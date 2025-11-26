<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] animate-in fade-in duration-300"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-[90%] max-w-[550px] relative animate-in slide-in-from-bottom-4 duration-400"
    >
      <div
        class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
        @click="close"
      >
        <font-awesome-icon icon="times" />
      </div>

      <div class="flex flex-col items-center text-center px-6 py-6 pb-10">
        <div class="w-[280px] h-[280px] flex items-center justify-center mb-6">
          <img
            src="@/assets/images/landing/business-upgrade.jpg"
            alt="Upgrade de plano"
            class="w-full h-auto rounded-lg"
          />
        </div>

        <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Assine um plano para usar o Tasky Pro
        </h2>

        <p class="text-base leading-6 mb-6 max-w-[460px] text-gray-700 dark:text-gray-300">
          Seu período de teste terminou. Para continuar usando o Tasky Pro com sua equipe, você precisa assinar um dos planos
          disponíveis.
        </p>

        <div class="flex gap-4 mt-2">
          <button
            class="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer transition-all duration-200"
            @click="close"
          >
            Escolher plano agora
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

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


