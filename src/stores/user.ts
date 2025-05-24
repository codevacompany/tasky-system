import { defineStore } from 'pinia';
import { ref } from 'vue';
import { localStorageService } from '@/utils/localStorageService';
import type { User } from '@/models';

export const useUserStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorageService.getUser());
  const isNewUser = ref(false);

  const setUser = (userData: User | null) => {
    user.value = userData;

    if(userData) {
      localStorageService.setUser(userData);
    }
  };

  const setIsNewUser = (isNew: boolean) => {
    isNewUser.value = isNew;
  };

  return { user, setUser, isNewUser, setIsNewUser };
});
