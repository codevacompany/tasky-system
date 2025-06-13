<template>
  <Teleport to="body">
    <div v-if="showProfileModal" class="backdrop" @click="closeModal"></div>
    <div v-if="showProfileModal" class="profile-dropdown" id="profileModal" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Perfil</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="profile-section">
            <div class="profile-header">
              <div class="profile-avatar">
                <span class="initials">{{ userInitials }}</span>
              </div>
              <div class="profile-info">
                <h4 class="user-name">{{ user?.firstName }} {{ user?.lastName }}</h4>
                <p class="user-email">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <div class="menu-section">
            <div class="menu-options">
              <router-link to="/faq" @click="closeModal" class="menu-item">
                <div class="menu-icon">
                  <font-awesome-icon icon="question-circle" />
                </div>
                <span>Ajuda</span>
              </router-link>

              <div class="menu-item" @click="toggleThemeModal">
                <div class="menu-icon">
                  <font-awesome-icon :icon="isDarkMode ? 'moon' : 'sun'" />
                </div>
                <span>Tema</span>
                <font-awesome-icon icon="chevron-right" class="arrow" />
              </div>

              <div class="menu-item" @click="openChangePasswordModal">
                <div class="menu-icon">
                  <font-awesome-icon icon="key" />
                </div>
                <span>Alterar senha</span>
              </div>

              <div class="menu-item logout" @click="handleLogout">
                <div class="menu-icon">
                  <font-awesome-icon icon="sign-out-alt" />
                </div>
                <span>Fazer Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showThemeModal" class="backdrop" @click="closeThemeModal"></div>
    <div v-if="showThemeModal" class="theme-modal" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <font-awesome-icon :icon="isDarkMode ? 'moon' : 'sun'" />
            Tema
          </h2>
          <button class="close-btn" @click="closeThemeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="theme-options">
            <div class="theme-option" @click="setTheme('light')" :class="{ active: !isDarkMode }">
              <div class="theme-preview light">
                <div class="preview-header"></div>
                <div class="preview-content"></div>
              </div>
              <div class="theme-info">
                <h4>Claro</h4>
                <p>Tema padrão com fundo branco</p>
              </div>
              <font-awesome-icon v-if="!isDarkMode" icon="check" class="check-icon" />
            </div>
            <div class="theme-option" @click="setTheme('dark')" :class="{ active: isDarkMode }">
              <div class="theme-preview dark">
                <div class="preview-header"></div>
                <div class="preview-content"></div>
              </div>
              <div class="theme-info">
                <h4>Escuro</h4>
                <p>Tema escuro para reduzir o cansaço visual</p>
              </div>
              <font-awesome-icon v-if="isDarkMode" icon="check" class="check-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      :is-open="showChangePasswordModal"
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
        <div class="form-group">
          <label for="currentPassword">Senha Atual</label>
          <input
            type="password"
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            class="form-control"
            :class="{ error: passwordForm.errors.currentPassword }"
            placeholder="Digite sua senha atual"
            required
          />
          <span v-if="passwordForm.errors.currentPassword" class="error-message">
            {{ passwordForm.errors.currentPassword }}
          </span>
        </div>
        <div class="form-group">
          <label for="newPassword">Nova Senha</label>
          <input
            type="password"
            id="newPassword"
            v-model="passwordForm.newPassword"
            class="form-control"
            :class="{ error: passwordForm.errors.newPassword }"
            placeholder="Digite sua nova senha"
            required
          />
          <span v-if="passwordForm.errors.newPassword" class="error-message">
            {{ passwordForm.errors.newPassword }}
          </span>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Nova Senha</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            class="form-control"
            :class="{ error: passwordForm.errors.confirmPassword }"
            placeholder="Confirme sua nova senha"
            required
          />
          <span v-if="passwordForm.errors.confirmPassword" class="error-message">
            {{ passwordForm.errors.confirmPassword }}
          </span>
        </div>
        <div class="password-requirements">
          <p>A senha deve conter:</p>
          <ul>
            <li :class="{ valid: hasMinLength }">Mínimo de 8 caracteres</li>
            <li :class="{ valid: hasUpperCase }">Pelo menos 1 letra maiúscula</li>
            <li :class="{ valid: hasLowerCase }">Pelo menos 1 letra minúscula</li>
            <li :class="{ valid: hasNumber }">Pelo menos 1 número</li>
            <li :class="{ valid: hasSpecialChar }">Pelo menos 1 caractere especial</li>
          </ul>
        </div>
      </form>
    </BaseModal>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useRouter } from 'vue-router';
import { localStorageService } from '@/utils/localStorageService';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';

const router = useRouter();

