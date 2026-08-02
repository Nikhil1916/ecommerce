import { any } from "zod";
import { ApiFeatures } from "../../../lib/mongo/api-features";
import { ProductQueryDto } from "../dto/ProductQueryDto";
import {
  ProductModel,
  Product,
  CreateProductInput,
} from "../models/product.model";
import { PRODUCT_QUERY_CONFIG } from "../product.constants";
import { IProductRepository } from "./product.repository";
type MongoFilter = Record<string, unknown>;

export class MongoProductRepository implements IProductRepository {
  async create(data: CreateProductInput): Promise<Product> {
    const product = await ProductModel.create(data);
    return product.toObject();
  }

  async findById(id: string): Promise<Product | null> {
    return ProductModel.findOne({
      _id: id,
      isActive: true,
    }).lean();
  }

  async findByName(name: string): Promise<Product | null> {
    return ProductModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      isActive: true,
    }).lean();
  }

  async update(
    id: string,
    data: Partial<CreateProductInput>,
  ): Promise<Product | null> {
    const product = await ProductModel.findOne({
      _id: id,
      isActive: true,
    });

    if (!product) {
      return null;
    }

    product.set(data);

    await product.save();

    return product.toObject();
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.updateOne(
      {
        _id: id,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async findByNameAndCategory(
    name: string,
    categoryId: string,
  ): Promise<Product | null> {
    return ProductModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      categoryId,
      isActive: true,
    }).lean();
  }

  async findAll(queryDto: ProductQueryDto): Promise<Product[]> {
    const filters = this.buildFilters(queryDto);
    const query = new ApiFeatures(ProductModel.find(filters), queryDto)
      .active()
      .search(PRODUCT_QUERY_CONFIG.searchableFields)
      .sort(PRODUCT_QUERY_CONFIG.sortableFields)
      .limitFields(PRODUCT_QUERY_CONFIG.selectableFields)
      .paginate();

    return query.getQuery();
  }


  private buildFilters(dto: ProductQueryDto): MongoFilter {
    const filters: MongoFilter = {};

    if (dto.categoryId) {
      filters.categoryId = dto.categoryId;
    }

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};

      if (dto.minPrice !== undefined) {
        priceFilter.$gte = dto.minPrice;
      }

      if (dto.maxPrice !== undefined) {
        priceFilter.$lte = dto.maxPrice;
      }

      filters.price = priceFilter;
    }

    return filters;
  }
}
