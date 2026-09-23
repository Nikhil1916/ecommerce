import { Link, useParams } from "react-router-dom";

import { useOrder } from "../../hooks/useCheckout";

import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
  const { orderId } = useParams();

  const orderQuery = useOrder(orderId ?? null);

  if (orderQuery.isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>
            <p>Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data?.data) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>
            <h2>Order not found</h2>
            <p>
              We couldn't find this order or you don't have access to it.
            </p>

            <Link to="/orders" className={styles.backButton}>
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = orderQuery.data.data;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link to="/orders" className={styles.backLink}>
          ← Back to Orders
        </Link>

        <div className={styles.header}>
          <div>
            <span className={styles.label}>Order</span>
            <h1>{order.orderNumber}</h1>

            <p>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <span
            className={`${styles.status} ${
              styles[`status${order.status.toLowerCase()}`]
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>Items</h2>

            <div className={styles.items}>
              {order.items.map((item) => (
                <div
                  className={styles.item}
                  key={`${order._id}-${item.productId}`}
                >
                  <div>
                    <p className={styles.itemName}>{item.name}</p>

                    <p className={styles.itemMeta}>
                      ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2>Order Summary</h2>

            <div className={styles.summary}>
              <div>
                <span>Total</span>
                <strong>
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <span className={styles.paymentStatus}>
                  {order.paymentStatus}
                </span>
              </div>

              <div>
                <span>Status</span>
                <span>{order.status}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;