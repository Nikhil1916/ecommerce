import { Queue } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";

export const backInStockQueue = new Queue(
  "back-in-stock",
  {
    connection: redisConnection,
  },
);