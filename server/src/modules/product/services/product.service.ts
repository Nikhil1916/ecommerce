import { ApiError } from "../../../core/ApiError";
import logger from "../../../lib/logger";
import { UploadFile } from "../../../storage/dto/upload-file.dto";
import { UploadResult } from "../../../storage/dto/upload-result.dto";
import { ImageStorage } from "../../../storage/interfaces/image-storage.interface";
import { ICategoryRepository } from "../../category/repositories/category.repository";
import { ProductQueryDto } from "../dto/ProductQueryDto";
import { Product } from "../models/product.model";
import { CreateProductInput, ProductListResult } from "../models/product.types";
// import { ICategoryRepository } from "../repositories/category.repository";
import { IProductRepository } from "../repositories/product.repository";

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly storageProvider: ImageStorage,
  ) {}

  async createProduct(
    data: CreateProductInput,
    file?: UploadFile,
  ): Promise<Product> {
    let image: UploadResult | undefined;
    try {
      const category = await this.categoryRepository.findById(data.categoryId);

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      const existingProduct =
        await this.productRepository.findByNameAndCategory(
          data.name,
          data.categoryId,
        );
      if (existingProduct) {
        throw new ApiError(409, "Product already exists");
      }

      if (file) {
        image = await this.storageProvider.upload(file);
      }

      const productData: CreateProductInput = {
        ...data,
        images: image
          ? [
              {
                url: image.url,
                key: image.key,
                alt: data.name,
              },
            ]
          : [],
      };

      return this.productRepository.create(productData);
    } catch (error) {
      if (image) {
        try {
          await this.storageProvider.delete(image.key);
        } catch (deleteError) {
          // TODO: log this
          logger.error(
            {
              error: deleteError,
              imageKey: image.key,
            },
            `Failed to delete uploaded image after product creation failure`,
          );
        }
      }
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  }

  async updateProduct(
    id: string,
    data: Partial<CreateProductInput>,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Category validate only if changed
    if (
      data.categoryId &&
      data.categoryId !== existingProduct.categoryId.toString()
    ) {
      const category = await this.categoryRepository.findById(data.categoryId);

      if (!category) {
        throw new Error("Category not found");
      }
    }

    // Duplicate check only if name/category changes
    if (data.name || data.categoryId) {
      const duplicate = await this.productRepository.findByNameAndCategory(
        data.name ?? existingProduct.name,
        data.categoryId ?? existingProduct.categoryId.toString(),
      );

      // Ignore current product
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error("Product already exists");
      }
    }

    const updated = await this.productRepository.update(id, data);

    if (!updated) {
      throw new ApiError(500, "Failed to update product");
    }

    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return this.productRepository.delete(id);
  }

  async getProducts(dto: ProductQueryDto): Promise<ProductListResult> {
    return this.productRepository.findAll(dto);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return product;
  }
}
