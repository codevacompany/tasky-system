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
            <div v-if="infoMessage" class="relative group flex items-center">
              <button
                type="button"
                class="text-[#9ea9b2] hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                aria-label="Informação"
              >
                <font-awesome-icon icon="info-circle" class="w-[14px] h-[14px]" />
              </button>
              <!-- Tooltip -->
              <div
                class="absolute -left-3 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none"
              >
                <div
                  class="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-normal w-80"
                >
                  {{ infoMessage }}
                  <!-- Tooltip arrow -->
                  <div
                    class="absolute left-4 top-0 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-700"
                  ></div>
                </div>
              </div>
            </div>
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
defineProps<{
  title?: string;
  subtitle?: string;
  infoMessage?: string;
}>();
</script>
