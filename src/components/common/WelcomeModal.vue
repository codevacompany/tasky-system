<template>
  <BaseModal
    v-if="isOpen"
    :is-open="isOpen"
    @close="close"
    :show-footer="false"
    :is-full-screen-mobile="true"
    :title="isReturningUser ? 'Atualização dos Termos' : 'Bem-vindo ao Tasky Pro!'"
    :closeOnClickOutside="termsAccepted && privacyPolicyAccepted"
  >
    <div class="flex flex-col items-center text-center px-4 sm:px-6 py-6 pb-8">
      <div class="w-full max-w-[200px] sm:max-w-[240px] flex items-center justify-center mb-5">
        <img
          src="@/assets/images/landing/management-drawing.png"
          alt="Task Management"
          class="w-full h-auto"
        />
      </div>

      <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-txt-primary dark:text-white px-2">
        <template v-if="isReturningUser"> Atualização dos Termos de Uso </template>
        <template v-else> Bem-vindo ao Tasky Pro! </template>
      </h2>

      <p
        v-if="isReturningUser"
        class="text-sm sm:text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
      >
        Nossos Termos de Uso e Política de Privacidade foram atualizados. Para continuar utilizando
        o Tasky Pro, é necessário aceitar os novos termos.
      </p>
      <template v-else>
        <p
          v-if="isTenantAdmin"
          class="text-sm sm:text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
        >
          Vamos começar! Você e sua equipe podem usar o Tasky Pro gratuitamente por 14 dias. Explore
          nosso guia ou comece agora mesmo a organizar suas tarefas.
        </p>
        <p
          v-else
          class="text-sm sm:text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
        >
          Explore nosso guia para conhecer todas as funcionalidades ou comece agora mesmo a
          organizar suas tarefas e colaborar com sua equipe.
        </p>
      </template>

      <!-- Terms Acceptance Section -->
      <div class="w-full max-w-[400px] mb-5 text-left px-2 sm:px-0">
        <div class="mb-4">
          <label class="flex items-start gap-4 cursor-pointer">
            <input
              v-model="termsAccepted"
              type="checkbox"
              class="mt-1 w-5 h-5 flex-shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 leading-tight pt-0.5">
              Concordo com os
              <a
                href="https://taskypro.com.br/termos-de-uso.html"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >Termos de Uso</a
              >
              do Tasky Pro
            </span>
          </label>
        </div>
        <div>
          <label class="flex items-start gap-4 cursor-pointer">
            <input
              v-model="privacyPolicyAccepted"
              type="checkbox"
              class="mt-1 w-5 h-5 flex-shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 leading-tight pt-0.5">
              Concordo com a
              <a
                href="https://taskypro.com.br/politica-de-privacidade.html"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >Política de Privacidade</a
              >
              do Tasky Pro
            </span>
          </label>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto px-2 sm:px-0"
        :class="{ 'sm:justify-center': isReturningUser }"
      >
        <button
          :disabled="!termsAccepted || !privacyPolicyAccepted"
          :class="[
            'px-6 py-3.5 rounded-md font-medium cursor-pointer transition-all duration-200 w-full sm:w-auto',
            termsAccepted && privacyPolicyAccepted
              ? isReturningUser
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-txt-primary dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-700 cursor-not-allowed',
          ]"
          @click="handleAccept"
        >
          {{ isReturningUser ? 'Continuar' : 'Começar Agora' }}
        </button>
        <button
          v-if="!isReturningUser"
          :disabled="!termsAccepted || !privacyPolicyAccepted"
          :class="[
            'px-6 py-3.5 rounded-md font-medium cursor-pointer transition-all duration-200 w-full sm:w-auto',
            termsAccepted && privacyPolicyAccepted
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-700 cursor-not-allowed',
          ]"
          @click="handleAcceptAndOpenGuide"
        >
          Abrir Guia do Tasky
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoles } from '@/composables/useRoles';
import { userService } from '@/services/userService';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import BaseModal from './BaseModal.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'openGuide']);

const userStore = useUserStore();
const router = useRouter();
const { isTenantAdmin } = useRoles();

const termsAccepted = ref(false);
const privacyPolicyAccepted = ref(false);
const isSubmitting = ref(false);

const isReturningUser = computed(() => {
  return (userStore.user?.loginCount ?? 0) > 1;
});

const handleAccept = async () => {
  if (!termsAccepted.value || !privacyPolicyAccepted.value || isSubmitting.value) {
    return;
  }

  try {
    isSubmitting.value = true;
    await userService.acceptTerms({
      termsAccepted: termsAccepted.value,
      privacyPolicyAccepted: privacyPolicyAccepted.value,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
    });

    // Refresh user data
    await userStore.whoami();

    emit('close');
  } catch (error: any) {
    console.error('Error accepting terms:', error);
    toast.error(error?.response?.data?.message || 'Erro ao aceitar termos. Tente novamente.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleAcceptAndOpenGuide = async () => {
  if (!termsAccepted.value || !privacyPolicyAccepted.value || isSubmitting.value) {
    return;
  }

  try {
    isSubmitting.value = true;
    await userService.acceptTerms({
      termsAccepted: termsAccepted.value,
      privacyPolicyAccepted: privacyPolicyAccepted.value,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
    });

    // Refresh user data
    await userStore.whoami();

    emit('openGuide');
    emit('close');
    router.push('/faq');
  } catch (error: any) {
    console.error('Error accepting terms:', error);
    toast.error(error?.response?.data?.message || 'Erro ao aceitar termos. Tente novamente.');
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  if (termsAccepted.value && privacyPolicyAccepted.value) {
    emit('close');
  }
};
</script>

<style scoped>
/* Custom animations for better compatibility */
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
