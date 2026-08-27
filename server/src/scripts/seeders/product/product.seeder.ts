import { faker } from "@faker-js/faker";

import { BaseSeeder } from "../base/base.seeder";
import { SEED_CONFIG } from "../seed.config";
import { ProductModel } from "../../../modules/product/models/product.model";
import { CategoryModel } from "../../../modules/category/models/category.model";
import { generateSlug } from "../../../utils/slug.utils";
import { generateSKU } from "../../../utils/sku.util";
import { MongoCounterRepository } from "../../../modules/counter/repositories/mongo-counter.repository";

export class ProductSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const categories = await CategoryModel.find();

    if (!categories.length) {
      throw new Error("No categories found. Seed categories first.");
    }

    const products = Array.from(
      { length: SEED_CONFIG.products },
      (_, index) => {
        const name = faker.commerce.productName();

        return {
          name,
          slug: `${generateSlug(name)}-${index + 1}`,
          sku: generateSKU(index + 1),

          description: faker.commerce.productDescription(),

          price: Number(
            faker.commerce.price({
              min: 100,
              max: 100000,
            }),
          ),

          stock: faker.number.int({
            min: 0,
            max: 500,
          }),

          categoryId: faker.helpers.arrayElement(categories)._id,

          // images: [
          //   {
          //     url: faker.image.urlPicsumPhotos(),
          //     alt: name,
          //   },
          // ],

          isActive: true,
        };
      },
    );
    await this.clear(ProductModel);
    await this.insertMany(ProductModel, products);

    const highestProduct = await ProductModel.findOne({
      sku: /^PRD-\d+$/,
    })
      .sort({ sku: -1 })
      .select("sku")
      .lean();

    const highestSequence = highestProduct
      ? Number(highestProduct.sku.split("-")[1])
      : 0;

    await new MongoCounterRepository().ensureAtLeast(
      "productSku",
      highestSequence,
    );
  }
}
