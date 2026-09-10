import { useTranslation } from "react-i18next";
import { useDashboard } from "../../hooks/useDashboard";
import styles from "./Dashboard.module.css";
import { formatCurrency } from "../../utils/format-currency";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardStatCard from "./components/DashboardStatCard";
import { useState } from "react";

const Dashboard = () => {
  const { t } = useTranslation();

  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, isError } = useDashboard(year);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data?.data) {
    return <div className={styles.container}>{t("dashboard.error")}</div>;
  }

  const dashboard = data.data;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{t("dashboard.title")}</h1>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        <select
          className={styles.yearSelect}
          value={dashboard.year}
          onChange={(e) => {
            setYear(Number(e.target.value));
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </header>

      <section className={styles.cards}>
        <DashboardStatCard
          label={t("dashboard.totalSales")}
          value={formatCurrency(dashboard.summary.totalSales)}
        />

        <DashboardStatCard
          label={t("dashboard.paidOrders")}
          value={dashboard.summary.totalOrders}
        />

        <DashboardStatCard
          label={t("dashboard.totalProducts")}
          value={dashboard.summary.totalProducts}
        />

        <DashboardStatCard
          label={t("dashboard.lowStock")}
          value={dashboard.summary.lowStockProducts}
        />

        <DashboardStatCard
          label={t("dashboard.outOfStock")}
          value={dashboard.summary.outOfStockProducts}
        />
      </section>
    </main>
  );
};

export default Dashboard;
