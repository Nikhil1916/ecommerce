import { InferSchemaType, model, Schema, Types } from "mongoose";
import { Product } from "../../product/models/product.model";

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export type Cart = InferSchemaType<typeof cartSchema> & {
  _id: Types.ObjectId;
};
export const CartModel = model<Cart>("Cart", cartSchema);


export type CartWithProducts = Cart & {
  items: Array<
    Cart["items"][number] & {
      product: Product;
    }
  >;
};