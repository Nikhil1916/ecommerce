import { ApiError } from "../../../core/ApiError";
import { ICategoryRepository } from "../../category/repositories/category.repository";
import { ProductQueryDto } from "../dto/ProductQueryDto";
import { Product, CreateProductInput } from "../models/product.model";
import { ProductListResult } from "../models/product.types";
// import { ICategoryRepository } from "../repositories/category.repository";
import { IProductRepository } from "../repositories/product.repository";

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async createProduct(data: CreateProductInput): Promise<Product> {
    const category = await this.categoryRepository.findById(data.categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const existingProduct = await this.productRepository.findByNameAndCategory(
      data.name,
      data.categoryId,
    );

    if (existingProduct) {
      throw new ApiError(409, "Product already exists");
    }

    return this.productRepository.create(data);
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
