<template>
  <section id="categoriasSection" class="p-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-txt-primary dark:text-white tracking-tight">
        Categorias
      </h1>
      <button
        id="newCategoriaBtn"
        class="flex items-center gap-2 px-4 py-2 btn btn-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
        @click="openModal"
      >
        <font-awesome-icon icon="plus" />
        <span>Nova Categoria</span>
      </button>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-soft-xs mb-6"
    >
      <h2 class="text-lg font-bold text-txt-primary dark:text-white tracking-tight">
        Gestão de Categorias
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Visualize e gerencie as categorias do sistema.
      </p>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft-xs mb-6"
    >
      <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:gap-6">
        <div class="w-full sm:w-1/4 min-w-0">
          <label for="searchCategories" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Buscar
          </label>
          <div class="relative">
            <font-awesome-icon
              icon="search"
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
            />
            <Input
              id="searchCategories"
              v-model="searchTerm"
              type="text"
              :placeholder="filterConfig.search.placeholder"
              padding="normal"
              class="pl-10 pr-4 w-full text-gray-700 dark:text-gray-300 text-sm border-gray-200 dark:border-gray-600 rounded-[5px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:bg-gray-700/50"
            />
          </div>
        </div>
        <div class="w-full sm:w-1/4 min-w-0">
          <label for="sortCategories" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Ordenar por
          </label>
          <Select
            id="sortCategories"
            v-model="sortByValue"
            :options="sortOptions"
            placeholder="Ordenar por..."
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-xs overflow-hidden"
    >
      <DataTable
        :data="initialConfig.items"
        :headers="initialConfig.headers"
        :isLoading="initialConfig.isLoading"
        :pagination="initialConfig.pagination"
        :clickable="true"
        :showActions="true"
        :showDeleteButton="false"
        minWidth="600px"
        rowKey="id"
        @pageChange="handlePageChange"
        @rowClick="handleRowClick"
        @sort="handleSort"
      >
        <template #column-name="{ item }">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-600 text-white"
            >
              <font-awesome-icon icon="tags" class="w-5 h-5" />
            </div>
            <div>
              <span class="font-semibold text-txt-primary dark:text-gray-100">
                {{ item.name }}
              </span>
            </div>
          </div>
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
            <div class="h-px bg-gray-100 dark:bg-gray-700 my-1" />
            <button
              @click.stop="
                confirmDelete(item);
                close();
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <font-awesome-icon icon="trash" class="w-4" />
              <span>Excluir</span>
            </button>
          </ActionDropdown>
        </template>

        <template #empty>
          <div
            class="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl mx-4 mb-4"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-4"
            >
              <font-awesome-icon
                icon="tags"
                class="text-2xl text-white"
              />
            </div>
            <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
              Nenhuma categoria encontrada
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              {{ searchTerm ? 'Tente ajustar o filtro de busca.' : 'Comece criando uma nova categoria.' }}
            </p>
          </div>
        </template>
      </DataTable>
    </div>

    <NewCategoryModal v-if="isModalOpen" @close="closeModal" @categoryCreated="loadCategories" />

    <EditCategoryModal
      v-if="isEditModalOpen"
      :category="categoryToEdit"
      @close="closeEditModal"
      @categoryUpdated="loadCategories"
    />

    <ConfirmationModal
      v-if="showDeleteConfirmation"
      title="Excluir Categoria"
      :message="`Tem certeza que deseja excluir a categoria '${categoryToDelete?.name}'?`"
      @confirm="deleteCategory"
      @cancel="cancelDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/models';
import NewCategoryModal from '@/components/categories/NewCategoryModal.vue';
import EditCategoryModal from '@/components/categories/EditCategoryModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import DataTable from '@/components/common/DataTable.vue';
import ActionDropdown from '@/components/common/ActionDropdown.vue';
import Select from '@/components/common/Select.vue';
import type { TableHeader, PaginationInfo } from '@/components/common/DataTable.vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useFiltersStore } from '@/stores/filters';
import Input from '@/components/common/Input.vue';

const filtersStore = useFiltersStore();

const SORT_OPTIONS = [
  { value: '', label: 'Padrão' },
  { value: 'name_asc', label: 'Nome (A–Z)' },
  { value: 'name_desc', label: 'Nome (Z–A)' },
] as const;

const sortOptions = SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

const categories = ref<Category[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isLoading = ref(false);
const searchTerm = ref('');
const totalPages = ref(1);
const showDeleteConfirmation = ref(false);
const categoryToDelete = ref<Category | null>(null);
const categoryToEdit = ref<Category | null>(null);

const sortByValue = computed({
  get() {
    const by = filtersStore.currentSortBy;
    const order = filtersStore.currentSortOrder;
    if (!by || !order) return '';
    return `${by}_${order}`;
  },
  set(value: string) {
    if (!value) {
      filtersStore.clearFilter('sortBy');
      filtersStore.clearFilter('sortOrder');
      return;
    }
    const [sortBy, sortOrder] = value.split('_') as [string, 'asc' | 'desc'];
    filtersStore.applyFilters({ sortBy, sortOrder });
  },
});

const headers = computed((): TableHeader[] => [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    sortKey: 'name',
    align: 'left',
    sortDirection:
      filtersStore.currentSortBy === 'name' ? filtersStore.currentSortDirection : 'none',
  },
]);

const initialConfig = computed(() => ({
  items: categories.value,
  headers: headers.value,
  isLoading: isLoading.value,
  pagination: {
    currentPage: filtersStore.currentPage,
    totalPages: totalPages.value,
    totalItems: categories.value.length,
    itemsPerPage: 10,
  },
}));

const filterConfig = computed(() => ({
  search: {
    label: 'Search',
    placeholder: 'Buscar categorias',
    defaultValue: filtersStore.currentSearch || '',
  },
  sort: {
    label: 'Sort By',
    options: [
      { value: 'id', label: 'ID' },
      { value: 'name', label: 'Nome' },
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

const handlePageChange = (page: number) => {
  filtersStore.setPage(page);
};

const handleRowClick = (category: Category) => {
  // Could open category details modal or navigate to category profile
};

const handleSort = (sortKey: string) => {
  filtersStore.setSort(sortKey);
};

const loadCategories = async () => {
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
    const response = await categoryService.fetch(filters);
    categories.value = response.data.items;
    totalPages.value = response.data.totalPages;
  } catch {
    toast.error('Erro ao carregar categorias. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const openEditModal = (category: Category) => {
  categoryToEdit.value = category;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  categoryToEdit.value = null;
};

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  categoryToDelete.value = null;
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  try {
    await categoryService.delete(categoryToDelete.value.uuid);
    toast.success('Categoria excluída com sucesso!');
    loadCategories();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast.error('Já existem tarefas com essa categoria e por isso não pode ser excluída.');
    } else {
      toast.error('Erro ao excluir categoria. Tente novamente.');
    }
  } finally {
    showDeleteConfirmation.value = false;
    categoryToDelete.value = null;
  }
};

onMounted(() => {
  filtersStore.initialize('CategoryList');

  searchTerm.value = filtersStore.currentSearch || '';

  loadCategories();
});

watch(
  () => filtersStore.currentFilters,
  () => {
    loadCategories();
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
