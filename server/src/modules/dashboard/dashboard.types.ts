export interface DashboardSummary {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface SalesByMonth {
  month: number;
  sales: number;
}

export interface OrdersByMonth {
  month: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TopSellingProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface RecentOrder {
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

export interface DashboardResponse {
  year: number;
  summary: DashboardSummary;
  salesByMonth: SalesByMonth[];
  ordersByMonth: OrdersByMonth[];
  ordersByStatus: OrdersByStatus[];
  topProducts: TopSellingProduct[];
  recentOrders: RecentOrder[];
}

export interface DashboardQuery {
  year: number;
}