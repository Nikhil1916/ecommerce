import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import type { OrdersByStatus } from "../../../types/dashboard.types";

import styles from "../Dashboard.module.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
);

interface OrderStatusChartProps {
  data: OrdersByStatus[];
}

const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#22c55e",
    SHIPPED: "#3b82f6",
    DELIVERED: "#8b5cf6",
    CANCELLED: "#6b7280",
    EXPIRED: "#ef4444",
  };

  const chartData = {
    labels: data.map((item) => item.status),

    datasets: [
      {
        data: data.map((item) => item.count),

        backgroundColor: data.map(
          (item) => statusColors[item.status] ?? "#9ca3af",
        ),

        borderColor: "#ffffff",
        borderWidth: 2,

        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "65%",

    plugins: {
      legend: {
        position: "bottom" as const,

        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },

      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const label = context.label;
            const value = context.parsed;

            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2>Order Status</h2>
      </div>

      <div className={styles.chartContainer}>
        <Doughnut data={chartData} options={options} />
      </div>
    </section>
  );
};

export default OrderStatusChart;