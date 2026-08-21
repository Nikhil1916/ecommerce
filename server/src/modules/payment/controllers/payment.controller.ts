import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { asyncHandler } from "../../../core/asyncHandler";

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
    await this.paymentService.handleWebhook(req.body);

    res.status(200).json({
      success: true,
    });
  });
}
