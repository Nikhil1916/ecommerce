import { InferSchemaType, model, Schema } from "mongoose";

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export type Counter = InferSchemaType<typeof counterSchema>;

export const CounterModel = model<Counter>(
  "Counter",
  counterSchema,
);
