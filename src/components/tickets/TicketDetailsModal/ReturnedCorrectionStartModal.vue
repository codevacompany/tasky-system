<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Iniciar Correção"
    @close="$emit('cancel')"
  >
    <div class="px-4 sm:px-6 py-6 sm:pb-7 text-center">
      <div class="text-3xl text-blue-700 dark:text-blue-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>

      <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-3">
        Inicie a correção
      </h3>

      <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-2">
        Esta tarefa foi devolvida para correção. Para visualizar os detalhes, é necessário iniciar a
        correção.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('cancel')"
          :disabled="isStartingCorrection"
        >
          Cancelar
        </button>
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="$emit('confirm')"
          :disabled="isStartingCorrection"
        >
          <font-awesome-icon v-if="isStartingCorrection" icon="spinner" spin class="text-sm" />
          {{ isStartingCorrection ? '' : 'Iniciar Correção Agora' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../../common/BaseModal.vue';

defineProps<{
  isOpen: boolean;
  isStartingCorrection: boolean;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script>

