<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    :show-footer="true"
    title="Selecione o Revisor"
    @close="$emit('cancel')"
  >
    <div class="p-4">
      <Select
        v-model="selectionProxy"
        :options="reviewerOptions"
        placeholder="Selecione o revisor"
      />
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('cancel')"
          :disabled="isReviewerModalLoading"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          @click="$emit('confirm')"
          :disabled="isReviewerModalLoading"
        >
          <LoadingSpinner v-if="isReviewerModalLoading" :size="16" />
          <span v-if="!isReviewerModalLoading">Confirmar</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '../../common/BaseModal.vue';
import Select from '../../common/Select.vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';

const props = defineProps<{
  isOpen: boolean;
  reviewerOptions: Array<{ value: any; label: string }>;
  reviewerSelection: string;
  isReviewerModalLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:reviewerSelection', value: string): void;
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

const selectionProxy = computed({
  get: () => props.reviewerSelection,
  set: (value: string) => emit('update:reviewerSelection', value),
});
</script>

