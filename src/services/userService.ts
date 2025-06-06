import type { User, CreateUserDto, UpdateUserDto } from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const userService = {
  async create(data: CreateUserDto): Promise<AxiosResponse<User>> {
    return apiClient.post<User>('/users', data);
  },

  async fetch(params: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<User>>> {
    return apiClient.get<PaginatedResponse<User>>('/users', { params });
  },

  async getByEmail(email: string): Promise<AxiosResponse<User>> {
    return apiClient.get<User>(`/users/${email}`);
  },

  async getByDepartment(
    departmentId: number,
    params?: {
      name?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<AxiosResponse<PaginatedResponse<User>>> {
    return apiClient.get(`/users/department/${departmentId}`, { params });
  },

  async update(id: number, data: UpdateUserDto): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },
};
