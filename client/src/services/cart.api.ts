import api from "./api";

import type {
  AddToCartRequest,
  CartApiResponse,
  UpdateCartItemRequest,
} from "../types/cart.types";

export const getCart = async (): Promise<CartApiResponse> => {
  const response = await api.get<CartApiResponse>("/cart/");
  return response.data;
};

export const addToCart = async (
  data: AddToCartRequest,
): Promise<CartApiResponse> => {
  const response = await api.post<CartApiResponse>("/cart/items", data);
  return response.data;
};

export const updateCartItem = async (
  productId: string,
  data: UpdateCartItemRequest,
): Promise<CartApiResponse> => {
  const response = await api.patch<CartApiResponse>(
    `/cart/items/${productId}`,
    data,
  );

  return response.data;
};

export const removeCartItem = async (
  productId: string,
): Promise<CartApiResponse> => {
  const response = await api.delete<CartApiResponse>(
    `/cart/items/${productId}`,
  );

  return response.data;
};

export const clearCart = async (): Promise<CartApiResponse> => {
  const response = await api.delete<CartApiResponse>("/cart/");
  return response.data;
};