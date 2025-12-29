<template>
  <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 gap-2">
    <button
      v-for="option in options"
      :key="option.value"
      @click="selectOption(option.value)"
      :class="[
        'px-5 py-2 text-sm font-medium rounded-md transition-all',
        modelValue === option.value
          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-soft-xs'
          : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-600/70',
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectOption = (value: string) => {
  emit('update:modelValue', value);
};
</script>
