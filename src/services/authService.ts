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
    const response = await apiClient.post('/auth/login', data);

    if (response.status === 200) {
      const userstore = useUserStore();
      userstore.setUser(response.data.user);
      localStorageService.setAccessToken(response.data.token.accessToken);
      localStorageService.setRefreshToken(response.data.token.refreshToken);
    }

    return response;
  },

  logout() {
    localStorageService.clear()
  },
};
