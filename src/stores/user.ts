import { defineStore } from 'pinia';
import { ref } from 'vue';
import { localStorageService } from '@/utils/localStorageService';
import type { User } from '@/models';
import apiClient from '@/utils/axiosInstance';

export const useUserStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isNewUser = ref(false);
  const isAppLoading = ref(false);

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const setIsNewUser = (isNew: boolean) => {
    isNewUser.value = isNew;
  };

  const setAppLoading = (loading: boolean) => {
    isAppLoading.value = loading;
  };

  const whoami = async (): Promise<boolean> => {
    try {
      setAppLoading(true);
      const response = await apiClient.get<{ user: User }>('/auth/whoami');
      setUser(response.data.user);
      return true;
    } catch (error) {
      localStorageService.removeAccessToken();
      localStorageService.removeRefreshToken();
      setUser(null);
      return false;
    } finally {
      setAppLoading(false);
    }
  };

  const logout = () => {
    localStorageService.clear();
    setUser(null);
  };

  return {
    user,
    setUser,
    isNewUser,
    setIsNewUser,
    isAppLoading,
    setAppLoading,
    whoami,
    logout,
  };
});
