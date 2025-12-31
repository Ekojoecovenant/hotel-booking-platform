export interface PaymentService {
  charge(input: {
    userId: string;
    amount: number;
    reference: string;
  }): Promise<{
    success: boolean;
    transactionId?: string;
  }>;
}
