import { Order } from "../models/order.model";
import { CreateOrderData } from "../types/order.types";

export interface IOrderRepository {
  createOrder(order: CreateOrderData): Promise<Order>;

  markOrderAsPaid(orderId: string): Promise<Order | null>;

  markOrderAsPaymentFailed(orderId: string): Promise<Order | null>;

  findById(orderId: string): Promise<Order | null>;
}
