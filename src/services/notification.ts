import type { Notification, CreateNotificationDto, UpdateNotificationDto } from '@/models';
import axios from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const NotificationService = {
  async create(data: CreateNotificationDto): Promise<AxiosResponse<Notification>> {
    return axios.post<Notification>('/notifications', data);
  },

  async fetch(): Promise<AxiosResponse<Notification[]>> {
    return axios.get<Notification[]>('/notifications');
  },

  async getBytargetUser(targetUserId: number): Promise<AxiosResponse<Notification>> {
    return axios.get<Notification>(`/notifications/target-user/${targetUserId}`);
  },

  async update(id: number, data: UpdateNotificationDto): Promise<AxiosResponse<Notification>> {
    return axios.patch<Notification>(`/notifications/${id}`, data);
  },

  async markAllAsRead(): Promise<AxiosResponse<Notification>> {
    return axios.post<Notification>(`/notifications/mark-as-read`);
  },

  async markAsRead(id: number): Promise<AxiosResponse<Notification>> {
    return axios.post<Notification>(`/notifications/${id}/mark-as-read`);
  },
};
