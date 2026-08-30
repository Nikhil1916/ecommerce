export interface IPaymentGateway {
  createPayment(
    orderId: string,
    amount: number,
  ): Promise<{
    paymentId: string;
    paymentUrl?: string;
  }>;

  handleWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<{
    orderId: string;
    status: "SUCCESS" | "FAILED";
  }>;
}