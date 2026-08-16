import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
const worker = new Worker(
  "payment-success",
  async (job) => {
    console.log(`Processing ${job.name}`);
    console.log(job.data);

    // Retry test
    // throw new Error("Email service down");
  },
  {
    connection: redisConnection
  },
);
