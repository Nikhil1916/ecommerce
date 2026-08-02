import {ISeeder } from "./base/seeder.interface";

export class SeedRunner {
    constructor(private seeders: ISeeder[]) {}

    async run(): Promise<void> {
        for (const seeder of this.seeders) {
            await seeder.seed();
        }
    }
}