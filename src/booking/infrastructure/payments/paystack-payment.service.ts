import axios from 'axios';
import { PaymentService } from '../../application/ports/payment-service.port';

export class PaystackPaymentService implements PaymentService {
  async charge(): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(
        `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: 'customer@example.com',
          amount: 500000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return { success: response.status === 200 };
    } catch (error) {
      void error;
      return { success: false };
    }
  }
}
