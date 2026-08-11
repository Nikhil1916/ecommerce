import { Order } from "../models/order.model";
import { CreateOrderData } from "../types/order.types";

export interface IOrderRepository {
  createOrder(order: CreateOrderData): Promise<Order>;
}