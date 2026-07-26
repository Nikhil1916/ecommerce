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