<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-transparent z-[999] pointer-events-auto" @click="closeModal"></div>
    <div
      class="fixed top-[var(--header-height)] right-4 w-[310px] bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-[1000] overflow-hidden transition-all duration-300 pointer-events-auto border border-gray-200 dark:border-gray-700"
      id="profileModal"
      @click.stop
    >
      <div class="w-full">
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center"
        >
          <h2
            class="m-0 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            Perfil
          </h2>
          <button
            class="text-gray-900 dark:text-white opacity-70 bg-none border-none cursor-pointer p-1 text-2xl leading-none rounded hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            @click="closeModal"
          >
            ×
          </button>
        </div>
        <div class="p-0">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
              >
                <span class="initials">{{ userInitials }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="m-0 text-base font-semibold text-gray-900 dark:text-white">
                  {{ user?.firstName }} {{ user?.lastName }}
                </h4>
                <p
                  v-if="user?.department?.name"
                  class="m-0 mb-0.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ user.department.name }}
                </p>
                <p class="m-0 text-sm text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <div class="py-4">
            <div class="flex flex-col">
              <router-link
                to="/faq"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-gray-900 hover:text-gray-900 dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-base text-gray-600 dark:text-gray-400">
                  <font-awesome-icon icon="question-circle" />
                </div>
                <span class="flex-1 text-sm text font-medium">Ajuda</span>
              </router-link>

              <router-link
                v-if="isTenantAdmin"
                to="/assinaturas"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-gray-900 hover:text-gray-900 dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-base text-gray-600 dark:text-gray-400">
                  <font-awesome-icon icon="credit-card" />
                </div>
                <span class="flex-1 text-sm text font-medium">Assinaturas</span>
              </router-link>

              <div
                class="flex items-center gap-3 px-6 py-3.5 text-gray-900 dark:text-white cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="toggleThemeModal"
              >
                <div class="w-5 flex justify-center text-base text-gray-600 dark:text-gray-400">
                  <font-awesome-icon :icon="userPreferencesStore.isDarkMode ? 'moon' : 'sun'" />
                </div>
                <span class="flex-1 text-sm font-medium">Tema</span>
                <font-awesome-icon
                  icon="chevron-right"
                  class="text-xs text-gray-600 dark:text-gray-400 opacity-50"
                />
              </div>

              <div
                class="flex items-center gap-3 px-6 py-3.5 text-gray-900 dark:text-white cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="openChangePasswordModal"
              >
                <div class="w-5 flex justify-center text-base text-gray-600 dark:text-gray-400">
                  <font-awesome-icon icon="key" />
                </div>
                <span class="flex-1 text-sm font-medium">Alterar senha</span>
              </div>

              <div
                class="flex items-center gap-3 px-6 py-3.5 text-red-600 cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-red-50 dark:hover:bg-red-900/10"
                @click="handleLogout"
              >
                <div class="w-5 flex justify-center text-base text-red-600">
                  <font-awesome-icon icon="sign-out-alt" />
                </div>
                <span class="flex-1 text-sm font-medium">Fazer Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showThemeModal"
      class="fixed inset-0 bg-transparent z-[999] pointer-events-auto"
      @click="closeThemeModal"
    ></div>
    <div
      v-if="showThemeModal"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-[1001] overflow-hidden border border-gray-200 dark:border-gray-700"
      @click.stop
    >
      <div class="w-full">
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center"
        >
          <h2
            class="m-0 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <font-awesome-icon :icon="userPreferencesStore.isDarkMode ? 'moon' : 'sun'" />
            Tema
          </h2>
          <button
            class="text-gray-900 dark:text-white opacity-70 bg-none border-none cursor-pointer p-1 text-2xl leading-none rounded hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            @click="closeThemeModal"
          >
            ×
          </button>
        </div>
        <div class="p-0">
          <div class="p-6 flex flex-col gap-4">
            <div
              class="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 relative hover:border-blue-500 dark:hover:border-blue-400"
              :class="{
                'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10':
                  !userPreferencesStore.isDarkMode,
              }"
              @click="setTheme('light')"
            >
              <div
                class="w-[60px] h-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white"
              >
                <div class="h-3 bg-gray-100 border-b border-gray-200"></div>
                <div class="h-7 bg-white"></div>
              </div>
              <div class="flex-1">
                <h4 class="m-0 mb-1 text-sm font-semibold text-gray-900 dark:text-white">Claro</h4>
                <p class="m-0 text-xs text-gray-600 dark:text-gray-400">
                  Tema padrão com fundo branco
                </p>
              </div>
              <font-awesome-icon
                v-if="!userPreferencesStore.isDarkMode"
                icon="check"
                class="absolute top-2 right-2 text-blue-500 dark:text-blue-400 text-sm"
              />
            </div>
            <div
              class="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 relative hover:border-blue-500 dark:hover:border-blue-400"
              :class="{
                'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10':
                  userPreferencesStore.isDarkMode,
              }"
              @click="setTheme('dark')"
            >
              <div
                class="w-[60px] h-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-800"
              >
                <div class="h-3 bg-gray-700 border-b border-gray-600"></div>
                <div class="h-7 bg-gray-800"></div>
              </div>
              <div class="flex-1">
                <h4 class="m-0 mb-1 text-sm font-semibold text-gray-900 dark:text-white">Escuro</h4>
                <p class="m-0 text-xs text-gray-600 dark:text-gray-400">
                  Tema escuro para reduzir o cansaço visual
                </p>
              </div>
              <font-awesome-icon
                v-if="userPreferencesStore.isDarkMode"
                icon="check"
                class="absolute top-2 right-2 text-blue-500 dark:text-blue-400 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      v-if="showChangePasswordModal"
      title="Alterar Senha"
      :show-footer="true"
      confirm-text="Alterar Senha"
      cancel-text="Cancelar"
      :confirm-disabled="!isPasswordFormValid || isChangingPassword"
      :is-loading="isChangingPassword"
      @close="closeChangePasswordModal"
      @confirm="changePassword"
    >
      <form @submit.prevent="changePassword">
        <div class="mb-6">
          <label
            for="currentPassword"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Senha Atual</label
          >
          <Input
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            :class="{ 'border-red-500': passwordForm.errors.currentPassword }"
            placeholder="Digite sua senha atual"
            required
          />
          <span v-if="passwordForm.errors.currentPassword" class="block mt-2 text-xs text-red-500">
            {{ passwordForm.errors.currentPassword }}
          </span>
        </div>
        <div class="mb-6">
          <label
            for="newPassword"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Nova Senha</label
          >
          <Input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            :class="{ 'border-red-500': passwordForm.errors.newPassword }"
            placeholder="Digite sua nova senha"
            required
          />
          <span v-if="passwordForm.errors.newPassword" class="block mt-2 text-xs text-red-500">
            {{ passwordForm.errors.newPassword }}
          </span>
        </div>
        <div class="mb-6">
          <label
            for="confirmPassword"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Confirmar Nova Senha</label
          >
          <Input
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            :class="{ 'border-red-500': passwordForm.errors.confirmPassword }"
            placeholder="Confirme sua nova senha"
            required
          />
          <span v-if="passwordForm.errors.confirmPassword" class="block mt-2 text-xs text-red-500">
            {{ passwordForm.errors.confirmPassword }}
          </span>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md mb-6">
          <p class="m-0 mb-2 text-xs font-medium text-gray-900 dark:text-white">
            A senha deve conter:
          </p>
          <ul class="m-0 p-0 list-none">
            <li
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1"
              :class="{ 'text-green-600 dark:text-green-400': hasMinLength }"
            >
              <span
                class="font-bold"
                :class="hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                >{{ hasMinLength ? '✓' : '✗' }}</span
              >
              Mínimo de 8 caracteres
            </li>
            <li
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1"
              :class="{ 'text-green-600 dark:text-green-400': hasUpperCase }"
            >
              <span
                class="font-bold"
                :class="hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                >{{ hasUpperCase ? '✓' : '✗' }}</span
              >
              Pelo menos 1 letra maiúscula
            </li>
            <li
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1"
              :class="{ 'text-green-600 dark:text-green-400': hasLowerCase }"
            >
              <span
                class="font-bold"
                :class="hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                >{{ hasLowerCase ? '✓' : '✗' }}</span
              >
              Pelo menos 1 letra minúscula
            </li>
            <li
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1"
              :class="{ 'text-green-600 dark:text-green-400': hasNumber }"
            >
              <span
                class="font-bold"
                :class="hasNumber ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                >{{ hasNumber ? '✓' : '✗' }}</span
              >
              Pelo menos 1 número
            </li>
            <li
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1"
              :class="{ 'text-green-600 dark:text-green-400': hasSpecialChar }"
            >
              <span
                class="font-bold"
                :class="hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                >{{ hasSpecialChar ? '✓' : '✗' }}</span
              >
              Pelo menos 1 caractere especial
            </li>
          </ul>
        </div>
      </form>
    </BaseModal>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';
