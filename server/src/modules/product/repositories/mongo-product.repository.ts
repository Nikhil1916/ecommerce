import { ProductModel, Product, CreateProductInput } from "../models/product.model";
import { IProductRepository } from "./product.repository";

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
      name:new RegExp(`^${name}$`, "i"),
      isActive: true,
    }).lean();
  }

  async update(id: string, data: Partial<CreateProductInput>): Promise<Product | null> {
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
    return await ProductModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      categoryId,
      isActive: true,
    }).lean();
  }
}