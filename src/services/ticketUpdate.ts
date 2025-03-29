import type { CreateTicketUpdateDto, TicketUpdate, UpdateTicketUpdateDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const ticketUpdateService = {
  async create(data: CreateTicketUpdateDto): Promise<AxiosResponse<TicketUpdate>> {
    return apiClient.post<TicketUpdate>('/ticket-updates', data);
  },

  async fetch(): Promise<AxiosResponse<TicketUpdate[]>> {
    return apiClient.get<TicketUpdate[]>('/ticket-updates');
  },

  async getById(id: number): Promise<AxiosResponse<TicketUpdate>> {
    return apiClient.get<TicketUpdate>(`/ticket-updates/${id}`);
  },

  async getByTicket(ticketId: number): Promise<AxiosResponse<TicketUpdate>> {
    return apiClient.get<TicketUpdate>(`/ticket-updates/${ticketId}`);
  },

  async update(id: number, data: UpdateTicketUpdateDto): Promise<AxiosResponse<TicketUpdate>> {
    return apiClient.patch<TicketUpdate>(`/ticket-updates/${id}`, data);
  },
};
