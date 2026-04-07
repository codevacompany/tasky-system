<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Iniciar Verificação"
    @close="$emit('cancel')"
  >
    <div class="px-4 sm:px-6 py-6 sm:py-8 text-center">
      <div class="text-3xl text-blue-700 dark:text-blue-400 mb-4">
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
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="$emit('confirm')"
          :disabled="isVerifying"
        >
          <font-awesome-icon v-if="isVerifying" icon="spinner" spin class="text-sm" />
          {{ isVerifying ? '' : 'Verificar Agora' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../../common/BaseModal.vue';

defineProps<{
  isOpen: boolean;
  isVerifying: boolean;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script>

