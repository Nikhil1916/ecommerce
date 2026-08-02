export interface ProductQueryDto {
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