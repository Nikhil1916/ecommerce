import { StockNotificationController } from "./controllers/stock-notification.controller";
import { MongoStockNotificationRepository } from "./repositories/mongo-stock-notification.repository";
import { StockNotificationService } from "./services/stock-notification.service";
import { createStockNotificationRoutes } from "./routes/stock-notifictaion-routes";

import { MongoProductRepository } from "../product/repositories/mongo-product.repository";
import { MongoCounterRepository } from "../counter/repositories/mongo-counter.repository";

const stockNotificationRepository =
  new MongoStockNotificationRepository();

const productRepository = new MongoProductRepository(
  new MongoCounterRepository(),
);

const stockNotificationService = new StockNotificationService(
  stockNotificationRepository,
  productRepository,
);

const stockNotificationController =
  new StockNotificationController(
    stockNotificationService,
  );

export const stockNotificationRoutes =
  createStockNotificationRoutes(
    stockNotificationController,
  );