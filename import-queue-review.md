# Import Queue and Worker Review

**Review date:** 2026-08-27

## Verdict

The import implementation has a good intermediate-level foundation, but it is not production-ready yet. The architecture is clear:

```text
HTTP request
  -> upload file
  -> create Mongo import job
  -> add BullMQ job to Redis
  -> separate worker downloads file
  -> parse Excel rows
  -> choose import strategy
  -> validate and import each row
  -> record row result and progress
```

The server TypeScript build passes. The main risks are retry duplication, incomplete failure handling, and missing input/status safeguards.

## How the Flow Works

### 1. Upload request

The endpoint is registered in [server/src/modules/imports/routes/import.routes.ts](server/src/modules/imports/routes/import.routes.ts):

```text
POST /api/v1/imports
```

The uploaded file field is `file`. The route uses Multer, authentication, and then the import controller.

### 2. Controller uploads the file

[server/src/modules/imports/controllers/import.controller.ts](server/src/modules/imports/controllers/import.controller.ts) does the following:

1. Checks that a file exists.
2. Uploads the Excel file to Cloudinary as an import asset.
3. Creates a MongoDB import job with status `PENDING`.
4. Adds a job to the BullMQ `import` queue.
5. Returns HTTP `202` with the Mongo `importJobId`.

The API does not process the Excel file synchronously. It only creates the work item.

The queued data is:

```ts
{
  importJobId,
  type,
  fileKey
}
```

### 3. BullMQ queue

The queue is defined in [server/src/modules/imports/queues/import.queue.ts](server/src/modules/imports/queues/import.queue.ts).

The queue name is `import`, and it uses Redis. The controller adds the job with:

```ts
attempts: 3,
backoff: {
  type: "fixed",
  delay: 5000,
}
```

A failed BullMQ job can therefore be retried up to three times, with a five-second delay.

### 4. Worker startup

The worker is implemented in [server/src/modules/imports/workers/parse.worker.ts](server/src/modules/imports/workers/parse.worker.ts).

Start it with:

```powershell
npm run worket:import
```

The script is currently named `worket:import` in [server/package.json](server/package.json). This is probably a typo and should eventually be renamed to `worker:import`.

The API and worker must run as separate processes:

```powershell
npm run dev
npm run worket:import
```

The API places jobs in Redis. The worker consumes jobs from Redis.

### 5. Worker processing

The worker:

1. Connects to the database.
2. Constructs repositories and services.
3. Creates the Excel parser and strategy factory.
4. Listens to the BullMQ queue named `import`.
5. Changes the Mongo import job from `PENDING` to `PROCESSING`.
6. Downloads the file from Cloudinary.
7. Writes it to a temporary `.xlsx` file.
8. Parses the first worksheet.
9. Chooses an import strategy based on the import type.
10. Processes every row sequentially.
11. Records success or failure for every row.
12. Updates progress after every row.
13. Marks the import as `COMPLETED`.
14. Deletes the temporary file in a `finally` block.

### 6. Strategy selection

The factory is in [server/src/modules/imports/factories/import-strategy.factory.ts](server/src/modules/imports/factories/import-strategy.factory.ts).

It maps import types to strategies:

| Import type | Strategy | Main behavior |
| --- | --- | --- |
| `PRODUCT` | [product-import.strategy.ts](server/src/modules/imports/strategies/product-import.strategy.ts) | Validates and creates products. |
| `CATEGORY` | [category-import.strategy.ts](server/src/modules/imports/strategies/category-import.strategy.ts) | Validates and creates categories. |
| `STOCK_NOTIFICATION` | [stock-notification-import.strategy.ts](server/src/modules/imports/strategies/stock-notification-import.strategy.ts) | Validates and creates pending stock notifications. |

An unsupported type throws an error.

### 7. Excel parsing

[XlsxParser](server/src/modules/imports/parsers/xlsx.parser.ts) reads the first worksheet using the `xlsx` package.

The first row is treated as the header. Therefore, the first data row is reported as Excel row number `2`.

### 8. Row processing

Each row follows this process:

```text
validate(row)
  -> import(row)
  -> record SUCCESS
  -> update progress
```

If validation or importing fails:

```text
catch error
  -> record FAILED with error message and row data
  -> update progress
  -> continue with the next row
```

For product imports, the expected fields include:

```text
name
description
price
stock
categoryId
```

### 9. MongoDB status and results

The Mongo models are:

