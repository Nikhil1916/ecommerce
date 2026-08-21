import { CheckoutService } from "../services/checkout.service";
import { Request, Response } from "express";
import { asyncHandler } from "../../../core/asyncHandler";
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  startCheckout = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.checkoutService.startCheckout(
      req.user!.id,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}