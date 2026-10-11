<template>
  <div>
    <div class="flex items-center gap-1.5 mb-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
        Sugerir para
        <span class="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
      </label>
      <InfoTooltip
        :message="suggestedForTooltip"
        width="280px"
        position="right"
      />
    </div>
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
import InfoTooltip from '@/components/common/InfoTooltip.vue';
import type { Department } from '@/models';

const suggestedForTooltip =
  'Controla em quais setores a tag aparece na seção Sugeridas. Em branco: não é sugerida a ninguém e fica apenas em Todas as tags. Com setores marcados: entra em Sugeridas quando a tarefa envolve esses setores.';

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
