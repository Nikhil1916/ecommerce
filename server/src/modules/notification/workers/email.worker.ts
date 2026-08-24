import { Worker } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";

console.log("Email worker started");

const worker = new Worker(
  "email",
  async (job) => {
    console.log("Processing email job:", job.id);
    console.log(job.data);

    // Later actual email provider goes here.

    console.log(
      `Sending back-in-stock email to ${job.data.email}`,
    );
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
  console.error(
    "Email job failed:",
    job?.id,
    error,
  );
});

worker.on("error", (error) => {
  console.error("Email worker error:", error);
});