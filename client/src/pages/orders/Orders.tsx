import { useState } from "react";
import { Link } from "react-router-dom";

import { useOrders } from "../../hooks/useCheckout";
import type { OrderStatus } from "../../types/checkout.types";

import styles from "./Orders.module.css";

const filters: { label: string; value?: OrderStatus }[] = [
  { label: "All Orders" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
];

const Orders = () => {
  const [status, setStatus] = useState<OrderStatus | undefined>();

  const ordersQuery = useOrders(status);

  const orders = ordersQuery.data?.data ?? [];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Orders</h1>
            <p>View and track your orders</p>
          </div>
        </div>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={`${styles.filter} ${
                status === filter.value ? styles.filterActive : ""
              }`}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {ordersQuery.isLoading && (
          <div className={styles.state}>
            <p>Loading orders...</p>
          </div>
        )}

        {ordersQuery.isError && (
          <div className={`${styles.state} ${styles.error}`}>
            <p>Unable to load orders. Please try again.</p>
          </div>
        )}

        {!ordersQuery.isLoading &&
          !ordersQuery.isError &&
          orders.length === 0 && (
            <div className={styles.state}>
              <h2>No orders found</h2>

              <p>Your orders will appear here after a successful payment.</p>

              <Link to="/products" className={styles.shopButton}>
                Continue Shopping
              </Link>
            </div>
          )}

        {!ordersQuery.isLoading &&
          !ordersQuery.isError &&
          orders.length > 0 && (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <article className={styles.orderCard} key={order._id}>
                  <div className={styles.orderCardHeader}>
                    <div>
                      <span className={styles.label}>Order</span>

                      <h2>{order.orderNumber}</h2>
                    </div>

                    <span
                      className={`${styles.status} ${
                        styles[
                          `status${order.status.toLowerCase().replace("_", "")}`
                        ]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.orderCardContent}>
                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div
                          className={styles.orderItem}
                          key={`${order._id}-${item.productId}`}
                        >
                          <div>
                            <p className={styles.itemName}>{item.name}</p>

                            <p className={styles.itemMeta}>
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <span>₹{item.subtotal.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderFooter}>
                      <div>
                        <span className={styles.label}>Ordered on</span>

                        <p>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div className={styles.total}>
                        <span className={styles.label}>Total</span>

                        <strong>
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className={styles.viewDetails}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
};

export default Orders;
