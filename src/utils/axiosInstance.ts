import axios from 'axios';
import { localStorageService } from '@/utils/localStorageService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = ['/login'];
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper function to notify all subscribers when a new token is available
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Request interceptor - attach token to headers
apiClient.interceptors.request.use((config) => {
  if (!PUBLIC_ENDPOINTS.includes(config.url || '')) {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorageService.getRefreshToken();

      if (!refreshToken) {
        localStorageService.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/refresh-token`, {
            refreshToken,
          });

          const newAccessToken = data.accessToken;
          localStorageService.setAccessToken(newAccessToken);
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the original request with the new token
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorageService.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // If another request is already refreshing, queue the failed request
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
