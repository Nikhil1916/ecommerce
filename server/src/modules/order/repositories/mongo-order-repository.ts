import { Order, OrderModel } from "../models/order.model";
import {
  CreateOrderData,
  OrderStatus,
  PaymentStatus,
} from "../types/order.types";
import { IOrderRepository } from "./order.repository";
import { ClientSession } from "mongoose";
// import { IOrderRepository } from "../interfaces/order.repository.interface";

export class MongoOrderRepository implements IOrderRepository {
  async createOrder(order: CreateOrderData, session?: ClientSession): Promise<Order> {
    if (session) {
      return OrderModel.create([order], { session }).then((docs) => docs[0] as Order);
    }

    return OrderModel.create(order);
  }

  async markOrderAsPaid(orderId: string, session?: ClientSession): Promise<Order | null> {
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
        session,
      },
    );
  }

  async markOrderAsPaymentFailed(orderId: string, session?: ClientSession): Promise<Order | null> {
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
        session,
      },
    );
  }

  async findById(orderId: string, session?: ClientSession): Promise<Order | null> {
    return OrderModel.findById(orderId).session(session || null);
  }
}
