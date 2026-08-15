import { Worker } from "bullmq";
const worker = new Worker(
  "payment-success",
  async (job) => {
    console.log(`Processing ${job.name}`);
    console.log(job.data);

    // Retry test
    // throw new Error("Email service down");
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
