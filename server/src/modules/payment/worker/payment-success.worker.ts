import { Worker } from "bullmq";
const worker = new Worker(
    "payment-success",
    async(job) => {
        console.log("processing job");
        console.log(job.name);
        console.log(job.data);
    },
    {
        connection: {
            host: "localhost",
            port: 6379
        }
    }
)