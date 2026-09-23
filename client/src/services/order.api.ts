import api from "./api";

import type {
  CheckoutApiResponse,
  OrderStatus,
  OrdersApiResponse,
} from "../types/checkout.types";

export const getOrderById = async (
  orderId: string,
): Promise<CheckoutApiResponse> => {
  const response = await api.get<CheckoutApiResponse>(
    `/orders/${orderId}`,
  );

  return response.data;
};

export const getOrders = async (
  status?: OrderStatus,
): Promise<OrdersApiResponse> => {
  const response = await api.get<OrdersApiResponse>("/orders", {
    params: status ? { status } : undefined,
  });

  return response.data;
};