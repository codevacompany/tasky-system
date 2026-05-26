<template>
  <Teleport to="body">
    <div
      :class="[
        'fixed inset-0 flex items-center justify-center z-[1000]',
        blurBackdrop
          ? 'bg-black/50 backdrop-blur-sm'
          : 'bg-black/50',
      ]"
      id="newTicketModal"
      @click.self="closeOnClickOutside ? close() : null"
    >
      <LoadingSpinner v-if="isLoading" :size="50" :color="'white'" />
      <div
        v-else
        :class="[
          'bg-white dark:bg-gray-800 shadow-lg flex flex-col overflow-hidden animate-modalSlideIn',
          // Rounded corners - always except when full screen mobile
          isFullScreenMobile ? '' : 'rounded-md',
          // Margins - only when not full screen mobile
          isFullScreenMobile ? '' : 'mx-4',
          // Mobile sizing - conditional, with configurable fixed desktop width when using full-screen mobile mode
          isFullScreenMobile
            ? `w-full h-full ${desktopWidthClass || 'sm:w-[780px] sm:h-auto'}`
            : 'min-w-[95vw] max-h-[calc(90vh-100px)]',
          // Desktop defaults: rounded, height + horizontal margin
          'sm:rounded-md sm:min-w-[500px] sm:max-h-[94vh] sm:mx-4',
        ]"
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
            <Button
              v-if="showCancelButton"
              variant="outlined"
              type="button"
              class="w-full sm:w-auto"
              @click="handleCancel"
              :disabled="confirmButtonLoading"
            >
              {{ cancelButtonText }}
            </Button>
            <Button
              v-if="showConfirmButton"
              ref="confirmButtonRef"
              variant="primary"
              type="button"
              class="w-full sm:w-auto"
              @click="handleConfirm"
              :disabled="confirmButtonLoading"
              :style="confirmButtonMinWidth"
            >
              <LoadingSpinner v-if="confirmButtonLoading" :size="16" />
              <span ref="confirmTextRef" v-if="!confirmButtonLoading">{{ confirmButtonText }}</span>
            </Button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import Button from './Button.vue';

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
  isFullScreenMobile: { type: Boolean, default: false },
  /** When true, backdrop uses blur (e.g. backdrop-blur-sm) like WelcomeModal */
  blurBackdrop: { type: Boolean, default: false },
  // Optional Tailwind classes to control desktop width when isFullScreenMobile is true
  desktopWidthClass: { type: String, default: '' },
});

const emit = defineEmits(['close', 'cancel', 'confirm']);

const confirmButtonRef = ref<ComponentPublicInstance | null>(null);
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
  const btnEl = confirmButtonRef.value?.$el as HTMLElement | undefined;
  if (confirmTextRef.value && btnEl) {
    const textWidth = confirmTextRef.value.offsetWidth;
    const buttonPadding = 32; // horizontal padding estimate
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
