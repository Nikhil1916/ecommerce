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

import type { SalesByMonth } from "../../../types/dashboard.types";
import styles from "../Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface SalesChartProps {
  data: SalesByMonth[];
}

const SalesChart = ({ data }: SalesChartProps) => {
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
        label: "Sales",
        data: data.map((item) => item.sales),

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
            const value = context.parsed.y ?? 0;

            return `Sales: ${new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            }).format(value)}`;
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
          callback: (value: string | number) => {
            const numberValue = Number(value);

            if (numberValue >= 100000) {
              return `₹${(numberValue / 100000).toFixed(1)}L`;
            }

            if (numberValue >= 1000) {
              return `₹${(numberValue / 1000).toFixed(0)}K`;
            }

            return `₹${numberValue}`;
          },
        },
      },
    },
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2>Sales Overview</h2>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
};

export default SalesChart;