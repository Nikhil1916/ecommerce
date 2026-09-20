import { Router } from "express";
import { authMiddleware } from "../../auth/auth.module";
import { validate } from "../../../middlewares/validate.middleware";
import { MongoOrderRepository } from "../repositories/mongo-order-repository";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../service/order.service";
import { OrderIdSchema } from "../validators/order-id.validator";

const router = Router();

const orderController = new OrderController(
  new OrderService(new MongoOrderRepository()),
);

router.get(
  "/:orderId",
  authMiddleware.authenticate,
  validate(OrderIdSchema, "params"),
  orderController.getOrderById,
);

export const orderRouter = router;