<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 relative"
  >
    <!-- Info icon in top right corner -->
    <div v-if="infoMessage" class="absolute top-1 right-1 z-10 group">
      <button
        type="button"
        class="text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
        aria-label="Informação"
      >
        <InformationCircleIcon class="w-4 h-4" />
      </button>
      <!-- Tooltip -->
      <div
        class="absolute -right-3 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
      >
        <div
          class="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-normal w-80"
        >
          {{ infoMessage }}
          <!-- Tooltip arrow -->
          <div
            class="absolute right-4 top-0 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-700"
          ></div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2 mb-4 sm:mb-0">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p
            v-if="subtitle || $slots.subtitle"
            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
          >
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
      </div>
      <!-- Custom header content slot -->
      <div class="flex items-center gap-2">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline';

defineProps<{
  title?: string;
  subtitle?: string;
  infoMessage?: string;
}>();
</script>
