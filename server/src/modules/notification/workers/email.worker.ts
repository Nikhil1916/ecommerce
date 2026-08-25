import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { MongoStockNotificationRepository } from "../repositories/mongo-stock-notification.repository";
import { connectDatabase } from "../../../lib/database";

console.log("Email worker started");

async function startWorker() {
  await connectDatabase();

  const notificationRepository = new MongoStockNotificationRepository();
  const worker = new Worker(
    "email",
    async (job) => {
      console.log("Processing email job:", job.id);
      console.log(job.data);

      // Later actual email provider goes here.
      console.log(`Sending back-in-stock email to ${job.data.email}`);

      // Simulated successful email
      const notification = await notificationRepository.markAsNotified(
        job.data.notificationId,
      );

      if (!notification) {
        throw new Error("Notification not found or already marked as notified");
      }

      console.log(`Notification marked as NOTIFIED: ${notification._id}`);
    },
    {
      connection: redisConnection,
    },
  );

  worker.on("ready", () => {
    console.log("Email worker ready");
  });

  worker.on("completed", (job) => {
    console.log("Email job completed:", job.id);
  });

  worker.on("failed", (job, error) => {
    console.error("Email job failed:", job?.id, error);
  });

  worker.on("error", (error) => {
    console.error("Email worker error:", error);
  });
}

startWorker().catch((error) => {
  console.error("Failed to start email worker:", error);
  process.exit(1);
});
