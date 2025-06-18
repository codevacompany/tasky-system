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
            src="@/assets/images/tasky-white.png"
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
                <input
                  type="email"
                  id="loginEmail"
                  placeholder="Seu e-mail"
                  v-model="email"
                  required
                  class="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm sm:text-base"
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
                <input
                  type="password"
                  id="loginPassword"
                  placeholder="Sua senha"
                  v-model="password"
                  required
                  class="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-[4px] bg-gray-50 text-gray-900 placeholder-gray-500 transition-colors text-sm sm:text-base"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label for="rememberMe" class="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <a
                href="#"
                class="text-sm text-gray-800 hover:text-gray-600 hover:underline transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-[4px] shadow-sm text-sm sm:text-base font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LoadingSpinner v-if="isLoading" :size="20" class="mr-2" />
              <span v-if="!isLoading">Entrar</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8 text-center">
          <p class="text-sm text-gray-600">
            Não tem uma conta?
            <router-link
              to="/cadastrar"
              class="text-gray-800 hover:text-gray-600 hover:underline transition-colors font-medium"
            >
              Cadastre-se
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authService } from '@/services/authService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  try {
    await authService.login({ email: email.value, password: password.value });

    router.push('/');
  } catch {
    toast.error('Email ou senha incorretos');
  } finally {
    isLoading.value = false;
  }
};
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
</style>
