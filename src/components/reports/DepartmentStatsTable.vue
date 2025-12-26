<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 dark:shadow-none dark:border dark:border-gray-700"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Estatísticas por Setor
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Análise detalhada do desempenho de cada setor
          </p>
        </div>
        <div class="w-full sm:w-auto">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar setor"
            padding="tight"
            class="w-full sm:w-80 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @update:modelValue="handleSearch"
          />
        </div>
      </div>
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
            {{ totalItems }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Setores Ativos</div>
        </div>
      </div>
    </div>

    <DataTable
      :data="stats"
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

      <template #column-efficiencyScore="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {{ formatPercentage(value) }}
        </span>
      </template>

      <template #column-deliveryOverdueRate="{ value }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getOverdueBadgeClass(value),
          ]"
        >
          {{ formatOverdueRate(value) }}
        </span>
      </template>

      <template #empty>
        <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum setor encontrado</p>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable, {
  type TableHeader,
  type PaginationInfo,
} from '@/components/common/DataTable.vue';
import Input from '@/components/common/Input.vue';
import type { DepartmentStats } from '@/services/reportService';
import { formatTimeInSecondsCompact, debounce } from '@/utils/generic-helper';

// Format percentage helper
const formatPercentage = (value?: number) => {
  if (value == null || isNaN(value)) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

// Format overdue rate helper (already a percentage)
const formatOverdueRate = (value?: number) => {
  if (value == null || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

// Get overdue rate badge class
const getOverdueBadgeClass = (rate?: number) => {
  if (rate === undefined || rate === null) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  // Lower is better for overdue rate
  if (rate <= 10) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  } else if (rate <= 25) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  } else {
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  }
};

interface Props {
  stats: DepartmentStats[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  summary: {
    totalTickets: number;
    totalResolved: number;
    averageResolutionTimeSeconds: number;
    averageAcceptanceTimeSeconds: number;
  } | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  stats: () => [],
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
});

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'sort-change', key: string, direction: 'asc' | 'desc'): void;
  (e: 'search-change', query: string): void;
}>();

// Search state
const searchQuery = ref('');

// Sorting state
const sortKey = ref<string>('efficiencyScore');
const sortDirection = ref<'asc' | 'desc'>('desc');

// Debounced search handler
const handleSearch = debounce((value: any) => {
  emit('search-change', value);
}, 300);

// Pagination info
const pagination = computed<PaginationInfo>(() => {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
  return {
    currentPage: props.currentPage,
    totalPages,
    totalItems: props.totalItems,
    itemsPerPage: props.itemsPerPage,
  };
});

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
  {
    key: 'efficiencyScore',
    label: '% de Desempenho',
    sortable: true,
    sortKey: 'efficiencyScore',
    align: 'center',
    sortDirection: sortKey.value === 'efficiencyScore' ? sortDirection.value : 'none',
  },
  {
    key: 'deliveryOverdueRate',
    label: '% de Atraso',
    sortable: true,
    sortKey: 'deliveryOverdueRate',
    align: 'center',
    sortDirection: sortKey.value === 'deliveryOverdueRate' ? sortDirection.value : 'none',
  },
]);

// Handle sort
const handleSort = (sortKeyParam: string) => {
  if (sortKey.value === sortKeyParam) {
    if (sortDirection.value === 'desc') {
      sortDirection.value = 'asc';
    } else if (sortDirection.value === 'asc') {
      // Reset
      sortKey.value = '';
      sortDirection.value = 'desc'; // Reset direction default
      emit('sort-change', '', 'desc');
      return;
    }
  } else {
    sortKey.value = sortKeyParam;
    sortDirection.value = 'desc';
  }
  emit('sort-change', sortKey.value, sortDirection.value);
};

// Handle page change
const handlePageChange = (page: number) => {
  emit('page-change', page);
};
</script>
