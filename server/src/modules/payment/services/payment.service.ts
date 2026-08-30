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

  async handleWebhook(payload: Buffer, signature: string) {
    const event = await this.paymentGateway.handleWebhook(payload, signature);

    const session: ClientSession = await mongoose.startSession();

    let queuedConfirmation = false;

    try {
      await session.withTransaction(async () => {
        /*
         * SUCCESS
         *
         * Atomically changes:
         *
         * PENDING → PAID
         *
         * If another webhook has already processed
         * the order, this returns null.
         */
        if (event.status === "SUCCESS") {
          const updatedOrder = await this.orderService.markOrderAsPaid(
            event.orderId,
            session,
          );

          /*
           * Duplicate webhook or order is no longer
           * in PENDING state.
           */
          if (!updatedOrder) {
            logger.info(`Duplicate webhook ignored: ${event.orderId}`);

            return;
          }

          /*
           * Payment was successfully processed,
           * so decrease the reserved inventory.
           */
          for (const item of updatedOrder.items) {
            const stockUpdated = await this.inventoryRepository.decreaseStock(
              {
                productId: item.productId,
                quantity: item.quantity,
              },
              session,
            );

            if (!stockUpdated) {
              throw new Error(
                `Failed to decrease stock for product ${item.productId}`,
              );
            }
          }

          /*
           * Payment successful → clear user's cart.
           */
          await this.cartRepository.clearCart(updatedOrder.userId, session);

          /*
           * Queue email only after transaction
           * successfully commits.
           */
          queuedConfirmation = true;

          return;
        }

        /*
         * FAILED
         *
         * Atomically changes:
         *
         * PENDING → FAILED
         */
        if (event.status === "FAILED") {
          const updatedOrder = await this.orderService.markOrderAsPaymentFailed(
            event.orderId,
            session,
          );

          /*
           * Duplicate webhook or order is no longer
           * in PENDING state.
           */
          if (!updatedOrder) {
            logger.info(`Duplicate webhook ignored: ${event.orderId}`);

            return;
          }

          /*
           * Payment failed → release the
           * previously reserved inventory.
           */
          for (const item of updatedOrder.items) {
            const stockReleased = await this.inventoryRepository.releaseStock(
              {
                productId: item.productId,
                quantity: item.quantity,
              },
              session,
            );

            if (!stockReleased) {
              throw new Error(
                `Failed to release stock for product ${item.productId}`,
              );
            }
          }

          return;
        }
      });

      /*
       * IMPORTANT:
       *
       * Email is queued only after the DB transaction
       * has successfully committed.
       */
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
