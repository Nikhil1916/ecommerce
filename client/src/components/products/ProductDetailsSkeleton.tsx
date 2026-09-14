import styles from "./ProductDetailsSkeleton.module.css";

const ProductDetailsSkeleton = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.backLink} />

        <div className={styles.layout}>
          <div className={styles.image} />

          <div className={styles.info}>
            <div className={styles.title} />
            <div className={styles.sku} />
            <div className={styles.price} />
            <div className={styles.stock} />

            <div className={styles.descriptionTitle} />
            <div className={styles.descriptionLine} />
            <div className={styles.descriptionLineShort} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsSkeleton;