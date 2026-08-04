import { ApiError } from "../../../core/ApiError";
import { UpdateInventoryDto } from "../dto/inventory.dto";
import { IInventoryRepository } from "../interfaces/inventory.repository.interface";

export class InventoryService {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async reserveStock(dto: UpdateInventoryDto): Promise<void> {
    const reserved = await this.inventoryRepository.reserveStock(dto);

    if (!reserved) {
      throw new ApiError(400, "Insufficient stock available.");
    }
  }

  async releaseStock(dto: UpdateInventoryDto): Promise<void> {
    const released = await this.inventoryRepository.releaseStock(dto);

    if (!released) {
      throw new ApiError(400, "Unable to release stock.");
    }
  }

  async increaseStock(dto: UpdateInventoryDto): Promise<void> {
    const increased = await this.inventoryRepository.increaseStock(dto);

    if (!increased) {
      throw new ApiError(404, "Product not found.");
    }
  }

  async decreaseStock(dto: UpdateInventoryDto): Promise<void> {
    const decreased = await this.inventoryRepository.decreaseStock(dto);

    if (!decreased) {
      throw new ApiError(400, "Unable to decrease stock.");
    }
  }
}
