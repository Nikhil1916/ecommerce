import styles from "../Dashboard.module.css";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
}

const DashboardStatCard = ({
  label,
  value,
}: DashboardStatCardProps) => {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <strong className={styles.cardValue}>{value}</strong>
    </div>
  );
};

export default DashboardStatCard;