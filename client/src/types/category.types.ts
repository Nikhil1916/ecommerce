export interface Category {
  _id: string;
  name: string;
  parentCategoryId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryApiResponse {
  success: boolean;
  data: Category[];
}