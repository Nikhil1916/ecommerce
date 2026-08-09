import { Cart, CartModel, CartWithProducts } from "../models/cart.model";
import { ICartRepository } from "./cart.repository";

export class MongoCartRespository implements ICartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    return CartModel.findOne({
      userId,
    });
  }

  async create(userId: string): Promise<Cart> {
    return CartModel.create({
      userId,
      items: [],
    });
  }

  async update(userId: string, items: Cart["items"]): Promise<Cart | null> {
    return CartModel.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: {
          items,
        },
      },
      {
        new: true,
      },
    );
  }

  async clear(userId: string): Promise<Cart | null> {
    return CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true },
    );
  }

  async incrementItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null> {
    return CartModel.findOneAndUpdate(
      {
        userId,
        "items.productId": productId,
      },
      {
        $inc: {
          "items.$.quantity": quantity,
        },
      },
      {
        new: true,
      },
    );
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null> {
    return CartModel.findOneAndUpdate(
      {
        userId,
        "items.productId": {
          $ne: productId,
        },
      },
      {
        $push: {
          items: {
            productId,
            quantity,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async getCartWithProducts(userId: string): Promise<CartWithProducts | null> {
    const result = await CartModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$_id",
          userId: {
            $first: "$userId",
          },
          items: {
            $push: {
              productId: "$items.productId",
              quantity: "$items.quantity",
              product: "$product",
            },
          },
          createdAt: {
            $first: "$createdAt",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
        },
      },
    ]);

    return result[0] ?? null;
  }
}
