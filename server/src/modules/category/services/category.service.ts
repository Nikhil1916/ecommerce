import { ApiError } from "../../../core/ApiError";
import { Category } from "../models/category.model";
import { ICategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async createCategory(data: Omit<Category, "createdAt" | "updatedAt">): Promise<Category> {
    const existingCategory =
      await this.categoryRepository.findByName(data.name);

    if (existingCategory) {
      throw new ApiError(409, "Category already exists");
    }

    return this.categoryRepository.create(data as Category);
  }

  async getCategoryById(id: string): Promise<Category> {
    const category =
      await this.categoryRepository.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return category;
  }

  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<Category> {
    const existingCategory =
      await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    if (
      data.name &&
      data.name.toLowerCase() !== existingCategory.name.toLowerCase()
    ) {
      const duplicate =
        await this.categoryRepository.findByName(data.name);

      if (duplicate) {
        throw new Error("Category already exists");
      }
    }

    const updatedCategory =
      await this.categoryRepository.update(id, data);

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category =
      await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    const deleted =
      await this.categoryRepository.delete(id);

    if (!deleted) {
      throw new ApiError(500, "Unable to delete category");
    }
  }
}