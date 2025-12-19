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
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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

  async update(uuid: string, data: UpdateUserDto): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>(`/users/${uuid}`, data);
  },

  async deactivate(uuid: string): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>(`/users/${uuid}`, { isActive: false });
  },

  async activate(uuid: string): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>(`/users/${uuid}`, { isActive: true });
  },

  async getTenantAdmins(): Promise<AxiosResponse<User[]>> {
    return apiClient.get('/users/tenant-admins');
  },

  async resetPassword(
    uuid: string,
    newPassword: string,
  ): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.patch(`/auth/admin/reset-password/${uuid}`, { newPassword });
  },

  async resetPasswordWithRandomPassword(
    uuid: string,
  ): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.patch(`/auth/admin/reset-password-uuid/${uuid}`);
  },

  async acceptTerms(data: {
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
    termsVersion?: string;
    privacyPolicyVersion?: string;
  }): Promise<AxiosResponse<User>> {
    return apiClient.post<User>('/users/accept-terms', data);
  },
};
