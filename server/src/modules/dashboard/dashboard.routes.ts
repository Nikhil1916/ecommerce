import { Router } from "express";
import { Role } from "@prisma/client";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../auth/auth.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardRepository } from "./dashboard.repository";
import { DashboardService } from "./dashboard.service";
import { DashboardQuerySchema } from "./dashboard.schemas";

const router = Router();

const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

router.get(
  "/dashboard",
  authMiddleware.authenticate,
  authorize(Role.ADMIN),
  validate(DashboardQuerySchema, "query"),
  dashboardController.getDashboard,
);

export const dashboardRouter = router;