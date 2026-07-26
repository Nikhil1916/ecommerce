import express from "express";
import { ApiResponse } from "./core/ApiResponse";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
const app = express();

app.use(express.json());


app.get("/health", (req, res)=>{
    res.json({
        success: true, 
        message: "server is started"
    })
});

// 404 Middleware
app.use(notFoundHandler);

// Global Error Middleware
app.use(errorHandler);

export default app;