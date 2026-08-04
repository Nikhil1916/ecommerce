import { UpdateInventoryDto } from "../dto/inventory.dto";

export interface IInventoryRepository {
  reserveStock(
    dto: UpdateInventoryDto
  ): Promise<boolean>;

  releaseStock(
    dto: UpdateInventoryDto
  ): Promise<boolean>;

  increaseStock(
    dto: UpdateInventoryDto
  ): Promise<boolean>;

  decreaseStock(
    dto: UpdateInventoryDto
  ): Promise<boolean>;
}