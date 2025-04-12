import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const categoryService = {
  async create(data: CreateCategoryDto): Promise<AxiosResponse<Category>> {
    return apiClient.post<Category>('/categories', data);
  },

  async fetch(params?: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Category>>> {
    return apiClient.get<PaginatedResponse<Category>>('/categories', { params });
  },

  async getById(id: number): Promise<AxiosResponse<Category>> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async update(id: number, data: UpdateCategoryDto): Promise<AxiosResponse<Category>> {
    return apiClient.patch<Category>(`/categories/${id}`, data);
  },
};
