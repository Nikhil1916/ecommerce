import express from "express";
import { ApiResponse } from "./core/ApiResponse";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import productRoutes from "./modules/product/routes/product.routes";
import categoryRoutes from "./modules/category/routes/category.routes";
import { authRouter } from "./modules/auth/auth.module";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.module";
import { inventoryRoutes } from "./modules/inventory/inventory.module";
import { cartRouter } from "./modules/cart/routes/cart.routes";
import { checkoutRouter } from "./modules/checkout/routes/checkout.routes";
import { paymentRouter } from "./modules/payment/routes/payment.routes";
import { stockNotificationRoutes } from "./modules/notification/stock-notification.module";
import { importRouter } from "./modules/imports/routes/import.routes";
const app = express();

app.use(requestId);
app.use(loggerMiddleware);

app.use("/api/v1/payment", paymentRouter);

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  res.json(
     ApiResponse.success("Server Running", {
      requestId: req.requestId,
    })
  );
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/imports", importRouter);
app.use("/api/v1", stockNotificationRoutes);

// 404 Middleware
app.use(notFoundHandler);

// Global Error Middleware
app.use(errorHandler);

export default app;