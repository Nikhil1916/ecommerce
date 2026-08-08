import { Cart, CartModel } from "../models/cart.model";
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
}
