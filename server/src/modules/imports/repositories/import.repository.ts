import { ClientSession } from "mongoose";
import { ImportJob, ImportJobModel } from "../models/import-job.model";
import {
  ImportJobStatus,
  ImportRowStatus,
  ImportType,
} from "../types/import.types";

export interface CreateImportJobData {
  type: ImportType;
  fileName: string;
  fileKey: string;
}

export interface CreateImportRowResultData {
  importJobId: string;
  rowNumber: number;
  status: ImportRowStatus;
  error?: string;
  data?: Record<string, unknown>;
}

export interface IImportRepository {
  createJob(
    data: CreateImportJobData,
    session?: ClientSession,
  ): Promise<ImportJob>;

  updateJobStatus(
    jobId: string,
    status: ImportJobStatus,
    session?: ClientSession,
  ): Promise<ImportJob | null>;

  updateJobProgress(
    jobId: string,
    successfulRows: number,
    failedRows: number,
    totalRows?: number,
    session?: ClientSession,
  ): Promise<ImportJob | null>;

  createRowResult(
    data: CreateImportRowResultData,
    session?: ClientSession,
  ): Promise<void>;

  completeJob(
    jobId: string,
    successfulRows: number,
    failedRows: number,
    session?: ClientSession,
  ): Promise<ImportJob | null>;

  findById(jobId: string): Promise<ImportJob | null>;

  failJob(
    jobId: string,
    error: string,
    session?: ClientSession,
  ): Promise<ImportJob | null>;
}
