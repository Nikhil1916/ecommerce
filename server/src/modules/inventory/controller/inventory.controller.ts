import { NextFunction, Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { ApiResponse } from "../../../core/ApiResponse";
import { UpdateInventoryDto } from "../dto/inventory.dto";

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  reserveStock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.inventoryService.reserveStock(req.body);

      res.status(200).json(ApiResponse.success("Stock reserved successfully."));
    } catch (error) {
      next(error);
    }
  };

  releaseStock = async (
    req: Request<{}, {}, UpdateInventoryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.inventoryService.releaseStock(req.body);

      res.status(200).json(ApiResponse.success("Stock released successfully."));
    } catch (error) {
      next(error);
    }
  };

  increaseStock = async (
    req: Request<{}, {}, UpdateInventoryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.inventoryService.increaseStock(req.body);

      res
        .status(200)
        .json(ApiResponse.success("Stock increased successfully."));
    } catch (error) {
      next(error);
    }
  };

  decreaseStock = async (
    req: Request<{}, {}, UpdateInventoryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.inventoryService.decreaseStock(req.body);

      res
        .status(200)
        .json(ApiResponse.success("Stock decreased successfully."));
    } catch (error) {
      next(error);
    }
  };
}
