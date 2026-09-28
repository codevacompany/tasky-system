<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gray-50">
    <!-- Left Section - Form -->
    <div
      class="flex-1 lg:flex-2 bg-white flex flex-col items-center px-4 pt-8 pb-8 lg:px-8 lg:pt-10 lg:pb-10 shadow-lg lg:shadow-2xl"
    >
      <img
        src="@/assets/images/tasky-pro-black.png"
        alt="Tasky Pro"
        class="w-16 xl:w-[115px] shrink-0 mt-2 mb-9"
      />
      <div class="w-full max-w-md lg:max-w-lg flex-1 flex flex-col justify-center min-h-0">
        <div class="w-full max-w-md lg:max-w-lg space-y-6">
          <div class="text-center lg:text-left">
            <h2 class="text-primary text-sm lg:text-[15.5px] font-semibold mb-1 xl:mb-3">
              Comece seus 14 dias de teste gratuito hoje.
            </h2>
            <h1 class="text-xl lg:text-2xl font-bold text-txt-primary">Complete seu cadastro</h1>
            <p class="text-sm text-gray-600 mt-2">
              Estamos quase lá! Defina o prefixo da empresa e sua senha para acessar o sistema.
            </p>
          </div>

          <form @submit.prevent="completeRegistration" class="space-y-4 lg:space-y-5">
            <div>
              <Input
                id="customKey"
                v-model="customKey"
                type="text"
                required
                maxlength="3"
                minlength="2"
                placeholder="Prefixo da empresa (Ex: TS)"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[5px] bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm lg:text-base"
                @input="handlePrefixInput"
              />
              <p class="text-xs text-gray-500 mt-1.5">
                Usado no ID dos tickets, ex: {{ prefixExample }}
              </p>
            </div>

            <div>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="Senha"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[5px] bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm lg:text-base"
                @input="validatePassword"
              />
              <div v-if="password" class="mt-2">
                <div class="h-1 bg-gray-200 rounded overflow-hidden">
                  <div
                    class="h-full rounded transition-all duration-300"
                    :style="{ width: passwordStrength + '%' }"
                    :class="strengthBarClass"
                  />
                </div>
                <span class="text-xs mt-1 inline-block" :class="strengthTextClass">
                  {{ strengthText }}
                </span>
              </div>
            </div>

            <div>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                required
                placeholder="Confirme a senha"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[5px] bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm lg:text-base"
                @input="validatePasswordMatch"
              />
              <span
                v-if="!passwordsMatch && confirmPassword"
                class="text-red-600 text-xs lg:text-sm mt-1 block"
              >
                As senhas não conferem
              </span>
            </div>

            <div class="mt-6">
              <Button
                type="submit"
                variant="secondary"
                :disabled="isLoading || !isFormValid"
                class="w-full py-2.5 text-sm font-semibold lg:py-3 lg:text-base"
              >
                <LoadingSpinner v-if="isLoading" :size="22" />
                <span v-else>Finalizar cadastro</span>
              </Button>
            </div>
          </form>

          <div class="text-center mt-4 mb-8 lg:mb-12">
            <p class="text-sm text-gray-600">
              Já tem uma conta?
              <router-link
                to="/login"
                class="text-gray-700 hover:text-gray-800 hover:underline transition-colors font-medium"
              >
                Ir para login
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden lg:flex flex-1 lg:flex-2 bg-cover bg-center relative flex items-center justify-center p-6 lg:p-12 order-first lg:order-last min-h-64 lg:min-h-screen"
      :style="{ backgroundImage: `url(${teamSuccessPhoto})` }"
    >
      <div class="absolute inset-0 bg-[#000814]/80"></div>

      <div class="relative z-10 text-center max-w-2xl px-4">
        <h2 class="text-[38px] font-bold text-white mb-6 leading-tight">
          Transforme a gestão da sua equipe <span class="gradient-text">ainda hoje.</span>
        </h2>
        <p class="text-[18px] text-gray-300 font-medium leading-relaxed">
          Junte-se a mais de 50 empresas que escalaram seus resultados organizando tarefas e prazos
          em um só lugar.
        </p>
      </div>
    </div>

    <a
      href="https://taskypro.com.br/"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-10 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold text-sm lg:text-base transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </a>
  </div>

  <a
    href="https://api.whatsapp.com/send/?phone=5511999619803&text=Ol%C3%A1%21+Gostaria+de+tirar+algumas+d%C3%BAvidas.&type=phone_number&app_absent=0"
    target="_blank"
    class="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-20 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
  >
    <svg class="w-6 h-6 lg:w-8 lg:h-8 fill-white" viewBox="0 0 308 308">
      <path
        d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
      />
      <path
        d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
      />
    </svg>

    <div
      class="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs lg:text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none"
    >
      Fale conosco no WhatsApp
      <div
        class="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"
      ></div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Button from '@/components/common/Button.vue';
