<template>
  <div class="p-4 md:p-6 md:pt-0">
    <div class="space-y-8">
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700"
      >
        <h2 class="text-2xl font-bold text-txt-primary dark:text-white m-0">Tema</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 m-0">
          Escolha a aparência do sistema.
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div class="p-6">
          <ThemeSelector variant="page" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSelector from '@/components/user/ThemeSelector.vue';
</script>
