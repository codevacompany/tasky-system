<template>
  <BaseModal
    title="Novo Colaborador"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="createUser"
    :confirmButtonText="'Cadastrar'"
    :cancelButtonText="'Cancelar'"
    :confirmButtonLoading="isLoading"
  >
    <form
      id="cadastroColaboradorForm"
      class="w-[100%] sm:min-w-[600px] grid grid-cols-1 sm:grid-cols-2 gap-5"
      @submit.prevent="createUser"
    >
      <div class="col-span-1">
        <label
          for="nomeColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Nome</label
        >
        <input
          type="text"
          id="nomeColaborador"
          v-model="userData.firstName"
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
        <input
          type="text"
          id="sobrenomeColaborador"
          v-model="userData.lastName"
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
        <input
          type="email"
          id="emailColaborador"
          v-model="userData.email"
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
          <option :value="null" disabled>Selecione um setor</option>
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
      </div>

      <div class="col-span-1">
        <label
          for="senhaColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Senha</label
        >
        <input
          type="password"
          id="senhaColaborador"
          v-model="userData.password"
          placeholder="Digite a senha"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div class="col-span-1">
        <label
          for="roleColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Função</label
        >
        <select
          id="roleColaborador"
          v-model="userData.roleId"
          required
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option :value="null" disabled>Selecione uma função</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { departmentService } from '@/services/departmentService';
import BaseModal from '../common/BaseModal.vue';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import { roleService } from '@/services/roleService';
import type { CreateUserDto } from '@/models';

const isLoading = ref(false);

const emit = defineEmits(['close', 'userCreated']);

const userData = ref<CreateUserDto>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  departmentId: null as number | null,
  roleId: null as number | null,
});

const departments = ref<{ id: number; name: string }[]>([]);
const roles = ref<{ id: number; name: string }[]>([]);
const selectedDepartment = ref<number | null>(null);

const fetchDepartments = async () => {
  try {
    const response = await departmentService.fetch({ limit: 100 });
    departments.value = response.data.items;
  } catch {
    toast.error('Erro ao carregar setores.');
  }
};

const fetchRoles = async () => {
  try {
    const response = await roleService.fetchAssignable({ limit: 100 });
    roles.value = response.data.items;
  } catch {
    toast.error('Erro ao carregar funções.');
  }
};

const resetForm = () => {
  userData.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    departmentId: null,
    roleId: null,
  };
  selectedDepartment.value = null;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const createUser = async () => {
  isLoading.value = true;
  try {
    await userService.create(userData.value);
    emit('userCreated');
    toast.success('Colaborador criado com sucesso!');
    closeModal();
  } catch (error) {
    console.error(error);
    toast.error('Algo deu errado. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchDepartments(), fetchRoles()]);
});
</script>
