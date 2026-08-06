import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { MongoCategoryRepository } from "../../category/repositories/mongo-category.repository";
import { MongoProductRepository } from "../repositories/mongo-product.repository";
import { ProductService } from "../services/product.service";
import { authMiddleware } from "../../auth/auth.module";
import { authorize } from "../../../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { validate } from "../../../middlewares/validate.middleware";
import { ProductQuerySchema } from "../validator/product-query.validator";
import { ProductSlugSchema } from "../validator/product-slug.validator";
import { upload } from "../../../storage/multer/multer.config";
import { CloudinaryProvider } from "../../../storage/providers/cloudinary.provider";
import { createProductSchema } from "../validator/create-product.validation";
import { PRODUCT_UPLOAD } from "../../../storage/constants/upload.constants";

const router = Router();

const productRepository =
  new MongoProductRepository();

const categoryRepository =
  new MongoCategoryRepository();

const storageProvider = new CloudinaryProvider();

const productService =
  new ProductService(
    productRepository,
    categoryRepository,
    storageProvider
  );

const productController =
  new ProductController(productService);

router.post(
  "/",
  authMiddleware.authenticate,
  authorize(Role.ADMIN),
  upload.array(PRODUCT_UPLOAD.FIELD_NAME, PRODUCT_UPLOAD.MAX_FILES),
  validate(createProductSchema, "body"),  
  productController.createProduct
);

router.get(
  "/slug/:slug",
  validate(ProductSlugSchema, "params"),
  productController.getProductBySlug
);


router.get(
  "/:id",
  authMiddleware.authenticate,
  authorize(Role.ADMIN),
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


router.get(
  "/",
  validate(ProductQuerySchema, "query"),
  productController.getProducts
);

export default router;