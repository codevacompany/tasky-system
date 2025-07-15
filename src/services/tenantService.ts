import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export interface UserWithStats {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string;
  role: string;
  isActive: boolean;
  lastAccess?: string;
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
  cnpj?: string;
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

  async createTenant(data: CreateTenantDto): Promise<AxiosResponse<any>> {
    return apiClient.post('/tenants', data);
  },
};
