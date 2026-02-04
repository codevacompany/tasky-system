<template>
  <section class="px-4 pt-4 pb-4 md:px-6 md:pt-4 md:pb-0">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-txt-primary dark:text-white mb-2">Meu Perfil</h1>
        <p class="text-sm text-txt-secondary dark:text-txt-light">Gerencie suas informações pessoais</p>
      </div>

      <!-- Profile Card -->
      <div
        class="bg-white dark:bg-gray-800 mb-8 rounded-lg shadow-soft-xs border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Profile Header Section -->
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-6 py-8 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <!-- Avatar -->
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0 shadow-lg ring-4 ring-white dark:ring-gray-800"
              :style="avatarStyle"
            >
              <span class="initials">{{ userInitials }}</span>
            </div>

            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <h2 class="text-2xl font-bold text-txt-primary dark:text-white mb-1">
                {{ user?.firstName }} {{ user?.lastName }}
              </h2>
              <p
                v-if="user?.department?.name"
                class="text-sm text-txt-secondary dark:text-txt-light mb-2"
              >
                <font-awesome-icon icon="building" class="mr-2" />
                {{ user.department.name }}
              </p>
              <p class="text-sm text-txt-secondary dark:text-txt-light">
                <font-awesome-icon icon="envelope" class="mr-2" />
                {{ user?.email }}
              </p>
              <div v-if="user?.role" class="mt-2">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {{ user.role.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Form Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-1">
                  Informações Pessoais
                </h3>
                <p class="text-sm text-txt-secondary dark:text-txt-light">
                  Atualize suas informações de perfil
                </p>
              </div>
              <button
                v-if="!isEditing"
                type="button"
                @click="startEditing"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors shadow-sm"
              >
                <font-awesome-icon icon="edit" class="text-xs" />
                Editar
              </button>
            </div>

            <!-- First Name -->
            <div class="mb-6">
              <label
                for="firstName"
                class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
              >
                Nome
              </label>
              <Input
                id="firstName"
                v-model="formData.firstName"
                :disabled="!isEditing"
                padding="relaxed"
                class="w-full"
                :class="{
                  'bg-gray-50 dark:bg-gray-900/50': !isEditing,
                  'border-red-500': errors.firstName,
                }"
                placeholder="Digite seu nome"
                required
              />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">
                {{ errors.firstName }}
              </p>
            </div>

            <!-- Last Name -->
            <div class="mb-6">
              <label
                for="lastName"
                class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
              >
                Sobrenome
              </label>
              <Input
                id="lastName"
                v-model="formData.lastName"
                :disabled="!isEditing"
                padding="relaxed"
                class="w-full"
                :class="{
                  'bg-gray-50 dark:bg-gray-900/50': !isEditing,
                  'border-red-500': errors.lastName,
                }"
                placeholder="Digite seu sobrenome"
                required
              />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">
                {{ errors.lastName }}
              </p>
            </div>

            <!-- Email -->
            <div class="mb-6">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
              >
                E-mail
              </label>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                disabled
                padding="relaxed"
                class="w-full"
                :class="{
                  'bg-gray-50 dark:bg-gray-900/50': !isEditing,
                  'border-red-500': errors.email,
                }"
                placeholder="Digite seu e-mail"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Department (Read-only) -->
            <div class="mb-6">
              <label
                for="department"
                class="block mb-2 text-sm font-medium text-txt-primary dark:text-white"
              >
                Setor
              </label>
              <Input
                id="department"
                :model-value="user?.department?.name || 'Não atribuído'"
                disabled
                padding="relaxed"
                class="w-full bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-txt-muted dark:text-txt-light">
                Entre em contato com o administrador para alterar seu setor
              </p>
            </div>

            <!-- Action Buttons -->
            <div
              v-if="isEditing"
              class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="submit"
                :disabled="isSaving || !hasChanges"
                class="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <font-awesome-icon v-if="isSaving" icon="spinner" class="animate-spin" />
                <font-awesome-icon v-else icon="check" />
                {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
              </button>
              <button
                type="button"
                @click="cancelEditing"
                :disabled="isSaving"
                class="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-txt-secondary dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import Input from '@/components/common/Input.vue';
import { getAvatarStyle } from '@/utils/generic-helper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const isEditing = ref(false);
const isSaving = ref(false);

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const originalData = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const userInitials = computed(() => {
  if (user.value?.firstName && user.value?.lastName) {
    return user.value.firstName.charAt(0) + user.value.lastName.charAt(0);
  }
  return '';
});

const avatarStyle = computed(() => {
  const departmentName = user.value?.department?.name || user.value?.firstName || 'User';
  return getAvatarStyle(departmentName);
});

const hasChanges = computed(() => {
  return (
    formData.value.firstName !== originalData.value.firstName ||
    formData.value.lastName !== originalData.value.lastName ||
    formData.value.email !== originalData.value.email
  );
});

const formatDate = (date: string | Date | null) => {
  if (!date) return 'Nunca';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

const initializeForm = () => {
  if (user.value) {
    formData.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
    };
    originalData.value = { ...formData.value };
  }
};

const startEditing = () => {
  isEditing.value = true;
  initializeForm();
};

const cancelEditing = () => {
  isEditing.value = false;
  initializeForm();
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
  };
};

const validateForm = () => {
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
  };

  let isValid = true;

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'Nome é obrigatório';
    isValid = false;
  } else if (formData.value.firstName.trim().length < 2) {
    errors.value.firstName = 'Nome deve ter pelo menos 2 caracteres';
    isValid = false;
  } else if (formData.value.firstName.trim().length > 15) {
    errors.value.firstName = 'Nome deve ter no máximo 15 caracteres';
    isValid = false;
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.value.firstName.trim())) {
    errors.value.firstName = 'Nome deve conter apenas letras';
    isValid = false;
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Sobrenome é obrigatório';
    isValid = false;
  } else if (formData.value.lastName.trim().length < 2) {
    errors.value.lastName = 'Sobrenome deve ter pelo menos 2 caracteres';
    isValid = false;
  } else if (formData.value.lastName.trim().length > 15) {
    errors.value.lastName = 'Sobrenome deve ter no máximo 15 caracteres';
    isValid = false;
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.value.lastName.trim())) {
    errors.value.lastName = 'Sobrenome deve conter apenas letras';
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'E-mail é obrigatório';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email.trim())) {
      errors.value.email = 'E-mail inválido';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  if (!user.value?.uuid) {
    toast.error('Erro ao identificar usuário');
    return;
  }

  isSaving.value = true;

  try {
    const updateData: any = {};

    if (formData.value.firstName.trim() !== originalData.value.firstName) {
      updateData.firstName = formData.value.firstName.trim();
    }
    if (formData.value.lastName.trim() !== originalData.value.lastName) {
      updateData.lastName = formData.value.lastName.trim();
    }
    if (formData.value.email.trim() !== originalData.value.email) {
      updateData.email = formData.value.email.trim();
    }

    if (Object.keys(updateData).length === 0) {
      toast.info('Nenhuma alteração detectada');
      isEditing.value = false;
      return;
    }

    await userService.update(user.value.uuid, updateData);

    // Refresh user data
    await userStore.whoami();

    toast.success('Perfil atualizado com sucesso!');
    isEditing.value = false;
    originalData.value = { ...formData.value };
  } catch (error: any) {
    console.error('Error updating profile:', error);

    if (error.response?.status === 409) {
      if (error.response?.data?.code === 'email-already-exists') {
        errors.value.email = 'Este e-mail já está em uso';
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.');
      }
    } else {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.initials {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 96px;
}
</style>
