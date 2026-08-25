import { Types } from "mongoose";
import { CategoryService } from "../../category/services/category.service";
import { Category } from "../../category/models/category.model";
import { ImportStrategy } from "./import.strategy";

export class CategoryImportStrategy
  implements ImportStrategy
{
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  async validate(
    row: Record<string, unknown>,
    rowNumber: number,
  ): Promise<void> {
    if (!row.name || !String(row.name).trim()) {
      throw new Error("Category name is required");
    }

    if (row.parentCategoryId) {
      const parentCategoryId = String(
        row.parentCategoryId,
      ).trim();

      if (!Types.ObjectId.isValid(parentCategoryId)) {
        throw new Error(
          "Invalid parentCategoryId",
        );
      }
    }
  }

  async import(
    row: Record<string, unknown>,
  ): Promise<void> {
    const parentCategoryId = row.parentCategoryId
      ? new Types.ObjectId(
          String(row.parentCategoryId).trim(),
        )
      : null;

    const category = {
      name: String(row.name).trim(),
      parentCategoryId,
      isActive: true,
    };

    await this.categoryService.createCategory(
      category,
    );
  }
}