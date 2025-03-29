import type { CreateTicketUpdateDto, TicketUpdate, UpdateTicketUpdateDto } from '@/models';
import axios from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const ticketUpdateService = {
  async create(data: CreateTicketUpdateDto): Promise<AxiosResponse<TicketUpdate>> {
    return axios.post<TicketUpdate>('/ticket-updates', data);
  },

  async fetch(): Promise<AxiosResponse<TicketUpdate[]>> {
    return axios.get<TicketUpdate[]>('/ticket-updates');
  },

  async getById(id: number): Promise<AxiosResponse<TicketUpdate>> {
    return axios.get<TicketUpdate>(`/ticket-updates/${id}`);
  },

  async getByTicket(ticketId: number): Promise<AxiosResponse<TicketUpdate>> {
    return axios.get<TicketUpdate>(`/ticket-updates/${ticketId}`);
  },

  async update(id: number, data: UpdateTicketUpdateDto): Promise<AxiosResponse<TicketUpdate>> {
    return axios.patch<TicketUpdate>(`/ticket-updates/${id}`, data);
  },
};
