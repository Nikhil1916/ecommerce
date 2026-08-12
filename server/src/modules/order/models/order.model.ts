import { InferSchemaType, model, Schema } from "mongoose";
import { OrderStatus, PaymentStatus } from "../types/order.types";

const orderItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export type Order = InferSchemaType<typeof orderSchema>;

export const OrderModel = model<Order>("Order", orderSchema);

// export const OrderModel = model("Order", orderSchema);