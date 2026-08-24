import { ApiError } from "../../../core/ApiError";
import { backInStockQueue } from "../../notification/queues/back-in-stock.queue";
import { UpdateInventoryDto } from "../dto/inventory.dto";
import { IInventoryRepository } from "../interfaces/inventory.repository.interface";
import mongoose from "mongoose";

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
    const session = await mongoose.startSession();

    let shouldNotify = false;

    try {
      await session.withTransaction(async () => {
        const result = await this.inventoryRepository.increaseStock(
          dto,
          session,
        );

        if (!result) {
          throw new ApiError(404, "Product not found.");
        }

        shouldNotify = result.wasOutOfStock;
      });
    } finally {
      await session.endSession();
    }

    if (shouldNotify) {
      await backInStockQueue.add(
        "product-back-in-stock",
        {
          productId: dto.productId,
        },
        {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    }
  }

  async decreaseStock(dto: UpdateInventoryDto): Promise<void> {
    const decreased = await this.inventoryRepository.decreaseStock(dto);

    if (!decreased) {
      throw new ApiError(400, "Unable to decrease stock.");
    }
  }
}
