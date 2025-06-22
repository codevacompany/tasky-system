<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      id="newTicketModal"
      @click.self="close"
    >
      <LoadingSpinner v-if="isLoading" :size="50" :color="'white'" />
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-md shadow-lg min-w-[95vw] sm:min-w-[500px] flex flex-col overflow-hidden animate-modalSlideIn mx-4"
      >
        <div v-if="hasCustomHeader">
          <slot name="custom-header"></slot>
        </div>

        <div
          v-else
          class="primary-gradient flex items-center justify-between p-3 sm:p-4 text-white"
        >
          <slot name="header">
            <h2 class="text-base sm:text-lg font-semibold">{{ title }}</h2>
          </slot>
          <button
            class="bg-transparent border-none text-white opacity-80 text-lg sm:text-xl cursor-pointer p-1 sm:p-2 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
            @click="close"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <div
          class="p-3 sm:p-6 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)] sm:max-h-[95vh]"
        >
          <slot></slot>
        </div>
        <div
          v-if="showFooter"
          class="p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700"
        >
          <slot name="footer">
            <button
              v-if="showCancelButton"
              type="button"
              class="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              @click="handleCancel"
            >
              {{ cancelButtonText }}
            </button>
            <button
              v-if="showConfirmButton"
              type="button"
              class="w-full sm:w-auto px-4 py-2 primary-gradient hover:opacity-95 text-white rounded transition-colors"
              @click="handleConfirm"
            >
              {{ confirmButtonText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
  isOpen: Boolean,
  title: { type: String, default: 'Modal Title' },
  isLoading: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: true },
  showCancelButton: { type: Boolean, default: true },
  showConfirmButton: { type: Boolean, default: true },
  cancelButtonText: { type: String, default: 'Cancelar' },
  confirmButtonText: { type: String, default: 'Confirmar' },
  hasCustomHeader: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'cancel', 'confirm']);

const close = () => {
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
  close();
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style>
@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-modalSlideIn {
  animation: modalSlideIn 0.3s ease;
}

/* Add a primary gradient class for consistent headers */
.primary-gradient {
  background: linear-gradient(135deg, #00143b 0%, #142046 100%);
}
</style>
