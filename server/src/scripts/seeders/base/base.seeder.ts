import { Model } from "mongoose";
import { ISeeder } from "./seeder.interface";

export abstract class BaseSeeder implements ISeeder {
  abstract seed(): Promise<void>;

  protected log(message: string): void {
    console.log(`[Seeder] ${message}`);
  }

  protected async clear(
    model: Model<any>
  ): Promise<void> {
    this.log(`Clearing ${model.modelName}...`);
    await model.deleteMany({});
  }

  protected async insertMany(
    model: Model<any>,
    documents: object[]
  ): Promise<void> {
    this.log(`Seeding ${model.modelName}...`);

    await model.insertMany(documents);

    this.log(
      `${documents.length} ${model.modelName} inserted successfully.`
    );
  }
}