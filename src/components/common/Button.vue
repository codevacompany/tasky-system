<template>
  <component
    :is="tag"
    v-bind="passthroughAttrs"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? disabled : undefined"
    data-app-button
    :class="rootClass"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

export type ButtonVariant = 'primary' | 'secondary' | 'outlined';
/** `gradient` matches legacy auth pages (linear navy). `solid` uses `--button-primary-color`. */
export type ButtonPrimaryTone = 'solid' | 'gradient';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    type?: 'button' | 'submit' | 'reset';
    /** Use `label` for file-upload triggers, etc. */
    tag?: string;
    disabled?: boolean;
    primaryTone?: ButtonPrimaryTone;
  }>(),
  {
    variant: 'primary',
    type: 'button',
    tag: 'button',
    primaryTone: 'solid',
  },
);

const attrs = useAttrs();

const isNativeButton = computed(() => props.tag === 'button');

const passthroughAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': {
      if (props.primaryTone === 'gradient') {
        return twMerge(
          'text-white border border-transparent rounded-[4px] shadow-soft-xs',
          'bg-gradient-to-br from-[#00143b] to-[#142046] hover:opacity-90',
        );
      }
      return twMerge(
        'text-white border border-transparent shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:opacity-90 hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]',
        'bg-[var(--button-primary-color)] dark:bg-[var(--primary-dark)]',
      );
    }
    case 'secondary':
      return twMerge(
        'text-white bg-primary-500 border border-primary-500 hover:bg-primary-700',
        'dark:bg-blue-600 dark:hover:bg-blue-700',
      );
    case 'outlined':
      return twMerge(
        'border border-gray-300 bg-white text-gray-700 shadow-none hover:bg-gray-50',
        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      );
    default:
      return '';
  }
});

const rootClass = computed(() =>
  twMerge(
    'inline-flex items-center justify-center gap-2 min-h-9 px-[0.85rem] py-2 text-sm font-medium whitespace-nowrap rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses.value,
    attrs.class as string | undefined,
  ),
);
</script>
