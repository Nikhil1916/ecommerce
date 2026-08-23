import { ClientSession } from "mongoose";
import {
  StockNotification,
  StockNotificationModel,
  StockNotificationStatus,
} from "../models/stock-notification.model";
import { IStockNotificationRepository } from "./stock-notification.repository";

export class MongoStockNotificationRepository
  implements IStockNotificationRepository
{
  async create(
    data: {
      productId: string;
      userId: string;
      email: string;
    },
    session?: ClientSession,
  ): Promise<StockNotification> {
    const docs = await StockNotificationModel.create(
      [
        {
          ...data,
          status: StockNotificationStatus.PENDING,
        },
      ],
      { session },
    );

    return docs[0];
  }

  async findPendingByProductAndUser(
    productId: string,
    userId: string,
  ): Promise<StockNotification | null> {
    return StockNotificationModel.findOne({
      productId,
      userId,
      status: StockNotificationStatus.PENDING,
    });
  }

  async findPendingByProduct(
    productId: string,
  ): Promise<StockNotification[]> {
    return StockNotificationModel.find({
      productId,
      status: StockNotificationStatus.PENDING,
    });
  }

  async markAsNotified(
    id: string,
    session?: ClientSession,
  ): Promise<StockNotification | null> {
    return StockNotificationModel.findOneAndUpdate(
      {
        _id: id,
        status: StockNotificationStatus.PENDING,
      },
      {
        $set: {
          status: StockNotificationStatus.NOTIFIED,
        },
      },
      {
        new: true,
        session,
      },
    );
  }
}