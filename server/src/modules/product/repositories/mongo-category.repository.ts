import { Category, CategoryModel } from "../models/category.model";
import { ICategoryRepository } from "./category.repository";

export class MongoCategoryRepository implements ICategoryRepository {
  async create(data: Category): Promise<Category> {
    const category = await CategoryModel.create(data);
    return category.toObject();
  }

  async findById(id: string): Promise<Category | null> {
    return CategoryModel.findOne({
      _id: id,
      isActive: true,
    }).lean();
  }

  async findByName(name: string): Promise<Category | null> {
    return CategoryModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      isActive: true,
    }).lean();
  }

    async update(id: string, data: Partial<Category>): Promise<Category | null> {
      const category = await CategoryModel.findOne({
        _id: id,
        isActive: true,
      });
  
      if (!category) {
        return null;
      }
  
      category.set(data);
  
      await category.save();
  
      return category.toObject();
    }
  
    async delete(id: string): Promise<boolean> {
      const result = await CategoryModel.updateOne(
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
  
}
