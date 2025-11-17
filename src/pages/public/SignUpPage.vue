<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gray-50">
    <!-- Left Section - Form -->
    <div
      class="flex-1 lg:flex-2 bg-white flex flex-col justify-center items-center px-4 py-8 lg:px-8 lg:py-0 shadow-lg lg:shadow-2xl relative"
    >
      <!-- Steps Indicator -->
      <div class="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-lg px-1 z-30">
        <ol class="flex items-center justify-between w-full list-none p-0 m-0">
          <li v-for="(s, idx) in steps" :key="s.key" class="flex items-center">
            <!-- Step with label below -->
            <div class="flex flex-col items-center gap-2 min-w-[56px]">
              <div
                :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold',
                  step > idx + 1
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step === idx + 1
                      ? 'border-blue-400 text-blue-600'
                      : 'border-gray-300 text-gray-400',
                ]"
              >
                <font-awesome-icon v-if="step > idx + 1" icon="check" />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span
                class="text-[11px] sm:text-xs font-medium whitespace-nowrap"
                :class="[step >= idx + 1 ? 'text-gray-900' : 'text-gray-400']"
              >
                {{ idx === 0 ? 'Dados da Empresa' : idx === 1 ? 'Responsável' : 'Concluir' }}
              </span>
            </div>

            <!-- Connector -->
            <div v-if="idx < steps.length - 1" class="mx-3 w-12 sm:w-20 md:w-28">
              <div
                :class="['h-0.5 w-full rounded', step > idx + 1 ? 'bg-blue-600' : 'bg-gray-200']"
              ></div>
            </div>
          </li>
        </ol>
      </div>

      <div class="w-full max-w-md lg:max-w-lg mt-8 lg:mt-10 h-[70%] flex items-center">
        <div class="w-full max-w-md lg:max-w-lg space-y-6">
          <div class="text-center lg:text-left">
            <h2 v-if="step === 1" class="text-blue-600 text-sm lg:text-base font-semibold mb-2">
              Vamos começar!
            </h2>
            <h2
              v-else-if="step === 2"
              class="text-blue-600 text-sm lg:text-base font-semibold mb-2"
            >
              Estamos quase lá
            </h2>

            <h1 v-if="step === 1" class="text-xl lg:text-2xl font-bold text-gray-900">
              Informações da empresa
            </h1>
            <h1 v-else-if="step === 2" class="text-xl lg:text-2xl font-bold text-gray-900">
              Informações do Responsável
            </h1>
          </div>

          <!-- Step 1 Form -->
          <form v-if="step === 1" @submit.prevent="nextStep" class="space-y-4 lg:space-y-5">
            <div>
              <Input
                v-model="form.companyName"
                type="text"
                required
                placeholder="Nome da empresa"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  v-model="form.cnpj"
                  type="text"
                  required
                  maxlength="18"
                  placeholder="CNPJ (12.345.678/0001-99)"
                  @input="form.cnpj = maskCNPJ(form.cnpj)"
                  @blur="cnpjTouched = true"
                  class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
                />
                <span
                  v-if="cnpjTouched && cnpjError"
                  class="text-red-600 text-xs lg:text-sm mt-1 block"
                >
                  {{ cnpjError }}
                </span>
              </div>
              <div>
                <Input
                  v-model="form.companyPhone"
                  type="tel"
                  required
                  placeholder="Telefone ((11) 91234-5678)"
                  @input="form.companyPhone = maskPhone(form.companyPhone)"
                  maxlength="15"
                  class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
                />
              </div>
            </div>

            <div>
              <Input
                v-model="form.companyEmail"
                type="email"
                required
                placeholder="E-mail (empresa@email.com)"
                @input="form.companyEmail = maskEmail(form.companyEmail)"
                @blur="companyEmailTouched = true"
                class="w-full px-4 py-3 lg:py-3.5 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
              <span
                v-if="companyEmailTouched && companyEmailError"
                class="text-red-600 text-xs lg:text-sm mt-1 block"
              >
                {{ companyEmailError }}
              </span>
            </div>

            <button
              type="submit"
              class="w-full py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[4px] transition-colors text-sm lg:text-base mt-6"
            >
              Avançar
            </button>
          </form>

          <!-- Step 2 Form -->
          <form
            v-else-if="step === 2"
            @submit.prevent="submitSignUp"
            class="space-y-4 lg:space-y-5"
          >
            <div>
              <Input
                v-model="form.contactName"
                type="text"
                required
                placeholder="Nome do responsável"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
            </div>

            <div>
              <Input
                v-model="form.contactCpf"
                type="text"
                required
                maxlength="14"
                placeholder="CPF (123.456.789-00)"
                @input="form.contactCpf = maskCPF(form.contactCpf)"
                @blur="contactCpfTouched = true"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
              <span
                v-if="contactCpfTouched && contactCpfError"
                class="text-red-600 text-xs lg:text-sm mt-1 block"
              >
                {{ contactCpfError }}
              </span>
            </div>

            <div>
              <Input
                v-model="form.contactEmail"
                type="email"
                required
                placeholder="E-mail (nome@email.com)"
                @input="form.contactEmail = maskEmail(form.contactEmail)"
                @blur="contactEmailTouched = true"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
              <span
                v-if="contactEmailTouched && contactEmailError"
                class="text-red-600 text-xs lg:text-sm mt-1 block"
              >
                {{ contactEmailError }}
              </span>
            </div>

            <div>
              <Input
                v-model="form.contactPhone"
                type="tel"
                required
                placeholder="Telefone ((11) 91234-5678)"
                @input="form.contactPhone = maskPhone(form.contactPhone)"
                maxlength="15"
                class="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm lg:text-base"
              />
            </div>

            <div class="flex flex-col gap-3 mt-6">
              <button
                type="button"
                class="w-full sm:w-auto px-6 py-2.5 lg:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-[4px] transition-colors text-sm lg:text-base"
                @click="prevStep"
              >
                Voltar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full sm:flex-1 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-[4px] transition-colors text-sm lg:text-base"
              >
                <span v-if="isSubmitting">Enviando...</span>
                <span v-else>Concluir Cadastro</span>
              </button>
            </div>
          </form>

          <!-- Success Step -->
          <div v-else class="text-center space-y-6">
            <div class="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                Cadastro realizado com sucesso!
              </h2>
              <p class="text-gray-600 text-sm lg:text-base mb-6">
                Obrigado por se cadastrar.<br />Em breve entraremos em contato com você.
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  class="w-full sm:w-auto px-6 py-2.5 lg:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm lg:text-base"
                  @click="goToLanding"
                >
                  Página Inicial
                </button>
                <button
                  class="w-full sm:flex-1 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm lg:text-base"
                  @click="goToLogin"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          </div>

          <!-- Terms Text -->
          <p v-if="step < 3" class="text-xs lg:text-sm text-gray-500 text-center mt-6">
            Ao cadastrar, você concorda com nossa Política de Privacidade e Termos de Uso.
          </p>

          <!-- Login Link -->
          <div v-if="step < 3" class="text-center mt-4 mb-8 lg:mb-12">
            <p class="text-sm text-gray-600">
              Já tem uma conta?
              <router-link
                to="/login"
                class="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
              >
                Ir para login
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden lg:flex flex-1 lg:flex-2 bg-blue-50 flex items-center justify-center p-6 lg:p-12 order-first lg:order-last min-h-64 lg:min-h-screen"
    >
      <div class="text-center max-w-lg">
        <h2 class="text-xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
          Transforme a gestão da sua empresa
        </h2>
        <p class="text-sm lg:text-lg text-gray-600 mb-6 lg:mb-8">
          Organize tarefas, otimize processos e aumente a produtividade da sua equipe com o Tasky
          System.
        </p>
        <div class="flex justify-center">
          <img
            src="@/assets/images/landing/hero-image.png"
            alt="Dashboard Tasky"
            class="max-w-full h-auto rounded-lg max-w-xs lg:max-w-md"
          />
        </div>
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

  <!-- WhatsApp Button -->
  <a
    href="https://wa.me/SEUNUMEROAQUI"
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
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { signupService } from '@/services/signupService';
import { toast } from 'vue3-toastify';
import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskEmail,
  validateEmail,
  validateCPF,
  validateCNPJ,
} from '@/utils/form-helpers';
import { AxiosError } from 'axios';
import Input from '@/components/common/Input.vue';

