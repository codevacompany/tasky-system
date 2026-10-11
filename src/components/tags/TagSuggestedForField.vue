<template>
  <div>
    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
      Sugerir para
      <span class="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
    </label>
    <div
      class="max-h-40 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700"
    >
      <div
        v-for="dept in departments"
        :key="dept.id"
        class="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <Checkbox v-model="selectedIds" :value="dept.id">
          {{ dept.name }}
        </Checkbox>
      </div>
      <p v-if="!departments.length" class="px-3 py-3 text-xs text-gray-400 text-left">
        Nenhum setor cadastrado
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '@/components/common/Checkbox.vue';
import type { Department } from '@/models';

const props = defineProps<{
  modelValue: number[];
  departments: Department[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number[]];
}>();

const selectedIds = computed({
  get: () => props.modelValue,
  set: (value: number[]) => emit('update:modelValue', value),
});
</script>
