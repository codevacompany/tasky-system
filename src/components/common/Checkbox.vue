<template>
  <label
    class="inline-flex items-center gap-3 cursor-pointer select-none"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : ''"
  >
    <span class="relative inline-flex shrink-0">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="isChecked"
        :disabled="disabled"
        :value="normalizedValue"
        @change="onChange"
      />
      <span
        class="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors
          border-[#C5CDD8] bg-white
          peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-1
          peer-checked:border-primary peer-checked:bg-primary
          dark:border-gray-500 dark:bg-gray-800
          dark:peer-checked:border-primary dark:peer-checked:bg-primary"
        aria-hidden="true"
      >
        <svg
          v-show="isChecked"
          class="h-3 w-3 text-white"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </span>
    <span
      v-if="label || $slots.default"
      class="text-sm text-gray-700 dark:text-gray-200 leading-snug"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts" generic="T extends string | number | boolean = boolean">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean | T[];
    /** When `modelValue` is an array, this is the option value (native checkbox group pattern). */
    value?: T;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean | T[]];
}>();

const normalizedValue = computed(() => props.value as string | number | undefined);

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value !== undefined && props.modelValue.includes(props.value);
  }
  return Boolean(props.modelValue);
});

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;

  if (Array.isArray(props.modelValue)) {
    if (props.value === undefined) return;
    const next = [...props.modelValue];
    const index = next.indexOf(props.value);
    if (checked && index === -1) next.push(props.value);
    if (!checked && index !== -1) next.splice(index, 1);
    emit('update:modelValue', next);
    return;
  }

  emit('update:modelValue', checked);
};
</script>
