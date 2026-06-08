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
          class="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center"
        >
          <h2
            class="m-0 text-lg font-semibold text-txt-primary dark:text-white flex items-center gap-2"
          >
            Perfil
          </h2>
          <button
            class="text-txt-primary dark:text-white opacity-70 bg-none border-none cursor-pointer p-1 text-2xl leading-none rounded hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            @click="closeModal"
          >
            ×
          </button>
        </div>
        <div class="p-0">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0"
                :style="avatarStyle"
              >
                <span class="initials">{{ userInitials }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="m-0 text-base font-semibold text-txt-primary dark:text-white">
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
                to="/perfil"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary hover:text-txt-primary dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <UserIcon class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm text font-medium">Perfil</span>
              </router-link>

              <router-link
                to="/preferencias"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary hover:text-txt-primary dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <AdjustmentsHorizontalIcon class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm text font-medium">Preferências</span>
              </router-link>

              <router-link
                to="/faq"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary hover:text-txt-primary dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm text font-medium">Ajuda</span>
              </router-link>

              <router-link
                v-if="isTenantAdmin"
                to="/admin/configuracoes"
                @click="closeModal"
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary hover:text-txt-primary dark:text-white no-underline cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <Cog6ToothIcon class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm text font-medium">Configurações da empresa</span>
              </router-link>

              <div
                ref="temaButtonRef"
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary dark:text-white cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 relative"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/10': showThemeModal,
                }"
                @click="toggleThemeModal"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <MoonIcon v-if="userPreferencesStore.isDarkMode" class="w-5 h-5" aria-hidden="true" />
                  <SunIcon v-else class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm font-medium">Tema</span>
                <ChevronRightIcon
                  class="w-4 h-4 text-gray-600 dark:text-gray-400 opacity-50"
                  aria-hidden="true"
                />
              </div>

              <div
                class="flex items-center gap-3 px-6 py-3.5 text-txt-primary dark:text-white cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="openChangePasswordModal"
              >
                <div class="w-5 flex justify-center text-gray-600 dark:text-gray-400">
                  <KeyIcon class="w-5 h-5" aria-hidden="true" />
                </div>
                <span class="flex-1 text-sm font-medium">Alterar senha</span>
              </div>

              <div
                class="flex items-center gap-3 px-6 py-3.5 text-red-600 cursor-pointer transition-all duration-200 border-none bg-none w-full text-left hover:bg-red-50 dark:hover:bg-red-900/10"
                @click="handleLogout"
              >
                <div class="w-5 flex justify-center text-red-600">
                  <ArrowRightOnRectangleIcon class="w-5 h-5" aria-hidden="true" />
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
      v-if="showThemeModal && temaButtonRef"
      ref="themePopupRef"
      class="fixed bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-[1001] overflow-hidden border border-gray-200 dark:border-gray-700 min-w-[280px]"
      :style="themePopupStyle"
      @click.stop
    >
      <ThemeSelector @selected="closeThemeModal" />
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
            class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
            >Senha Atual</label
          >
          <Input
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-txt-primary dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
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
            class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
            >Nova Senha</label
          >
          <Input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-txt-primary dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
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
            class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
            >Confirmar Nova Senha</label
          >
          <Input
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-md text-sm text-txt-primary dark:text-white bg-white dark:bg-gray-800 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            :class="{ 'border-red-500': passwordForm.errors.confirmPassword }"
            placeholder="Confirme sua nova senha"
            required
          />
          <span v-if="passwordForm.errors.confirmPassword" class="block mt-2 text-xs text-red-500">
            {{ passwordForm.errors.confirmPassword }}
          </span>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md mb-6">
          <p class="m-0 mb-2 text-xs font-medium text-txt-primary dark:text-white">
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
import { computed, ref, reactive, nextTick, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import BaseModal from '@/components/common/BaseModal.vue';
import { useRoles } from '@/composables';
import { getAvatarStyle } from '@/utils/generic-helper';
import Input from '@/components/common/Input.vue';
import ThemeSelector from '@/components/user/ThemeSelector.vue';
import {
  AdjustmentsHorizontalIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  KeyIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  UserIcon,
} from '@heroicons/vue/24/solid';
import { useTicketsStore } from '@/stores/tickets';
import { useFiltersStore } from '@/stores/filters';

const router = useRouter();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const userStore = useUserStore();
const user = computed(() => userStore.user);
const userPreferencesStore = useUserPreferencesStore();
const ticketsStore = useTicketsStore();
const filtersStore = useFiltersStore();

// Use the roles composable
const { isTenantAdmin } = useRoles();

const showThemeModal = ref(false);
const temaButtonRef = ref<HTMLElement | null>(null);
const themePopupRef = ref<HTMLElement | null>(null);
const themePopupStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' });

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

const handleLogout = async () => {
  userStore.logout();
  ticketsStore.clear();

  await router.push('/login');

  filtersStore.clearAllFilters();
};

const updateThemePopupPosition = () => {
  if (!temaButtonRef.value || !showThemeModal.value) return;

  nextTick(() => {
    if (!temaButtonRef.value) return;

    const buttonRect = temaButtonRef.value.getBoundingClientRect();
    const profileModal = document.getElementById('profileModal');
    if (!profileModal) return;

    const modalRect = profileModal.getBoundingClientRect();
    const popupWidth = 280;
    const gap = 6;

    const top = buttonRect.top;

    let left = modalRect.left - popupWidth - gap;

    const minLeft = 8;
    left = Math.max(left, minLeft);

    const popupRightEdge = left + popupWidth;
    if (popupRightEdge >= modalRect.left) {
      left = modalRect.left - popupWidth - gap;
      left = Math.max(left, minLeft);
    }

    themePopupStyle.value = {
      top: `${top}px`,
      left: `${left}px`,
    };

    nextTick(() => {
      if (themePopupRef.value) {
        const popupRect = themePopupRef.value.getBoundingClientRect();
        const actualPopupRight = popupRect.right;

        if (actualPopupRight >= modalRect.left - gap) {
          const adjustedLeft = modalRect.left - popupRect.width - gap;
          themePopupStyle.value = {
            top: `${top}px`,
            left: `${Math.max(adjustedLeft, minLeft)}px`,
          };
        }
      }
    });
  });
};

const toggleThemeModal = () => {
  showThemeModal.value = !showThemeModal.value;
  if (showThemeModal.value) {
    updateThemePopupPosition();
  }
};

const closeThemeModal = () => {
  showThemeModal.value = false;
};

const handleResize = () => {
  if (showThemeModal.value) {
    updateThemePopupPosition();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleResize, true);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleResize, true);
});

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

    toast.success('Senha alterada com sucesso');
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

const avatarStyle = computed(() => {
  const currentUser = user.value;
  const departmentName = currentUser?.department?.name || currentUser?.firstName || 'User';
  return getAvatarStyle(departmentName);
});
</script>

<style scoped>
.initials {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 48px;
}
</style>
