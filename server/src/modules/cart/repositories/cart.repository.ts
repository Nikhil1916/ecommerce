import { ClientSession } from "mongoose";
import { Cart, CartWithProducts } from "../models/cart.model";
export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;

  create(userId: string): Promise<Cart>;

  incrementItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null>;

  addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null>;

  clear(userId: string): Promise<Cart | null>;

  getCartWithProducts(userId: string): Promise<CartWithProducts | null>;

  removeItem(userId: string, productId: string): Promise<Cart | null>;

  updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null>;

  clearCart(userId: string, session?: ClientSession): Promise<Cart | null>;
}
