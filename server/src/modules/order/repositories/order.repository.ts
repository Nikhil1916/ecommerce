import { Order } from "../models/order.model";
import { CreateOrderData, OrderStatus } from "../types/order.types";
import { ClientSession } from "mongoose";

export interface IOrderRepository {
  createOrder(order: CreateOrderData, session?: ClientSession): Promise<Order>;

  markOrderAsPaid(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null>;

  markOrderAsPaymentFailed(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null>;

  findById(orderId: string, session?: ClientSession): Promise<Order | null>;

  findByUserId(
    userId: string,
    status?: OrderStatus,
  ): Promise<Order[]>;

  markOrderAsExpired(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null>;
}
