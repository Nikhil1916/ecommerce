import type { Product } from "./product.types";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface PopulatedCartItem extends CartItem {
  product: Product;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedCart extends Omit<Cart, "items"> {
  items: PopulatedCartItem[];
}

export interface CartApiResponse {
  success: boolean;
  message?: string;
  data: Cart | PopulatedCart;
  requestId?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}