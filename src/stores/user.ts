import { defineStore } from 'pinia';
import { ref } from 'vue';
import { localStorageService } from '@/utils/localStorageService';
import type { User } from '@/models';
import apiClient from '@/utils/axiosInstance';

export const useUserStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isNewUser = ref(false);
  const isAppLoading = ref(false);
  const hasActiveSubscription = ref<boolean | undefined>(undefined);

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const setIsNewUser = (isNew: boolean) => {
    isNewUser.value = isNew;
  };

  const setAppLoading = (loading: boolean) => {
    isAppLoading.value = loading;
  };

  const setHasActiveSubscription = (value: boolean | undefined) => {
    hasActiveSubscription.value = value;
  };

  const whoami = async (options?: { silent?: boolean }): Promise<boolean> => {
    try {
      if (!options?.silent) {
        setAppLoading(true);
      }
      const response = await apiClient.get<{ user: User; hasActiveSubscription?: boolean }>(
        '/auth/whoami',
      );
      setUser(response.data.user);
      setHasActiveSubscription(response.data.hasActiveSubscription);
      return true;
    } catch {
      localStorageService.removeAccessToken();
      localStorageService.removeRefreshToken();
      setUser(null);
      setHasActiveSubscription(undefined);
      return false;
    } finally {
      if (!options?.silent) {
        setAppLoading(false);
      }
    }
  };

  const logout = () => {
    localStorageService.clear();
    setUser(null);
    setHasActiveSubscription(undefined);
  };

  return {
    user,
    setUser,
    isNewUser,
    setIsNewUser,
    isAppLoading,
    setAppLoading,
    hasActiveSubscription,
    setHasActiveSubscription,
    whoami,
    logout,
  };
});
