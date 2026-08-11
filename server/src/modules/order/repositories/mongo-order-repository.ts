import { Order, OrderModel } from "../models/order.model";
import { CreateOrderData } from "../types/order.types";
import { IOrderRepository } from "./order.repository";
// import { IOrderRepository } from "../interfaces/order.repository.interface";

export class MongoOrderRepository implements IOrderRepository {
  async createOrder(order: CreateOrderData): Promise<Order> {
    return OrderModel.create(order);
  }
}