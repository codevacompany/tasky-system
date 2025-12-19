<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] animate-in fade-in duration-300"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-[90%] max-w-[550px] max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-4 duration-400 mx-auto"
        @click.stop
      >
        <!-- Close button - disabled if terms not accepted -->
        <div
          v-if="termsAccepted && privacyPolicyAccepted"
          class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
          @click="close"
        >
          <font-awesome-icon icon="times" />
        </div>
        <div
          v-else
          class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-600 cursor-not-allowed"
        >
          <font-awesome-icon icon="times" />
        </div>

        <div class="flex flex-col items-center text-center px-6 py-6 pb-8">
          <div class="w-[240px] flex items-center justify-center mb-5">
            <img
              src="@/assets/images/landing/management-drawing.png"
              alt="Task Management"
              class="w-full h-auto"
            />
          </div>

          <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            <template v-if="isReturningUser"> Atualização dos Termos de Uso </template>
            <template v-else> Bem-vindo ao Tasky Pro! </template>
          </h2>

          <p
            v-if="isReturningUser"
            class="text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
          >
            Nossos Termos de Uso e Política de Privacidade foram atualizados. Para continuar
            utilizando o Tasky Pro, é necessário aceitar os novos termos.
          </p>
          <template v-else>
            <p
              v-if="isTenantAdmin"
              class="text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
            >
              Vamos começar! Você e sua equipe podem usar o Tasky Pro gratuitamente por 14 dias.
              Explore nosso guia ou comece agora mesmo a organizar suas tarefas.
            </p>
            <p
              v-else
              class="text-base leading-6 mb-5 max-w-[450px] text-gray-700 dark:text-gray-300"
            >
              Explore nosso guia para conhecer todas as funcionalidades ou comece agora mesmo a
              organizar suas tarefas e colaborar com sua equipe.
            </p>
          </template>

          <!-- Terms Acceptance Section -->
          <div class="w-full max-w-[450px] mb-5 text-left ml-8">
            <div class="mb-4">
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="termsAccepted"
                  type="checkbox"
                  class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
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
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="privacyPolicyAccepted"
                  type="checkbox"
                  class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
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

          <div class="flex gap-4 mt-2" :class="{ 'justify-center': isReturningUser }">
            <button
              :disabled="!termsAccepted || !privacyPolicyAccepted"
              :class="[
                'px-6 py-3 rounded-md font-medium cursor-pointer transition-all duration-200',
                termsAccepted && privacyPolicyAccepted
                  ? isReturningUser
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-700 cursor-not-allowed',
              ]"
              @click="handleAccept"
            >
              {{ isReturningUser ? 'Continuar' : 'Começar' }}
            </button>
            <button
              v-if="!isReturningUser"
              :disabled="!termsAccepted || !privacyPolicyAccepted"
              :class="[
                'px-6 py-3 rounded-md font-medium cursor-pointer transition-all duration-200',
                termsAccepted && privacyPolicyAccepted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-700 cursor-not-allowed',
              ]"
              @click="handleAcceptAndOpenGuide"
            >
              Abrir Guia
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoles } from '@/composables/useRoles';
import { userService } from '@/services/userService';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

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
