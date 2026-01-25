import type { Notification, CreateNotificationDto } from '@/models';
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

  async getBytargetUser(
    targetUserId: number,
    params?: { page?: number; limit?: number },
  ): Promise<AxiosResponse<PaginatedResponse<Notification>>> {
    return apiClient.get(`/notifications/target-user/${targetUserId}`, {
      params,
    });
  },

  async getUnreadByTickets(ticketIds: string[]): Promise<AxiosResponse<Notification[]>> {
    return apiClient.post<Notification[]>('/notifications/unread/tickets', { ticketIds });
  },

  async markAllAsRead(): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>(`/notifications/mark-as-read`);
  },

  async markAsRead(id: number): Promise<AxiosResponse<Notification>> {
    return apiClient.post<Notification>(`/notifications/${id}/mark-as-read`);
  },

  async delete(uuid: string): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.delete(`/notifications/${uuid}`);
  },

  async getStreamTicket(): Promise<AxiosResponse<{ streamTicket: string }>> {
    return apiClient.post(`/notifications/stream-ticket`);
  },
};
