import { Router } from "express";
import { authMiddleware } from "../../auth/auth.module";
import { asyncHandler } from "../../../core/asyncHandler";
import { CheckoutController } from "../controller/checkout.controller";
import { CheckoutService } from "../services/checkout.service";
import { MongoCartRespository } from "../../cart/repositories/mongo-cart.repository";
import InventoryRepository from "../../inventory/repositories/inventory.repository";
import { OrderService } from "../../order/service/order.service";
import { MongoOrderRepository } from "../../order/repositories/mongo-order-repository";

const router = Router();

const checkoutService = new CheckoutService(new MongoCartRespository(), new InventoryRepository(), new OrderService(new MongoOrderRepository()));
const checkoutController = new CheckoutController(checkoutService)

router.post(
  "/start",
  authMiddleware.authenticate,
  asyncHandler(checkoutController.startCheckout),
);

export const checkoutRouter = router;
