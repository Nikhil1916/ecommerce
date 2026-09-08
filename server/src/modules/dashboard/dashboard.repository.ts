import { ApiError } from "../../core/ApiError";
import {
  DashboardSummary,
  OrdersByMonth,
  OrdersByStatus,
  RecentOrder,
  SalesByMonth,
  TopSellingProduct,
} from "./dashboard.types";

export class DashboardRepository {
  async getDashboardSummary(_year: number): Promise<DashboardSummary> {
    return this.notImplemented();
  }

  async getSalesByMonth(_year: number): Promise<SalesByMonth[]> {
    return this.notImplemented();
  }

  async getOrdersByMonth(_year: number): Promise<OrdersByMonth[]> {
    return this.notImplemented();
  }

  async getOrdersByStatus(_year: number): Promise<OrdersByStatus[]> {
    return this.notImplemented();
  }

  async getTopSellingProducts(_year: number): Promise<TopSellingProduct[]> {
    return this.notImplemented();
  }

  async getRecentOrders(_year: number): Promise<RecentOrder[]> {
    return this.notImplemented();
  }

  private notImplemented<T>(): Promise<T> {
    return Promise.reject(
      new ApiError(501, "Dashboard queries are not implemented yet."),
    );
  }
}