import { CreateProductInput, Product } from "../models/product.model";

export interface IProductRepository {
  create(data: CreateProductInput): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findByName(name: string): Promise<Product | null>;

  update(
    id: string,
    data: Partial<CreateProductInput>
  ): Promise<Product | null>;

  delete(id: string): Promise<boolean>;

  findByNameAndCategory(
        name: string,
        categoryId: string
    ): Promise<Product | null>;

}