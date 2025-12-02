import type { ChecklistItem, CreateChecklistItemDto, UpdateChecklistItemDto } from '@/models/checklist';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const checklistService = {
  async getByTicket(ticketId: number): Promise<AxiosResponse<ChecklistItem[]>> {
    return apiClient.get(`/ticket-checklists/ticket/${ticketId}`);
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

