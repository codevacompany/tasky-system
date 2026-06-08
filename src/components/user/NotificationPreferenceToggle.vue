<template>
  <Tooltip v-if="required" :message="REQUIRED_MESSAGE" width="260px" position="right">
    <span class="inline-flex flex-shrink-0 mt-1">
      <button
        type="button"
        role="switch"
        :aria-checked="enabled"
        disabled
        class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none cursor-not-allowed"
        :class="trackClass"
      >
        <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 translate-x-5" />
      </button>
    </span>
  </Tooltip>
  <button
    v-else
    type="button"
    role="switch"
    :aria-checked="enabled"
    :disabled="disabled"
    class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none mt-1 cursor-pointer focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
    :class="trackClass"
    @click="emit('toggle')"
  >
    <span
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
      :class="enabled ? 'translate-x-5' : 'translate-x-0'"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Tooltip from '@/components/common/Tooltip.vue';

const REQUIRED_MESSAGE = 'Esta notificação é obrigatória e não pode ser desativada.';

const props = defineProps<{
  enabled: boolean;
  required?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const trackClass = computed(() => {
  if (props.required) return 'bg-gray-400 dark:bg-gray-500';
  return props.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600';
});
</script>
