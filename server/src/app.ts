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
const app = express();

app.use(requestId);
app.use(loggerMiddleware);

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

// 404 Middleware
app.use(notFoundHandler);

// Global Error Middleware
app.use(errorHandler);

export default app;