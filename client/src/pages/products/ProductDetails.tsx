import { Link, useParams } from "react-router-dom";

import ProductImageGallery from "../../components/products/ProductImageGallery";
import ProductInfo from "../../components/products/ProductInfo";
// import ProductDetailsSkeleton from "../../components/products/ProductDetailsSkeleton";
import { useProduct } from "../../hooks/use-product";
import styles from "./ProductDetails.module.css";
import ProductDetailsSkeleton from "../../components/products/ProductDetailsSkeleton";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useProduct(id ?? "");

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className={styles.message}>
        <p>Failed to load product.</p>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  const product = data?.data;

  if (!product) {
    return (
      <div className={styles.message}>
        <p>Product not found.</p>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link to="/products" className={styles.backLink}>
          ← Back to products
        </Link>

        <div className={styles.productLayout}>
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />

          <ProductInfo product={product} />
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;