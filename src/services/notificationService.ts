import type { Notification, CreateNotificationDto, UpdateNotificationDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const notificationService = {
  async create(data: CreateNotificationDto): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>('/notifications', data);
  },

  async count(userId: number) {
    return apiClient.get(`/notifications/unread/count/${userId}`);
  },

  async getBytargetUser(targetUserId: number): Promise<AxiosResponse<Notification[]>> {
    return apiClient.get<Notification[]>(`/notifications/target-user/${targetUserId}`);
  },

  async update(id: number, data: UpdateNotificationDto): Promise<AxiosResponse<Notification>> {
    return apiClient.patch<Notification>(`/notifications/${id}`, data);
  },

  async markAllAsRead(): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>(`/notifications/mark-as-read`);
  },

  async markAsRead(id: number): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>(`/notifications/${id}/mark-as-read`);
  },
};
