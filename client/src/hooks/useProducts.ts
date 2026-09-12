import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/product.api";

import type { ProductQueryParams } from "../types/product.types";

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};
