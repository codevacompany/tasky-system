<template>
  <BaseModal
    title="Editar Colaborador"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="updateUser"
    :confirmButtonText="isLoading ? '' : 'Salvar'"
    :cancelButtonText="'Cancelar'"
  >
    <form
      id="editarColaboradorForm"
      class="w-[100%] sm:min-w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-5"
      @submit.prevent="updateUser"
    >
      <div class="col-span-1">
        <label
          for="nomeColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Nome</label
        >
        <Input
          id="nomeColaborador"
          v-model="userData.firstName"
          type="text"
          placeholder="Digite o nome do colaborador"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div class="col-span-1">
        <label
          for="sobrenomeColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Sobrenome</label
        >
        <Input
          id="sobrenomeColaborador"
          v-model="userData.lastName"
          type="text"
          placeholder="Digite o sobrenome"
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div class="col-span-1">
        <label
          for="emailColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >E-mail</label
        >
        <Input
          id="emailColaborador"
          v-model="userData.email"
          type="email"
          placeholder="Digite o e-mail"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div class="col-span-1">
        <label
          for="setorColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Setor</label
        >
        <select
          id="setorColaborador"
          v-model="userData.departmentId"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
      </div>

      <div class="col-span-1">
        <label
          for="isAdminColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Administrador</label
        >
        <select
          id="isAdminColaborador"
          v-model="userData.isAdmin"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option :value="false">Não</option>
          <option :value="true">Sim</option>
        </select>
      </div>

      <div class="col-span-1">
        <label
          for="isActiveColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Status</label
        >
        <select
          id="isActiveColaborador"
          v-model="userData.isActive"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option :value="true">Ativo</option>
          <option :value="false">Inativo</option>
        </select>
      </div>

      <div v-if="isLoading" class="col-span-2 flex justify-center my-2">
        <LoadingSpinner :size="22" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { departmentService } from '@/services/departmentService';
import BaseModal from '../common/BaseModal.vue';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Input from '../common/Input.vue';
import type { User } from '@/models';

const props = defineProps<{
  user: User;
}>();

const isLoading = ref(false);

const emit = defineEmits(['close', 'userUpdated']);

const userData = ref({
  firstName: '',
  lastName: '',
  email: '',
  departmentId: null as number | null,
  isAdmin: false,
  isActive: true,
});

const departments = ref<{ id: number; name: string }[]>([]);

const fetchDepartments = async () => {
  try {
    const response = await departmentService.fetch({ limit: 100 });
    departments.value = response.data.items;
  } catch {
    toast.error('Erro ao carregar setores.');
  }
};

const initializeForm = () => {
  if (props.user) {
    userData.value = {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      departmentId: props.user.department?.id || null,
      isAdmin: props.user.role?.name === 'Administrador',
      isActive: props.user.isActive,
    };
  }
};

const closeModal = () => {
  emit('close');
};

const updateUser = async () => {
  isLoading.value = true;
  try {
    const payload = {
      ...userData.value,
      departmentId:
        userData.value.departmentId === null || userData.value.departmentId === undefined
          ? undefined
          : userData.value.departmentId,
    };
    await userService.update(props.user.id, payload);
    emit('userUpdated');
    toast.success('Colaborador atualizado com sucesso!');
    closeModal();
  } catch (error) {
    console.error(error);
    toast.error('Algo deu errado. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDepartments();
  initializeForm();
});

watch(
  () => props.user,
  () => {
    initializeForm();
  },
  { immediate: true },
);
</script>
