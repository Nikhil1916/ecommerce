import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart.api";

import type {
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../types/cart.types";

export const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => addToCart(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateCartItemRequest;
    }) => updateCartItem(productId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });
    },
  });
};