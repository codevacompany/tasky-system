<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white m-0">
            Usuários do Cliente
          </h1>
          <h2 class="text-base text-gray-600 dark:text-gray-400 mt-1 m-0">
            {{ client.razaoSocial }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <span
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
          >
            {{ client.usuariosAtivos }}/{{ client.limiteUsuarios }} usuários
          </span>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="showNewUserModal = true"
            :disabled="client.usuariosAtivos >= client.limiteUsuarios"
          >
            <font-awesome-icon icon="plus" /> Novo Usuário
          </button>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <div class="relative flex-1">
          <font-awesome-icon
            icon="search"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar por nome, email ou perfil..."
            class="w-full sm:w-[300px] pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 w-full sm:w-[180px]"
        >
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
        <select
          v-model="roleFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 w-full sm:w-[180px]"
        >
          <option value="">Todos os Perfis</option>
          <option value="ADMIN">Administrador</option>
          <option value="GESTOR">Gestor</option>
          <option value="USUARIO">Usuário</option>
        </select>
      </div>
    </header>

    <!-- Lista de Usuários -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto"
    >
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Usuário
            </th>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Email
            </th>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Perfil
            </th>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Status
            </th>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Último Acesso
            </th>
            <th
              class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm"
                >
                  {{ getUserInitials(user) }}
                </div>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white"
                    >{{ user.firstName }} {{ user.lastName }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    user.departamento
                  }}</span>
                </div>
              </div>
            </td>
            <td
              class="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            >
              {{ user.email }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <span
                :class="[
                  'inline-block px-2 py-1 rounded-md text-xs font-medium',
                  user.perfil === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : user.perfil === 'GESTOR'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                ]"
              >
                {{ user.perfil }}
              </span>
            </td>
            <td class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <span
                :class="[
                  'inline-block px-2 py-1 rounded-md text-xs font-medium',
                  user.status === 'ATIVO'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                ]"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div class="flex flex-col text-sm">
                <span class="text-gray-900 dark:text-gray-100">{{
                  formatDate(user.ultimoAcesso)
                }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{
                  formatTime(user.ultimoAcesso)
                }}</span>
              </div>
            </td>
            <td class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div class="flex gap-2">
                <button
                  class="w-8 h-8 flex items-center justify-center border-none bg-transparent text-gray-600 dark:text-gray-400 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Editar"
                  @click="editUser(user)"
                >
                  <font-awesome-icon icon="edit" />
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center border-none bg-transparent text-gray-600 dark:text-gray-400 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400"
                  :title="user.status === 'ATIVO' ? 'Desativar' : 'Ativar'"
                  @click="toggleUserStatus(user)"
                >
                  <font-awesome-icon :icon="user.status === 'ATIVO' ? 'ban' : 'check'" />
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center border-none bg-transparent text-gray-600 dark:text-gray-400 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Redefinir Senha"
                  @click="resetPassword(user)"
                >
                  <font-awesome-icon icon="key" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Usuário -->
    <div
      v-if="showNewUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg w-[90%] max-w-md shadow-lg">
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-600"
        >
          <h2 class="m-0 text-xl font-semibold text-gray-900 dark:text-white">Novo Usuário</h2>
          <button
            class="w-8 h-8 flex items-center justify-center border-none bg-transparent text-gray-600 dark:text-gray-400 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="showNewUserModal = false"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveNewUser">
            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                >Nome Completo</label
              >
              <input
                type="text"
                v-model="newUser.firstName"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 mb-2"
                placeholder="Nome"
              />
              <input
                type="text"
                v-model="newUser.lastName"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="Sobrenome"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                v-model="newUser.email"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                >Departamento</label
              >
              <input
                type="text"
                v-model="newUser.departamento"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div class="mb-0">
              <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">Perfil</label>
              <select
                v-model="newUser.perfil"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="ADMIN">Administrador</option>
                <option value="GESTOR">Gestor</option>
                <option value="USUARIO">Usuário</option>
              </select>
            </div>
          </form>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            @click="showNewUserModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            @click="saveNewUser"
          >
            Criar Usuário
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getUserInitials } from '@/utils/generic-helper';

// Estados
const searchTerm = ref('');
const statusFilter = ref('');
const roleFilter = ref('');
const showNewUserModal = ref(false);

// Novo usuário
const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  departamento: '',
  perfil: 'USUARIO',
});

// Dados mockados
const client = ref({
  id: 1,
  razaoSocial: 'Empresa ABC Ltda',
  usuariosAtivos: 15,
  limiteUsuarios: 20,
});

const users = ref([
  {
    id: 1,
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@empresa.com',
    departamento: 'TI',
    perfil: 'ADMIN',
    status: 'ATIVO',
    ultimoAcesso: '2024-03-20T14:30:00',
  },
  // Adicione mais usuários mockados aqui
]);

// Computed properties
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchSearch =
      !searchTerm.value ||
      fullName.includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.perfil.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchStatus = !statusFilter.value || user.status === statusFilter.value;
    const matchRole = !roleFilter.value || user.perfil === roleFilter.value;

    return matchSearch && matchStatus && matchRole;
  });
});

// Métodos
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const editUser = (user: any) => {
  console.log('Editar usuário:', user);
};

const toggleUserStatus = (user: any) => {
  console.log('Alternar status do usuário:', user);
};

const resetPassword = (user: any) => {
  console.log('Redefinir senha do usuário:', user);
};

const saveNewUser = () => {
  console.log('Salvar novo usuário:', newUser.value);
  showNewUserModal.value = false;
};
</script>

<style scoped>
/* All styles have been converted to Tailwind classes */
</style>
