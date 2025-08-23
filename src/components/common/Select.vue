<template>
  <div class="relative w-full">
    <select
      :value="modelValue"
      @change="updateValue"
      :disabled="disabled"
      :class="[
        'appearance-none w-full px-[14px] py-2.5 pr-10 text-sm font-medium rounded border transition-colors cursor-pointer',
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10',
        'hover:border-gray-300',
        disabled
          ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
          : 'bg-white dark:bg-gray-800',
        'text-gray-800 dark:text-white border-gray-200 dark:border-gray-700',
      ]"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400"
    >
      <font-awesome-icon icon="chevron-down" class="text-xs" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[];
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

defineOptions({
  inheritAttrs: false,
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>
