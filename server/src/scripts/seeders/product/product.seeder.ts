import { faker } from "@faker-js/faker";

import { BaseSeeder } from "../base/base.seeder";
import { SEED_CONFIG } from "../seed.config";
import { ProductModel } from "../../../modules/product/models/product.model";
import { CategoryModel } from "../../../modules/category/models/category.model";
export class ProductSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const categories = await CategoryModel.find();

    if (!categories.length) {
      throw new Error(
        "No categories found. Seed categories first."
      );
    }

    const products = Array.from(
      { length: SEED_CONFIG.products },
      () => ({
        name: faker.commerce.productName(),

        description:
          faker.commerce.productDescription(),

        price: Number(
          faker.commerce.price({
            min: 100,
            max: 100000,
          })
        ),

        stock: faker.number.int({
          min: 0,
          max: 500,
        }),

        categoryId:
          faker.helpers.arrayElement(categories)._id,

        images: [
          {
            url: faker.image.urlPicsumPhotos(),
            alt: faker.commerce.productName(),
          },
        ],

        isActive: true,
      })
    );

    await this.clear(ProductModel);
    await this.insertMany(ProductModel, products);
  }
}