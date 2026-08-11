import { Order } from "../models/order.model";
import { IOrderRepository } from "../repositories/order.repository";
import { OrderItem } from "../types/order.types";

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
      status: "PENDING" as const,
      paymentStatus: "PENDING" as const,
    };

    return this.orderRepository.createOrder(order);
  }
}
