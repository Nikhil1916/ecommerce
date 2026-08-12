import { IPaymentGateway } from "../interfaces/payment.gateway.interface";

export class FakePaymentGateway implements IPaymentGateway {
  async createPayment(
    orderId: string,
    amount: number,
  ): Promise<{
    paymentId: string;
    paymentUrl?: string;
  }> {
    return {
      paymentId: `fake_${Date.now()}`,
      paymentUrl: `https://fake-payment.com/pay/${orderId}`,
    };
  }

  async handleWebhook(payload: any) {
    return {
      orderId: payload.orderId,
      status: payload.status,
    };
  }
}
