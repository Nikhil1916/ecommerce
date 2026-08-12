import { ApiError } from "../../../core/ApiError";
import { Order } from "../models/order.model";
import { IOrderRepository } from "../repositories/order.repository";
import { OrderItem, OrderStatus, PaymentStatus } from "../types/order.types";

export class OrderService {
  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    // next step
    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    const order = {
      orderNumber: `ORD-${Date.now()}`,
      userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    };

    return this.orderRepository.createOrder(order);
  }

  async markOrderAsPaid(orderId: string): Promise<Order> {
    const order = await this.orderRepository.markOrderAsPaid(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found or cannot be marked as paid");
    }

    return order;
  }

  async markOrderAsPaymentFailed(orderId: string): Promise<Order> {
    const order = await this.orderRepository.markOrderAsPaymentFailed(orderId);

    if (!order) {
      throw new ApiError(
        404,
        "Order not found or cannot be marked as payment failed",
      );
    }

    return order;
  }
}
