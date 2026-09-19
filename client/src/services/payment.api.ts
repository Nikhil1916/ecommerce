import api from "./api";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../types/checkout.types";

export const createPayment = async (
  data: CreatePaymentRequest,
): Promise<CreatePaymentResponse> => {
  const response = await api.post<CreatePaymentResponse>(
    "/payment/create",
    data,
  );

  return response.data;
};