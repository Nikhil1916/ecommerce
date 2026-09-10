import styles from "./Dashboard.module.css";

const DashboardSkeleton = () => {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonSubtitle} />
        </div>

        <div className={styles.skeletonSelect} />
      </header>

      <section className={styles.cards}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.skeletonLabel} />
            <div className={styles.skeletonValue} />
          </div>
        ))}
      </section>
    </main>
  );
};

export default DashboardSkeleton;