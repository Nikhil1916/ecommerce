import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { connectDatabase } from "../../../lib/database";

import { ImportService } from "../services/import.service";
import { XlsxParser } from "../parsers/xlsx.parser";
import { ImportStrategyFactory } from "../factories/import-strategy.factory";
import { ImportJobData } from "../queues/import.queue";

import { CloudinaryProvider } from "../../../storage/providers/cloudinary.provider";
import { StorageAssetType } from "../../../storage/types/storage.types";

import { ImportRepository } from "../repositories/import.repository";
import { MongoImportRepository } from "../repositories/mongo-import.repository";

import fs from "fs";
import path from "path";
import os from "os";

const startWorker = async (): Promise<void> => {
  await connectDatabase();

  // Dependencies
  const importRepository =
    new MongoImportRepository();

  const importService =
    new ImportService(importRepository);

  const parser =
    new XlsxParser();

  const strategyFactory =
    new ImportStrategyFactory();

  const storageProvider =
    new CloudinaryProvider();

  const worker = new Worker<ImportJobData>(
    "import",
    async (job) => {
      const {
        importJobId,
        type,
        fileKey,
      } = job.data;

      console.log(
        `Processing import job: ${job.id}`,
      );

      let tempFilePath: string | undefined;

      try {
        await importService.startImport(
          importJobId,
        );

        /*
         * Download Excel from storage into a
         * temporary file.
         *
         * We intentionally don't create a huge
         * Buffer for the complete Excel file.
         */
        const fileStream =
          await storageProvider.download(
            fileKey,
            StorageAssetType.IMPORT,
          );

        tempFilePath = path.join(
          os.tmpdir(),
          `import-${importJobId}.xlsx`,
        );

        const writeStream =
          fs.createWriteStream(tempFilePath);

        await new Promise<void>(
          (resolve, reject) => {
            fileStream.pipe(writeStream);

            fileStream.on("error", reject);
            writeStream.on("error", reject);
            writeStream.on("finish", resolve);
          },
        );

        /*
         * Keep existing XlsxParser unchanged.
         */
        const rows =
          await parser.parse(tempFilePath);

        const strategy =
          strategyFactory.create(type);

        let successfulRows = 0;
        let failedRows = 0;

        await importService.updateProgress(
          importJobId,
          0,
          0,
          rows.length,
        );

        for (
          let index = 0;
          index < rows.length;
          index++
        ) {
          const row = rows[index];

          // Excel:
          // row 1 = headers
          // row 2 = first data row
          const rowNumber = index + 2;

          try {
            await strategy.validate(
              row,
              rowNumber,
            );

            await strategy.import(row);

            successfulRows++;

            await importService.recordRowSuccess(
              importJobId,
              rowNumber,
              row,
            );
          } catch (error) {
            failedRows++;

            const message =
              error instanceof Error
                ? error.message
                : "Unknown import error";

            await importService.recordRowFailure(
              importJobId,
              rowNumber,
              message,
              row,
            );
          }

          await importService.updateProgress(
            importJobId,
            successfulRows,
            failedRows,
            rows.length,
          );
        }

        await importService.completeImport(
          importJobId,
          successfulRows,
          failedRows,
        );

        console.log(
          `Import job ${job.id} completed`,
        );
      } finally {
        /*
         * Remove temporary Excel file after
         * processing, whether successful or failed.
         */
        if (tempFilePath) {
          await fs.promises
            .unlink(tempFilePath)
            .catch(() => {
              // Don't hide the original import error.
            });
        }
      }
    },
    {
      connection: redisConnection,
    },
  );

  worker.on("ready", () => {
    console.log("Import worker ready");
  });

  worker.on("completed", (job) => {
    console.log(
      "Import job completed:",
      job.id,
    );
  });

  worker.on("failed", (job, error) => {
    console.error(
      "Import job failed:",
      job?.id,
      error,
    );
  });

  worker.on("error", (error) => {
    console.error(
      "Import worker error:",
      error,
    );
  });
};

startWorker().catch((error) => {
  console.error(
    "Failed to start import worker:",
    error,
  );

  process.exit(1);
});