export class PaymentFailedError extends Error {
  constructor() {
    super('Payment failed');
  }
}
