<template>
  <div class="tag-color-field relative">
    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Cor</label>
    <VSwatches
      v-model="color"
      show-fallback
      fallback-input-type="color"
      popover-x="right"
    >
      <template #trigger>
        <button
          type="button"
          class="inline-flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/40 px-2.5 py-2 text-left shadow-sm hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          title="Clique para escolher a cor"
        >
          <span
            class="w-8 h-8 rounded-md border border-black/10 dark:border-white/20 shrink-0 shadow-inner"
            :style="{ backgroundColor: color }"
          />
          <span class="min-w-0">
            <span class="block text-sm font-mono text-gray-800 dark:text-gray-100 uppercase leading-tight">
              {{ color }}
            </span>
            <span class="block text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
              Clique para alterar
            </span>
          </span>
          <font-awesome-icon
            icon="chevron-down"
            class="w-3 h-3 text-gray-400 dark:text-gray-500 ml-1 shrink-0"
          />
        </button>
      </template>
    </VSwatches>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VSwatches } from 'vue3-swatches';
import 'vue3-swatches/dist/style.css';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const color = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value?.toUpperCase?.() ?? value),
});
</script>

<style scoped>
/* Sit above modal footer / sibling content (library default is z-index: 50). */
.tag-color-field :deep(.vue-swatches__container:not(.vue-swatches--inline)) {
  z-index: 1100;
}
</style>
