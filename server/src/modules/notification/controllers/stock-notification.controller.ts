import { Request, Response, NextFunction } from "express";
import { StockNotificationService } from "../services/stock-notification.service";

export class StockNotificationController {
  constructor(
    private stockNotificationService: StockNotificationService,
  ) {}

  subscribe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = Array.isArray(req.params.productId)
        ? req.params.productId[0]
        : req.params.productId;

      const notification =
        await this.stockNotificationService.subscribe(
          productId,
          req.user!.id,
          req.user!.email,
        );

      res.status(201).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };
}