import { Queue } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";

export const emailQueue = new Queue(
  "email",
  {
    connection: redisConnection,
  },
);