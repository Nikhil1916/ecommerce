import api from "./api";

import type { CheckoutApiResponse } from "../types/checkout.types";

export const startCheckout = async(): Promise<CheckoutApiResponse> => {
    const response = await api.post<CheckoutApiResponse>("/checkout/start");
    return response.data;
}