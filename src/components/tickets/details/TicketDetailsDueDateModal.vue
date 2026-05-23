<template>
  <BaseModal
    v-if="showDueDateModal"
    title="Definir Prazo de Conclusão"
    :showFooter="true"
    @close="handleDueDateCancel"
  >
    <div class="p-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Esta tarefa não possui um prazo definido. Para aceitar a tarefa, defina uma data estimada de
        conclusão:
      </p>
      <div class="flex flex-col gap-2">
        <label for="dueDate" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Data de Conclusão:
        </label>
        <div class="w-full">
          <DatePicker
            :value="dueDateValue"
            type="datetime"
            format="DD/MM/YYYY HH:mm"
            value-type="format"
            :lang="pt"
            placeholder="Selecione data e hora"
            :clearable="true"
            :editable="false"
            :disabled-date="disabledWeekendDate"
            @change="handleDatePickerChange"
            input-class="w-full px-[14px] py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800"
            placeholder-class="text-gray-500 dark:text-gray-400"
            :time-picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45',
            }"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleDueDateCancel"
          :disabled="isDueDateModalLoading"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          @click="confirmDueDate"
          :disabled="!dueDateValue || isDueDateModalLoading"
        >
          <LoadingSpinner v-if="isDueDateModalLoading" :size="16" />
          <span v-if="!isDueDateModalLoading">Confirmar</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import pt from 'vue-datepicker-next/locale/pt-br.es';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';

const { workflow, dueDate } = useTicketDetailsInjected();

const { handleDueDateCancel } = workflow;
const {
  showDueDateModal,
  dueDateValue,
  isDueDateModalLoading,
  disabledWeekendDate,
  handleDatePickerChange,
  confirmDueDate,
} = dueDate;
</script>

<style scoped>
:deep(.mx-datepicker),
:deep(.mx-input-wrapper) {
  width: 100%;
}
</style>
