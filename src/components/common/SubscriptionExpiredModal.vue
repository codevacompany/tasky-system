<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    @close="close"
    :show-footer="false"
    :is-full-screen-mobile="true"
    title="Assinatura Necessária"
  >
    <div class="flex flex-col items-center text-center px-4 sm:px-6 py-6 pb-10">
      <div class="w-full max-w-[280px] aspect-square flex items-center justify-center mb-6">
        <img
          src="@/assets/images/landing/business-upgrade.jpg"
          alt="Upgrade de plano"
          class="w-full h-auto"
        />
      </div>

      <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-txt-primary dark:text-white px-2">
        Assine um plano para usar o Tasky Pro
      </h2>

      <p class="text-sm sm:text-base leading-6 mb-6 max-w-[460px] text-gray-700 dark:text-gray-300">
        Seu período de teste terminou. Para continuar usando o Tasky Pro com sua equipe, você
        precisa assinar um dos planos disponíveis.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto px-4 sm:px-0">
        <button
          class="w-full sm:w-auto px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer transition-all duration-200"
          @click="close"
        >
          Escolher plano agora
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

.slide-in-from-bottom-4 {
  animation: slideUp 0.4s ease;
}
</style>
