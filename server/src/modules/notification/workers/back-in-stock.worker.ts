import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { MongoStockNotificationRepository } from "../repositories/mongo-stock-notification.repository";
import { connectDatabase } from "../../../lib/database";
import { emailQueue } from "../queues/email.queue";

const startWorker = async (): Promise<void> => {
  await connectDatabase();

  const notificationRepository = new MongoStockNotificationRepository();

  console.log("Back-in-stock worker started");

  const worker = new Worker(
    "back-in-stock",
    async (job) => {
      const { productId } = job.data;

      console.log("Processing back-in-stock notification", job.data);

      const subscribers =
        await notificationRepository.findPendingByProduct(productId);

      console.log(`Found ${subscribers.length} pending subscribers`);

      for (const subscriber of subscribers) {
        // Email queue will be added here later.
        console.log(`Notify ${subscriber.email} for product ${productId}`);
        await emailQueue.add(
          "back-in-stock-email",
          {
            notificationId: subscriber._id.toString(),
            productId,
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
