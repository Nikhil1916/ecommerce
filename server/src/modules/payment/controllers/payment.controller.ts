import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { asyncHandler } from "../../../core/asyncHandler";
import { ApiError } from "../../../core/ApiError";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  createPayment = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, amount } = req.body;

    const payment = await this.paymentService.createPayment(orderId, amount);

    res.status(200).json({
      success: true,
      data: payment,
    });
  });

  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"];

    if (typeof signature !== "string") {
      throw new ApiError(400, "Missing Razorpay signature");
    }

    const rawBody = (
      req as Request & {
        rawBody: Buffer;
      }
    ).rawBody;

    await this.paymentService.handleWebhook(rawBody, signature);

    res.status(200).json({
      success: true,
    });
  });
}
