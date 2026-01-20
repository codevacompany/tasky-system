<template>
  <div class="flex flex-col gap-1.5">
    <div v-if="label" class="flex items-center gap-1.5">
      <label :for="htmlFor" class="text-sm text-gray-800 dark:text-gray-200">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
        <span v-else-if="optional" class="text-gray-500 text-xs">(Opcional)</span>
      </label>
      <InfoTooltip
        v-if="tooltip"
        :message="tooltip"
        :width="tooltipWidth"
        :position="tooltipPosition"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import InfoTooltip from './InfoTooltip.vue';

defineProps<{
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  tooltipWidth?: string;
  tooltipPosition?: 'left' | 'center' | 'right';
}>();
</script>
