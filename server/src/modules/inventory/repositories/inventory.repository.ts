import { ProductModel } from "../../product/models/product.model";
import { UpdateInventoryDto } from "../dto/inventory.dto";
import { IInventoryRepository } from "../interfaces/inventory.repository.interface";
import { ClientSession } from "mongoose";

export default class InventoryRepository implements IInventoryRepository {
  async reserveStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean> {
    console.log("Reserving stock for product:", dto.productId, "Quantity:", dto.quantity);
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: dto.productId,
        $expr: {
          $gte: [
            {
              $subtract: ["$stock", "$reservedStock"],
            },
            dto.quantity,
          ],
        },
      },
      {
        $inc: {
          reservedStock: dto.quantity,
        },
      },
      { session },
    );
    return product !== null;
  }

  async releaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean> {
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: dto.productId,

        reservedStock: {
          $gte: dto.quantity,
        },
      },
      {
        $inc: {
          reservedStock: -dto.quantity,
        },
      },
      { session },
    );

    return product !== null;
  }

  async decreaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean> {
    const product = await ProductModel.findOneAndUpdate(
      {
        _id: dto.productId,

        reservedStock: {
          $gte: dto.quantity,
        },
      },
      {
        $inc: {
          stock: -dto.quantity,
          reservedStock: -dto.quantity,
        },
      },
      { session },
    );

    return product !== null;
  }
  async increaseStock(dto: UpdateInventoryDto, session?: ClientSession): Promise<boolean> {
    const product = await ProductModel.findByIdAndUpdate(dto.productId, {
      $inc: {
        stock: dto.quantity,
      },
    }, { session });

    return product !== null;
  }
}
