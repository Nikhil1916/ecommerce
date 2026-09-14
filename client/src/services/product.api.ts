import api from "./api";

import type {
  ProductApiResponse,
  ProductQueryParams,
  ProductDetailsApiResponse
} from "../types/product.types";

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductApiResponse> => {
  const response = await api.get<ProductApiResponse>("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (
  id: string,
): Promise<ProductDetailsApiResponse> => {
  const response = await api.get<ProductDetailsApiResponse>(`/products/${id}`);

  return response.data;
};