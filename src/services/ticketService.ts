import type {
  CreateTicketDto,
  Ticket,
  TicketPriority,
  DefaultTicketStatus,
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
    status?: DefaultTicketStatus;
    priority?: TicketPriority;
    departmentUuid?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    paginated?: boolean;
  }): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get('/tickets', { params });
  },

  async getById(customId: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.get(`/tickets/${customId}`);
  },

  async getByDepartment(
    departmentId: number,
    params?: {
      name?: string;
      status?: DefaultTicketStatus;
      priority?: TicketPriority;
      departmentUuid?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      paginated?: boolean;
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
      status?: DefaultTicketStatus;
      priority?: TicketPriority;
      departmentUuid?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      paginated?: boolean;
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
      status?: DefaultTicketStatus;
      priority?: TicketPriority;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      paginated?: boolean;
    },
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets/target-user/${targetUserId}`, {
      params,
    });
  },

  async getReceivedTickets(
    userId: number,
    params?: {
      name?: string;
      status?: DefaultTicketStatus;
      priority?: TicketPriority;
      departmentUuid?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      paginated?: boolean;
    },
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets/received/${userId}`, {
      params,
    });
  },

  async getArchived(params?: {
    name?: string;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get('/tickets/archived', { params });
  },

  async getTenantRecentTickets(
    limit: number = 10,
  ): Promise<AxiosResponse<PaginatedResponse<Ticket>>> {
    return apiClient.get(`/tickets?limit=${limit}`);
  },

  async update(
    customId: string,
    data: UpdateTicketDto,
  ): Promise<AxiosResponse<{ message: string; ticketId: number }>> {
    return apiClient.patch(`/tickets/${customId}`, data);
  },

  async updateStatus(
    customId: string,
    data: UpdateTicketStatusDto,
  ): Promise<AxiosResponse<{ message: string; ticketData: Ticket }>> {
    return apiClient.patch(`/tickets/${customId}/status`, data);
  },

  async accept(customId: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${customId}/accept`);
  },

  async approve(customId: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${customId}/approve`);
  },

  async cancel(customId: string, data?: { reason: string; details: string }) {
    return apiClient.post(`/tickets/${customId}/cancel`, data);
  },

  async reject(customId: string, data?: { reason: string; details: string }) {
    return apiClient.post(`/tickets/${customId}/reject`, data);
  },

  async requestCorrection(
    customId: string,
    data?: { reason: string; details: string; targetUserId?: number },
  ) {
    return apiClient.post(`/tickets/${customId}/request-correction`, data);
  },

  async addFiles(customId: string, fileUrls: string[]): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${customId}/files`, { files: fileUrls });
  },

  async deleteFile(fileId: number): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.delete(`/ticket-files/${fileId}`);
  },

  async updateAssignee(
    customId: string,
    targetUserId: number,
    order: number,
  ): Promise<AxiosResponse<Ticket>> {
    return apiClient.patch(`/tickets/${customId}/assignee`, { targetUserId, order });
  },

  async updateReviewer(ticketCustomId: string, reviewerId: number) {
    return apiClient.patch(`/tickets/${ticketCustomId}/reviewer`, { reviewerId });
  },

  async sendToNextDepartment(customId: string): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${customId}/send-to-next-department`);
  },
};
