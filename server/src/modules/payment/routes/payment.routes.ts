import express, { Router } from "express";
import { authMiddleware } from "../../auth/auth.module";
import { asyncHandler } from "../../../core/asyncHandler";
import { PaymentController } from "../controllers/payment.controller";
import { PaymentService } from "../services/payment.service";
import { FakePaymentGateway } from "../gateways/fake-payment.gateway";
import { OrderService } from "../../order/service/order.service";
import InventoryRepository from "../../inventory/repositories/inventory.repository";
import { MongoOrderRepository } from "../../order/repositories/mongo-order-repository";
import { MongoCartRespository } from "../../cart/repositories/mongo-cart.repository";
import { RazorpayPaymentGateway } from "../gateways/razorpay-payment.gateway";

const router = Router();

const paymentService = new PaymentService(
  new RazorpayPaymentGateway(),
  new OrderService(new MongoOrderRepository()),
  new InventoryRepository(),
  new MongoCartRespository()
);

const paymentController = new PaymentController(
  paymentService,
);

router.post(
  "/create",
  // ()=>{throw new Error("hello")},
   express.json(),
  authMiddleware.authenticate,
  asyncHandler(paymentController.createPayment),
);


router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(paymentController.handleWebhook),
);

export const paymentRouter = router;