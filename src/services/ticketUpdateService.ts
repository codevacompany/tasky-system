import type { TicketUpdate} from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const TicketUpdateService = {
  async fetch(): Promise<AxiosResponse<TicketUpdate[]>> {
    return apiClient.get<TicketUpdate[]>('/ticket-updates');
  },

  async getById(id: number): Promise<AxiosResponse<TicketUpdate>> {
    return apiClient.get<TicketUpdate>(`/ticket-updates/${id}`);
  },

  async getByTicket(ticketId: string): Promise<AxiosResponse<TicketUpdate[]>> {
    return apiClient.get<TicketUpdate[]>(`/ticket-updates/ticket/${ticketId}`);
  },
};
