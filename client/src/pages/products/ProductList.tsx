import { useState } from "react";

import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useDebounce } from "../../hooks/useDebounce";

import styles from "./ProductList.module.css";
import ProductCard from "../../components/products/ProductCard";
import ProductSkeleton from "../../components/products/ProductSkeleton";
import ProductPagination from "../../components/products/ProductPagination";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
    minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    sort: sort || undefined,
    order,
  });

  const categories = categoriesData?.data ?? [];
  const products = productsData?.data.items ?? [];

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setOrder("asc");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    setPage(1);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleOrderChange = (value: "asc" | "desc") => {
    setOrder(value);
    setPage(1);
  };

  if (productsLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Products</h1>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={styles.searchInput}
            />

            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.select}
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />

            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />

            <button
              type="button"
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (productsError || !productsData?.data) {
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
            {productsData.data.pagination.totalItems} products
          </p>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.select}
            disabled={categoriesLoading}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className={styles.priceInput}
            min="0"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className={styles.priceInput}
            min="0"
          />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.select}
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="createdAt">Date Added</option>
          </select>
          <select
            value={order}
            onChange={(e) =>
              handleOrderChange(e.target.value as "asc" | "desc")
            }
            className={styles.select}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>No products found.</div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <ProductPagination
        page={productsData.data.pagination.page}
        totalPages={productsData.data.pagination.totalPages}
        hasNextPage={productsData.data.pagination.hasNextPage}
        hasPreviousPage={productsData.data.pagination.hasPreviousPage}
        onPageChange={setPage}
      />
    </main>
  );
};

export default ProductList;
