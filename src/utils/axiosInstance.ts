import axios from 'axios';
import { localStorageService } from '@/utils/localStorageService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/login'];

apiClient.interceptors.request.use((config) => {
  if (!PUBLIC_ENDPOINTS.includes(config.url || '')) {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
