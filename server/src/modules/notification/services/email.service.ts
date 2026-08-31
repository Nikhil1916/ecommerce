import { IEmailProvider } from "../interfaces/email.provider.interface";

export class EmailService {
  constructor(
    private readonly emailProvider: IEmailProvider,
  ) {}

  async sendOrderConfirmation(data: {
    to: string;
    orderId: string;
  }): Promise<void> {
    throw new Error("Email service down");
    await this.emailProvider.sendEmail({
      to: data.to,
      subject: "Order Confirmation",
      html: `
        <h2>Payment Successful</h2>
        <p>Your order has been confirmed.</p>
        <p>Order ID: ${data.orderId}</p>
      `,
    });
  }
}