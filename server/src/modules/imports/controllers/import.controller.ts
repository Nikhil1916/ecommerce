import { NextFunction, Request, Response } from "express";
import { ImportService } from "../services/import.service";
import { ImportType } from "../types/import.types";
import { importQueue } from "../queues/import.queue";
import { ApiResponse } from "../../../core/ApiResponse";

export class ImportController {
  constructor(
    private readonly importService: ImportService,
  ) {}

  createImport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        throw new Error("Excel file is required");
      }

      const type = req.body.type as ImportType;

      const importJob =
        await this.importService.createImportJob({
          type,
          fileName: file.originalname,
        });

      await importQueue.add(
        "process-import",
        {
          importJobId: importJob._id.toString(),
          type,
          filePath: file.path,
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
        ApiResponse.success(
          "Import started successfully.",
          {
            importJobId: importJob._id,
          },
        ),
      );
    } catch (error) {
      next(error);
    }
  };
}