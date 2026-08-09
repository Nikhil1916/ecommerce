import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { CartService } from "../services/cart.service";
import { MongoCartRespository } from "../repositories/mongo-cart.repository";
import { authMiddleware } from "../../auth/auth.module";
import { validate } from "../../../middlewares/validate.middleware";
import { addToCartSchema } from "../validators/add-to-cart.validation";
import { MongoProductRepository } from "../../product";
import { asyncHandler } from "../../../core/asyncHandler";

const router = Router();

const cartRepository = new MongoCartRespository();
const productRepository = new MongoProductRepository();

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

export const cartRouter = router;
