import type { TopSellingProduct } from "../../../types/dashboard.types";
import { formatCurrency } from "../../../utils/format-currency";

import styles from "../Dashboard.module.css";

interface TopProductsTableProps {
  data: TopSellingProduct[];
}

const TopProductsTable = ({ data }: TopProductsTableProps) => {
  return (
    <section className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2>Top Selling Products</h2>
      </div>

      {data.length === 0 ? (
        <div className={styles.emptyState}>
          No sales data available.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>

            <tbody>
              {data.map((product) => (
                <tr key={product.productId}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TopProductsTable;