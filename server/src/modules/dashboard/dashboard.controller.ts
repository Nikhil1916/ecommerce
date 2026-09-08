import { Request, Response } from "express";
import { asyncHandler } from "../../core/asyncHandler";
import { ApiResponse } from "../../core/ApiResponse";
import { DashboardService } from "./dashboard.service";
import { DashboardQuery } from "./dashboard.types";

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const { year } = req.query as unknown as DashboardQuery;
    const dashboard = await this.dashboardService.getDashboard(year);

    res
      .status(200)
      .json(ApiResponse.success("Dashboard fetched successfully.", dashboard, req.requestId));
  });
}