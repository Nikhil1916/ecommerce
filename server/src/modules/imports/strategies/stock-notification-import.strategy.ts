import { Types } from "mongoose";
import { ImportStrategy } from "./import.strategy";
import { IStockNotificationRepository } from "../../notification/repositories/stock-notification.repository";

export class StockNotificationImportStrategy
  implements ImportStrategy
{
  constructor(
    private readonly stockNotificationRepository: IStockNotificationRepository,
  ) {}

  async validate(
    row: Record<string, unknown>,
    rowNumber: number,
  ): Promise<void> {
    if (!row.productId) {
      throw new Error("productId is required");
    }

    if (!Types.ObjectId.isValid(String(row.productId))) {
      throw new Error("Invalid productId");
    }

    if (!row.userId) {
      throw new Error("userId is required");
    }

    if (!row.email) {
      throw new Error("email is required");
    }

    const email = String(row.email).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email");
    }
  }

  async import(
    row: Record<string, unknown>,
  ): Promise<void> {
    const productId = String(row.productId);
    const userId = String(row.userId);
    const email = String(row.email).trim().toLowerCase();

    const existing =
      await this.stockNotificationRepository
        .findPendingByProductAndUser(
          productId,
          userId,
        );

    if (existing) {
      throw new Error(
        "Pending notification already exists for this user and product",
      );
    }

    await this.stockNotificationRepository.create({
      productId,
      userId,
      email,
    });
  }
}