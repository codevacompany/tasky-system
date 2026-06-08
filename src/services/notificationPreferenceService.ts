import type {
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesDto,
} from '@/models/notificationPreference';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const notificationPreferenceService = {
  async get(): Promise<AxiosResponse<NotificationPreferencesResponse>> {
    return apiClient.get<NotificationPreferencesResponse>('/users/me/notification-preferences');
  },

  async update(
    data: UpdateNotificationPreferencesDto,
  ): Promise<AxiosResponse<NotificationPreferencesResponse>> {
    return apiClient.patch<NotificationPreferencesResponse>(
      '/users/me/notification-preferences',
      data,
    );
  },
};
