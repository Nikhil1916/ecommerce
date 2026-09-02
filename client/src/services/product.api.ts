import api from "./api";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  fields?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async (query?: ProductQuery) => {
  const response = await api.get("/products", {
    params: query,
  });

  return response.data;
};