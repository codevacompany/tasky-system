<template>
  <div
    v-if="userStore.isAppLoading"
    class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-600 dark:text-gray-300">Carregando...</p>
    </div>
  </div>
  <router-view v-else />
  <Toaster position="bottom-right" rich-colors :theme="isDarkMode ? 'dark' : 'light'" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Toaster } from 'vue-sonner';
import { useUserStore } from '@/stores/user';
import { useUserPreferencesStore } from '@/stores/userPreferences';

const userStore = useUserStore();
const preferencesStore = useUserPreferencesStore();
const isDarkMode = computed(() => preferencesStore.isDarkMode);
</script>
