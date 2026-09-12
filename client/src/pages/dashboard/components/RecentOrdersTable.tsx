import type { RecentOrder } from "../../../types/dashboard.types";
import { formatCurrency } from "../../../utils/format-currency";

import styles from "../Dashboard.module.css";

interface RecentOrdersTableProps {
  data: RecentOrder[];
}

const RecentOrdersTable = ({ data }: RecentOrdersTableProps) => {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <section className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2>Recent Orders</h2>
      </div>

      {data.length === 0 ? (
        <div className={styles.emptyState}>
          No orders found.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.map((order) => (
                <tr key={order.orderNumber}>
                  <td>{order.orderNumber}</td>

                  <td>{formatCurrency(order.totalAmount)}</td>

                  <td>{order.status}</td>

                  <td>{order.paymentStatus}</td>

                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentOrdersTable;