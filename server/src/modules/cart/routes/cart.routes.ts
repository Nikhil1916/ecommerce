import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { CartService } from "../services/cart.service";
import { MongoCartRespository } from "../repositories/mongo-cart.repository";
import { authMiddleware } from "../../auth/auth.module";
import { validate } from "../../../middlewares/validate.middleware";
import { addToCartSchema } from "../validators/add-to-cart.validation";
import { MongoProductRepository } from "../../product";
import { asyncHandler } from "../../../core/asyncHandler";
import { removeCartItemSchema } from "../validators/remove-item.validation";
import { updateCartItemSchema } from "../validators/update-item.validation";
import { MongoCounterRepository } from "../../counter/repositories/mongo-counter.repository";

const router = Router();

const cartRepository = new MongoCartRespository();
const productRepository = new MongoProductRepository(
  new MongoCounterRepository(),
);

const cartService = new CartService(cartRepository, productRepository);

const cartController = new CartController(cartService);


router.post(
  "/items",
  authMiddleware.authenticate,
  validate(addToCartSchema, "body"),
  asyncHandler(cartController.addToCart.bind(cartController)),
);

router.get(
  "/",
  authMiddleware.authenticate,
  asyncHandler(cartController.getCart),
);

router.delete(
  "/items/:productId",
  authMiddleware.authenticate,
  validate(removeCartItemSchema, "params"),
  asyncHandler(cartController.removeFromCart),
);

router.patch(
  "/items/:productId",
  authMiddleware.authenticate,
  validate(updateCartItemSchema, "body"),
  asyncHandler(cartController.updateCartItem),
);

router.delete(
  "/",
  authMiddleware.authenticate,
  asyncHandler(cartController.clearCart),
);

export const cartRouter = router;
