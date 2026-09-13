import api from "./api";

import type { CategoryApiResponse } from "../types/category.types";

export const getCategories = async (): Promise<CategoryApiResponse> => {
  const response = await api.get<CategoryApiResponse>("/categories");

  return response.data;
};