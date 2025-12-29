<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md sm:max-w-lg">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
        <!-- Header -->
        <div
          class="h-32 sm:h-40 px-4 py-6 flex justify-center items-center primary-gradient relative"
        >
          <img
            src="@/assets/images/tasky-pro-white.png"
            alt="Tasky Logo"
            class="h-auto w-28 sm:w-36 mx-auto"
          />
        </div>

        <!-- Form Container -->
        <div class="px-6 py-6 sm:px-8 sm:py-8">
          <h2 class="text-xl font-semibold text-txt-primary mb-2">Verificar Código</h2>
          <p class="text-sm text-gray-600 mb-6">
            Digite o código de 6 dígitos enviado para <strong>{{ email }}</strong>
          </p>

          <form @submit.prevent="verifyCode" class="space-y-4 sm:space-y-6">
            <!-- Code Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4 text-center">
                Código de Verificação
              </label>
              <div class="flex justify-center gap-2 sm:gap-3">
                <input
                  v-for="(digit, index) in codeDigits"
                  :key="index"
                  :ref="(el) => setInputRef(el, index)"
                  v-model="codeDigits[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-txt-primary"
                  @input="handleInput(index, $event)"
                  @keydown="handleKeyDown(index, $event)"
                  @paste="handlePaste($event)"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || code.length !== 6"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-[4px] shadow-soft-xs text-sm sm:text-base font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
            >
              <LoadingSpinner v-if="isLoading" :size="20" class="mr-2" />
              <span v-if="!isLoading">Verificar</span>
            </button>

            <!-- Resend Code -->
            <div class="text-center">
              <button
                type="button"
                @click="resendCode"
                :disabled="isResending"
                class="text-sm text-gray-800 hover:text-gray-600 hover:underline transition-colors disabled:opacity-50"
              >
                {{ isResending ? 'Enviando...' : 'Reenviar código' }}
              </button>
            </div>

            <!-- Back to Request -->
            <div class="text-center">
              <router-link
                to="/esqueci-senha"
                class="text-sm text-gray-800 hover:text-gray-600 hover:underline transition-colors"
              >
                Voltar
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authService } from '@/services/authService';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();

const email = ref('');
const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const isLoading = ref(false);
const isResending = ref(false);

const setInputRef = (el: any, index: number) => {
  if (el) {
    inputRefs.value[index] = el;
  }
};

const code = computed(() => codeDigits.value.join(''));

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '').slice(0, 1);

  codeDigits.value[index] = value;

  // Auto-focus next input if digit entered
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }

  // Auto-submit if all digits filled
  if (code.value.length === 6) {
    verifyCode();
  }
};

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text') || '';
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

  digits.forEach((digit, index) => {
    if (index < 6) {
      codeDigits.value[index] = digit;
    }
  });

  // Focus the next empty input or the last one
  const nextEmptyIndex = codeDigits.value.findIndex((d) => !d);
  const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
  inputRefs.value[focusIndex]?.focus();

  // Auto-submit if all digits filled
  if (code.value.length === 6) {
    verifyCode();
  }
};

const verifyCode = async () => {
  if (code.value.length !== 6) {
    toast.error('O código deve ter 6 dígitos');
    return;
  }

  isLoading.value = true;
  try {
    const response = await authService.validateVerificationCode({
      email: email.value,
      code: code.value,
    });

    sessionStorage.setItem('resetPasswordToken', response.data.token);

    router.push({ path: '/nova-senha' });
  } catch (error: any) {
    const errorCode = error.response?.data?.code;
    if (errorCode === 'email-not-found') {
      toast.error('Este e-mail não está cadastrado');
    } else {
      toast.error('Código inválido ou expirado');
    }
  } finally {
    isLoading.value = false;
  }
};

const resendCode = async () => {
  if (!email.value) {
    router.push('/esqueci-senha');
    return;
  }

  isResending.value = true;
  try {
    await authService.requestPasswordReset(email.value);
    toast.success('Código reenviado para seu e-mail');
  } catch (error: any) {
    const errorCode = error.response?.data?.code;
    if (errorCode === 'email-not-found') {
      toast.error('Este e-mail não está cadastrado');
    } else {
      toast.error(error.response?.data?.message || 'Erro ao reenviar código');
    }
  } finally {
    isResending.value = false;
  }
};

const loadEmailFromSession = () => {
  if (typeof window === 'undefined') return;
  const storedEmail = sessionStorage.getItem('resetPasswordEmail');
  if (storedEmail) {
    email.value = storedEmail;
  }
};

onMounted(async () => {
  loadEmailFromSession();

  if (!email.value) {
    toast.error('E-mail não informado. Solicite um novo código.');
    router.push('/esqueci-senha');
    return;
  }

  // Focus first input on mount
  await nextTick();
  inputRefs.value[0]?.focus();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

:deep(.bg-white) {
  background-color: #ffffff !important;
}

:deep(.text-gray-700) {
  color: #374151 !important;
}

:deep(.text-txt-primary) {
  color: #111827 !important;
}

:deep(.text-gray-600) {
  color: #4b5563 !important;
}

:deep(.text-gray-800) {
  color: #1f2937 !important;
}

:deep(.bg-gray-50) {
  background-color: #f9fafb !important;
}

:deep(.text-gray-500) {
  color: #6b7280 !important;
}

:deep(.text-gray-400) {
  color: #9ca3af !important;
}

:deep(.btn-primary) {
  background: linear-gradient(135deg, #00143b 0%, #142046 100%) !important;
  color: #ffffff !important;
}

:deep(.btn-primary:hover) {
  opacity: 0.9 !important;
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

:deep(label) {
  color: #374151 !important;
}

:deep(a) {
  color: #1f2937 !important;
}

:deep(a:hover) {
  color: #4b5563 !important;
}
</style>
