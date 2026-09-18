import { useState } from "react";

import type { Product } from "../../types/product.types";
import { useAddToCart } from "../../hooks/useCart";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../utils/api-error";

import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const isOutOfStock = product.stock <= 0;

  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success("Product added to cart");
          setQuantity(1);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.name}>{product.name}</h1>

        <span className={styles.sku}>SKU: {product.sku}</span>
      </div>

      <p className={styles.price}>₹{product.price.toLocaleString("en-IN")}</p>

      <div
        className={`${styles.stock} ${
          isOutOfStock ? styles.outOfStock : styles.inStock
        }`}
      >
        {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
      </div>

      {!isOutOfStock && (
        <div className={styles.cartActions}>
          <div className={styles.quantityControls}>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(product.stock, current + 1))
              }
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      )}

      <div className={styles.description}>
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
