import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { localStorageService } from '@/utils/localStorageService';

export const useUserPreferencesStore = defineStore('userPreferences', () => {
  const isDarkMode = ref(localStorageService.isDarkMode());

  watch(
    isDarkMode,
    (newValue) => {
      document.body.classList.toggle('dark-mode', newValue);
      document.body.classList.toggle('dark', newValue);
      localStorageService.setTheme(newValue ? 'dark' : 'light');
    },
    { immediate: true },
  );

  const setTheme = (theme: 'light' | 'dark') => {
    isDarkMode.value = theme === 'dark';
  };

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return {
    isDarkMode,
    setTheme,
    toggleTheme,
  };
});
