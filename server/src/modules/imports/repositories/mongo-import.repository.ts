import { ClientSession } from "mongoose";

import { ImportJob, ImportJobModel } from "../models/import-job.model";

import { ImportRowResult, ImportRowResultModel } from "../models/import-row-result.model";
import { MongoServerError } from "mongodb";

import {
  ImportJobStatus,
  ImportRowStatus,
  ImportType,
} from "../types/import.types";

import {
  CreateImportJobData,
  CreateImportRowResultData,
  IImportRepository,
} from "./import.repository";

export class MongoImportRepository implements IImportRepository {
  async createJob(
    data: CreateImportJobData,
    session?: ClientSession,
  ): Promise<ImportJob> {
    const [job] = await ImportJobModel.create(
      [
        {
          type: data.type,
          fileName: data.fileName,
          fileKey: data.fileKey,
          status: ImportJobStatus.PENDING,
        },
      ],
      { session },
    );

    return job;
  }

  async updateJobStatus(
    jobId: string,
    status: ImportJobStatus,
    session?: ClientSession,
  ): Promise<ImportJob | null> {
    const update: Record<string, unknown> = {
      status,
    };

    if (status === ImportJobStatus.PROCESSING) {
      update.startedAt = new Date();
    }

    return ImportJobModel.findByIdAndUpdate(
      jobId,
      {
        $set: update,
      },
      {
        new: true,
        session,
      },
    );
  }

  async updateJobProgress(
    jobId: string,
    successfulRows: number,
    failedRows: number,
    totalRows?: number,
    session?: ClientSession,
  ): Promise<ImportJob | null> {
    const update: Record<string, unknown> = {
      successfulRows,
      failedRows,
    };

    if (totalRows !== undefined) {
      update.totalRows = totalRows;
    }

    return ImportJobModel.findByIdAndUpdate(
      jobId,
      {
        $set: update,
      },
      {
        new: true,
        session,
      },
    );
  }

async createRowResult(
  data: CreateImportRowResultData,
  session?: ClientSession,
): Promise<void> {
  try {
    await ImportRowResultModel.create(
      [
        {
          importJobId: data.importJobId,
          rowNumber: data.rowNumber,
          status: data.status,
          error: data.error,
          data: data.data,
        },
      ],
      { session },
    );
  } catch (error:any) {
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      return;
    }

    throw error;
  }
}
  async completeJob(
    jobId: string,
    successfulRows: number,
    failedRows: number,
    session?: ClientSession,
  ): Promise<ImportJob | null> {
    return ImportJobModel.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: ImportJobStatus.COMPLETED,
          successfulRows,
          failedRows,
          completedAt: new Date(),
        },
      },
      {
        new: true,
        session,
      },
    );
  }

  async findById(jobId: string): Promise<ImportJob | null> {
    return ImportJobModel.findById(jobId).lean();
  }

  async failJob(
    jobId: string,
    error: string,
    session?: ClientSession,
  ): Promise<ImportJob | null> {
    return ImportJobModel.findByIdAndUpdate(
      jobId,
      {
        status: ImportJobStatus.FAILED,
        error,
      },
      {
        new: true,
        session,
      },
    );
  }

  async findRowResult(
    importJobId: string,
    rowNumber: number,
  ): Promise<ImportRowResult | null> {
    return ImportRowResultModel.findOne({
      importJobId,
      rowNumber,
    });
  }
}
