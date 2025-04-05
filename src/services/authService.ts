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
}

export const authService = {
  async login(data: { email: string; password: string }): Promise<AxiosResponse<LoginResponse>> {
    try {
      const response = await apiClient.post('/auth/login', data);

      const userstore = useUserStore();
      console.log(response.data);
      userstore.setUser(response.data.user);
      localStorageService.setUser(response.data.user);
      localStorageService.setAccessToken(response.data.token.accessToken);
      localStorageService.setRefreshToken(response.data.token.refreshToken);

      return response;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorageService.clear();
  },
};
