import { Product } from "./product.model";

export interface IImage {
  url: string;
  alt?: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: IImage[];
  isActive: boolean;
}

export interface PaginationDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductListResult  {
  items: Product[];
  pagination: PaginationDto;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  slug: string;
  sku: string;

  images: {
    url: string;
    key: string;
    alt?: string;
  }[];
}