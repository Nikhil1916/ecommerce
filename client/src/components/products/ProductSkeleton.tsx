import styles from "./ProductSkeleton.module.css";

const ProductSkeleton = () => {
  return (
    <article className={styles.card}>
      <div className={styles.image} />

      <div className={styles.content}>
        <div className={styles.name} />

        <div className={styles.description} />
        <div className={styles.descriptionShort} />

        <div className={styles.footer}>
          <div className={styles.price} />
          <div className={styles.stock} />
        </div>
      </div>
    </article>
  );
};

export default ProductSkeleton;