const router = useRouter();
const step = ref(1);
const steps = [{ key: 'company' }, { key: 'owner' }, { key: 'done' }];

const form = reactive({
  // Step 1
  companyName: '',
  cnpj: '',
  companyEmail: '',
  companyPhone: '',
  // Step 2
  contactName: '',
  contactCpf: '',
  contactEmail: '',
  contactPhone: '',
});

const companyEmailError = ref('');
const contactEmailError = ref('');
const companyEmailTouched = ref(false);
const contactEmailTouched = ref(false);
const contactCpfError = ref('');
const contactCpfTouched = ref(false);
const cnpjError = ref('');
const cnpjTouched = ref(false);

const isSubmitting = ref(false);

watch(
  () => form.companyEmail,
  (val) => {
    if (!val || validateEmail(val)) {
      companyEmailError.value = '';
    } else {
      companyEmailError.value = 'E-mail inválido';
    }
  },
);

watch(
  () => form.contactEmail,
  (val) => {
    if (!val || validateEmail(val)) {
      contactEmailError.value = '';
    } else {
      contactEmailError.value = 'E-mail inválido';
    }
  },
);

watch(
  () => form.contactCpf,
  (val) => {
    if (!val) {
      contactCpfError.value = '';
    } else {
      const isValid = validateCPF(val);
      contactCpfError.value = isValid ? '' : 'CPF inválido';
    }
  },
);

