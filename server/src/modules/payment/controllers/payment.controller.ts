import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  createPayment = async (req: Request, res: Response): Promise<void> => {
    const { orderId, amount } = req.body;

    const payment = await this.paymentService.createPayment(orderId, amount);

    res.status(200).json({
      success: true,
      data: payment,
    });
  };

  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    await this.paymentService.handleWebhook(req.body);

    res.status(200).json({
      success: true,
    });
  };
}
