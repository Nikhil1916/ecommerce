import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { connectDatabase } from "../../../lib/database";

import { ImportType } from "../types/import.types";
import { ImportService } from "../services/import.service";
import { XlsxParser } from "../parsers/xlsx.parser";
import { ImportStrategyFactory } from "../factories/import-strategy.factory";

const startWorker = async (): Promise<void> => {
  await connectDatabase();

  // These dependencies will eventually come
  // from our module/composition root.
  const importService = /* existing ImportService */;
  const parser = /* existing XlsxParser */;
  const strategyFactory = /* existing ImportStrategyFactory */;

  const worker = new Worker(
    "import",
    async (job) => {
      const {
        importJobId,
        type,
        filePath,
      }: {
        importJobId: string;
        type: ImportType;
        filePath: string;
      } = job.data;

      console.log(
        `Processing import job: ${job.id}`,
      );

      await importService.startImport(importJobId);

      const rows = await parser.parse(filePath);

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

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        // Excel row number is usually +2:
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