import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { MongoCategoryRepository } from "../repositories/mongo-category.repository";
import { CategoryService } from "../services/category.service";

const router = Router();

const categoryRepository =
  new MongoCategoryRepository();

const categoryService =
  new CategoryService(categoryRepository);

const categoryController =
  new CategoryController(categoryService);

router.post(
  "/",
  categoryController.createCategory
);

router.get(
  "/:id",
  categoryController.getCategoryById
);

router.patch(
  "/:id",
  categoryController.updateCategory
);

router.delete(
  "/:id",
  categoryController.deleteCategory
);

export default router;