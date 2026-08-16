import { ApiError } from "../../../core/ApiError";
import { Order } from "../models/order.model";
import { IOrderRepository } from "../repositories/order.repository";
import { OrderItem, OrderStatus, PaymentStatus } from "../types/order.types";
import { ClientSession } from "mongoose";

export class OrderService {
  constructor(private orderRepository: IOrderRepository) {}

  async createOrder(
    userId: string,
    items: OrderItem[],
    session?: ClientSession,
  ): Promise<Order> {
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

    return this.orderRepository.createOrder(order, session);
  }

  async markOrderAsPaid(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order> {
    const order = await this.orderRepository.markOrderAsPaid(orderId, session);

    if (!order) {
      throw new ApiError(404, "Order not found or cannot be marked as paid");
    }

    return order;
  }

  async markOrderAsPaymentFailed(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order> {
    const order = await this.orderRepository.markOrderAsPaymentFailed(
      orderId,
      session,
    );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found or cannot be marked as payment failed",
      );
    }

    return order;
  }

  async getOrderById(orderId: string, session?: ClientSession): Promise<Order> {
    const order = await this.orderRepository.findById(orderId, session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return order;
  }

  async markOrderAsExpired(orderId: string, session?: ClientSession) {
    const order = await this.orderRepository.markOrderAsExpired(
      orderId,
      session,
    );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found or cannot be marked as payment failed",
      );
    }

    return order;
  }
}
