import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const departmentService = {
  async create(data: CreateDepartmentDto): Promise<AxiosResponse<Department>> {
    return apiClient.post<Department>('/departments', data);
  },

  async fetch(params?: {
    name?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AxiosResponse<PaginatedResponse<Department>>> {
    return apiClient.get<PaginatedResponse<Department>>('/departments', { params });
  },

  async getById(uuid: string): Promise<AxiosResponse<Department>> {
    return apiClient.get<Department>(`/departments/${uuid}`);
  },

  async update(uuid: string, data: UpdateDepartmentDto): Promise<AxiosResponse<Department>> {
    return apiClient.patch<Department>(`/departments/${uuid}`, data);
  },

  async delete(uuid: string): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/departments/${uuid}`);
  },
};
