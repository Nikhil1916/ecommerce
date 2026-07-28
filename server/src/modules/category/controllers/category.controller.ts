import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.model";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  createCategory = async (
    req: Request<{}, {}, Category>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category =
        await this.categoryService.createCategory(req.body);

      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category =
        await this.categoryService.getCategoryById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (
    req: Request<{ id: string }, {}, Partial<Category>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category =
        await this.categoryService.updateCategory(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.categoryService.deleteCategory(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}