import { useRoles } from '@/composables';
import Input from '@/components/common/Input.vue';

const router = useRouter();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const userStore = useUserStore();
const user = computed(() => userStore.user);
const userPreferencesStore = useUserPreferencesStore();

// Use the roles composable
const { isTenantAdmin } = useRoles();

const showThemeModal = ref(false);

const showChangePasswordModal = ref(false);
const isChangingPassword = ref(false);

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  errors: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
});

const closeModal = () => {
  emit('close');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

const toggleThemeModal = () => {
  showThemeModal.value = true;
};

const closeThemeModal = () => {
  showThemeModal.value = false;
};

const setTheme = (theme: 'light' | 'dark') => {
  userPreferencesStore.setTheme(theme);
  closeThemeModal();
};

const openChangePasswordModal = () => {
  showChangePasswordModal.value = true;
  resetPasswordForm();
};

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false;
  resetPasswordForm();
};

const resetPasswordForm = () => {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordForm.errors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

const hasMinLength = computed(() => passwordForm.newPassword.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.newPassword));
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.newPassword));
const hasNumber = computed(() => /\d/.test(passwordForm.newPassword));
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+{}[\]:;<>,.?~/\\=-]/.test(passwordForm.newPassword),
);

const isPasswordValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  );
});

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword.trim() !== '' &&
    passwordForm.newPassword.trim() !== '' &&
    passwordForm.confirmPassword.trim() !== '' &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    isPasswordValid.value
  );
});

