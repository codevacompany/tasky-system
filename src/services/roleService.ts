import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export interface RoleDto {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const roleService = {
  async fetchAssignable(params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<RoleDto>>> {
    return apiClient.get('/roles/assignable', { params });
  },
};
