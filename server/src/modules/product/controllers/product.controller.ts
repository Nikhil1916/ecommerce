import { NextFunction, Request, Response } from "express";
import { CreateProductInput } from "../models/product.model";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  createProduct = async (
    req: Request<{}, {}, CreateProductInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = await this.productService.createProduct(
        req.body
      );

      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = await this.productService.getProductById(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (
    req: Request<{ id: string }, {}, Partial<CreateProductInput>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.productService.deleteProduct(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}