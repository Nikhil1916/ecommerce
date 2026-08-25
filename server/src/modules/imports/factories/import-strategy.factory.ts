import { ImportType } from "../types/import.types";
import { ImportStrategy } from "../strategies/import.strategy";
import { ProductImportStrategy } from "../strategies/product-import.strategy";
import { CategoryImportStrategy } from "../strategies/category-import.strategy";
import { StockNotificationImportStrategy } from "../strategies/stock-notification-import.strategy";

import { ProductService } from "../../product/services/product.service";
import { CategoryService } from "../../category/services/category.service";
import { IStockNotificationRepository } from "../../notification/repositories/stock-notification.repository";

export class ImportStrategyFactory {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly stockNotificationRepository: IStockNotificationRepository,
  ) {}

  create(type: ImportType): ImportStrategy {
    switch (type) {
      case ImportType.PRODUCT:
        return new ProductImportStrategy(
          this.productService,
        );

      case ImportType.CATEGORY:
        return new CategoryImportStrategy(
          this.categoryService,
        );

      case ImportType.STOCK_NOTIFICATION:
        return new StockNotificationImportStrategy(
          this.stockNotificationRepository,
        );

      default:
        throw new Error(
          `Unsupported import type: ${type}`,
        );
    }
  }
}