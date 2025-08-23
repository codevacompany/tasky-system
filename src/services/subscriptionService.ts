import apiClient from '@/utils/axiosInstance';

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  maxUsers: number | null;
  priceMonthly: string | number;
  priceYearly: string | number | null;
  description: string;
  isActive: boolean;
}

export interface SubscriptionSummary {
  hasSubscription: boolean;
  subscription?: {
    id: number;
    status: string;
    planName: string;
    planSlug: string;
    maxUsers: number | null;
    startDate: string;
    endDate: string | null;
    trialEndDate: string | null;
    isActive: boolean;
  };
  userStats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  validation?: {
    isValid: boolean;
    currentUsers: number;
    maxUsers: number | null;
  };
  billing?: {
    basePlanCost: number;
    additionalUsersCost: number;
    totalCost: number;
    additionalUsers: number;
    currentUsers: number;
    exceedsLimit: boolean;
  };
}

export interface BillingCalculation {
  basePlanCost: number;
  additionalUsersCost: number;
  totalCost: number;
  basePlanUsers: number;
  additionalUsers: number;
  totalUsers: number;
  planName: string;
  planSlug: string;
  description: string;
}

export interface BillingSummary {
  currentBilling: BillingCalculation;
  nextBillingDate: string | null;
  pendingPayments: any[];
  overduePayments: any[];
}

export interface UserAdditionValidation {
  canAdd: boolean;
  reason?: string;
  additionalCost?: number;
  newTotalCost?: number;
}

class SubscriptionService {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get('/subscription-plans');
    return response.data;
  }

  async getPlanBySlug(slug: string): Promise<SubscriptionPlan> {
    const response = await apiClient.get(`/subscription-plans/${slug}`);
    return response.data;
  }

  async getCurrentSubscription(tenantId: number): Promise<SubscriptionSummary> {
    const response = await apiClient.get(`/tenant-subscriptions/tenant/${tenantId}/summary`);
    return response.data;
  }

  async subscribe(planSlug: string): Promise<any> {
    const response = await apiClient.post('/tenant-subscriptions/subscribe', {
      planSlug,
    });
    return response.data;
  }

  // New billing-related methods
  async getTenantBilling(tenantId: number): Promise<BillingCalculation> {
    const response = await apiClient.get(`/tenant-subscriptions/tenant/${tenantId}/billing`);
    return response.data;
  }

  async getBillingSummary(tenantId: number): Promise<BillingSummary> {
    const response = await apiClient.get(
      `/tenant-subscriptions/tenant/${tenantId}/billing/summary`,
    );
    return response.data;
  }

  async validateUserAddition(
    tenantId: number,
    usersToAdd: number = 1,
  ): Promise<UserAdditionValidation> {
    const response = await apiClient.post(
      `/tenant-subscriptions/tenant/${tenantId}/billing/validate-user-addition`,
      {
        usersToAdd,
      },
    );
    return response.data;
  }

  async createBillingPayment(tenantId: number, dueDate?: string): Promise<any> {
    const response = await apiClient.post(
      `/tenant-subscriptions/tenant/${tenantId}/billing/create-payment`,
      {
        dueDate,
      },
    );
    return response.data;
  }

  async generateBillingReport(tenantId: number, fromDate?: string, toDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const response = await apiClient.get(
      `/tenant-subscriptions/tenant/${tenantId}/billing/report?${params}`,
    );
    return response.data;
  }

  // User validation method (to be used before creating users)
  async validateUserCreation(usersToAdd: number = 1): Promise<any> {
    const response = await apiClient.post('/users/validate-creation', {
      usersToAdd,
    });
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();
