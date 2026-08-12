import { Order, OrderModel } from "../models/order.model";
import {
  CreateOrderData,
  OrderStatus,
  PaymentStatus,
} from "../types/order.types";
import { IOrderRepository } from "./order.repository";
// import { IOrderRepository } from "../interfaces/order.repository.interface";

export class MongoOrderRepository implements IOrderRepository {
  async createOrder(order: CreateOrderData): Promise<Order> {
    return OrderModel.create(order);
  }

  async markOrderAsPaid(orderId: string): Promise<Order | null> {
    return OrderModel.findOneAndUpdate(
      {
        _id: orderId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      },
      {
        $set: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      },
      {
        new: true,
      },
    );
  }

  async markOrderAsPaymentFailed(orderId: string): Promise<Order | null> {
    return OrderModel.findOneAndUpdate(
      {
        _id: orderId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      },
      {
        $set: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
        },
      },
      {
        new: true,
      },
    );
  }

  async findById(orderId: string): Promise<Order | null> {
    return OrderModel.findById(orderId);
  }
}
