import { ClientSession } from "mongoose";
import { StockNotification } from "../models/stock-notification.model";

export interface IStockNotificationRepository {
  create(
    data: {
      productId: string;
      userId: string;
      email: string;
    },
    session?: ClientSession,
  ): Promise<StockNotification>;

  findPendingByProductAndUser(
    productId: string,
    userId: string,
  ): Promise<StockNotification | null>;

  findPendingByProduct(
    productId: string,
  ): Promise<StockNotification[]>;

  markAsNotified(
    id: string,
    session?: ClientSession,
  ): Promise<StockNotification | null>;
}