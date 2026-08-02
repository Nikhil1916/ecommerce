import mongoose from "mongoose";
import { connectDatabase, disconnectMongo } from "../lib/database";
import { SeedRunner } from "./seeders/seed-runner";
import { CategorySeeder } from "./seeders/category/category.seeder";
import { ProductSeeder } from "./seeders/product/product.seeder";

async function bootstrap() {
    try {
        await connectDatabase();
        const seeders = [new CategorySeeder(), new ProductSeeder()];
        const seedRunner = new SeedRunner(seeders);
        await seedRunner.run();
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await disconnectMongo();
    }
}

bootstrap();