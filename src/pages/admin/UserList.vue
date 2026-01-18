<template>
  <section id="colaboradoresSection" class="p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-txt-primary dark:text-white">Colaboradores</h1>
      <button
        id="newColaboradorBtn"
        class="flex items-center gap-2 px-4 py-2 btn btn-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
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
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-light/80 dark:text-gray-500 w-4 h-4 pointer-events-none"
          />
          <Input
            id="searchTickets"
            v-model="searchTerm"
            type="text"
            :placeholder="filterConfig.search.placeholder"
            padding="tight"
            class="pl-10 pr-4 w-full text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </div>

      <div class="flex items-center">
        <Switch v-model="showInactiveUsers" label="Mostrar usuários inativos" />
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-soft-xs overflow-hidden"
    >
      <DataTable
        :data="initialConfig.items"
        :headers="initialConfig.headers"
        :isLoading="initialConfig.isLoading"
        :pagination="initialConfig.pagination"
        :clickable="true"
        :showActions="true"
        :showDeleteButton="false"
        minWidth="800px"
        rowKey="id"
        @pageChange="handlePageChange"
        @rowClick="handleRowClick"
        @sort="handleSort"
      >
        <template #column-name="{ item }">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white text-sm font-bold"
            >
              <span>{{ getUserInitials(item) }}</span>
            </div>
            <div class="font-medium text-txt-primary dark:text-gray-100">
              {{ item.firstName }} {{ item.lastName }}
            </div>
          </div>
        </template>

        <template #column-email="{ value }">
          <span class="text-sm text-txt-primary dark:text-gray-100">
            {{ value }}
          </span>
        </template>

        <template #column-department="{ value }">
          <span class="text-sm text-txt-primary dark:text-gray-100">
            {{ value?.name || 'N/A' }}
          </span>
        </template>

        <template #column-role="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              value?.name === 'Tenant Admin'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            ]"
          >
            {{ value?.name || 'N/A' }}
          </span>
        </template>

        <template #column-isActive="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              value
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            ]"
          >
            {{ value ? 'Ativo' : 'Inativo' }}
          </span>
        </template>

        <template #actions="{ item }">
          <ActionDropdown v-slot="{ close }">
            <button
              @click.stop="
                openEditModal(item);
                close();
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <font-awesome-icon icon="edit" class="w-4" />
              <span>Editar</span>
            </button>

            <button
              v-if="item.isActive && userStore.user?.id !== item.id"
              @click.stop="
                handleResetPassword(item);
                close();
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <font-awesome-icon icon="key" class="w-4" />
              <span>Redefinir Senha</span>
            </button>

            <div
              v-if="userStore.user?.id !== item.id"
              class="h-px bg-gray-100 dark:bg-gray-700 my-1"
            ></div>

            <button
              v-if="item.isActive && userStore.user?.id !== item.id"
              @click.stop="
                deactivateUser(item);
                close();
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              :disabled="isProcessing"
            >
              <font-awesome-icon icon="user-slash" class="w-4" />
              <span>Desativar</span>
            </button>

            <button
              v-else-if="!item.isActive"
              @click.stop="
                activateUser(item);
                close();
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              :disabled="isProcessing"
            >
              <font-awesome-icon icon="user-check" class="w-4" />
              <span>Ativar</span>
            </button>
          </ActionDropdown>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <font-awesome-icon icon="users" class="text-3xl mb-3" />
            <p class="text-sm font-medium mb-1">
              {{
                users.length === 0 ? 'Nenhum usuário encontrado' : 'Nenhum usuário ativo encontrado'
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
        </template>
      </DataTable>
    </div>

    <NewUserModal v-if="isModalOpen" @close="closeModal" @userCreated="loadUsers" />

    <EditUserModal
      v-if="isEditModalOpen && userToEdit"
      :user="userToEdit"
      @close="closeEditModal"
      @userUpdated="loadUsers"
    />

    <ConfirmationModal
      v-if="isConfirmationModalOpen"
      :title="confirmationTitle"
      :message="confirmationMessage"
      @confirm="handleConfirmAction"
      @cancel="handleCancelAction"
    />

    <!-- Password Reset Confirmation Modal -->
    <div
      v-if="showPasswordResetModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in duration-200"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center"
          >
            <font-awesome-icon icon="key" class="text-xl text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-txt-primary dark:text-white m-0">Redefinir Senha</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 m-0">Confirmação de segurança</p>
          </div>
        </div>

        <div v-if="!resetPasswordResult" class="mb-6">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Uma nova senha será gerada automaticamente e enviada por e-mail para o colaborador
            <strong class="text-gray-900 dark:text-white"
              >{{ userToReset?.firstName }} {{ userToReset?.lastName }}</strong
            >
            ({{ userToReset?.email }}).
          </p>

          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mt-4"
          >
            <div class="flex gap-3">
              <font-awesome-icon icon="info-circle" class="text-blue-500 mt-0.5" />
              <p class="text-xs text-blue-800 dark:text-blue-200 m-0 leading-relaxed">
                A senha será gerada aleatoriamente pelo sistema. O colaborador receberá as
                instruções de acesso imediatamente por e-mail.
              </p>
            </div>
          </div>
        </div>

        <div v-else class="mb-6">
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 mb-4"
          >
            <div class="flex items-center gap-3 mb-2">
              <font-awesome-icon icon="check-circle" class="text-green-600 dark:text-green-400" />
              <span class="text-sm font-bold text-green-800 dark:text-green-200"
                >Senha redefinida com sucesso!</span
              >
            </div>
            <p class="text-xs text-green-700 dark:text-green-300 m-0 leading-relaxed">
              O e-mail com as novas credenciais foi enviado para
              <span class="font-semibold">{{ userToReset?.email }}</span>
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            v-if="!resetPasswordResult"
            class="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            @click="closePasswordResetModal"
            :disabled="isResettingPassword"
          >
            Cancelar
          </button>
          <button
            v-if="!resetPasswordResult"
            class="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            @click="confirmPasswordReset"
            :disabled="isResettingPassword"
          >
            <font-awesome-icon v-if="isResettingPassword" icon="spinner" spin />
            <span>{{ isResettingPassword ? 'Redefinindo...' : 'Confirmar Redefinição' }}</span>
          </button>
          <button
            v-if="resetPasswordResult"
            class="px-8 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
            @click="closePasswordResetModal"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { userService } from '@/services/userService';
import type { User } from '@/models';
import NewUserModal from '@/components/users/NewUserModal.vue';
import EditUserModal from '@/components/users/EditUserModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import DataTable from '@/components/common/DataTable.vue';
import Switch from '@/components/common/Switch.vue';
import ActionDropdown from '@/components/common/ActionDropdown.vue';
import type { TableHeader, PaginationInfo } from '@/components/common/DataTable.vue';
import { toast } from 'vue3-toastify';
import { useUserStore } from '@/stores/user';
import { useFiltersStore } from '@/stores/filters';
import Input from '@/components/common/Input.vue';

const userStore = useUserStore();
const filtersStore = useFiltersStore();

const users = ref<User[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isLoading = ref(false);
const isProcessing = ref(false);
const searchTerm = ref('');
const totalPages = ref(1);
const showInactiveUsers = ref(false);
const userToEdit = ref<User | null>(null);

const isConfirmationModalOpen = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const pendingAction = ref<{ type: 'deactivate' | 'activate'; user: User } | null>(null);

// Password Reset Modal State
const showPasswordResetModal = ref(false);
const isResettingPassword = ref(false);
const userToReset = ref<User | null>(null);
const resetPasswordResult = ref<any>(null);

const filteredUsers = computed(() => {
  if (showInactiveUsers.value) {
    return users.value;
  }
  return users.value.filter((user) => user.isActive);
});

const initialConfig = computed(() => ({
  items: filteredUsers.value,
  headers: [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      sortKey: 'firstName',
      sortDirection:
        filtersStore.currentSortBy === 'firstName' ? filtersStore.currentSortDirection : 'none',
      align: 'left' as const,
      width: 0.25, // 25% - good space for names
    },
    {
      key: 'department',
      label: 'Setor',
      sortable: false,
      align: 'center' as const,
      width: 0.15, // 15% - department names
    },
    {
      key: 'role',
      label: 'Perfil',
      sortable: false,
      align: 'center' as const,
      width: 0.15, // 15% - role column
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      align: 'center' as const,
      width: 0.25, // 25% - email addresses need more space
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: false,
      align: 'center' as const,
      width: 0.12, // 12% - status column
    },
  ],
  pagination: paginationInfo.value,
  isLoading: isLoading.value,
  currentSortKey: filtersStore.currentSortBy,
  currentSortDirection: filtersStore.currentSortDirection,
}));

const filterConfig = computed(() => ({
  search: {
    label: 'Search',
    placeholder: 'Buscar usuários',
    defaultValue: filtersStore.currentSearch || '',
  },
  sort: {
    label: 'Sort By',
    options: [
      { value: 'id', label: 'ID' },
      { value: 'firstName', label: 'Nome' },
    ],
    defaultValue: filtersStore.currentSortBy || '',
  },
  onFilterChange: (filterValues: Record<string, string>) => {
    if (filterValues.search !== undefined) {
      filtersStore.setSearch(filterValues.search);
    }
    if (filterValues.sort !== undefined) {
      filtersStore.setSort(filterValues.sort);
    }
  },
}));

const paginationInfo = computed(
  (): PaginationInfo => ({
    currentPage: filtersStore.currentPage,
    totalPages: totalPages.value,
  }),
);

const getUserInitials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  } else if (user.firstName) {
    return user.firstName.substring(0, 2).toUpperCase();
  }
  return 'U';
};

