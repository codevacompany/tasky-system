import type {
  Checklist,
  ChecklistItem,
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistDto,
  UpdateChecklistItemDto,
} from '@/models/checklist';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const checklistService = {
  async create(data: CreateChecklistDto): Promise<AxiosResponse<Checklist>> {
    return apiClient.post('/ticket-checklists', data);
  },

  async getByTicket(ticketId: number): Promise<AxiosResponse<Checklist[]>> {
    return apiClient.get(`/ticket-checklists/ticket/${ticketId}`);
  },

  async update(
    id: number,
    data: UpdateChecklistDto,
  ): Promise<AxiosResponse<Checklist>> {
    return apiClient.patch(`/ticket-checklists/${id}`, data);
  },

  async delete(id: number): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.delete(`/ticket-checklists/${id}`);
  },

  async createItem(data: CreateChecklistItemDto): Promise<AxiosResponse<ChecklistItem>> {
    return apiClient.post('/ticket-checklists/items', data);
  },

  async updateItem(
    id: number,
    data: UpdateChecklistItemDto,
  ): Promise<AxiosResponse<ChecklistItem>> {
    return apiClient.patch(`/ticket-checklists/items/${id}`, data);
  },

  async deleteItem(id: number): Promise<AxiosResponse<{ message: string }>> {
    return apiClient.delete(`/ticket-checklists/items/${id}`);
  },
};

