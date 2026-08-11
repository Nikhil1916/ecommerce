import { CheckoutService } from "../services/checkout.service";
import { Request, Response } from "express";
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  startCheckout = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const result = await this.checkoutService.startCheckout(
      req.user!.id,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  };
}