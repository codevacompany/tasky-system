import type { User } from '@/models';
import type { AxiosResponse } from 'axios';
import { localStorageService } from '@/utils/localStorageService';
import apiClient from '@/utils/axiosInstance';
import { useUserStore } from '@/stores/user';

export interface LoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
  hasActiveSubscription?: boolean;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface WhoamiResponse {
  user: User;
  hasActiveSubscription?: boolean;
}

export const authService = {
  async login(data: { email: string; password: string }): Promise<AxiosResponse<LoginResponse>> {
    try {
      const response = await apiClient.post('/auth/login', data);

      const userstore = useUserStore();
      userstore.setUser(response.data.user);
      userstore.setHasActiveSubscription(response.data.hasActiveSubscription);

      if (response.data.user.loginCount === 1) {
        userstore.setIsNewUser(true);
      }

      localStorageService.setAccessToken(response.data.token.accessToken);
      localStorageService.setRefreshToken(response.data.token.refreshToken);

      return response;
    } catch (error) {
      throw error;
    }
  },

  async whoami(): Promise<AxiosResponse<WhoamiResponse>> {
    try {
      const response = await apiClient.get('/auth/whoami');

      const userstore = useUserStore();
      userstore.setUser(response.data.user);
      userstore.setHasActiveSubscription(response.data.hasActiveSubscription);

      return response;
    } catch (error) {
      throw error;
    }
  },

  async changePassword(data: ChangePasswordDto): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/change-password', data);
  },

  async requestPasswordReset(email: string): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password/request', { email });
  },

  async validateVerificationCode(data: {
    email: string;
    code: string;
  }): Promise<AxiosResponse<{ verificationCode: any; token: string }>> {
    return apiClient.post<{ verificationCode: any; token: string }>(
      '/auth/reset-password/validate',
      data,
    );
  },

  async resetPasswordWithToken(
    token: string,
    newPassword: string,
  ): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};
