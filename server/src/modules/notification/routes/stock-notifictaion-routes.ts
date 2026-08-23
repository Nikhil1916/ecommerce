import { Router } from "express";
import { StockNotificationController } from "../controllers/stock-notification.controller";
import { authMiddleware } from "../../auth/auth.module";

export const createStockNotificationRoutes = (
    stockNotificationController: StockNotificationController
) => {
  const router = Router();
  router.post(
    "/products/:productId/notify",
    authMiddleware.authenticate,
    stockNotificationController.subscribe,
  );

  return router;
};
