import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import type { OrdersByMonth } from "../../../types/dashboard.types";

import styles from "../Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface OrdersChartProps {
  data: OrdersByMonth[];
}

const OrdersChart = ({ data }: OrdersChartProps) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: data.map((item) => monthNames[item.month - 1]),

    datasets: [
      {
        label: "Orders",
        data: data.map((item) => item.orders),

        tension: 0.3,

        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,

        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            return `Orders: ${context.parsed.y}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2>Orders Overview</h2>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
};

export default OrdersChart;