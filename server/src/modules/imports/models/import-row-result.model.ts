import { InferSchemaType, model, Schema, Types } from "mongoose";
import { ImportRowStatus } from "../types/import.types";

const importRowResultSchema = new Schema(
  {
    importJobId: {
      type: Schema.Types.ObjectId,
      ref: "ImportJob",
      required: true,
      index: true,
    },

    rowNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ImportRowStatus),
      required: true,
    },

    error: {
      type: String,
      trim: true,
    },

    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

importRowResultSchema.index({
  importJobId: 1,
  rowNumber: 1,
});

export type ImportRowResult = InferSchemaType<
  typeof importRowResultSchema
> & {
  _id: Types.ObjectId;
};

export const ImportRowResultModel =
  model<ImportRowResult>(
    "ImportRowResult",
    importRowResultSchema,
  );
importRowResultSchema.index(
  { importJobId: 1, rowNumber: 1 },
  { unique: true },
);