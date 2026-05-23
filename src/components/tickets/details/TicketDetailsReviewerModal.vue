<template>
  <BaseModal
    v-if="showReviewerModal"
    title="Selecione o Revisor"
    :showFooter="true"
    @close="closeReviewerModal"
  >
    <div class="p-4">
      <Select
        v-model="reviewerSelection"
        :options="reviewerOptions"
        placeholder="Selecione o revisor"
      />
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="closeReviewerModal"
          :disabled="isReviewerModalLoading"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          @click="confirmReviewerSelection"
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
import BaseModal from '@/components/common/BaseModal.vue';
import Select from '@/components/common/Select.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';

const { ctx, assignees } = useTicketDetailsInjected();

const { reviewerOptions, closeReviewerModal, confirmReviewerSelection } = assignees;

const showReviewerModal = computed({
  get: () => ctx.showReviewerModal.value,
  set: (value) => {
    ctx.showReviewerModal.value = value;
  },
});

const reviewerSelection = computed({
  get: () => ctx.reviewerSelection.value,
  set: (value) => {
    ctx.reviewerSelection.value = value;
  },
});

const isReviewerModalLoading = computed(() => ctx.isReviewerModalLoading.value);
</script>
