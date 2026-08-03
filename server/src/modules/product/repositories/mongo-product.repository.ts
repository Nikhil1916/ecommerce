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
import { ProductListResult } from "../models/product.types";
import { generateSlug } from "../../../utils/slug.utils";
import { generateSKU } from "../../../utils/sku.util";
type MongoFilter = Record<string, unknown>;

export class MongoProductRepository implements IProductRepository {
  async create(data: CreateProductInput): Promise<Product> {
    const slug = await this.generateUniqueSlug(data.name);

    // TODO:
    // Replace with CounterService using Mongo atomic $inc
    // to avoid race conditions in concurrent requests.
    const sku = await this.generateUniqueSKU();
    const product = await ProductModel.create({ ...data, slug, sku });
    return product.toObject();
  }

  async findById(id: string): Promise<Product | null> {
    return ProductModel.findOne({
      _id: id,
      isActive: true,
    }).lean();
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return ProductModel.findOne({
      slug,
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

  async findAll(queryDto: ProductQueryDto): Promise<ProductListResult> {
    const filters = this.buildFilters(queryDto);
    const searchFilter = this.buildSearchFilter(queryDto.search);
    const query = new ApiFeatures(
      ProductModel.find({
        ...filters,
        ...searchFilter,
      }),
      queryDto,
    )
      .active()
      // .search(PRODUCT_QUERY_CONFIG.searchableFields)
      .sort(PRODUCT_QUERY_CONFIG.sortableFields)
      .limitFields(PRODUCT_QUERY_CONFIG.selectableFields)
      .paginate();

    const page = Math.max(queryDto.page || 1, 1);
    const limit = Math.max(queryDto.limit || 10, 1);

    const [products, totalItems] = await Promise.all([
      query.getQuery(),
      ProductModel.countDocuments({
        ...filters,
        ...searchFilter,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  private buildFilters(dto: ProductQueryDto): MongoFilter {
    const filters: MongoFilter = {
      isActive: true,
    };

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

  private buildSearchFilter(search?: string): MongoFilter {
    if (!search?.trim()) {
      return {};
    }

    return {
      $or: PRODUCT_QUERY_CONFIG.searchableFields.map((field) => ({
        [field]: {
          $regex: this.escapeRegex(search.trim()),
          $options: "i",
        },
      })),
    };
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;

    let counter = 1;

    while (await ProductModel.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async generateUniqueSKU(): Promise<string> {
    const latestProduct = await ProductModel.findOne()
      .sort({
        createdAt: -1,
      })
      .select("sku");

    if (!latestProduct) {
      return generateSKU(1);
    }

    const current = Number(latestProduct.sku.split("-")[1]);

    return generateSKU(current + 1);
  }
}
