import { Category } from "../models/category.model";

export interface ICategoryRepository {

    create(data: Category): Promise<Category>;

    findById(id: string): Promise<Category | null>;

    findByName(name: string): Promise<Category | null>;

    update(
        id: string,
        data: Partial<Category>
    ): Promise<Category | null>;

    delete(id: string): Promise<boolean>;
}