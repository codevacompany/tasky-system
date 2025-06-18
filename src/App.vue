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
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>
