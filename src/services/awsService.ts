import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const awsService = {
  async getSignedUrl(ext: string): Promise<AxiosResponse<{ url: string }>> {
    return apiClient.get(`/aws/upload-url?ext=.${ext}`);
  },
};
