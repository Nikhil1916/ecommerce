import { useMutation, useQuery } from "@tanstack/react-query";

import { startCheckout } from "../services/checkout.api";
import { createPayment } from "../services/payment.api";
import { getOrderById } from "../services/order.api";

export const useStartCheckout = () => {
  return useMutation({
    mutationFn: startCheckout,
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: createPayment,
  });
};

export const useOrder = (orderId: string | null) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const paymentStatus = query.state.data?.data.paymentStatus;

      if (paymentStatus === "PAID" || paymentStatus === "FAILED") {
        return false;
      }

      return 2000;
    },
  });
};