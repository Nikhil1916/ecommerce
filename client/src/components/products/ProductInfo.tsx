import type { Product } from "../../types/product.types";
import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.name}>{product.name}</h1>

        <span className={styles.sku}>
          SKU: {product.sku}
        </span>
      </div>

      <p className={styles.price}>
        ₹{product.price.toLocaleString("en-IN")}
      </p>

      <div
        className={`${styles.stock} ${
          isOutOfStock ? styles.outOfStock : styles.inStock
        }`}
      >
        {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
      </div>

      <div className={styles.description}>
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;