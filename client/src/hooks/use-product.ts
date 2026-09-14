import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/product.api";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
};