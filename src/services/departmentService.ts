import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const departmentService = {
  async create(data: CreateDepartmentDto): Promise<AxiosResponse<Department>> {
    return apiClient.post<Department>('/departments', data);
  },

  async fetch(params?: { name?: string }): Promise<AxiosResponse<Department[]>> {
    return apiClient.get<Department[]>('/departments', { params });
  },

  async getById(id: number): Promise<AxiosResponse<Department>> {
    return apiClient.get<Department>(`/departments/${id}`);
  },

  async update(id: number, data: UpdateDepartmentDto): Promise<AxiosResponse<Department>> {
    return apiClient.patch<Department>(`/departments/${id}`, data);
  },
};
