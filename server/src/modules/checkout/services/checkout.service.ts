import { ApiError } from "../../../core/ApiError";
import { ICartRepository } from "../../cart/repositories/cart.repository";
import { UpdateInventoryDto } from "../../inventory/dto/inventory.dto";
import { IInventoryRepository } from "../../inventory/interfaces/inventory.repository.interface";
import { reservationExpiryQueue } from "../../order/queues/reservation-expiry.queue";
import { OrderService } from "../../order/service/order.service";

export class CheckoutService {
  constructor(
    private cartRepository: ICartRepository,
    private inventoryRepository: IInventoryRepository,
    private orderService: OrderService,
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

    try {
      const order = await this.orderService.createOrder(
        userId,
        cart.items.map((item) => ({
          productId: item.productId.toString(),
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        })),
      );
      console.log(order._id);
      const job = await reservationExpiryQueue.add(
        "expire-order",
        {
          orderId: order._id.toString(),
        },
        {
          delay: 30000, // testing
          removeOnComplete: true,
        },
      );
      console.log("Expiry job added", order._id, job.id);
      return order;
    } catch (error) {
      for (const reservedItem of reservedItems) {
        await this.inventoryRepository.releaseStock(reservedItem);
      }

      throw error;
    }
  }
}
