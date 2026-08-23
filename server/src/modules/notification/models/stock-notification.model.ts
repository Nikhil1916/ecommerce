import { InferSchemaType, model, Schema, Types } from "mongoose";

export enum StockNotificationStatus {
  PENDING = "PENDING",
  NOTIFIED = "NOTIFIED",
}

const stockNotificationSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: [StockNotificationStatus.NOTIFIED, StockNotificationStatus.PENDING],
      default: StockNotificationStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

stockNotificationSchema.index(
  {
    productId: 1,
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
        status: StockNotificationStatus.PENDING
    }
  },
);

export type StockNotification = InferSchemaType<
  typeof stockNotificationSchema
> & {
  _id: Types.ObjectId;
};

export const StockNotificationModel = model<StockNotification>(
  "StockNotification",
  stockNotificationSchema,
);

