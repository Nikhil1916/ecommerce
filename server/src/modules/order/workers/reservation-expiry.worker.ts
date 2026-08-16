import mongoose from "mongoose";
import { Worker } from "bullmq";
import { OrderService } from "../service/order.service";
import { PaymentStatus } from "../types/order.types";
import InventoryRepository from "../../inventory/repositories/inventory.repository";
import { redisConnection } from "../../../redis/config/redis.config";
import { MongoOrderRepository } from "../repositories/mongo-order-repository";

console.log("Reservation worker started");
const orderRepository = new MongoOrderRepository();

const orderService = new OrderService(
  orderRepository,
);

const inventoryRepository = new InventoryRepository();

const worker = new Worker(
  "reservation-expiry",
  async (job) => {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { orderId } = job.data;
        console.log("Processing reservation expiry", job.data);
        const order = await orderService.getOrderById(orderId, session);
        console.log(order);
        if (order.paymentStatus !== PaymentStatus.PENDING) {
          return;
        }

        for (const item of order.items) {
          await inventoryRepository.releaseStock(
            {
              productId: item.productId,
              quantity: item.quantity,
            },
            session,
          );
        }

        await orderService.markOrderAsExpired(orderId, session);
      });
    } finally {
      await session.endSession();
    }
  },
  {
    connection: redisConnection,
  },
);

worker.on("ready", () => {
  console.log("Reservation worker ready");
});

worker.on("error", (err) => {
  console.error("Worker error", err);
});