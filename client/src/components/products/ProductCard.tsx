import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/format-currency";
import styles from "./ProductCard.module.css";
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const image = product.images[0];

  return (
    <Link to={`/products/${product?._id}`}>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          {image ? (
            <img
              src={image.url}
              alt={image.alt || product.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>No image</div>
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.name}>{product.name}</h2>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.footer}>
            <span className={styles.price}>
              {formatCurrency(product.price)}
            </span>

            <span className={styles.stock}>Stock: {product.stock}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
