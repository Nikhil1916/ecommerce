import { ApiError } from "../../../core/ApiError";
import { IProductRepository } from "../../product/repositories/product.repository";
import { StockNotificationStatus } from "../models/stock-notification.model";
import { IStockNotificationRepository } from "../repositories/stock-notification.repository";

export class StockNotificationService {
  constructor(
    private stockNotificationRepository: IStockNotificationRepository,
    private productRepository: IProductRepository,
  ) {}

  async subscribe(
    productId: string,
    userId: string,
    email: string,
  ) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.stock > 0) {
      throw new ApiError(
        400,
        "Product is already in stock",
      );
    }

    const existing =
      await this.stockNotificationRepository.findPendingByProductAndUser(
        productId,
        userId,
      );

    if (existing) {
      throw new ApiError(
        409,
        "You are already subscribed for this product",
      );
    }

    return this.stockNotificationRepository.create({
      productId,
      userId,
      email,
    });
  }
}