const handlePageChange = (page: number) => {
  filtersStore.setPage(page);
};

const handleRowClick = (user: User) => {
  // Could open user details modal or navigate to user profile
};

const handleSort = (sortKey: string) => {
  filtersStore.setSort(sortKey);
};

const loadUsers = async () => {
  isLoading.value = true;

  const filters: any = {
    name: filtersStore.currentSearch,
    page: filtersStore.currentPage,
  };

  if (filtersStore.currentSortBy) {
    filters.sortBy = filtersStore.currentSortBy;
    filters.sortOrder = filtersStore.currentSortOrder;
  }

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
      await userService.deactivate(user.uuid);
      toast.success(`Usuário ${user.firstName} ${user.lastName} foi desativado com sucesso.`);
    } else {
      await userService.activate(user.uuid);
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

const openEditModal = (user: User) => {
  userToEdit.value = user;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  userToEdit.value = null;
};

const handleResetPassword = (user: User) => {
  userToReset.value = user;
  showPasswordResetModal.value = true;
};

const confirmPasswordReset = async () => {
  if (!userToReset.value) return;

  try {
    isResettingPassword.value = true;
    const response = await userService.resetPasswordWithRandomPassword(userToReset.value.uuid);
    resetPasswordResult.value = response.data;
    toast.success('Senha redefinida com sucesso!');
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error);
    toast.error(error?.response?.data?.message || 'Erro ao redefinir senha');
  } finally {
    isResettingPassword.value = false;
  }
};

const closePasswordResetModal = () => {
  showPasswordResetModal.value = false;
  // Use a small timeout to clear data after animation
  setTimeout(() => {
    userToReset.value = null;
    resetPasswordResult.value = null;
  }, 200);
};

onMounted(() => {
  filtersStore.initialize('UserList');

  searchTerm.value = filtersStore.currentSearch || '';

  loadUsers();
});

watch(
  () => filtersStore.currentFilters,
  () => {
    loadUsers();
    filtersStore.syncUrl();
  },
  { deep: true },
);

watch(searchTerm, (newValue) => {
  filtersStore.setSearch(newValue);
});

// Sync store search value back to local ref when it changes (e.g., from URL)
watch(
  () => filtersStore.currentSearch,
  (newValue) => {
    if (searchTerm.value !== newValue) {
      searchTerm.value = newValue || '';
    }
  },
);
</script>
