import { Queue } from "bullmq";

export const paymentSuccessQueue = new Queue(
       "payment-success",
    {
        connection: {
            host: "localhost",
            port: "6379"
        }
    }
)