import api from "./api";

import type {
  ProductApiResponse,
  ProductQueryParams,
} from "../types/product.types";

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductApiResponse> => {
  const response = await api.get<ProductApiResponse>("/products", {
    params,
  });

  return response.data;
};