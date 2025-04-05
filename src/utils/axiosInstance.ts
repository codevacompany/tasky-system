import axios from 'axios';
import { localStorageService } from '@/utils/localStorageService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Include all public (unauthenticated) endpoints
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/refresh-token'];

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// ✅ Helper to check if request is to a public endpoint
function isPublicEndpoint(url?: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));
}

// ✅ Request interceptor - attach token if not public
apiClient.interceptors.request.use((config) => {
  if (!isPublicEndpoint(config.url)) {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Response interceptor - handle expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry login or refresh endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicEndpoint(originalRequest.url)
    ) {
      const refreshToken = localStorageService.getRefreshToken();

      if (!refreshToken) {
        localStorageService.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const newAccessToken = data.accessToken;
          localStorageService.setAccessToken(newAccessToken);
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the original request
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorageService.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Queue failed requests until refresh finishes
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
