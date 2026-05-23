<template>
  <BaseModal
    v-if="showVerificationAlert"
    :is-open="showVerificationAlert"
    @close="handleVerificationCancel"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Iniciar Verificação"
  >
    <div class="px-4 sm:px-6 py-6 sm:py-8 text-center">
      <div class="text-3xl text-purple-700 dark:text-purple-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>
      <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-3">
        Deseja iniciar a revisão?
      </h3>
      <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
        Para visualizar os detalhes desta tarefa, você precisa iniciar a verificação agora.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
          @click="handleVerificationCancel"
        >
          Cancelar
        </button>
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleVerificationConfirm"
          :disabled="isVerifying"
        >
          <font-awesome-icon v-if="isVerifying" icon="spinner" spin class="text-sm" />
          {{ isVerifying ? '' : 'Verificar Agora' }}
        </button>
      </div>
    </div>
  </BaseModal>

  <BaseModal
    v-if="showAcceptanceAlert"
    :is-open="showAcceptanceAlert"
    @close="handleAcceptanceCancel"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Aceitar Tarefa"
  >
    <div class="px-4 sm:px-6 py-6 sm:pb-7 text-center">
      <div class="text-3xl text-blue-700 dark:text-blue-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>
      <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-3">Aceite esta tarefa</h3>
      <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-2">
        Para visualizar os detalhes desta tarefa, você precisa aceitá-la primeiro.
      </p>
      <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-8">
        Ao aceitar, a tarefa será movida para o status "Em andamento".
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleAcceptanceCancel"
          :disabled="isAccepting"
        >
          Cancelar
        </button>
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleAcceptanceConfirm"
          :disabled="isAccepting"
        >
          <font-awesome-icon v-if="isAccepting" icon="spinner" spin class="text-sm" />
          {{ isAccepting ? '' : 'Aceitar Agora' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';

const { ctx, workflow } = useTicketDetailsInjected();

const {
  handleVerificationCancel,
  handleVerificationConfirm,
  handleAcceptanceCancel,
  handleAcceptanceConfirm,
} = workflow;

const showVerificationAlert = computed(() => ctx.showVerificationAlert.value);
const showAcceptanceAlert = computed(() => ctx.showAcceptanceAlert.value);
const isVerifying = computed(() => ctx.isVerifying.value);
const isAccepting = computed(() => ctx.isAccepting.value);
</script>
