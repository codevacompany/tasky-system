import apiClient from '@/utils/axiosInstance';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PaymentHistory {
  id: number;
  date: Date;
  plan: string;
  amount: number;
  status: string;
  invoiceUrl?: string;
}

class SubscriptionService {
  private readonly baseUrl = '/api/subscriptions';

  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get(`${this.baseUrl}/plans`);
    return response.data;
  }

  async getCurrentSubscription(): Promise<SubscriptionPlan> {
    const response = await apiClient.get(`${this.baseUrl}/current`);
    return response.data;
  }

  async subscribe(planId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/subscribe`, { planId });
  }

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    const response = await apiClient.get(`${this.baseUrl}/payments`);
    return response.data;
  }

  async downloadInvoice(paymentId: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/payments/${paymentId}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async cancelSubscription(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/cancel`);
  }
}

export const subscriptionService = new SubscriptionService(); 