export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface CheckoutOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CheckoutOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: CheckoutOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutApiResponse {
  success: boolean;
  message?: string;
  data: CheckoutOrder;
  requestId?: string;
}


export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
}

export interface CreatePaymentResponse {
  success: boolean;
  message?: string;
  data: {
    paymentId: string;
  };
  requestId?: string;
}