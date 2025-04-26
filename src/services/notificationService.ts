import type { Notification, CreateNotificationDto, UpdateNotificationDto } from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const notificationService = {
  async create(data: CreateNotificationDto): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>('/notifications', data);
  },

  async count() {
    return apiClient.get(`/notifications/unread/count`);
  },

  async getBytargetUser(targetUserId: number): Promise<AxiosResponse<PaginatedResponse<Notification>>> {
    return apiClient.get(`/notifications/target-user/${targetUserId}`);
  },

  async getUnreadByTickets(ticketIds: string[]): Promise<AxiosResponse<Notification[]>> {
    return apiClient.post<Notification[]>('/notifications/unread/tickets', { ticketIds });
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
