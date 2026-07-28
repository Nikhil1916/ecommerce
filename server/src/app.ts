import express from "express";
import { ApiResponse } from "./core/ApiResponse";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import productRoutes from "./modules/product/routes/product.routes";
import categoryRoutes from "./modules/category/routes/category.routes";
const app = express();

app.use(requestId);
app.use(loggerMiddleware);

app.use(express.json());


app.get("/health", (req, res) => {
  res.json(
    new ApiResponse("Server Running", {
      requestId: req.requestId,
    })
  );
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// 404 Middleware
app.use(notFoundHandler);

// Global Error Middleware
app.use(errorHandler);

export default app;