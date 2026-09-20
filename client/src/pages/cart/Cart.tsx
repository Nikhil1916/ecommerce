/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CART_QUERY_KEY,
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "../../hooks/useCart";

import type { PopulatedCart } from "../../types/cart.types";

import styles from "./Cart.module.css";
import {
  useCreatePayment,
  useStartCheckout,
  useOrder,
} from "../../hooks/useCheckout";
import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Cart = () => {
  const { data, isLoading, isError } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const paymentHandledRef = useRef(false);

  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const startCheckoutMutation = useStartCheckout();
  const createPaymentMutation = useCreatePayment();
  const orderQuery = useOrder(orderId);
  const queryClient = useQueryClient();
  useEffect(() => {

    const paymentStatus = orderQuery.data?.data.paymentStatus;

    if(!paymentStatus || paymentHandledRef.current == true) return;

    if (paymentStatus === "PAID") {
       paymentHandledRef.current = true;
      queryClient.invalidateQueries({
        queryKey: CART_QUERY_KEY,
      });

      toast.success("Payment successful!");
    }

    if (paymentStatus === "FAILED") {
       paymentHandledRef.current = true;
      toast.error("Payment failed. Your cart has been kept.");
    }
  }, [orderQuery.data, queryClient]);

  console.log(orderQuery.data);

  const handleCheckout = () => {
    startCheckoutMutation.mutate(undefined, {
      onSuccess: (response: any) => {
        const order = response.data;
        setOrderId(order._id);
        createPaymentMutation.mutate(
          {
            orderId: order._id,
            amount: order.totalAmount,
          },
          {
            onSuccess: (paymentResponse) => {
              console.log("Razorpay Order:", paymentResponse.data.paymentId);
              const razorpay = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.totalAmount * 100,
                currency: "INR",
                name: "Your Ecommerce App",
                description: `Order ${order.orderNumber}`,
                order_id: paymentResponse.data.paymentId,

                handler: (response) => {
                  console.log("Payment successful:", response);
                },

                theme: {
                  color: "#3399cc",
                },
              });
              razorpay.open();
            },
          },
        );
      },
    });
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Loading cart...</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>
          <h1>Something went wrong</h1>
          <p>Unable to load your cart.</p>
        </div>
      </main>
    );
  }

  const cart = data?.data as PopulatedCart | undefined;

  if (!cart || cart.items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.emptyCart}>
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>

          <Link to="/products" className={styles.continueButton}>
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handleIncrease = (productId: string, quantity: number) => {
    updateMutation.mutate({
      productId,
      data: {
        quantity: quantity + 1,
      },
    });
  };

  const handleDecrease = (productId: string, quantity: number) => {
    if (quantity <= 1) return;

    updateMutation.mutate({
      productId,
      data: {
        quantity: quantity - 1,
      },
    });
  };

  const handleRemove = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleClearCart = () => {
    clearMutation.mutate();
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Your Cart</h1>

          <span>
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className={styles.content}>
          <section className={styles.itemsSection}>
            {cart.items.map((item) => {
              const product = item.product;
              const itemTotal = product.price * item.quantity;

              return (
                <article key={item.productId} className={styles.cartItem}>
                  <div className={styles.imageWrapper}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt ?? product.name}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <h2>{product.name}</h2>

                    <p className={styles.sku}>SKU: {product.sku}</p>

                    <p className={styles.price}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(item.productId, item.quantity)
                        }
                        disabled={
                          item.quantity <= 1 || updateMutation.isPending
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(item.productId, item.quantity)
                        }
                        disabled={
                          item.quantity >= product.stock ||
                          updateMutation.isPending
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <p className={styles.itemTotal}>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </p>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemove(item.productId)}
                      disabled={removeMutation.isPending}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}

            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearCart}
              disabled={clearMutation.isPending}
            >
              {clearMutation.isPending ? "Clearing..." : "Clear Cart"}
            </button>
          </section>

          <aside className={styles.summary}>
            <h2>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <button
              type="button"
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={startCheckoutMutation.isPending}
            >
              {startCheckoutMutation.isPending
                ? "Proceeding..."
                : "Proceed to Checkout"}
            </button>

            <Link to="/products" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
