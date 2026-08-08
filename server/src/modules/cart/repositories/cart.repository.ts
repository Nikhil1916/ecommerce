import { Cart } from "../models/cart.model";

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;

  create(userId: string): Promise<Cart>;

  update(
    userId: string,
    items: Cart["items"],
  ): Promise<Cart | null>;

  clear(userId: string): Promise<Cart | null>;
}