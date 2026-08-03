import { InferSchemaType, model, Schema } from "mongoose";

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

import { Types } from "mongoose";

export type Product = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export const ProductModel = model<Product>("Product", productSchema);

export type CreateProductInput = Omit<
  Product,
  "_id" | "createdAt" | "updatedAt" | "isActive" | "categoryId"
> & {
  categoryId: string;
};
