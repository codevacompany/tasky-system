import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';
import type { LoginResponse } from './authService';
import { useUserStore } from '@/stores/user';
import { localStorageService } from '@/utils/localStorageService';

interface SignUpPayload {
  companyName: string;
  email: string;
  cnpj: string;
  contactName: string;
  contactCpf: string;
  contactEmail: string;
  contactPhone: string;
  termsAccepted: boolean;
  termsVersion?: string;
  privacyPolicyAccepted: boolean;
  privacyPolicyVersion?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface CompleteRegistrationPayload {
  customKey: string;
  password: string;
}

class SignupService {
  private readonly baseUrl = '/sign-up';

  async createSignUp(data: SignUpPayload) {
    return apiClient.post(this.baseUrl, data);
  }

  async getSignups(params: PaginationParams) {
    return apiClient.get(this.baseUrl, { params });
  }

  async approveSignup(id: number) {
    return apiClient.post(`${this.baseUrl}/${id}/approve`);
  }

  async rejectSignup(id: number) {
    return apiClient.post(`${this.baseUrl}/${id}/reject`);
  }

  async resendEmail(id: number) {
    return apiClient.post(`${this.baseUrl}/${id}/resend-email`);
  }

  async completeRegistration(
    token: string,
    data: CompleteRegistrationPayload,
  ): Promise<AxiosResponse<LoginResponse>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/complete/${token}`, data);

      const userStore = useUserStore();
      if (response.data && response.data.token && response.data.user) {
        userStore.setUser(response.data.user);
        userStore.setIsNewUser(true);
        if (response.data.hasActiveSubscription !== undefined) {
          userStore.setHasActiveSubscription(response.data.hasActiveSubscription);
        }
        localStorageService.setUser(response.data.user);
        localStorageService.setAccessToken(response.data.token.accessToken);
        localStorageService.setRefreshToken(response.data.token.refreshToken);
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const signupService = new SignupService();
