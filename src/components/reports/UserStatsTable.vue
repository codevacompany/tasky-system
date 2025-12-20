<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 dark:shadow-none dark:border dark:border-gray-700"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Estatísticas por Colaborador
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Análise detalhada de desempenho por colaborador
          </p>
        </div>
        <div class="w-full sm:w-auto">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar colaborador"
            padding="tight"
            class="w-full sm:w-80 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <div
      v-if="summary && filteredUsers.length > 0"
      class="p-6 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ filteredUsers.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Colaboradores</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ summary.totalTickets }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tickets</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ summary.totalResolved }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Resolvidos</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ formatTimeInSecondsCompact(summary.averageAcceptanceTimeSeconds) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tempo Médio de Aceite</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ formatTimeInSecondsCompact(summary.averageResolutionTimeSeconds) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tempo Médio de Resolução</div>
        </div>
      </div>
    </div>

    <DataTable
      :data="paginatedUsers"
      :headers="tableHeaders"
      :pagination="pagination"
      :is-loading="isLoading"
      :row-key="(item) => item.userId"
      :show-actions="false"
      @sort="handleSort"
      @page-change="handlePageChange"
    >
      <template #column-user="{ item }">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              getAvatarColorClass(item.userId),
            ]"
          >
            <div v-if="!item.avatarUrl">
              {{ getInitials(item.firstName, item.lastName) }}
            </div>
            <img
              v-else
              :src="item.avatarUrl"
              :alt="`${item.firstName} ${item.lastName}`"
              class="w-full h-full object-cover rounded-full"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ item.firstName }} {{ item.lastName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ item.departmentName }}
            </p>
          </div>
        </div>
      </template>

      <template #column-averageAcceptanceTimeSeconds="{ value }">
        {{ formatTimeInSecondsCompact(value) }}
      </template>

      <template #column-averageResolutionTimeSeconds="{ value }">
        {{ formatTimeInSecondsCompact(value) }}
      </template>

      <template #empty>
        <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum colaborador encontrado</p>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import DataTable, {
  type TableHeader,
  type PaginationInfo,
} from '@/components/common/DataTable.vue';
import Input from '@/components/common/Input.vue';
import type { UserRankingItemDto } from '@/services/reportService';
import { formatTimeInSecondsCompact } from '@/utils/generic-helper';

interface Props {
  users: UserRankingItemDto[];
  averageResolutionTimeSeconds?: number;
  averageAcceptanceTimeSeconds?: number;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

// Search state
const searchQuery = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Sorting state
const sortKey = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc' | 'none'>('none');

// Filtered users based on search
const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return props.users;
  return props.users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q),
  );
});

// Summary computed from filtered users
const summary = computed(() => {
  if (!filteredUsers.value || filteredUsers.value.length === 0) return null;

  const totalTickets = filteredUsers.value.reduce((acc, u) => acc + (u.totalTickets || 0), 0);
  const totalResolved = filteredUsers.value.reduce(
    (acc, u) => acc + (u.resolvedTickets || 0),
    0,
  );

  return {
    totalTickets,
    totalResolved,
    averageResolutionTimeSeconds: props.averageResolutionTimeSeconds || 0,
    averageAcceptanceTimeSeconds: props.averageAcceptanceTimeSeconds || 0,
  };
});

// Table headers
const tableHeaders = computed<TableHeader<UserRankingItemDto>[]>(() => [
  {
    key: 'user',
    label: 'Colaborador',
    sortable: false,
    align: 'left',
  },
  {
    key: 'resolvedTickets',
    label: 'Tarefas Resolvidas',
    sortable: true,
    sortKey: 'resolvedTickets',
    align: 'center',
    sortDirection: sortKey.value === 'resolvedTickets' ? sortDirection.value : 'none',
  },
  {
    key: 'totalTickets',
    label: 'Tarefas Totais',
    sortable: true,
    sortKey: 'totalTickets',
    align: 'center',
    sortDirection: sortKey.value === 'totalTickets' ? sortDirection.value : 'none',
  },
  {
    key: 'averageAcceptanceTimeSeconds',
    label: 'Tempo de Aceite',
    sortable: true,
    sortKey: 'averageAcceptanceTimeSeconds',
    align: 'center',
    sortDirection: sortKey.value === 'averageAcceptanceTimeSeconds' ? sortDirection.value : 'none',
  },
  {
    key: 'averageResolutionTimeSeconds',
    label: 'Tempo de Resolução',
    sortable: true,
    sortKey: 'averageResolutionTimeSeconds',
    align: 'center',
    sortDirection: sortKey.value === 'averageResolutionTimeSeconds' ? sortDirection.value : 'none',
  },
]);

// Sorted users
const sortedUsers = computed(() => {
  if (!filteredUsers.value || filteredUsers.value.length === 0) return [];
  if (!sortKey.value || sortDirection.value === 'none') return filteredUsers.value;

  const sorted = [...filteredUsers.value].sort((a, b) => {
    const aValue = (a as any)[sortKey.value!];
    const bValue = (b as any)[sortKey.value!];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Numeric comparison
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });

  return sorted;
});

// Paginated users
const paginatedUsers = computed(() => {
  if (!sortedUsers.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedUsers.value.slice(start, end);
});

// Pagination info
const pagination = computed<PaginationInfo | undefined>(() => {
  if (!sortedUsers.value || sortedUsers.value.length === 0) return undefined;
  const totalPages = Math.ceil(sortedUsers.value.length / itemsPerPage);
  return {
    currentPage: currentPage.value,
    totalPages,
    totalItems: sortedUsers.value.length,
    itemsPerPage,
  };
});

// Handle sort
const handleSort = (sortKeyParam: string) => {
  // If clicking the same column, cycle through: none -> asc -> desc -> none
  if (sortKey.value === sortKeyParam) {
    if (sortDirection.value === 'none') {
      sortDirection.value = 'asc';
    } else if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
    } else {
      // desc -> none (reset sort)
      sortKey.value = null;
      sortDirection.value = 'none';
    }
  } else {
    // New column, start with ascending
    sortKey.value = sortKeyParam;
    sortDirection.value = 'asc';
  }
  // Reset to first page when sorting changes
  currentPage.value = 1;
};

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// Format percentage helper
const formatPercentage = (value?: number) => {
  if (value == null || isNaN(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

// Get resolution rate badge class
const getResolutionRateBadgeClass = (rate?: number) => {
  if (rate === undefined) return 'bg-gray-100 text-gray-800';

  const percentage = rate * 100;

  if (percentage >= 70) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  } else if (percentage >= 40) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

// Get user initials
const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName ? firstName.charAt(0) : '';
  const lastInitial = lastName ? lastName.charAt(0) : '';
  return (firstInitial + lastInitial).toUpperCase();
};

// Get avatar color class
const getAvatarColorClass = (userId: number): string => {
  return 'avatar-blue';
};

// Reset pagination when users or search changes
watch(
  () => [props.users, searchQuery.value],
  () => {
    currentPage.value = 1;
    sortKey.value = null;
    sortDirection.value = 'none';
  },
);
</script>

<style scoped>
.avatar-blue {
  @apply bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300;
}
</style>

