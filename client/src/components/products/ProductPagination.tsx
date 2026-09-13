import styles from "./ProductPagination.module.css";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    page - 1,
    page,
    page + 1,
    "...",
    totalPages,
  ];
};

const ProductPagination = ({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: ProductPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Product pagination">
      <button
        type="button"
        className={styles.button}
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <div className={styles.pages}>
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className={styles.ellipsis}
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              type="button"
              className={`${styles.pageButton} ${
                pageNumber === page ? styles.active : ""
              }`}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.button}
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
};

export default ProductPagination;