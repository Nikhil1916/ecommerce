import { Router } from "express";
import { ImportController } from "../controllers/import.controller";
import { authMiddleware } from "../../auth/auth.module";
import { importUpload } from "../../../storage/multer/import-multer.config";
import { ImportService } from "../services/import.service";
import { MongoImportRepository } from "../repositories/mongo-import.repository";
import { CloudinaryProvider } from "../../../storage/providers/cloudinary.provider";

const createImportRoutes = (importController: ImportController) => {
  const router = Router();

  router.post(
    "/",
    importUpload.single("file"),
    authMiddleware.authenticate,
    importController.createImport,
  );

  router.get(
    "/:id/download",
    authMiddleware.authenticate,
    importController.downloadImport.bind(importController),
  );

  return router;
};

export const importRouter = createImportRoutes(
  new ImportController(new ImportService(new MongoImportRepository(), new CloudinaryProvider())),
);
