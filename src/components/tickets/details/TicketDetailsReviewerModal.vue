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
        <Button variant="outlined" type="button" @click="closeReviewerModal" :disabled="isReviewerModalLoading">
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="button"
          class="min-w-[100px]"
          @click="confirmReviewerSelection"
          :disabled="isReviewerModalLoading"
        >
          <LoadingSpinner v-if="isReviewerModalLoading" :size="16" />
          <span v-if="!isReviewerModalLoading">Confirmar</span>
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import Button from '@/components/common/Button.vue';
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
