import { Router } from "express";
import { ImportController } from "../controllers/import.controller";
import { authMiddleware } from "../../auth/auth.module";

export const createImportRoutes = (
  importController: ImportController,
) => {
  const router = Router();

  router.post(
    "/",
    authMiddleware.authenticate,
    importController.createImport,
  );

  return router;
};