defineProps({
  showProfileModal: Boolean,
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const user = useUserStore().user;

const isDarkMode = ref(localStorageService.isDarkMode());
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
  authService.logout();
  router.push('/login');
};

const toggleThemeModal = () => {
  showThemeModal.value = true;
};

const closeThemeModal = () => {
  showThemeModal.value = false;
};

const setTheme = (theme: 'light' | 'dark') => {
  isDarkMode.value = theme === 'dark';

  document.body.classList.toggle('dark-mode', isDarkMode.value);
  document.body.classList.toggle('dark', isDarkMode.value);

  localStorageService.setTheme(theme);
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
  if (user?.firstName && user?.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  }
  return '';
});
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
  pointer-events: auto;
}

.profile-dropdown {
  position: fixed;
  top: calc(var(--header-height) + 6px);
  right: 20px;
  width: 310px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
  pointer-events: auto;
  border: 1px solid var(--border-color);
}

.theme-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.modal-content {
  width: 100%;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  color: var(--text-color);
  opacity: 0.7;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.5rem;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: var(--hover-bg);
}

.modal-body {
  padding: 0;
}

.profile-section {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
  margin: 0 0 1rem 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.user-email {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-light);
}

.menu-section {
  padding: 1rem 0;
}

.menu-section .section-title {
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
}

.menu-options {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.menu-item:hover {
  background-color: var(--hover-bg);
}

.menu-item.logout {
  color: var(--danger-color);
}

.menu-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

.menu-icon {
  width: 20px;
  display: flex;
  justify-content: center;
  font-size: 1rem;
  color: var(--text-light);
}

.menu-item.logout .menu-icon {
  color: var(--danger-color);
}

.menu-item span {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.arrow {
  font-size: 0.75rem;
  color: var(--text-light);
  opacity: 0.5;
}

/* Theme Modal Styles */
.theme-options {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.theme-option:hover {
  border-color: var(--primary-color);
}

.theme-option.active {
  border-color: var(--primary-color);
  background-color: rgba(37, 99, 235, 0.05);
}

.theme-preview {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.theme-preview.light {
  background: #ffffff;
}

.theme-preview.light .preview-header {
  height: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.theme-preview.light .preview-content {
  height: 27px;
  background: #ffffff;
}

.theme-preview.dark {
  background: #1a2233;
}

.theme-preview.dark .preview-header {
  height: 12px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.theme-preview.dark .preview-content {
  height: 27px;
  background: #1a2233;
}

.theme-info {
  flex: 1;
}

.theme-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.theme-info p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-light);
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: var(--primary-color);
  font-size: 0.875rem;
}

/* Password Change Form Styles (for BaseModal content) */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-color);
  background-color: var(--card-bg);
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-control.error {
  border-color: var(--danger-color);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--danger-color);
}

.password-requirements {
  background: var(--hover-bg);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.password-requirements p {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-color);
}

.password-requirements ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.password-requirements li::before {
  content: '✗';
  color: var(--danger-color);
  font-weight: bold;
}

.password-requirements li.valid {
  color: var(--success-color);
}

.password-requirements li.valid::before {
  content: '✓';
  color: var(--success-color);
}

/* Dark mode styles */
:deep(body.dark-mode) .profile-dropdown,
:deep(body.dark-mode) .theme-modal {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

:deep(body.dark-mode) .modal-header {
  background-color: var(--card-bg);
  border-bottom-color: var(--border-color);
}

:deep(body.dark-mode) .modal-header h2 {
  color: var(--text-color);
}

:deep(body.dark-mode) .close-btn {
  color: var(--text-color);
}

:deep(body.dark-mode) .close-btn:hover {
  background-color: var(--hover-bg);
}

:deep(body.dark-mode) .profile-section {
  border-bottom-color: var(--border-color);
}

:deep(body.dark-mode) .section-title {
  color: var(--text-light);
}

:deep(body.dark-mode) .user-name {
  color: var(--text-color);
}

:deep(body.dark-mode) .user-email {
  color: var(--text-light);
}

:deep(body.dark-mode) .menu-item {
  color: var(--text-color);
}

:deep(body.dark-mode) .menu-item:hover {
  background-color: var(--hover-bg);
}

:deep(body.dark-mode) .menu-icon {
  color: var(--text-light);
}

:deep(body.dark-mode) .arrow {
  color: var(--text-light);
}

:deep(body.dark-mode) .theme-option {
  border-color: var(--border-color);
}

:deep(body.dark-mode) .theme-option:hover {
  border-color: var(--primary-color);
}

:deep(body.dark-mode) .theme-option.active {
  background-color: rgba(37, 99, 235, 0.1);
}

:deep(body.dark-mode) .theme-info h4 {
  color: var(--text-color);
}

:deep(body.dark-mode) .theme-info p {
  color: var(--text-light);
}

:deep(body.dark-mode) .form-control {
  background-color: var(--hover-bg);
  border-color: var(--border-color);
  color: var(--text-color);
}

:deep(body.dark-mode) .form-control:focus {
  border-color: var(--primary-color);
}

:deep(body.dark-mode) .password-requirements {
  background-color: var(--hover-bg);
}
</style>
