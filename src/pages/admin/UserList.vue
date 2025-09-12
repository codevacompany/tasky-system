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
            :placeholder="filterConfig.search.placeholder"
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
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ item.firstName }} {{ item.lastName }}
            </div>
          </div>
        </template>

        <template #column-email="{ value }">
          <span class="text-sm text-gray-900 dark:text-gray-100">
            {{ value }}
          </span>
        </template>

        <template #column-department="{ value }">
          <span class="text-sm text-gray-900 dark:text-gray-100">
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
          <div class="flex items-center gap-2">
            <button
              v-if="item.isActive && userStore.user?.id !== item.id"
              @click.stop="deactivateUser(item)"
              class="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium rounded-md transition-colors"
              :disabled="isProcessing"
            >
              <font-awesome-icon icon="user-slash" class="w-3 h-3 mr-1" />
              Desativar
            </button>
            <span
              v-else-if="item.isActive && userStore.user?.id === item.id"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 text-xs font-medium rounded-md cursor-not-allowed"
              title="Você não pode desativar sua própria conta"
            >
              <font-awesome-icon icon="user" class="w-3 h-3 mr-1" />
              Você
            </span>
            <button
              v-else-if="!item.isActive"
              @click.stop="activateUser(item)"
              class="inline-flex items-center px-3 py-1.5 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs font-medium rounded-md transition-colors"
              :disabled="isProcessing"
            >
              <font-awesome-icon icon="user-check" class="w-3 h-3 mr-1" />
              Ativar
            </button>
          </div>
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

    <ConfirmationModal
      v-if="isConfirmationModalOpen"
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
import DataTable from '@/components/common/DataTable.vue';
import type { TableHeader, PaginationInfo } from '@/components/common/DataTable.vue';
import { toast } from 'vue3-toastify';
import { useUserStore } from '@/stores/user';
import { useFiltersStore } from '@/stores/filters';

const userStore = useUserStore();
const filtersStore = useFiltersStore();

const users = ref<User[]>([]);
const isModalOpen = ref(false);
const isLoading = ref(false);
const isProcessing = ref(false);
const searchTerm = ref('');
const totalPages = ref(1);
const showInactiveUsers = ref(false);

const isConfirmationModalOpen = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const pendingAction = ref<{ type: 'deactivate' | 'activate'; user: User } | null>(null);

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
      key: 'id',
      label: 'ID',
      sortable: true,
      sortKey: 'id',
      sortDirection:
        filtersStore.currentSortBy === 'id' ? filtersStore.currentSortDirection : 'none',
      align: 'left' as const,
      width: 'w-1/6',
    },
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      sortKey: 'firstName',
      sortDirection:
        filtersStore.currentSortBy === 'firstName' ? filtersStore.currentSortDirection : 'none',
      align: 'left' as const,
      width: 'w-1/6',
    },
    {
      key: 'department',
      label: 'Setor',
      sortable: false,
      align: 'center' as const,
      width: 'w-1/6',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      align: 'center' as const,
      width: 'w-1/6',
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: false,
      align: 'center' as const,
      width: 'w-1/6',
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
    placeholder: 'Buscar usuários...',
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

onMounted(() => {
  filtersStore.initialize('UserList');

  searchTerm.value = filtersStore.currentSearch || '';

  loadUsers();
});

watch(
  () => filtersStore.filters,
  () => {
    loadUsers();
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
