import Razorpay from "razorpay";
import { env } from "../../../config/env";
import { IPaymentGateway } from "../interfaces/payment.gateway.interface";
import crypto from "crypto";

export class RazorpayPaymentGateway implements IPaymentGateway {
  private readonly razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createPayment(
    orderId: string,
    amount: number,
  ): Promise<{
    paymentId: string;
    paymentUrl?: string;
  }> {
    // console.log(env);
    const razorpayOrder = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
    });

    return {
      paymentId: razorpayOrder.id,
    };
  }

async handleWebhook(
  payload: Buffer,
  signature: string,
): Promise<{
  orderId: string;
  status: "SUCCESS" | "FAILED";
}> {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  const isValid =
    expectedSignature.length === signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    );

  if (!isValid) {
    throw new Error("Invalid Razorpay webhook signature");
  }

  const webhook = JSON.parse(payload.toString("utf8"));

  switch (webhook.event) {
    case "payment.captured": {
      const payment = webhook.payload.payment.entity;

      const razorpayOrder = await this.razorpay.orders.fetch(
        payment.order_id,
      );

      if (!razorpayOrder.receipt) {
        throw new Error(
          `Razorpay order ${payment.order_id} does not have a receipt`,
        );
      }

      return {
        orderId: razorpayOrder.receipt as string,
        status: "SUCCESS",
      };
    }

    case "payment.failed": {
      const payment = webhook.payload.payment.entity;

      const razorpayOrder = await this.razorpay.orders.fetch(
        payment.order_id,
      );

      if (!razorpayOrder.receipt) {
        throw new Error(
          `Razorpay order ${payment.order_id} does not have a receipt`,
        );
      }

      return {
        orderId: razorpayOrder.receipt as string,
        status: "FAILED",
      };
    }

    default:
      throw new Error(
        `Unsupported Razorpay webhook event: ${webhook.event}`,
      );
  }
}
}
