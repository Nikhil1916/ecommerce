import { Request, Response } from "express";
import { asyncHandler } from "../../../core/asyncHandler";
import { ApiError } from "../../../core/ApiError";
import { ApiResponse } from "../../../core/ApiResponse";
import { OrderService } from "../service/order.service";
import { OrderQuery } from "../validators/order-query.validator";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  getOrders = asyncHandler(async (
    req: Request,
    res: Response,
  ) => {
    const { status } = req.query as unknown as OrderQuery;
    const orders = await this.orderService.getOrdersByUserId(
      req.user!.id,
      status,
    );

    res.status(200).json(
      ApiResponse.success("Orders fetched successfully.", orders, req.requestId),
    );
  });

  getOrderById = asyncHandler(async (
    req: Request,
    res: Response,
  ) => {
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;
    const order = await this.orderService.getOrderById(orderId);

    if (order.userId !== req.user!.id) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json(
      ApiResponse.success("Order fetched successfully.", order, req.requestId),
    );
  });
}