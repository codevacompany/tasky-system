<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2 mb-4 sm:mb-0">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              <slot name="title">{{ title }}</slot>
            </h2>
            <!-- Info icon next to title -->
            <BaseInfoTooltip v-if="infoMessage" :message="infoMessage" />
          </div>
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
import BaseInfoTooltip from './InfoTooltip.vue';

defineProps<{
  title?: string;
  subtitle?: string;
  infoMessage?: string;
}>();
</script>
