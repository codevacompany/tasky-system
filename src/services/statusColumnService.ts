import type { StatusColumn } from '@/models/statusColumn';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const statusColumnService = {
  async fetch(params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<StatusColumn>>> {
    return apiClient.get<PaginatedResponse<StatusColumn>>('/status-columns', { params });
  },
};

