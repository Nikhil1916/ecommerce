import { Router } from "express";
import { authMiddleware } from "../../auth/auth.module";
import { validate } from "../../../middlewares/validate.middleware";
import { MongoOrderRepository } from "../repositories/mongo-order-repository";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../service/order.service";
import { OrderIdSchema } from "../validators/order-id.validator";
import { OrderQuerySchema } from "../validators/order-query.validator";

const router = Router();

const orderController = new OrderController(
  new OrderService(new MongoOrderRepository()),
);

router.get(
  "/",
  authMiddleware.authenticate,
  validate(OrderQuerySchema, "query"),
  orderController.getOrders,
);

router.get(
  "/:orderId",
  authMiddleware.authenticate,
  validate(OrderIdSchema, "params"),
  orderController.getOrderById,
);

export const orderRouter = router;