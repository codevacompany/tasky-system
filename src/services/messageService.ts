import type { Message, CreateMessageDto, UpdateMessageDto, MessageReaction, Mention } from '@/models/message';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

interface CreateMessageData {
  content: string;
  channel: 'geral' | 'setor' | 'individual' | 'inicio';
  targetUserId?: number;
  mentions: Mention[];
  requiresConfirmation?: boolean;
  parentMessageId?: number;
}

export const messageService = {
  async create(data: CreateMessageData): Promise<AxiosResponse<Message>> {
    return apiClient.post<Message>('/messages', data);
  },

  async fetch(params?: {
    channel?: 'geral' | 'setor' | 'individual' | 'inicio';
    targetUserId?: number;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Message>>> {
    return apiClient.get<PaginatedResponse<Message>>('/messages', { params });
  },

  async getById(id: number): Promise<AxiosResponse<Message>> {
    return apiClient.get<Message>(`/messages/${id}`);
  },

  async update(id: number, data: Partial<Message>): Promise<AxiosResponse<Message>> {
    return apiClient.put<Message>(`/messages/${id}`, data);
  },

  async delete(id: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/messages/${id}`);
  },

  async markAsRead(id: number): Promise<AxiosResponse<Message>> {
    return apiClient.post<Message>(`/messages/${id}/read`);
  },

  async markAllAsRead(channel?: 'geral' | 'setor' | 'individual' | 'inicio'): Promise<AxiosResponse<Message>> {
    return apiClient.post<Message>('/messages/mark-all-as-read', { channel });
  },

  async markMessagesAsRead(messageIds: number[]): Promise<AxiosResponse<Message[]>> {
    return apiClient.post<Message[]>('/messages/mark-as-read/batch', { messageIds });
  },

  async addReaction(messageId: number, reactionType: string): Promise<AxiosResponse<Message>> {
    return apiClient.post<Message>(`/messages/${messageId}/reactions`, { type: reactionType });
  },

  async removeReaction(messageId: number, reactionType: string): Promise<AxiosResponse<Message>> {
    return apiClient.delete<Message>(`/messages/${messageId}/reactions/${reactionType}`);
  },

  async confirmView(messageId: number): Promise<AxiosResponse<Message>> {
    return apiClient.post<Message>(`/messages/${messageId}/confirm-view`);
  }
}; 