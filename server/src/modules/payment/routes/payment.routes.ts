import { Router } from "express";
import { authMiddleware } from "../../auth/auth.module";
import { asyncHandler } from "../../../core/asyncHandler";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentService } from "../services/payment.service";
import { FakePaymentGateway } from "../gateways/fake-payment.gateway";
import { OrderService } from "../../order/service/order.service";
import InventoryRepository from "../../inventory/repositories/inventory.repository";
import { MongoOrderRepository } from "../../order/repositories/mongo-order-repository";

const router = Router();

const paymentService = new PaymentService(
  new FakePaymentGateway(),
  new OrderService(new MongoOrderRepository()),
  new InventoryRepository()
);

const paymentController = new PaymentController(
  paymentService,
);

router.post(
  "/create",
  authMiddleware.authenticate,
  asyncHandler(paymentController.createPayment),
);


router.post(
  "/webhook",
  asyncHandler(paymentController.handleWebhook),
);

export const paymentRouter = router;