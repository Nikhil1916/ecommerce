import { Order, OrderModel } from "../models/order.model";
import {
  CreateOrderData,
  OrderStatus,
  PaymentStatus,
} from "../types/order.types";
import { IOrderRepository } from "./order.repository";
import { ClientSession } from "mongoose";
export class MongoOrderRepository implements IOrderRepository {
  async markOrderAsExpired(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
    return OrderModel.findOneAndUpdate(
      {
        _id: orderId,
        paymentStatus: PaymentStatus.PENDING,
      },
      {
        $set: {
          status: OrderStatus.EXPIRED
        },
      },
      {
        returnDocument: "after",
        session,
      },
    );
  }

  async createOrder(
    order: CreateOrderData,
    session?: ClientSession,
  ): Promise<Order> {
    if (session) {
      return OrderModel.create([order], { session }).then(
        (docs) => docs[0] as Order,
      );
    }

    return OrderModel.create(order);
  }

  async markOrderAsPaid(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
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
        returnDocument: "after",
        session,
      },
    );
  }

  async markOrderAsPaymentFailed(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
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
        returnDocument: "after",
        session,
      },
    );
  }

  async findById(
    orderId: string,
    session?: ClientSession,
  ): Promise<Order | null> {
    return OrderModel.findById(orderId).session(session || null);
  }
}
