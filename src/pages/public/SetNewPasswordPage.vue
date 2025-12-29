<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-sm sm:max-w-sm">
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
          <h2 class="text-xl font-semibold text-txt-primary mb-2">Nova Senha</h2>
          <p class="text-sm text-gray-600 mb-6">Digite sua nova senha</p>

          <form @submit.prevent="setNewPassword" class="space-y-4 sm:space-y-6">
            <!-- New Password Field -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon icon="lock" class="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="newPassword"
                  v-model="newPassword"
                  type="password"
                  placeholder="Digite sua nova senha"
                  required
                  class="block w-full pl-10 pr-3 sm:py-3 bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm sm:text-base rounded-[4px]"
                />
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon icon="lock" class="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  required
                  class="block w-full pl-10 pr-3 sm:py-3 bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm sm:text-base rounded-[4px]"
                />
              </div>
              <p v-if="!passwordsMatch && confirmPassword" class="mt-1 text-sm text-red-600">
                As senhas não coincidem
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || !passwordsMatch || !newPassword"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-[4px] shadow-soft-xs text-sm sm:text-base font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LoadingSpinner v-if="isLoading" :size="20" class="mr-2" />
              <span v-if="!isLoading">Redefinir Senha</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authService } from '@/services/authService';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Input from '@/components/common/Input.vue';

const router = useRouter();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const passwordsMatch = computed(() => {
  if (!newPassword.value || !confirmPassword.value) return true;
  return newPassword.value === confirmPassword.value;
});

const setNewPassword = async () => {
  if (!passwordsMatch.value) {
    toast.error('As senhas não coincidem');
    return;
  }

  if (newPassword.value.length < 8) {
    toast.error('A senha deve ter no mínimo 8 caracteres');
    return;
  }

  isLoading.value = true;
  try {
    await authService.resetPasswordWithToken(token.value, newPassword.value);
    toast.success('Senha redefinida com sucesso!');
    sessionStorage.removeItem('resetPasswordToken');
    sessionStorage.removeItem('resetPasswordEmail');
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
  } finally {
    isLoading.value = false;
  }
};

const loadTokenFromSession = () => {
  if (typeof window === 'undefined') return;
  const storedToken = sessionStorage.getItem('resetPasswordToken');
  if (storedToken) {
    token.value = storedToken;
  }
};

onMounted(() => {
  loadTokenFromSession();

  if (!token.value) {
    toast.error('Token inválido. Por favor, solicite um novo código.');
    router.push('/esqueci-senha');
  }
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
