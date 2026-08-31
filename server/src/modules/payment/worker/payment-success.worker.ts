import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import logger from "../../../lib/logger";

import { MongoOrderRepository } from "../../order/repositories/mongo-order-repository";
import { PrismaUserRepository } from "../../user/repositories/prisma-user.repository";
import { EmailService } from "../../notification/services/email.service";
import { FakeEmailProvider } from "../../notification/providers/fake-email.provider";

;

const orderRepository = new MongoOrderRepository();

const userRepository = new PrismaUserRepository();

const emailService = new EmailService(
  new FakeEmailProvider(),
);

const worker = new Worker(
  "payment-success",
  async (job) => {
    const { orderId } = job.data;

    logger.info(
      {
        jobId: job.id,
        orderId,
        attemptsMade: job.attemptsMade,
      },
      "Processing payment confirmation email",
    );

    try {
      const order = await orderRepository.findById(orderId);

      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      const user = await userRepository.findById(order.userId);

      if (!user) {
        throw new Error(`User not found: ${order.userId}`);
      }

      await emailService.sendOrderConfirmation({
        to: user.email,
        orderId: order.orderNumber,
      });

      logger.info(
        {
          jobId: job.id,
          orderId,
          email: user.email,
        },
        "Payment confirmation email sent",
      );
    } catch (error) {
      logger.error(
        {
          error,
          jobId: job.id,
          orderId,
          attemptsMade: job.attemptsMade,
        },
        "Failed to send payment confirmation email",
      );

      /*
       * IMPORTANT:
       *
       * Re-throw the error so BullMQ marks
       * the job as failed and retries it.
       */
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);

worker.on("ready", () => {
  logger.info("Payment success worker ready");
});

worker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Payment confirmation job completed",
  );
});

worker.on("failed", (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      error,
      attemptsMade: job?.attemptsMade,
    },
    "Payment confirmation job failed",
  );
});

worker.on("error", (error) => {
  logger.error(
    {
      error,
    },
    "Payment success worker error",
  );
});