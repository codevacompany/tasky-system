<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      id="newTicketModal"
      @click.self="closeOnClickOutside ? close() : null"
    >
      <LoadingSpinner v-if="isLoading" :size="50" :color="'white'" />
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-md shadow-lg min-w-[95vw] sm:min-w-[500px] max-h-[calc(90vh-100px)] sm:max-h-[94vh] flex flex-col overflow-hidden animate-modalSlideIn mx-4"
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

        <div class="p-3 sm:p-6 overflow-y-auto overflow-x-hidden">
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
              class="w-full sm:w-auto px-4 py-2 btn bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleCancel"
              :disabled="confirmButtonLoading"
            >
              {{ cancelButtonText }}
            </button>
            <button
              v-if="showConfirmButton"
              ref="confirmButtonRef"
              type="button"
              class="w-full sm:w-auto px-4 py-2 btn btn-primary hover:opacity-95 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              @click="handleConfirm"
              :disabled="confirmButtonLoading"
              :style="confirmButtonMinWidth"
            >
              <LoadingSpinner v-if="confirmButtonLoading" :size="16" />
              <span ref="confirmTextRef" v-if="!confirmButtonLoading">{{ confirmButtonText }}</span>
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
  title: { type: String, default: 'Ação Necessária' },
  isLoading: { type: Boolean, default: false },
  confirmButtonLoading: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: true },
  showCancelButton: { type: Boolean, default: true },
  showConfirmButton: { type: Boolean, default: true },
  cancelButtonText: { type: String, default: 'Cancelar' },
  confirmButtonText: { type: String, default: 'Confirmar' },
  hasCustomHeader: { type: Boolean, default: false },
  closeOnClickOutside: { type: Boolean, default: true },
});

const emit = defineEmits(['close', 'cancel', 'confirm']);

const confirmButtonRef = ref<HTMLButtonElement | null>(null);
const confirmTextRef = ref<HTMLSpanElement | null>(null);
const buttonMinWidth = ref<number | null>(null);

const confirmButtonMinWidth = computed(() => {
  if (props.confirmButtonLoading && buttonMinWidth.value) {
    return { minWidth: `${buttonMinWidth.value}px` };
  }
  return {};
});

const measureButtonWidth = async () => {
  await nextTick();
  if (confirmTextRef.value && confirmButtonRef.value) {
    const textWidth = confirmTextRef.value.offsetWidth;
    const buttonPadding = 32; // px-4 (16px * 2)
    buttonMinWidth.value = textWidth + buttonPadding;
  }
};

onMounted(() => {
  if (props.showConfirmButton && !props.confirmButtonLoading) {
    measureButtonWidth();
  }
});

watch(
  () => [props.confirmButtonText, props.confirmButtonLoading],
  async () => {
    if (!props.confirmButtonLoading) {
      await nextTick();
      measureButtonWidth();
    }
  },
);

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
