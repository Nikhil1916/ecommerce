export interface ProductImage {
  _id: string;
  url: string;
  key: string;
  alt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  reservedStock: number;
  categoryId: string;
  images: ProductImage[];
  isActive: boolean;
  slug: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductQueryParams {
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

export interface ProductPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductApiResponse {
  success: boolean;
  message: string;

  data: {
    items: Product[];
    pagination: ProductPagination;
  };

  requestId?: string;
}

export interface ProductDetailsApiResponse {
  success: boolean;
  message?: string;
  data: Product;
  requestId?: string;
}