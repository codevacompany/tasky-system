import type { User, CreateUserDto, UpdateUserDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const userService = {
  async create(data: CreateUserDto): Promise<AxiosResponse<User>> {
    return apiClient.post<User>('/users', data);
  },

  async fetch(params: { name?: string }): Promise<AxiosResponse<User[]>> {
    return apiClient.get<User[]>('/users', { params });
  },

  async getByEmail(email: string): Promise<AxiosResponse<User>> {
    return apiClient.get<User>(`/users/${email}`);
  },

  async getByDepartment(departmentId: number): Promise<AxiosResponse<User[]>> {
    return apiClient.get<User[]>(`/users/department/${departmentId}`);
  },

  async update(id: number, data: UpdateUserDto): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },
};
