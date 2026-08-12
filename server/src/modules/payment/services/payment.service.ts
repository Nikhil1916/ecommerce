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

    if (event.status === "SUCCESS") {
      const order = await this.orderService.markOrderAsPaid(event.orderId);

      const latestOrder = await this.orderService.getOrderById(
        order._id.toString(),
      );

      console.log(latestOrder);

      for (const item of latestOrder.items) {
        await this.inventoryRepository.decreaseStock({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return;
    }

    if (event.status === "FAILED") {
      const order = await this.orderService.markOrderAsPaymentFailed(
        event.orderId,
      );

      const latestOrder = await this.orderService.getOrderById(
        order._id.toString(),
      );

      for (const item of latestOrder.items) {
        await this.inventoryRepository.releaseStock({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return;
    }
  }
}
