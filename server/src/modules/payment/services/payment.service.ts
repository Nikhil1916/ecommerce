import logger from "../../../lib/logger";
import { IInventoryRepository } from "../../inventory/interfaces/inventory.repository.interface";
import { OrderService } from "../../order/service/order.service";
import { IPaymentGateway } from "../interfaces/payment.gateway.interface";

export class PaymentService {
  constructor(
    private paymentGateway: IPaymentGateway,
    private orderService: OrderService,
    private inventoryRepository: IInventoryRepository,
  ) {}

  async createPayment(orderId: string, amount: number) {
    return this.paymentGateway.createPayment(orderId, amount);
  }

  async handleWebhook(payload: unknown) {
    const event = await this.paymentGateway.handleWebhook(payload);

    const order = await this.orderService.getOrderById(event.orderId);
    if (order.paymentStatus !== "PENDING") {
      logger.info(`Duplicate webhook ignored ${order._id}`);
      return;
    }
    if (event.status === "SUCCESS") {
      await this.orderService.markOrderAsPaid(event.orderId);

      for (const item of order.items) {
        await this.inventoryRepository.decreaseStock({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return;
    }

    if (event.status === "FAILED") {
      await this.orderService.markOrderAsPaymentFailed(event.orderId);

      for (const item of order.items) {
        await this.inventoryRepository.releaseStock({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return;
    }
  }
}
