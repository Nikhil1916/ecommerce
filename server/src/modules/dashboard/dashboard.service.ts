import { DashboardRepository } from "./dashboard.repository";
import { DashboardResponse } from "./dashboard.types";

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboard(year: number): Promise<DashboardResponse> {
    const [summary, salesByMonth, ordersByMonth, ordersByStatus, topProducts, recentOrders] =
      await Promise.all([
        this.dashboardRepository.getDashboardSummary(year),
        this.dashboardRepository.getSalesByMonth(year),
        this.dashboardRepository.getOrdersByMonth(year),
        this.dashboardRepository.getOrdersByStatus(year),
        this.dashboardRepository.getTopSellingProducts(year),
        this.dashboardRepository.getRecentOrders(year),
      ]);

    return {
      year,
      summary,
      salesByMonth,
      ordersByMonth,
      ordersByStatus,
      topProducts,
      recentOrders,
    };
  }
}