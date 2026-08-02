import { faker } from "@faker-js/faker";
import { CategoryModel } from "../../../modules/category/models/category.model";
import { BaseSeeder } from "../base/base.seeder";
import { SEED_CONFIG } from "../seed.config";


export class CategorySeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const categories = Array.from(
      { length: SEED_CONFIG.categories },
      () => ({
        name: faker.commerce.department(),
        parentCategoryId: null,
        isActive: true,
      })
    );

    await this.clear(CategoryModel);
    await this.insertMany(CategoryModel, categories);
  }
}