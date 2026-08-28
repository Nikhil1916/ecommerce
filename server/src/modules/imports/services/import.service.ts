import { ApiError } from "../../../core/ApiError";
import {
  CreateImportJobData,
  IImportRepository,
} from "../repositories/import.repository";
import { ImportJob } from "../models/import-job.model";
import {
  ImportJobStatus,
  ImportRowStatus,
  ImportType,
} from "../types/import.types";

import { Readable } from "stream";
import { StorageProvider } from "../../../storage/interfaces/image-storage.interface";
import { StorageAssetType } from "../../../storage/types/storage.types";


export class ImportService {
  constructor(private readonly importRepository: IImportRepository,
     private readonly storageProvider: StorageProvider,
  ) {}

  async createImportJob(data: CreateImportJobData): Promise<ImportJob> {
    return this.importRepository.createJob(data);
  }

  async startImport(jobId: string): Promise<void> {
    const job = await this.importRepository.updateJobStatus(
      jobId,
      ImportJobStatus.PROCESSING,
    );

    if (!job) {
      throw new ApiError(404, "Import job not found.");
    }
  }

  async recordRowSuccess(
    jobId: string,
    rowNumber: number,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.importRepository.createRowResult({
      importJobId: jobId,
      rowNumber,
      status: ImportRowStatus.SUCCESS,
      data,
    });
  }

  async recordRowFailure(
    jobId: string,
    rowNumber: number,
    error: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.importRepository.createRowResult({
      importJobId: jobId,
      rowNumber,
      status: ImportRowStatus.FAILED,
      error,
      data,
    });
  }

  async updateProgress(
    jobId: string,
    successfulRows: number,
    failedRows: number,
    totalRows: number,
  ): Promise<void> {
    await this.importRepository.updateJobProgress(
      jobId,
      successfulRows,
      failedRows,
      totalRows,
    );
  }

  async completeImport(
    jobId: string,
    successfulRows: number,
    failedRows: number,
  ): Promise<void> {
    const job = await this.importRepository.completeJob(
      jobId,
      successfulRows,
      failedRows,
    );

    if (!job) {
      throw new ApiError(404, "Import job not found.");
    }
  }

  async downloadImport(importJobId: string): Promise<{
    stream: Readable;
    fileName: string;
  }> {
    const importJob = await this.importRepository.findById(importJobId);

    if (!importJob) {
      throw new ApiError(404, "Import job not found");
    }

    const stream = await this.storageProvider.download(
      importJob.fileKey,
      StorageAssetType.IMPORT,
    );

    return {
      stream,
      fileName: importJob.fileName,
    };
  }
}