import { signupService } from '@/services/signupService';
import Input from '@/components/common/Input.vue';
import teamSuccessPhoto from '@/assets/images/team_success_photo.png';

const router = useRouter();
const route = useRoute();
const token = computed(() => route.params.token as string);

const customKey = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const passwordStrength = ref(0);
const passwordsMatch = ref(true);

const prefixExample = computed(() => {
  if (!customKey.value) return 'TS-001';
  return `${customKey.value.toUpperCase()}-001`;
});

const handlePrefixInput = () => {
  customKey.value = customKey.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
};

const validatePassword = () => {
  let strength = 0;
  const pwd = password.value;

  if (pwd.length >= 8) strength += 25;
  if (pwd.match(/[A-Z]/)) strength += 25;
  if (pwd.match(/[0-9]/)) strength += 25;
  if (pwd.match(/[^A-Za-z0-9]/)) strength += 25;

  passwordStrength.value = strength;
  validatePasswordMatch();
};

const validatePasswordMatch = () => {
  if (confirmPassword.value) {
    passwordsMatch.value = password.value === confirmPassword.value;
  }
};

const strengthBarClass = computed(() => {
  if (passwordStrength.value < 50) return 'bg-red-500';
  if (passwordStrength.value < 75) return 'bg-amber-400';
  return 'bg-green-500';
});

const strengthTextClass = computed(() => {
  if (passwordStrength.value < 50) return 'text-red-600';
  if (passwordStrength.value < 75) return 'text-amber-600';
  return 'text-green-600';
});

const strengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Fraca';
  if (passwordStrength.value < 75) return 'Média';
  return 'Forte';
});

const isFormValid = computed(() => {
  return (
    customKey.value.length >= 2 &&
    password.value.length >= 8 &&
    passwordsMatch.value &&
    confirmPassword.value
  );
});

const completeRegistration = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  try {
    await signupService.completeRegistration(token.value, {
      customKey: customKey.value,
      password: password.value,
    });

    toast.success('Cadastro finalizado com sucesso');
    router.push('/');
  } catch (error) {
    console.error('Error completing registration:', error);
    toast.error('Ocorreu um erro ao finalizar o cadastro. Por favor, tente novamente.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Force light theme — match SignUpPage */
:deep(.bg-white) {
  background-color: #ffffff !important;
}

:deep(.bg-gray-50) {
  background-color: #f9fafb !important;
}

:deep(.text-txt-primary) {
  color: #1f2937 !important;
}

:deep(.text-primary) {
  color: var(--primary-color, #4263eb) !important;
}

:deep(input) {
  background-color: #f9fafb !important;
  color: #1f2937 !important;
  border-color: #d1d5db !important;
}

:deep(input::placeholder) {
  color: #6b7280 !important;
}

:deep(.bg-green-500) {
  background-color: #22c55e !important;
}

:deep(.hover\:bg-green-600:hover) {
  background-color: #16a34a !important;
}

.gradient-text {
  background: linear-gradient(135deg, #4263eb 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
