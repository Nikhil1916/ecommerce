import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { MongoCategoryRepository } from "../../category/repositories/mongo-category.repository";
import { MongoProductRepository } from "../repositories/mongo-product.repository";
import { ProductService } from "../services/product.service";

const router = Router();

const productRepository =
  new MongoProductRepository();

const categoryRepository =
  new MongoCategoryRepository();

const productService =
  new ProductService(
    productRepository,
    categoryRepository
  );

const productController =
  new ProductController(productService);

router.post(
  "/",
  productController.createProduct
);

router.get(
  "/:id",
  productController.getProductById
);

router.patch(
  "/:id",
  productController.updateProduct
);

router.delete(
  "/:id",
  productController.deleteProduct
);

export default router;