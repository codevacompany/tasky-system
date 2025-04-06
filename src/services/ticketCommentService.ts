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

  async getById(id: number): Promise<AxiosResponse<TicketComment>> {
    return apiClient.get<TicketComment>(`/ticket-comments/${id}`);
  },

  async getByTicket(ticketId: number): Promise<AxiosResponse<TicketComment[]>> {
    return apiClient.get<TicketComment[]>(`/ticket-comments/ticket/${ticketId}`);
  },

  async update(id: number, data: UpdateTicketCommentDto): Promise<AxiosResponse<TicketComment>> {
    return apiClient.patch<TicketComment>(`/ticket-comments/${id}`, data);
  },
};