const validatePasswordForm = () => {
  passwordForm.errors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  let isValid = true;

  if (!passwordForm.currentPassword.trim()) {
    passwordForm.errors.currentPassword = 'Senha atual é obrigatória';
    isValid = false;
  }

  if (!passwordForm.newPassword.trim()) {
    passwordForm.errors.newPassword = 'Nova senha é obrigatória';
    isValid = false;
  } else if (!isPasswordValid.value) {
    passwordForm.errors.newPassword = 'A nova senha não atende aos requisitos';
    isValid = false;
  }

  if (!passwordForm.confirmPassword.trim()) {
    passwordForm.errors.confirmPassword = 'Confirmação de senha é obrigatória';
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordForm.errors.confirmPassword = 'As senhas não coincidem';
    isValid = false;
  }

  if (passwordForm.currentPassword === passwordForm.newPassword) {
    passwordForm.errors.newPassword = 'A nova senha deve ser diferente da atual';
    isValid = false;
  }

  return isValid;
};

const changePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }

  isChangingPassword.value = true;

  try {
    await authService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    toast.success('Senha alterada com sucesso!');
    closeChangePasswordModal();
  } catch (error: any) {
    console.error('Error changing password:', error);

    if (
      error.response?.status === 401 ||
      error.response?.data?.code === 'invalid-current-password'
    ) {
      passwordForm.errors.currentPassword = 'Senha atual incorreta';
    } else {
      toast.error('Erro ao alterar senha. Tente novamente.');
    }
  } finally {
    isChangingPassword.value = false;
  }
};

const userInitials = computed(() => {
  const currentUser = user.value;
  if (currentUser?.firstName && currentUser?.lastName) {
    return currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
  }
  return '';
});
</script>
