import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { MongoStockNotificationRepository } from "../repositories/mongo-stock-notification.repository";
import { connectDatabase } from "../../../lib/database";
import { emailQueue } from "../queues/email.queue";
import { MongoProductRepository } from "../../product";
import { MongoCounterRepository } from "../../counter/repositories/mongo-counter.repository";
import { EmailType } from "../types/email.types";

const startWorker = async (): Promise<void> => {
  await connectDatabase();

  const notificationRepository = new MongoStockNotificationRepository();
  const productRepository = new MongoProductRepository(
    new MongoCounterRepository(),
  );

  console.log("Back-in-stock worker started");

  const worker = new Worker(
    "back-in-stock",
    async (job) => {
      const { productId } = job.data;

      console.log("Processing back-in-stock notification", job.data);

      const subscribers =
        await notificationRepository.findPendingByProduct(productId);

      const product = await productRepository.findById(productId);

      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      Then: console.log(`Found ${subscribers.length} pending subscribers`);

      for (const subscriber of subscribers) {
        console.log(`Creating email job for ${subscriber.email}`);

        await emailQueue.add(
          "back-in-stock-email",
          {
            type: EmailType.BACK_IN_STOCK,
            notificationId: subscriber._id.toString(),
            productName: product.name,
            email: subscriber.email,
          },
          {
            attempts: 3,
            backoff: {
              type: "fixed",
              delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        );
      }
    },
    {
      connection: redisConnection,
    },
  );

  worker.on("ready", () => {
    console.log("Back-in-stock worker ready");
  });

  worker.on("active", (job) => {
    console.log("Processing job:", job.id);
  });

  worker.on("completed", (job) => {
    console.log("Back-in-stock job completed:", job.id);
  });

  worker.on("failed", (job, error) => {
    console.error("Back-in-stock job failed:", job?.id, error);
  });

  worker.on("error", (error) => {
    console.error("Worker error:", error);
  });
};

startWorker().catch((error) => {
  console.error("Failed to start back-in-stock worker", error);

  process.exitCode = 1;
});
