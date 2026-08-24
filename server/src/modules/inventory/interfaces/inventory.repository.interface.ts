import { UpdateInventoryDto } from "../dto/inventory.dto";
import { ClientSession } from "mongoose";
import { Product } from "../../product/models/product.model";

export interface IncreaseStockResult {
  product: Product;
  wasOutOfStock: boolean;
}

export interface IInventoryRepository {
  reserveStock(
    dto: UpdateInventoryDto,
    session?: ClientSession,
  ): Promise<boolean>;

  releaseStock(
    dto: UpdateInventoryDto,
    session?: ClientSession,
  ): Promise<boolean>;

  increaseStock(
    dto: UpdateInventoryDto,
    session?: ClientSession,
  ): Promise<IncreaseStockResult | null>;

  decreaseStock(
    dto: UpdateInventoryDto,
    session?: ClientSession,
  ): Promise<boolean>;
}