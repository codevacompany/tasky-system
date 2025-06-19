<template>
  <section id="colaboradoresSection" class="p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Colaboradores</h1>
      <button
        id="newColaboradorBtn"
        class="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        @click="openModal"
      >
        <font-awesome-icon icon="plus" />
        <span>Novo Colaborador</span>
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="w-64">
        <div class="relative">
          <font-awesome-icon
            icon="search"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
          />
          <input
            type="text"
            id="searchTickets"
            placeholder="Buscar usuários"
            v-model="searchTerm"
            class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
          />
        </div>
      </div>

      <div class="flex items-center">
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="showInactiveUsers" class="sr-only peer" />
          <div
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Mostrar usuários inativos
          </span>
        </label>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full" id="colaboradoresTable">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                Nome
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                Setor
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                Ativo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-8">
                <div class="flex justify-center items-center">
                  <LoadingSpinner :size="28" />
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0" class="hover:bg-transparent">
              <td colspan="6" class="px-6 py-8 text-center">
                <div
                  class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                >
                  <font-awesome-icon icon="users" class="text-3xl mb-3" />
                  <p class="text-sm font-medium mb-1">
                    {{
                      users.length === 0
                        ? 'Nenhum usuário encontrado'
                        : 'Nenhum usuário ativo encontrado'
                    }}
                  </p>
                  <p class="text-xs">
                    {{
                      users.length === 0
                        ? searchTerm
                          ? 'Tente ajustar os filtros de busca.'
                          : 'Comece criando um novo usuário.'
                        : 'Ative o toggle "Mostrar usuários inativos" para ver todos os usuários.'
                    }}
                  </p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ user.id }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                {{ user.department?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                  ]"
                >
                  {{ user.isActive ? 'Sim' : 'Não' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <button
                    v-if="user.isActive && userStore.user?.id !== user.id"
                    @click="deactivateUser(user)"
                    class="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium rounded-md transition-colors"
                    :disabled="isProcessing"
                  >
                    <font-awesome-icon icon="user-slash" class="w-3 h-3 mr-1" />
                    Desativar
                  </button>
                  <span
                    v-else-if="user.isActive && userStore.user?.id === user.id"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 text-xs font-medium rounded-md cursor-not-allowed"
                    title="Você não pode desativar sua própria conta"
                  >
                    <font-awesome-icon icon="user" class="w-3 h-3 mr-1" />
                    Você
                  </span>
                  <button
                    v-else-if="!user.isActive"
                    @click="activateUser(user)"
                    class="inline-flex items-center px-3 py-1.5 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs font-medium rounded-md transition-colors"
                    :disabled="isProcessing"
                  >
                    <font-awesome-icon icon="user-check" class="w-3 h-3 mr-1" />
                    Ativar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4 mt-6">
      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <span class="text-sm text-gray-600 dark:text-gray-400"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >

      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <NewUserModal :isOpen="isModalOpen" @close="closeModal" @userCreated="loadUsers" />

    <ConfirmationModal
      :isOpen="isConfirmationModalOpen"
      :title="confirmationTitle"
      :message="confirmationMessage"
      @confirm="handleConfirmAction"
      @cancel="handleCancelAction"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { userService } from '@/services/userService';
import type { User } from '@/models';
import NewUserModal from '@/components/users/NewUserModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { debounce } from '@/utils/generic-helper';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const users = ref<User[]>([]);
const isModalOpen = ref(false);
const isLoading = ref(false);
const isProcessing = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const showInactiveUsers = ref(false);

const isConfirmationModalOpen = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const pendingAction = ref<{ type: 'deactivate' | 'activate'; user: User } | null>(null);

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  loadUsers();
}, 400);

const filteredUsers = computed(() => {
  if (showInactiveUsers.value) {
    return users.value;
  }
  return users.value.filter((user) => user.isActive);
});

const loadUsers = async () => {
  isLoading.value = true;
  const name = searchTerm.value.trim() || undefined;

  const filters = { name, page: currentPage.value };

  try {
    const response = await userService.fetch(filters);
    users.value = response.data.items;
    totalPages.value = response.data.totalPages;
  } catch {
    toast.error('Erro ao carregar usuários. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const deactivateUser = async (user: User) => {
  if (isProcessing.value) return;

  confirmationTitle.value = 'Confirmar Desativação';
  confirmationMessage.value = `Tem certeza que deseja desativar o usuário ${user.firstName} ${user.lastName}?`;
  pendingAction.value = { type: 'deactivate', user };
  isConfirmationModalOpen.value = true;
};

const activateUser = async (user: User) => {
  if (isProcessing.value) return;

  // Show confirmation modal
  confirmationTitle.value = 'Confirmar Ativação';
  confirmationMessage.value = `Tem certeza que deseja ativar o usuário ${user.firstName} ${user.lastName}?`;
  pendingAction.value = { type: 'activate', user };
  isConfirmationModalOpen.value = true;
};

const handleConfirmAction = async () => {
  if (!pendingAction.value) return;

  isConfirmationModalOpen.value = false;
  isProcessing.value = true;

  const { type, user } = pendingAction.value;

  try {
    if (type === 'deactivate') {
      await userService.deactivate(user.id);
      toast.success(`Usuário ${user.firstName} ${user.lastName} foi desativado com sucesso.`);
    } else {
      await userService.activate(user.id);
      toast.success(`Usuário ${user.firstName} ${user.lastName} foi ativado com sucesso.`);
    }
    await loadUsers();
  } catch (error: any) {
    console.error(`Erro ao ${type === 'deactivate' ? 'desativar' : 'ativar'} usuário:`, error);
  } finally {
    isProcessing.value = false;
    pendingAction.value = null;
  }
};

const handleCancelAction = () => {
  isConfirmationModalOpen.value = false;
  pendingAction.value = null;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(loadUsers);

watch(searchTerm, () => {
  debouncedSearch();
});

watch(currentPage, () => {
  loadUsers();
});
</script>
