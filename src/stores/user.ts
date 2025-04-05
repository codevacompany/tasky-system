import { defineStore } from 'pinia';
import { ref } from 'vue';
import { localStorageService } from '@/utils/localStorageService';
import type { User } from '@/models';

export const useUserStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorageService.getUser());

  const setUser = (userData: User | null) => {
    user.value = userData;

    if(userData) {
      localStorageService.setUser(userData);
    }
  };

  return { user, setUser };
});
