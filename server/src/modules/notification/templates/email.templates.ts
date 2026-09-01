export const orderConfirmationTemplate = (data: {
  orderId: string;
}) => ({
  subject: "Order Confirmation",
  html: `
    <h2>Payment Successful</h2>
    <p>Your order has been confirmed.</p>
    <p>Order ID: ${data.orderId}</p>
  `,
});

export const backInStockTemplate = (data: {
  productName: string;
}) => ({
  subject: `${data.productName} is back in stock`,
  html: `
    <h2>Product Back in Stock</h2>
    <p>Good news! <strong>${data.productName}</strong> is now back in stock.</p>
  `,
});