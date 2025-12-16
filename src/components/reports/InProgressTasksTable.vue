<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 p-3"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Tarefas em Andamento
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Acompanhe o progresso das tarefas atualmente sendo processadas
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ tasks.length }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ overdueCount }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Em atraso</div>
          </div>
        </div>
      </div>
    </div>

    <DataTable
      :data="paginatedTasks"
      :headers="tableHeaders"
      :pagination="pagination"
      :is-loading="showLoading"
      :row-key="(item) => item.id"
      :show-actions="false"
      @sort="handleSort"
      @page-change="handlePageChange"
    >
      <template #column-assignee="{ item }">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400"
          >
            {{ item.assignee.initials }}
          </div>
          <span class="text-sm text-gray-900 dark:text-white">
            {{ item.assignee.name }}
          </span>
        </div>
      </template>

      <template #column-ticket="{ item }">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
            {{ item.customId }}
          </span>
          <span class="text-sm text-gray-900 dark:text-white">
            {{ item.name }}
          </span>
        </div>
      </template>

      <template #column-status="{ value }">
        <span
          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
        >
          {{ value }}
        </span>
      </template>

      <template #column-timeInProgress="{ item }">
        <div class="flex items-center justify-center gap-1">
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ item.timeInProgress }}
          </span>
          <span
            v-if="item.isOverdue"
            class="text-red-600 dark:text-red-400 ml-1"
            :title="item.overdueReason"
          >
            <font-awesome-icon icon="exclamation-triangle" />
          </span>
        </div>
      </template>

      <template #empty>
        <div
          class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
        >
          <font-awesome-icon icon="check-circle" class="text-3xl mb-3 text-green-500" />
          <p class="text-lg font-medium">Nenhum ticket em andamento</p>
          <p class="text-sm">Todos os tickets foram processados!</p>
        </div>
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

export interface InProgressTask {
  id: number;
  customId: string;
  name: string;
  assignee: {
    name: string;
    initials: string;
  };
  status: string;
  timeInProgress: string;
  isOverdue: boolean;
  overdueReason?: string;
  timeInProgressSeconds: number;
}

interface Props {
  tasks: InProgressTask[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

// Track if we've ever loaded data (to distinguish initial load from polling updates)
const hasLoadedData = ref(false);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Sorting state
const sortKey = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc' | 'none'>('none');

// Only show loading spinner on initial load (when we haven't loaded data yet)
const showLoading = computed(() => {
  return props.isLoading && !hasLoadedData.value;
});

// Overdue count
const overdueCount = computed(() => {
  return props.tasks.filter((task) => task.isOverdue).length;
});

// Table headers
const tableHeaders = computed<TableHeader<InProgressTask>[]>(() => [
  {
    key: 'assignee',
    label: 'Responsável',
    sortable: false,
    align: 'left',
  },
  {
    key: 'ticket',
    label: 'Título',
    sortable: false,
    align: 'left',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    sortKey: 'status',
    align: 'center',
    sortDirection: sortKey.value === 'status' ? sortDirection.value : 'none',
  },
  {
    key: 'timeInProgress',
    label: 'Tempo em Andamento',
    sortable: true,
    sortKey: 'timeInProgressSeconds',
    align: 'center',
    sortDirection: sortKey.value === 'timeInProgressSeconds' ? sortDirection.value : 'none',
  },
]);

// Sorted tasks
const sortedTasks = computed(() => {
  if (!props.tasks || props.tasks.length === 0) return [];
  if (!sortKey.value || sortDirection.value === 'none') return props.tasks;

  const sorted = [...props.tasks].sort((a, b) => {
    const aValue = (a as any)[sortKey.value!];
    const bValue = (b as any)[sortKey.value!];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // String comparison for status
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

// Paginated tasks
const paginatedTasks = computed(() => {
  if (!sortedTasks.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedTasks.value.slice(start, end);
});

// Pagination info
const pagination = computed<PaginationInfo | undefined>(() => {
  if (!sortedTasks.value || sortedTasks.value.length === 0) return undefined;
  const totalPages = Math.ceil(sortedTasks.value.length / itemsPerPage);
  return {
    currentPage: currentPage.value,
    totalPages,
    totalItems: sortedTasks.value.length,
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

// Track when data is loaded and reset pagination/sorting when tasks change
watch(
  () => props.tasks,
  (newTasks) => {
    // Mark that we've loaded data if we have tasks
    if (newTasks && newTasks.length > 0) {
      hasLoadedData.value = true;
    }

    currentPage.value = 1;
    sortKey.value = null;
    sortDirection.value = 'none';
  },
);

// Also track loading state to mark when initial load completes
watch(
  () => props.isLoading,
  (isLoading) => {
    // When loading finishes and we have data, mark as loaded
    if (!isLoading && props.tasks && props.tasks.length > 0) {
      hasLoadedData.value = true;
    }
  },
);
</script>
