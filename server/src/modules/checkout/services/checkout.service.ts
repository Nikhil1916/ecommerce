import { ApiError } from "../../../core/ApiError";
import { ICartRepository } from "../../cart/repositories/cart.repository";
import { UpdateInventoryDto } from "../../inventory/dto/inventory.dto";
import { IInventoryRepository } from "../../inventory/interfaces/inventory.repository.interface";

export class CheckoutService {
  constructor(
    private cartRepository: ICartRepository,
    private inventoryRepository: IInventoryRepository,
  ) {}

  async startCheckout(userId: string) {
    const cart = await this.cartRepository.getCartWithProducts(userId);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    const reservedItems: UpdateInventoryDto[] = [];

    for (const item of cart.items) {
      const reservation = {
        productId: item.productId.toString(),
        quantity: item.quantity,
      };

      const reserved = await this.inventoryRepository.reserveStock(reservation);

      if (!reserved) {
        for (const reservedItem of reservedItems) {
          await this.inventoryRepository.releaseStock(reservedItem);
        }

        throw new ApiError(
          400,
          `Insufficient stock for product ${item.productId}`,
        );
      }

      reservedItems.push(reservation);
    }

    return {
      message: "Stock reserved successfully",
    };
  }
}
