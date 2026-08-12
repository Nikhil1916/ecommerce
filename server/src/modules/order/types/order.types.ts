export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type CreateOrderData = {
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}