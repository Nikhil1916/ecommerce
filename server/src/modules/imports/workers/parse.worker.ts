import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { connectDatabase } from "../../../lib/database";
import fs from "fs";
import path from "path";
import os from "os";

// Services
import { ImportService } from "../services/import.service";
import { ProductService } from "../../product/services/product.service";
import { CategoryService } from "../../category/services/category.service";

// Repositories
import { MongoImportRepository } from "../repositories/mongo-import.repository";
import { MongoProductRepository } from "../../product/repositories/mongo-product.repository";
import { MongoCategoryRepository } from "../../category/repositories/mongo-category.repository";
import { MongoStockNotificationRepository } from "../../notification/repositories/mongo-stock-notification.repository";

// Storage
import { CloudinaryProvider } from "../../../storage/providers/cloudinary.provider";
import { StorageAssetType } from "../../../storage/types/storage.types";

// Parser + Factory
import { XlsxParser } from "../parsers/xlsx.parser";
import { ImportStrategyFactory } from "../factories/import-strategy.factory";

// Queue types
import { ImportJobData } from "../queues/import.queue";
import { RedisService } from "../../../redis/services/redis.service";
import { MongoCounterRepository } from "../../counter/repositories/mongo-counter.repository";

const startWorker = async (): Promise<void> => {
  await connectDatabase();

  /*
   * -----------------------------
   * Infrastructure dependencies
   * -----------------------------
   */

  const categoryRepository =
    new MongoCategoryRepository();

  const stockNotificationRepository =
    new MongoStockNotificationRepository();

  const importRepository =
    new MongoImportRepository();

  const storageProvider =
    new CloudinaryProvider();

  const redisService =
    new RedisService();

  const counterRepository =
    new MongoCounterRepository();

  const productRepository =
    new MongoProductRepository(
      counterRepository,
    );

  /*
   * -----------------------------
   * Services
   * -----------------------------
   */

  const productService =
    new ProductService(
      productRepository,
      categoryRepository,
      storageProvider,
      redisService,
    );

  const categoryService =
    new CategoryService(
      categoryRepository,
    );

  const importService =
    new ImportService(
      importRepository,
    );

  /*
   * -----------------------------
   * Parser
   * -----------------------------
   */

  const parser =
    new XlsxParser();

  /*
   * -----------------------------
   * Strategy Factory
   * -----------------------------
   */

  const strategyFactory =
    new ImportStrategyFactory(
      productService,
      categoryService,
      stockNotificationRepository,
    );

  /*
   * -----------------------------
   * BullMQ Worker
   * -----------------------------
   */

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
        /*
         * Mark job as processing
         */
        await importService.startImport(
          importJobId,
        );

        /*
         * Download Excel from storage
         *
         * We use a stream instead of downloading
         * the complete file into a Buffer.
         */
        const fileStream =
          await storageProvider.download(
            fileKey,
            StorageAssetType.IMPORT,
          );

        /*
         * Store stream temporarily because the
         * current XlsxParser works with filePath.
         */
        tempFilePath = path.join(
          os.tmpdir(),
          `import-${importJobId}.xlsx`,
        );

        const writeStream =
          fs.createWriteStream(
            tempFilePath,
          );

        await new Promise<void>(
          (resolve, reject) => {
            fileStream.pipe(writeStream);

            fileStream.on(
              "error",
              reject,
            );

            writeStream.on(
              "error",
              reject,
            );

            writeStream.on(
              "finish",
              resolve,
            );
          },
        );

        /*
         * Parse Excel
         */
        const rows =
          await parser.parse(
            tempFilePath,
          );

        /*
         * Select strategy according to
         * import type.
         */
        const strategy =
          strategyFactory.create(type);

        let successfulRows = 0;
        let failedRows = 0;

        /*
         * Initial progress
         */
        await importService.updateProgress(
          importJobId,
          0,
          0,
          rows.length,
        );

        /*
         * Process rows
         */
        for (
          let index = 0;
          index < rows.length;
          index++
        ) {
          const row = rows[index];

          /*
           * Excel row number:
           *
           * Row 1 = headers
           * Row 2 = first data row
           */
          const rowNumber =
            index + 2;

          try {
            /*
             * Validate row
             */
            await strategy.validate(
              row,
              rowNumber,
            );

            /*
             * Import row
             */
            await strategy.import(
              row,
            );

            successfulRows++;

            /*
             * Record successful row
             */
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

            /*
             * Record failed row
             */
            await importService.recordRowFailure(
              importJobId,
              rowNumber,
              message,
              row,
            );
          }

          /*
           * Update progress after
           * every processed row.
           */
          await importService.updateProgress(
            importJobId,
            successfulRows,
            failedRows,
            rows.length,
          );
        }

        /*
         * Complete import
         */
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
         * Remove temporary Excel file.
         *
         * This runs on both success
         * and failure.
         */
        if (tempFilePath) {
          await fs.promises
            .unlink(tempFilePath)
            .catch(() => {
              // Don't hide the original error.
            });
        }
      }
    },
    {
      connection: redisConnection,
    },
  );

  /*
   * -----------------------------
   * Worker events
   * -----------------------------
   */

  worker.on("ready", () => {
    console.log(
      "Import worker ready",
    );
  });

  worker.on(
    "completed",
    (job) => {
      console.log(
        "Import job completed:",
        job.id,
      );
    },
  );

  worker.on(
    "failed",
    (job, error) => {
      console.error(
        "Import job failed:",
        job?.id,
        error,
      );
    },
  );

  worker.on(
    "error",
    (error) => {
      console.error(
        "Import worker error:",
        error,
      );
    },
  );
};

startWorker().catch((error) => {
  console.error(
    "Failed to start import worker:",
    error,
  );

  process.exit(1);
});