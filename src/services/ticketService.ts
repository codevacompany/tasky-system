import type {
  CreateTicketDto,
  Ticket,
  TicketPriority,
  TicketStatus,
  UpdateTicketDto,
  UpdateTicketStatusDto,
} from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const ticketService = {
  async create(data: CreateTicketDto): Promise<AxiosResponse<Ticket>> {
    return apiClient.post('/tickets', data);
  },

  async fetch(params?: {
    name?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get('/tickets', { params });
  },

  async getById(id: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.get(`/tickets/${id}`);
  },

  async getByDepartment(
    departmentId: number,
    params?: {
      name?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
      page?: number;
      limit?: number;
    },
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets/department/${departmentId}`, {
      params,
    });
  },

  async getByRequester(
    requesterId: number,
    params?: {
      name?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
      page?: number;
      limit?: number;
    },
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets/requester/${requesterId}`, {
      params,
    });
  },

  async getByTargetUser(
    targetUserId: number,
    params?: {
      name?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
      page?: number;
      limit?: number;
    },
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets/target-user/${targetUserId}`, {
      params,
    });
  },

  async getArchived(params?: {
    name?: string;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get('/tickets/archived', { params });
  },

  async getTenantRecentTickets(
    limit: number = 10,
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets?limit=${limit}`);
  },

  async update(
    id: string,
    data: UpdateTicketDto,
  ): Promise<AxiosResponse<{ message: string; ticketId: number }>> {
    return apiClient.patch(`/tickets/${id}`, data);
  },

  async updateStatus(
    id: string,
    data: UpdateTicketStatusDto,
  ): Promise<AxiosResponse<{ message: string; ticketData: Ticket }>> {
    return apiClient.patch(`/tickets/${id}/status`, data);
  },

  async accept(id: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/accept`);
  },

  async approve(id: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/approve`);
  },

  async cancel(id: string, data?: { reason: string; details: string }) {
    return apiClient.post(`/tickets/${id}/cancel`, data);
  },

  async reject(id: string, data?: { reason: string; details: string }) {
    return apiClient.post(`/tickets/${id}/reject`, data);
  },

  async requestCorrection(id: string, data?: { reason: string; details: string }) {
    return apiClient.post(`/tickets/${id}/request-correction`, data);
  },

  async addFiles(id: string, fileUrls: string[]): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/files`, { fileUrls });
  },
};
