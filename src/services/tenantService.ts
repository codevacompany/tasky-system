import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export interface UserWithStats {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string;
  role: string;
  isActive: boolean;
  lastAccess?: string;
  loginCount?: number;
  lastLogin?: string | Date | null;
}

export interface SubscriptionInfo {
  planName?: string;
  planSlug?: string;
  maxUsers?: number;
  status?: string;
  trialEndDate?: string;
}

export interface TenantWithStats {
  id: number;
  name: string;
  cnpj?: string;
  email?: string;
  billingEmail?: string;
  phoneNumber?: string;
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  companySize?: string;
  mainActivity?: string;
  customKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Statistics
  totalUsers: number;
  activeUsers: number;
  totalTickets: number;
  ticketsThisMonth: number;
  openTickets: number;
  closedTickets: number;

  // Users list
  users: UserWithStats[];

  // Legal consent
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  termsVersion?: string;
  privacyPolicyAccepted: boolean;
  privacyPolicyAcceptedAt?: string;
  privacyPolicyVersion?: string;

  // Subscription info
  subscription?: SubscriptionInfo;
}

export interface GlobalStats {
  totalActiveClients: number;
  totalUsers: number;
  totalMonthlyTickets: number;
}

export interface TenantStatsResponse {
  items: TenantWithStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  globalStats: GlobalStats;
}

export interface CreateTenantDto {
  name: string;
  customKey: string;
  email?: string;
  billingEmail?: string;
  cnpj?: string;
  phoneNumber?: string;
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  companySize?: string;
  mainActivity?: string;
}

export const tenantService = {
  async getTenantsWithStats(params?: {
    page?: number;
    limit?: number;
    name?: string;
  }): Promise<AxiosResponse<TenantStatsResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.name) queryParams.append('name', params.name);

    const queryString = queryParams.toString();
    const url = `/tenants/with-stats${queryString ? `?${queryString}` : ''}`;

    return apiClient.get(url);
  },

  async createTenant(data: CreateTenantDto): Promise<AxiosResponse<TenantWithStats>> {
    return apiClient.post('/tenants', data);
  },

  async getMe(): Promise<AxiosResponse<TenantWithStats>> {
    return apiClient.get('/tenants/me');
  },

  async getById(id: number): Promise<AxiosResponse<TenantWithStats>> {
    return apiClient.get(`/tenants/${id}/details`);
  },

  async updateById(
    id: number,
    data: Partial<CreateTenantDto>,
  ): Promise<AxiosResponse<{ message: string; TenantId: number }>> {
    return apiClient.patch(`/tenants/${id}`, data);
  },

  async updateMe(
    data: Partial<CreateTenantDto>,
  ): Promise<AxiosResponse<{ message: string; TenantId: number }>> {
    return apiClient.patch('/tenants/me', data);
  },
};
