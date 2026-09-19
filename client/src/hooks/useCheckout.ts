import { useMutation } from "@tanstack/react-query";
import { startCheckout } from "../services/checkout.api";
import { createPayment } from "../services/payment.api";

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