import { ApiError } from "../../core/ApiError";
import { OrderModel } from "../order/models/order.model";
import { PaymentStatus } from "../order/types/order.types";
import { ProductModel } from "../product/models/product.model";
import {
  DashboardSummary,
  OrdersByMonth,
  OrdersByStatus,
  RecentOrder,
  SalesByMonth,
  TopSellingProduct,
} from "./dashboard.types";

export class DashboardRepository {
  async getDashboardSummary(year: number): Promise<DashboardSummary> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const [orderResult, productResult] = await Promise.all([
      OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfYear,
              $lt: startOfNextYear,
            },
            paymentStatus: PaymentStatus.PAID,
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),

      ProductModel.aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $facet: {
            totalProducts: [
              {
                $count: "count",
              },
            ],
            lowStockProducts: [
              {
                $match: {
                  $expr: { $lte: ["$stock", 5] },
                },
              },
              {
                $count: "count",
              },
            ],
            outOfStockProducts: [
              {
                $match: {
                  $expr: { $eq: ["$stock", 0] },
                },
              },
              {
                $count: "count",
              },
            ],
          },
        },
      ]),
    ]);
    return {
      totalSales: orderResult[0]?.totalSales || 0,
      totalOrders: orderResult[0]?.totalOrders || 0,
      totalProducts: productResult[0]?.totalProducts?.[0]?.count || 0,
      lowStockProducts: productResult[0]?.lowStockProducts?.[0]?.count || 0,
      outOfStockProducts: productResult[0]?.outOfStockProducts?.[0]?.count || 0,
    };
  }

  async getSalesByMonth(year: number): Promise<SalesByMonth[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const salesByMonth = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: startOfNextYear,
          },
          paymentStatus: PaymentStatus.PAID,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthData = salesByMonth.find((s) => s._id === month);
      return {
        month,
        sales: monthData ? monthData.sales : 0,
      };
    });
  }

  async getOrdersByMonth(year: number): Promise<OrdersByMonth[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const salesByMonth = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: startOfNextYear,
          },
           paymentStatus: PaymentStatus.PAID,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthData = salesByMonth.find((s) => s._id === month);
      return {
        month,
        orders: monthData ? monthData.orders : 0,
      };
    });
  }

  async getOrdersByStatus(year: number): Promise<OrdersByStatus[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const ordersByStatus = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: startOfNextYear,
          },
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        }
      }
    ]);
    return ordersByStatus;
  }

  async getTopSellingProducts(year: number): Promise<TopSellingProduct[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    return OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: startOfNextYear,
          },
          paymentStatus: PaymentStatus.PAID,
        }
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        }
      },
      {
        $sort: { quantity: -1 },
      },
      {
        $limit: 5,
      }, 
      {
        $project: {
          _id: 0,
        productId: "$_id",
        name: 1,
        quantity: 1,
        revenue: 1,
        }
      }
    ]);
  }

  async getRecentOrders(year: number): Promise<RecentOrder[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    const recentOrders = await OrderModel.find({
      paymentStatus: PaymentStatus.PAID,
      createdAt: {
        $gte: startOfYear,
        $lt: startOfNextYear,
      },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber totalAmount status paymentStatus createdAt")
      .lean();
    return recentOrders;
  }

  private notImplemented<T>(): Promise<T> {
    return Promise.reject(
      new ApiError(501, "Dashboard queries are not implemented yet."),
    );
  }
}