watch(
  () => form.cnpj,
  (val) => {
    if (!val) {
      cnpjError.value = '';
    } else {
      const isValid = validateCNPJ(val);
      cnpjError.value = isValid ? '' : 'CNPJ inválido';
    }
  },
);

const progressWidth = computed(() => {
  if (step.value === 1) return '50%';
  if (step.value === 2) return '100%';
  return '100%';
});

function nextStep() {
  if (form.cnpj && !validateCNPJ(form.cnpj)) {
    cnpjTouched.value = true;
    cnpjError.value = 'CNPJ inválido';
    return;
  }

  if (step.value < 2) {
    step.value++;
  } else if (step.value === 2) {
    step.value = 3;
  }
}
function prevStep() {
  if (step.value > 1) step.value--;
}

function goToLanding() {
  router.push('/landing');
}

function goToLogin() {
  router.push('/login');
}

async function submitSignUp() {
  if (isSubmitting.value) return;

  if (!validateCPF(form.contactCpf)) {
    contactCpfTouched.value = true;
    contactCpfError.value = 'CPF inválido';
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      companyName: form.companyName,
      email: form.companyEmail,
      cnpj: form.cnpj.replace(/[^\d]/g, ''),
      contactName: form.contactName,
      contactCpf: form.contactCpf.replace(/[^\d]/g, ''),
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone.replace(/[^\d]/g, ''),
      termsAccepted: true,
      privacyPolicyAccepted: true,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
    };

    await signupService.createSignUp(payload);
    step.value = 3;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 409) {
      toast.error('Empresa já cadastrada. Por favor, faça login.');
    } else {
      toast.error('Ocorreu um erro ao enviar seu cadastro. Por favor, tente novamente.');
    }
    console.error('Signup error:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Force light theme for signup page - override any dark mode styles */
:deep(.bg-white) {
  background-color: #ffffff !important;
}

:deep(.bg-gray-50) {
  background-color: #f9fafb !important;
}

:deep(.bg-blue-50) {
  background-color: #eff6ff !important;
}

:deep(.bg-gray-100) {
  background-color: #f3f4f6 !important;
}

:deep(.bg-gray-200) {
  background-color: #e5e7eb !important;
}

:deep(.bg-green-100) {
  background-color: #dcfce7 !important;
}

:deep(.text-gray-900) {
  color: #111827 !important;
}

:deep(.text-gray-700) {
  color: #374151 !important;
}

:deep(.text-gray-600) {
  color: #4b5563 !important;
}

:deep(.text-gray-500) {
  color: #6b7280 !important;
}

:deep(.text-blue-600) {
  color: #2563eb !important;
}

:deep(.text-green-600) {
  color: #16a34a !important;
}

:deep(.text-red-600) {
  color: #dc2626 !important;
}

:deep(.border-gray-100) {
  border-color: #f3f4f6 !important;
}

:deep(.bg-blue-600) {
  background-color: #2563eb !important;
}

:deep(.bg-blue-700) {
  background-color: #1d4ed8 !important;
}

:deep(.bg-blue-400) {
  background-color: #60a5fa !important;
}

:deep(.bg-green-500) {
  background-color: #22c55e !important;
}

:deep(.bg-green-600) {
  background-color: #16a34a !important;
}

:deep(.hover\:bg-blue-700:hover) {
  background-color: #1d4ed8 !important;
}

:deep(.hover\:bg-gray-200:hover) {
  background-color: #e5e7eb !important;
}

:deep(.hover\:bg-green-600:hover) {
  background-color: #16a34a !important;
}

:deep(.hover\:text-blue-600:hover) {
  color: #2563eb !important;
}

:deep(input) {
  background-color: #f9fafb !important;
  border-color: #d1d5db !important;
  color: #111827 !important;
}

:deep(input:focus) {
  border-color: var(--primary-color) !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2) !important;
}

:deep(input::placeholder) {
  color: #6b7280 !important;
}

:deep(button) {
  color: inherit !important;
}

:deep(.text-white) {
  color: #ffffff !important;
}

:deep(a) {
  color: #374151 !important;
}

:deep(a:hover) {
  color: #2563eb !important;
}

:deep(svg) {
  color: inherit !important;
}

:deep(.bg-blue-600) {
  background-color: #2563eb !important;
}

:deep(.bg-green-500) {
  background-color: #22c55e !important;
}

:deep(.hover\:bg-green-600:hover) {
  background-color: #16a34a !important;
}

:deep(.shadow-lg) {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.shadow-2xl) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

:deep(.shadow-sm) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.shadow-xl) {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}
</style>
