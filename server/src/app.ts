import express from "express";
import { ApiResponse } from "./core/ApiResponse";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { requestId } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
const app = express();

app.use(requestId);
app.use(loggerMiddleware);

app.use(express.json());

app.use(express.json());


app.get("/health", (req, res) => {
  res.json(
    new ApiResponse("Server Running", {
      requestId: req.requestId,
    })
  );
});
// 404 Middleware
app.use(notFoundHandler);

// Global Error Middleware
app.use(errorHandler);

export default app;