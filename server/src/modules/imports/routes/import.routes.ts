import { Router } from "express";
import { ImportController } from "../controllers/import.controller";
import { authMiddleware } from "../../auth/auth.module";
import { importUpload } from "../../../storage/multer/import-multer.config";

export const createImportRoutes = (
  importController: ImportController,
) => {
  const router = Router();

  router.post(
    "/",
    importUpload.single("file"),
    authMiddleware.authenticate,
    importController.createImport,
  );

  return router;
};