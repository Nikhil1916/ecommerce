import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import logger from "../../../lib/logger";

import { MongoOrderRepository } from "../../order/repositories/mongo-order-repository";
import { PrismaUserRepository } from "../../user/repositories/prisma-user.repository";
import { emailQueue } from "../../notification/queues/email.queue";
import { EmailType } from "../../notification/types/email.types";

const orderRepository = new MongoOrderRepository();
const userRepository = new PrismaUserRepository();

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
      "Processing payment success job",
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

      await emailQueue.add(
        "order-confirmation",
        {
          type: EmailType.ORDER_CONFIRMATION,
          to: user.email,
          orderId: order.orderNumber,
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

      logger.info(
        {
          jobId: job.id,
          orderId,
          email: user.email,
        },
        "Order confirmation email job queued",
      );
    } catch (error) {
      logger.error(
        {
          error,
          jobId: job.id,
          orderId,
          attemptsMade: job.attemptsMade,
        },
        "Failed to queue payment confirmation email",
      );

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
    "Payment success job completed",
  );
});

worker.on("failed", (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      error,
      attemptsMade: job?.attemptsMade,
    },
    "Payment success job failed",
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