import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { MongoStockNotificationRepository } from "../repositories/mongo-stock-notification.repository";
import { connectDatabase } from "../../../lib/database";
import { EmailService } from "../services/email.service";
import { FakeEmailProvider } from "../providers/fake-email.provider";
import {
  backInStockTemplate,
  orderConfirmationTemplate,
} from "../templates/email.templates";
import { EmailType } from "../types/email.types";

console.log("Email worker started");

async function startWorker() {
  await connectDatabase();

  const notificationRepository = new MongoStockNotificationRepository();

  const emailService = new EmailService(new FakeEmailProvider());

  const worker = new Worker(
    "email",
    async (job) => {
      const { type, to } = job.data;
      console.log(`Processing email job of type: ${type} for ${to}`);
      let template;

      switch (type) {
        case EmailType.ORDER_CONFIRMATION:
          template = orderConfirmationTemplate({
            orderId: job.data.orderId,
          });
          break;

        case EmailType.BACK_IN_STOCK:
          template = backInStockTemplate({
            productName: job.data.productName,
          });
          break;

        default:
          throw new Error(`Unsupported email type: ${type}`);
      }

      await emailService.sendEmail({
        to,
        ...template,
      });

      // back-in-stock specific DB update
      if (type === "BACK_IN_STOCK") {
        await notificationRepository.markAsNotified(job.data.notificationId);
      }
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