- [import-job.model.ts](server/src/modules/imports/models/import-job.model.ts)
- [import-row-result.model.ts](server/src/modules/imports/models/import-row-result.model.ts)

An import job stores:

- Type
- Original file name
- Cloudinary file key
- Status
- Total rows
- Successful rows
- Failed rows
- Start time
- Completion time

Each row result stores:

- Import job ID
- Excel row number
- `SUCCESS` or `FAILED` status
- Error message, if any
- Original row data

Persistence is handled by [mongo-import.repository.ts](server/src/modules/imports/repositories/mongo-import.repository.ts).

## What Is Good

- The controller is separated from worker processing.
- BullMQ and Redis are appropriate for asynchronous imports.
- The strategy pattern makes product, category, and notification imports extensible.
- Row-level failures do not stop the entire import.
- Progress is persisted during processing.
- Temporary files are cleaned up in `finally`.
- Cloudinary and database access are hidden behind service/repository abstractions.
- The TypeScript build currently passes.

## Changes Needed Before Production

### 1. Prevent duplicate records during retries

This is the highest-risk issue.

The controller configures three attempts. If the worker imports several rows and then fails, BullMQ retries from the first row. Previously successful rows may be imported again.

Possible solutions:

- Add a unique index for `importJobId + rowNumber`.
- Skip rows that already have a successful result.
- Use deterministic business keys for imported products and categories.
- Make each strategy operation idempotent.
- Resume from the last successfully processed row.

### 2. Mark fatal imports as failed

The worker marks the job as `PROCESSING`, but does not mark it as `FAILED` when file download, parsing, or infrastructure errors occur.

As a result, a Mongo import can remain stuck in `PROCESSING` even though BullMQ has permanently failed the job.

Add a failure method to the import service and repository, then call it before rethrowing the error:

```ts
catch (error) {
  await importService.failImport(importJobId, errorMessage);
  throw error;
}
```

The `FAILED` status already exists in [import.types.ts](server/src/modules/imports/types/import.types.ts).

It would also be useful to store a job-level error message.

### 3. Handle Mongo and queue failures together

The controller creates the Mongo job before adding the BullMQ job. If queue insertion fails, Mongo contains a `PENDING` job that will never run.

The Cloudinary file can also remain orphaned if a later operation fails.

Consider:

- Deleting the Cloudinary file when job creation or queue insertion fails.
- A recovery process for old `PENDING` jobs.
- An outbox pattern for reliable queue publishing.

### 4. Validate the import type

This code only performs a TypeScript cast:

```ts
const type = req.body.type as ImportType;
```

A cast does not validate runtime input. Validate the value with Zod before uploading the file or creating the job. Only allow:

```text
PRODUCT
CATEGORY
STOCK_NOTIFICATION
```

### 5. Authenticate before parsing large uploads

The route currently runs Multer before authentication:

```ts
importUpload.single("file"),
authMiddleware.authenticate,
```

The upload configuration has a 10 MB limit, but an unauthenticated request can still cause the server to allocate memory before authentication rejects it.

Prefer authentication before Multer if the authentication middleware does not need the uploaded file.

### 6. Add import status endpoints

The API returns an `importJobId`, but the current imports route only exposes the creation endpoint.

Add endpoints such as:

```text
GET /api/v1/imports/:id
GET /api/v1/imports/:id/rows
```

These should return progress, final status, counts, and row-level errors.

## Smaller Improvements

- Rename `worket:import` to `worker:import`.
- Use the project logger instead of `console.log` and `console.error`.
- Add maximum row-count validation in addition to the 10 MB file-size limit.
- Add worker concurrency and shutdown handling.
- Add automated tests for retrying after partial success.
- Add tests for invalid files and unsupported import types.
- Add tests confirming that fatal errors set the Mongo job to `FAILED`.
- Consider parsing from a stream later if very large files need to be supported.
- Consider batching progress writes for large imports instead of writing to Mongo after every row.

## Recommended Priority

1. Make row imports idempotent.
2. Add `FAILED` status handling for fatal worker errors.
3. Validate the import type at the API boundary.
4. Add status and row-result endpoints.
5. Resolve Mongo, Cloudinary, and queue failure cleanup.
6. Add tests for retries and partial failures.
7. Apply logging, shutdown, and performance improvements.

Overall, the design is a solid foundation for an asynchronous import feature. The strategy factory and worker separation are good choices; reliability and data-integrity handling are the next level of work.
