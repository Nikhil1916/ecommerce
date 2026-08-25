import { BaseSeeder } from "../base/base.seeder";
import { StockNotificationModel } from "../../../modules/notification/models/stock-notification.model";
import { ProductModel } from "../../../modules/product/models/product.model";
import { SEED_CONFIG } from "../seed.config";
import { StockNotificationStatus } from "../../../modules/notification/models/stock-notification.model";

export class StockNotificationSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const products = await ProductModel.find();

    if (!products.length) {
      throw new Error(
        "No products found. Seed products first.",
      );
    }

    const notifications = [];

    for (let i = 0; i < SEED_CONFIG.stockNotifications; i++) {
      const product =
        products[i % products.length];

      notifications.push({
        productId: product._id,
        userId: `seed-user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        status:
          i % 3 === 0
            ? StockNotificationStatus.NOTIFIED
            : StockNotificationStatus.PENDING,
      });
    }

    await this.clear(StockNotificationModel);

    await this.insertMany(
      StockNotificationModel,
      notifications,
    );
  }
}