import type { CreateTagDto, Tag, UpdateTagDto } from '@/models';
import type { PaginatedResponse } from '@/types/http';
import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const tagService = {
  async create(data: CreateTagDto): Promise<AxiosResponse<Tag>> {
    return apiClient.post<Tag>('/tags', data);
  },

  async fetch(params?: {
    q?: string;
    name?: string;
    activeOnly?: boolean;
    sectorScope?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AxiosResponse<PaginatedResponse<Tag>>> {
    return apiClient.get<PaginatedResponse<Tag>>('/tags', {
      params: {
        ...params,
        q: params?.q ?? params?.name,
        activeOnly: params?.activeOnly === false ? 'false' : undefined,
        sectorScope: params?.sectorScope ? 'true' : undefined,
      },
    });
  },

  async getSuggested(params?: {
    ticketCustomId?: string;
    limit?: number;
  }): Promise<AxiosResponse<Tag[]>> {
    return apiClient.get<Tag[]>('/tags/suggested', { params });
  },

  async getById(uuid: string): Promise<AxiosResponse<Tag>> {
    return apiClient.get<Tag>(`/tags/${uuid}`);
  },

  async update(uuid: string, data: UpdateTagDto): Promise<AxiosResponse<Tag>> {
    return apiClient.patch<Tag>(`/tags/${uuid}`, data);
  },

  async delete(uuid: string): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/tags/${uuid}`);
  },
};
