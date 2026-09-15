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
    PENDING: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-pending")
      .trim(),
    CONFIRMED: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-confirmed")
      .trim(),
    SHIPPED: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-shipped")
      .trim(),
    DELIVERED: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-delivered")
      .trim(),
    CANCELLED: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-cancelled")
      .trim(),
    EXPIRED: getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-expired")
      .trim(),
  };

  const chartData = {
    labels: data.map((item) => item.status),

    datasets: [
      {
        data: data.map((item) => item.count),

        backgroundColor: data.map(
          (item) =>
            statusColors[item.status] ??
            getComputedStyle(document.documentElement)
              .getPropertyValue("--color-text-subtle")
              .trim(),
        ),

        borderColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-text-on-primary")
          .trim(),
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