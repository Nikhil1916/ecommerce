import logger from "../../../lib/logger";
import mongoose, { ClientSession } from "mongoose";
import { IInventoryRepository } from "../../inventory/interfaces/inventory.repository.interface";
import { OrderService } from "../../order/service/order.service";
import { IPaymentGateway } from "../interfaces/payment.gateway.interface";
import { paymentSuccessQueue } from "../queues/payment-success.queue";
import { ICartRepository } from "../../cart/repositories/cart.repository";

export class PaymentService {
  constructor(
    private paymentGateway: IPaymentGateway,
    private orderService: OrderService,
    private inventoryRepository: IInventoryRepository,
    private cartRepository: ICartRepository,
  ) {}

  async createPayment(orderId: string, amount: number) {
    return this.paymentGateway.createPayment(orderId, amount);
  }

  async handleWebhook(payload: unknown) {
    const event = await this.paymentGateway.handleWebhook(payload);
    const session: ClientSession = await mongoose.startSession();
    let queuedConfirmation = false;
    try {
      await session.withTransaction(async () => {
        const order = await this.orderService.getOrderById(
          event.orderId,
          session,
        );
        if (order.paymentStatus !== "PENDING") {
          logger.info(`Duplicate webhook ignored ${order._id}`);
          return;
        }

        if (event.status === "SUCCESS") {
          await this.orderService.markOrderAsPaid(event.orderId, session);
          for (const item of order.items) {
            await this.inventoryRepository.decreaseStock(
              {
                productId: item.productId,
                quantity: item.quantity,
              },
              session,
            );
          }
          await this.cartRepository.clearCart(order.userId, session);
          queuedConfirmation = true;
          return;
        }

        if (event.status === "FAILED") {
          await this.orderService.markOrderAsPaymentFailed(
            event.orderId,
            session,
          );

          for (const item of order.items) {
            await this.inventoryRepository.releaseStock(
              {
                productId: item.productId,
                quantity: item.quantity,
              },
              session,
            );
          }

          return;
        }
      });

      if (queuedConfirmation) {
        await paymentSuccessQueue.add(
          "send-confirmation-email",
          {
            orderId: event.orderId,
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
    } finally {
      await session.endSession();
    }
  }
}
