import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import {InventoryController} from "../controller/inventory.controller";
import { UpdateInventorySchema } from "../validators/update-inventory.validator";
import { InventoryService } from "../services/inventory.service";

export const createInventoryRoutes = (
  inventoryService: InventoryService,
  inventoryController: InventoryController,
) => {
  const router = Router();

  router.post(
    "/reserve",
    validate(UpdateInventorySchema),
    inventoryController.reserveStock,
  );

  router.post(
    "/release",
    validate(UpdateInventorySchema),
    inventoryController.releaseStock,
  );

  router.post(
    "/increase",
    validate(UpdateInventorySchema),
    inventoryController.increaseStock,
  );

  router.post(
    "/decrease",
    validate(UpdateInventorySchema),
    inventoryController.decreaseStock,
  );

  return router;
};
