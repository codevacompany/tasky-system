import type { CreateTicketDto, Ticket, UpdateTicketDto, UpdateTicketStatusDto } from '@/models';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const ticketService = {
  async create(data: CreateTicketDto): Promise<AxiosResponse<Ticket>> {
    return apiClient.post('/tickets', data);
  },

  async fetch(): Promise<AxiosResponse<Ticket[]>> {
    return apiClient.get('/tickets');
  },

  async getById(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.get(`/tickets/${id}`);
  },

  async getByDepartment(departmentId: number, params?: {name?: string}): Promise<AxiosResponse<{items: Ticket[], totalPages: number}>> {
    return apiClient.get(`/tickets/department/${departmentId}`, {
      params,
    });
  },

  async getByRequester(requesterId: number, params?: {name?: string}): Promise<AxiosResponse<{items: Ticket[], totalPages: number}>> {
    return apiClient.get(`/tickets/requester/${requesterId}`, {
      params,
    });
  },

  async getByTargetUser(targetUserId: number, params?: {name?: string}): Promise<AxiosResponse<{items: Ticket[], totalPages: number}>> {
    return apiClient.get(`/tickets/target-user/${targetUserId}`, {
      params,
    });
  },

  async update(
    id: number,
    data: UpdateTicketDto,
  ): Promise<AxiosResponse<{ message: string; ticketId: number }>> {
    return apiClient.patch(`/tickets/${id}`, data);
  },

  async updateStatus(
    id: number,
    data: UpdateTicketStatusDto,
  ): Promise<AxiosResponse<{ message: string; ticketData: Ticket }>> {
    return apiClient.patch(`/tickets/${id}/status`, data);
  },

  async accept(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/accept`);
  },

  async approve(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/approve`);
  },

  async delete(id: number) {
    return apiClient.delete(`/tickets/${id}`);
  },
};
