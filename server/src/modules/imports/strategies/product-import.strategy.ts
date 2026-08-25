import { ProductService } from "../../product/services/product.service";
import { CreateProductInput } from "../../product/models/product.types";
import { ImportStrategy } from "./import.strategy";

export class ProductImportStrategy
  implements ImportStrategy
{
  constructor(
    private readonly productService: ProductService,
  ) {}

  async validate(
    row: Record<string, unknown>,
    rowNumber: number,
  ): Promise<void> {
    if (!row.name || !String(row.name).trim()) {
      throw new Error("Name is required");
    }

    if (
      !row.description ||
      !String(row.description).trim()
    ) {
      throw new Error("Description is required");
    }

    if (
      row.price === undefined ||
      row.price === null ||
      Number.isNaN(Number(row.price))
    ) {
      throw new Error("Invalid price");
    }

    if (Number(row.price) < 0) {
      throw new Error("Price cannot be negative");
    }

    if (
      row.stock === undefined ||
      row.stock === null ||
      Number.isNaN(Number(row.stock))
    ) {
      throw new Error("Invalid stock");
    }

    if (Number(row.stock) < 0) {
      throw new Error("Stock cannot be negative");
    }

    if (
      !row.categoryId ||
      !String(row.categoryId).trim()
    ) {
      throw new Error("categoryId is required");
    }
  }

  async import(
    row: Record<string, unknown>,
  ): Promise<void> {
    const productData = {
      name: String(row.name).trim(),

      description: String(
        row.description,
      ).trim(),

      price: Number(row.price),

      stock: Number(row.stock),

      categoryId: String(
        row.categoryId,
      ).trim(),

      // Required by existing CreateProductInput.
      // Repository will generate the real values.
      slug: "",

      sku: "",

      images: [],
    } satisfies CreateProductInput;

    await this.productService.createProduct(
      productData,
    );
  }
}