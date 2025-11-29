<template>
  <BaseModal
    title="Editar Colaborador"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="updateUser"
    :confirmButtonText="'Salvar'"
    :cancelButtonText="'Cancelar'"
    :confirmButtonLoading="isLoading"
  >
    <form
      id="editarColaboradorForm"
      class="w-[100%] sm:min-w-[460px] grid grid-cols-1 gap-5"
      @submit.prevent="updateUser"
    >
      <div>
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
          padding="normal"
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
          padding="normal"
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
          padding="normal"
        />
      </div>

      <div class="col-span-1">
        <label
          for="setorColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Setor</label
        >
        <Select
          :options="departmentOptions"
          :modelValue="departmentValue"
          @update:modelValue="updateDepartment"
          placeholder="Selecione um setor"
        />
      </div>

      <div>
        <label
          for="roleColaborador"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Função</label
        >
        <Select
          :options="roleOptions"
          :modelValue="roleValue"
          @update:modelValue="updateRole"
          placeholder="Selecione uma função"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { departmentService } from '@/services/departmentService';
import BaseModal from '../common/BaseModal.vue';
import Select from '../common/Select.vue';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Input from '../common/Input.vue';
import { roleService } from '@/services/roleService';
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
  roleId: null as number | null,
  isActive: true,
});

const departments = ref<{ id: number; name: string }[]>([]);
const roles = ref<{ id: number; name: string }[]>([]);

const departmentOptions = computed(() =>
  departments.value.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  })),
);

const roleOptions = computed(() =>
  roles.value.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  })),
);

const departmentValue = computed(() => {
  return userData.value.departmentId?.toString() || '';
});

const roleValue = computed(() => {
  return userData.value.roleId?.toString() || '';
});

const updateDepartment = (value: string) => {
  userData.value.departmentId = value ? parseInt(value) : null;
};

const updateRole = (value: string) => {
  userData.value.roleId = value ? parseInt(value) : null;
};

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

const initializeForm = () => {
  if (props.user) {
    userData.value = {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      departmentId: props.user.department?.id || null,
      roleId: props.user.role?.id || null,
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
      roleId:
        userData.value.roleId === null || userData.value.roleId === undefined
          ? undefined
          : userData.value.roleId,
    };
    await userService.update(props.user.uuid, payload);
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

onMounted(async () => {
  await Promise.all([fetchDepartments(), fetchRoles()]);
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
