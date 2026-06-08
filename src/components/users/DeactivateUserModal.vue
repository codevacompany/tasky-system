<template>
  <BaseModal
    title="Desativar Colaborador"
    :showFooter="true"
    @close="handleCancel"
  >
    <div class="p-4 sm:p-6 space-y-5">
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed m-0">
        Ao desativar
        <strong class="text-gray-900 dark:text-white">
          {{ user.firstName }} {{ user.lastName }}
        </strong>,
        as tarefas em aberto precisam ser redirecionadas.
      </p>

      <div
        v-if="preview.requiresTargetUserSelection"
        class="space-y-2"
      >
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Novo responsável pelas tarefas
          <span class="font-normal text-gray-500 dark:text-gray-400">
            ({{ preview.targetUserTicketCount }}
            {{ preview.targetUserTicketCount === 1 ? 'tarefa' : 'tarefas' }})
          </span>
        </label>
        <Select
          v-model="selectedTargetUserId"
          :options="targetUserOptions"
          placeholder="Selecione o novo responsável"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
          {{
            preview.useTenantAdminsForTargetUser
              ? 'Não há outros colaboradores no setor. Selecione um administrador.'
              : 'Selecione um colaborador do mesmo setor.'
          }}
        </p>
      </div>

      <div
        v-if="preview.reviewerTicketCount > 0"
        class="space-y-2"
      >
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Novo revisor das tarefas
          <span class="font-normal text-gray-500 dark:text-gray-400">
            ({{ preview.reviewerTicketCount }}
            {{ preview.reviewerTicketCount === 1 ? 'tarefa' : 'tarefas' }})
          </span>
        </label>

        <div
          v-if="preview.departmentSupervisor"
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4"
        >
          <div class="flex gap-3">
            <font-awesome-icon icon="info-circle" class="text-blue-500 mt-0.5 shrink-0" />
            <p class="text-sm text-blue-800 dark:text-blue-200 m-0 leading-relaxed">
              O supervisor do setor,
              <strong>
                {{ preview.departmentSupervisor.firstName }}
                {{ preview.departmentSupervisor.lastName }}
              </strong>,
              será definido automaticamente como novo revisor.
            </p>
          </div>
        </div>

        <template v-else>
          <Select
            v-model="selectedReviewerId"
            :options="reviewerOptions"
            placeholder="Selecione o novo revisor"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
            Não há supervisor no setor. Selecione um administrador.
          </p>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          variant="outlined"
          type="button"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancelar
        </Button>
        <Button
          variant="secondary"
          type="button"
          class="min-w-[120px]"
          @click="handleConfirm"
          :disabled="!canConfirm || isSubmitting"
        >
          <LoadingSpinner v-if="isSubmitting" :size="16" />
          <span v-if="!isSubmitting">Desativar</span>
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import Button from '@/components/common/Button.vue';
import Select from '@/components/common/Select.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import type { User, UserDeactivationPreview } from '@/models';

const props = defineProps<{
  user: User;
  preview: UserDeactivationPreview;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm', data: { newTargetUserId?: number; newReviewerId?: number }): void;
  (e: 'cancel'): void;
}>();

const selectedTargetUserId = ref('');
const selectedReviewerId = ref('');

const toSelectOptions = (users: User[]) =>
  users.map((user) => ({
    value: user.id.toString(),
    label: `${user.firstName} ${user.lastName}`,
  }));

const targetUserOptions = computed(() => toSelectOptions(props.preview.targetUserOptions));
const reviewerOptions = computed(() => toSelectOptions(props.preview.reviewerOptions));

const canConfirm = computed(() => {
  if (props.preview.requiresTargetUserSelection && !selectedTargetUserId.value) {
    return false;
  }

  if (props.preview.requiresReviewerSelection && !selectedReviewerId.value) {
    return false;
  }

  return true;
});

const handleConfirm = () => {
  if (!canConfirm.value) return;

  emit('confirm', {
    ...(selectedTargetUserId.value
      ? { newTargetUserId: Number(selectedTargetUserId.value) }
      : {}),
    ...(selectedReviewerId.value ? { newReviewerId: Number(selectedReviewerId.value) } : {}),
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script>
