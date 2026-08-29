import { InferSchemaType, model, Schema, Types } from "mongoose";
import { ImportJobStatus, ImportType } from "../types/import.types";

const importJobSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ImportType),
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileKey: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(ImportJobStatus),
      default: ImportJobStatus.PENDING,
      index: true,
    },

    totalRows: {
      type: Number,
      default: 0,
    },

    successfulRows: {
      type: Number,
      default: 0,
    },

    failedRows: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
    error: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type ImportJob = InferSchemaType<typeof importJobSchema> & {
  _id: Types.ObjectId;
};

export const ImportJobModel = model<ImportJob>("ImportJob", importJobSchema);
