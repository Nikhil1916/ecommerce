import { NextFunction, Request, Response } from "express";
// import { CreateProductInput } from "../models/product.model";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../../../core/ApiResponse";
import { ProductQueryDto } from "../dto/ProductQueryDto";
import { UploadFile } from "../../../storage/dto/upload-file.dto";
import { CreateProductInput } from "../models/product.types";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct = async (
    req: Request<{}, {}, CreateProductInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files: UploadFile[] = (
        (req.files as Express.Multer.File[]) ?? []
      ).map((file) => ({
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
      }));
      const product = await this.productService.createProduct(req.body, files);

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
    next: NextFunction,
  ) => {
    try {
      const product = await this.productService.getProductById(req.params.id);

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
    next: NextFunction,
  ) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body,
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
    next: NextFunction,
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

  getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.productService.getProducts(
        req.query as ProductQueryDto,
      );

      res
        .status(200)
        .json(ApiResponse.success("Products fetched successfully.", result));
    } catch (error) {
      next(error);
    }
  };

  getProductBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductBySlug(
        req.params.slug,
      );

      res
        .status(200)
        .json(ApiResponse.success("Product fetched successfully.", product));
    } catch (error) {
      next(error);
    }
  };

async downloadProductImage(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const { key } = req.query;

  const url =
    await this.productService.getProductImageDownloadUrl(
      id,
      String(key),
    );

  return res.status(200).json({
    success: true,
    data: {
      url,
    },
  });
}
}
