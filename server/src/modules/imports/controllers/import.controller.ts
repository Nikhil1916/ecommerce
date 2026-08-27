import { NextFunction, Request, Response } from "express";
import { ImportService } from "../services/import.service";
import { ImportType } from "../types/import.types";
import { importQueue } from "../queues/import.queue";
import { ApiResponse } from "../../../core/ApiResponse";
import { UploadFile } from "../../../storage/dto/upload-file.dto";
import { CloudinaryProvider } from "../../../storage/providers/cloudinary.provider";
import { StorageAssetType } from "../../../storage/types/storage.types";
import { ApiError } from "../../../core/ApiError";

export class ImportController {
  constructor(private readonly importService: ImportService) {}
  // constructor(private readonly importService: ImportService) {}
  private readonly storageProvider = new CloudinaryProvider();
  createImport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        throw new ApiError(400, "Excel file is required");
      }

      const type = req.body.type as ImportType;

      const uploadFile: UploadFile = {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.size,
      };

      const uploadResult = await this.storageProvider.upload(
        uploadFile,
        StorageAssetType.IMPORT,
      );

      const importJob = await this.importService.createImportJob({
        type,
        fileName: file.originalname,
        fileKey: uploadResult.key,
      });

      await importQueue.add(
        "process-import",
        {
          importJobId: importJob._id.toString(),
          type,
          fileKey: uploadResult.key,
        },
        {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      res.status(202).json(
        ApiResponse.success("Import started successfully.", {
          importJobId: importJob._id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
