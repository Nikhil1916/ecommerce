import api from "./api";

import type { CheckoutOrder } from "../types/checkout.types";

export const getOrderById = async (
  orderId: string,
): Promise<{ success: boolean; message: string; data: CheckoutOrder }> => {
  const response = await api.get(
    `/orders/${orderId}`,
  );

  return response.data;
};