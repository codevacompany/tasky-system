<template>
  <section class="p-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-txt-primary dark:text-white tracking-tight">
        Colaboradores
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Usuários do seu setor
        <span v-if="departmentName"> — {{ departmentName }}</span>
      </p>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft-xs mb-6"
    >
      <div class="w-full sm:w-1/3 min-w-0">
        <label
          for="searchCollaborators"
          class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5"
        >
          Buscar
        </label>
        <div class="relative">
          <font-awesome-icon
            icon="search"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
          />
          <Input
            id="searchCollaborators"
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nome"
            padding="normal"
            class="pl-10 pr-4 w-full text-sm border-gray-200 dark:border-gray-600 rounded-[5px] dark:bg-gray-700/50"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-xs overflow-hidden"
    >
      <DataTable
        :data="users"
        :headers="headers"
        :is-loading="isLoading"
        :pagination="pagination"
        :clickable="false"
        :show-actions="false"
        min-width="640px"
        row-key="id"
        @page-change="handlePageChange"
      >
        <template #column-name="{ item }">
          <span class="font-semibold text-txt-primary dark:text-gray-100">
            {{ item.firstName }} {{ item.lastName }}
          </span>
        </template>

        <template #column-email="{ item }">
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ item.email }}</span>
        </template>

        <template #column-role="{ item }">
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ item.role?.name || '—' }}</span>
        </template>

        <template #column-isActive="{ item }">
          <span
            class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
            :class="
              item.isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            "
          >
            {{ item.isActive ? 'Ativo' : 'Inativo' }}
          </span>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
              Nenhum colaborador encontrado
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{
                !departmentId
                  ? 'Você precisa estar vinculado a um setor.'
                  : searchTerm
                    ? 'Tente ajustar a busca.'
                    : 'Não há usuários neste setor.'
              }}
            </p>
          </div>
        </template>
      </DataTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import DataTable from '@/components/common/DataTable.vue';
import type { TableHeader } from '@/components/common/DataTable.vue';
import Input from '@/components/common/Input.vue';
import type { User } from '@/models';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const users = ref<User[]>([]);
const isLoading = ref(false);
const searchTerm = ref('');
const page = ref(1);
const totalPages = ref(1);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const departmentId = computed(() => userStore.user?.departmentId);
const departmentName = computed(() => userStore.user?.department?.name);

const headers = computed((): TableHeader[] => [
  { key: 'name', label: 'Nome', align: 'left' },
  { key: 'email', label: 'E-mail', align: 'left' },
  { key: 'role', label: 'Perfil', align: 'left' },
  { key: 'isActive', label: 'Status', align: 'left' },
]);

const pagination = computed(() => ({
  currentPage: page.value,
  totalPages: totalPages.value,
  totalItems: users.value.length,
  itemsPerPage: 20,
}));

const loadUsers = async () => {
  if (!departmentId.value) {
    users.value = [];
    totalPages.value = 1;
    return;
  }

  isLoading.value = true;
  try {
    const { data } = await userService.getByDepartment(departmentId.value, {
      name: searchTerm.value || undefined,
      page: page.value,
      limit: 20,
    });
    users.value = data.items;
    totalPages.value = data.totalPages;
  } catch {
    toast.error('Erro ao carregar colaboradores');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (nextPage: number) => {
  page.value = nextPage;
  loadUsers();
};

watch(searchTerm, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    loadUsers();
  }, 250);
});

onMounted(loadUsers);
</script>
