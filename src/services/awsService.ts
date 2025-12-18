import apiClient from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const awsService = {
  async getSignedUrl(fileName: string): Promise<AxiosResponse<{ url: string }>> {
    return apiClient.get(`/aws/upload-url?fileName=${encodeURIComponent(fileName)}`);
  },
  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    const response = await apiClient.get(`/aws/download?url=${encodeURIComponent(fileUrl)}`, {
      responseType: 'blob',
    });

    // Create blob URL and trigger download
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },
};
