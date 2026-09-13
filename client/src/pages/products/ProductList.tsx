import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";

import styles from "./ProductList.module.css";
import ProductSkeleton from "../../components/common/ProductCard/ProductSkeleton";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { useDebounce } from "../../hooks/useDebounce";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  console.log(debouncedSearch, "deboundec");

  const { data, isLoading, isError } = useProducts({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  if (isLoading) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Products</h1>

        {/* <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div> */}

        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.error}>Failed to load products.</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.count}>
            {data.data.pagination.totalItems} products
          </p>
        </div>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {data.data.items.length === 0 ? (
        <div className={styles.emptyState}>
          No products found.
        </div>
      ) : (
        <div className={styles.grid}>
          {data.data.items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductList;