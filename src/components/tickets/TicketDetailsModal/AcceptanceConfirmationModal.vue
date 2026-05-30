<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Aceitar Tarefa"
    @close="$emit('cancel')"
  >
    <div class="px-4 sm:px-6 py-6 sm:pb-7 text-center">
      <div class="text-3xl text-blue-700 dark:text-blue-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>

      <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-3">
        Aceite esta tarefa
      </h3>

      <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-2">
        Para visualizar os detalhes desta tarefa, você precisa aceitá-la primeiro.
      </p>
      <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-8">
        Ao aceitar, a tarefa será movida para o status "Em andamento".
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('cancel')"
          :disabled="isAccepting"
        >
          Cancelar
        </button>
        <button
          class="w-full sm:w-auto px-8 py-3.5 sm:py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="$emit('confirm')"
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
import BaseModal from '../../common/BaseModal.vue';

defineProps<{
  isOpen: boolean;
  isAccepting: boolean;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script>

