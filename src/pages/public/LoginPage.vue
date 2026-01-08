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
          <form @submit.prevent="login" class="space-y-4 sm:space-y-6">
            <!-- Email Field -->
            <div>
              <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon icon="envelope" class="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="loginEmail"
                  v-model="email"
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  class="block w-full pl-10 pr-3 sm:py-3 bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm sm:text-base rounded-[4px]"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon icon="lock" class="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="loginPassword"
                  v-model="password"
                  type="password"
                  placeholder="Sua senha"
                  required
                  class="block w-full pl-10 pr-3 sm:py-3 bg-gray-50 text-txt-primary placeholder-gray-500 transition-colors text-sm sm:text-base rounded-[4px]"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
            >
              <div class="flex items-center">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  id="rememberMe"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label for="rememberMe" class="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <router-link
                to="/esqueci-senha"
                class="text-sm text-gray-800 hover:text-gray-600 hover:underline transition-colors"
              >
                Esqueceu a senha?
              </router-link>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-[4px] shadow-soft-xs text-sm sm:text-base font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LoadingSpinner v-if="isLoading" :size="20" class="mr-2" />
              <span v-if="!isLoading">Entrar</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8 text-center">
          <p class="text-sm text-gray-600">Deseja ter o Tasky Pro na sua empresa?</p>
          <router-link to="/cadastrar" class="text-sm text-gray-700 hover:text-gray-800 hover:underline font-medium">
            Cadastre aqui
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authService } from '@/services/authService';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Input from '@/components/common/Input.vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(true); // Changed from false to true
const isLoading = ref(false);

const REMEMBER_ME_KEY = 'tasky_remember_email';

const login = async () => {
  isLoading.value = true;
  try {
    await authService.login({ email: email.value, password: password.value });

    // Handle "Remember Me"
    if (rememberMe.value) {
      localStorage.setItem(REMEMBER_ME_KEY, email.value);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    if (userStore.hasActiveSubscription === false) {
      router.push({ path: '/assinaturas', query: { trialExpired: '1' } });
    } else {
      router.push('/');
    }
  } catch (error: any) {
    const errorCode = error.response?.data?.code;
    if (errorCode === 'subscription-required') {
      toast.error('Esta conta foi desativada');
    } else {
      toast.error('Email ou senha incorretos');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem(REMEMBER_ME_KEY);
};

onMounted(() => {
  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.value = true;
  } else {
    // Set to true by default even if no remembered email exists
    rememberMe.value = true;
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

/* Force light theme for login page - override any dark mode styles */
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
</style>
