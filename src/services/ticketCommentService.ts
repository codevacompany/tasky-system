import type { CreateTicketCommentDto, TicketComment, UpdateTicketCommentDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const ticketCommentService = {
  async create(data: CreateTicketCommentDto): Promise<AxiosResponse<TicketComment>> {
    return apiClient.post<TicketComment>('/ticket-comments', data);
  },

  async fetch(): Promise<AxiosResponse<TicketComment[]>> {
    return apiClient.get<TicketComment[]>('/ticket-comments');
  },

  async getById(uuid: string): Promise<AxiosResponse<TicketComment>> {
    return apiClient.get<TicketComment>(`/ticket-comments/${uuid}`);
  },

  async getByTicket(ticketId: string): Promise<AxiosResponse<TicketComment[]>> {
    return apiClient.get<TicketComment[]>(`/ticket-comments/ticket/${ticketId}`);
  },

  async getMentionableUsers(ticketId: string): Promise<AxiosResponse<any[]>> {
    return apiClient.get<any[]>(`/ticket-comments/ticket/${ticketId}/mentionable-users`);
  },

  async update(uuid: string, data: UpdateTicketCommentDto): Promise<AxiosResponse<TicketComment>> {
    return apiClient.patch<TicketComment>(`/ticket-comments/${uuid}`, data);
  },

  async delete(uuid: string): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/ticket-comments/${uuid}`);
  },
};
