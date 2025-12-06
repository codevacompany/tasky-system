<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 dark:shadow-none dark:border dark:border-gray-700"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Estatísticas por Setor
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Análise detalhada do desempenho de cada departamento
      </p>
    </div>

    <div v-if="summary" class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ summary.totalTickets }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total de Tickets</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ summary.totalResolved }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tickets Resolvidos</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ formatTimeInSecondsCompact(summary.averageResolutionTimeSeconds) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tempo Médio de Resolução</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ stats.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Setores Ativos</div>
        </div>
      </div>
    </div>

    <DataTable
      :data="paginatedStats"
      :headers="tableHeaders"
      :pagination="pagination"
      :is-loading="isLoading"
      :row-key="(item) => item.departmentId"
      :show-actions="false"
      @sort="handleSort"
      @page-change="handlePageChange"
    >
      <template #column-departmentName="{ item }">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          >
            <font-awesome-icon icon="building" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
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
        <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum setor encontrado</p>
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
import type { DepartmentStats } from '@/services/reportService';
import { formatTimeInSecondsCompact } from '@/utils/generic-helper';

// Format percentage helper
const formatPercentage = (value?: number) => {
  if (value == null || isNaN(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

interface Props {
  stats: DepartmentStats[];
  summary: {
    totalTickets: number;
    totalResolved: number;
    averageResolutionTimeSeconds: number;
    averageAcceptanceTimeSeconds: number;
    averageTotalTimeSeconds: number;
  } | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Sorting state - default to sorting by resolvedTickets descending
const sortKey = ref<string | null>('resolvedTickets');
const sortDirection = ref<'asc' | 'desc' | 'none'>('desc');

// Table headers
const tableHeaders = computed<TableHeader<DepartmentStats>[]>(() => [
  {
    key: 'departmentName',
    label: 'Setor',
    sortable: true,
    sortKey: 'departmentName',
    align: 'left',
    sortDirection: sortKey.value === 'departmentName' ? sortDirection.value : 'none',
  },
  {
    key: 'userCount',
    label: 'Colaboradores',
    sortable: true,
    sortKey: 'userCount',
    align: 'center',
    sortDirection: sortKey.value === 'userCount' ? sortDirection.value : 'none',
  },
  {
    key: 'totalTickets',
    label: 'Total',
    sortable: true,
    sortKey: 'totalTickets',
    align: 'center',
    sortDirection: sortKey.value === 'totalTickets' ? sortDirection.value : 'none',
  },
  {
    key: 'resolvedTickets',
    label: 'Resolvidos',
    sortable: true,
    sortKey: 'resolvedTickets',
    align: 'center',
    sortDirection: sortKey.value === 'resolvedTickets' ? sortDirection.value : 'none',
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

// Sorted stats
const sortedStats = computed(() => {
  if (!props.stats || props.stats.length === 0) return [];
  if (!sortKey.value || sortDirection.value === 'none') return props.stats;

  const sorted = [...props.stats].sort((a, b) => {
    const aValue = (a as any)[sortKey.value!];
    const bValue = (b as any)[sortKey.value!];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Compare values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Numeric comparison
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });

  return sorted;
});

// Paginated stats
const paginatedStats = computed(() => {
  if (!sortedStats.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedStats.value.slice(start, end);
});

// Pagination info
const pagination = computed<PaginationInfo | undefined>(() => {
  if (!sortedStats.value || sortedStats.value.length === 0) return undefined;
  const totalPages = Math.ceil(sortedStats.value.length / itemsPerPage);
  return {
    currentPage: currentPage.value,
    totalPages,
    totalItems: sortedStats.value.length,
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

// Reset pagination when stats change (but keep default sorting)
watch(
  () => props.stats,
  () => {
    currentPage.value = 1;
    // Keep default sorting by resolvedTickets descending
    if (!sortKey.value) {
      sortKey.value = 'resolvedTickets';
      sortDirection.value = 'desc';
    }
  },
);
</script>
