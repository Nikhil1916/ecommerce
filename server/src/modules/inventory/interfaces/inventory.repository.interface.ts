import { UpdateInventoryDto } from "../dto/inventory.dto";
import { ClientSession } from "mongoose";

export interface IInventoryRepository {
  reserveStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean>;

  releaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean>;

  increaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean>;

  decreaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean>;
}