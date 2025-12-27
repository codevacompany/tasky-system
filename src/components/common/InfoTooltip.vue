<template>
  <Tooltip :message="message" :width="width" :position="position">
    <button
      type="button"
      class="text-[#9ea9b2] hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none flex items-center"
      aria-label="Informação"
    >
      <font-awesome-icon icon="info-circle" class="w-[14px] h-[14px]" />
    </button>
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue';

defineProps<{
  message: string;
  width?: string;
  position?: 'left' | 'center' | 'right';
}>();
</script>
