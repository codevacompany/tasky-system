<template>
  <section id="categoriasSection" class="p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
      <button
        id="newCategoriaBtn"
        class="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        @click="openModal"
      >
        <font-awesome-icon icon="plus" />
        <span>Nova Categoria</span>
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
            id="searchCategories"
            :placeholder="filterConfig.search.placeholder"
            v-model="searchTerm"
            class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
          />
        </div>
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
        minWidth="600px"
        rowKey="id"
        @pageChange="handlePageChange"
        @rowClick="handleRowClick"
        @sort="handleSort"
      >
        <template #column-name="{ item }">
          <div class="font-medium text-gray-900 dark:text-gray-100">
            {{ item.name }}
          </div>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center justify-center gap-2">
            <button
              class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-200"
              @click.stop="openEditModal(item)"
              title="Editar categoria"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button
              class="w-8 h-8 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all duration-200"
              @click.stop="confirmDelete(item)"
              title="Excluir categoria"
            >
              <font-awesome-icon icon="trash" />
            </button>
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
import type { TableHeader, PaginationInfo } from '@/components/common/DataTable.vue';
import { toast } from 'vue3-toastify';
import { AxiosError } from 'axios';
import { useFiltersStore } from '@/stores/filters';

const filtersStore = useFiltersStore();

const categories = ref<Category[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isLoading = ref(false);
const searchTerm = ref('');
const totalPages = ref(1);
const showDeleteConfirmation = ref(false);
const categoryToDelete = ref<Category | null>(null);
const categoryToEdit = ref<Category | null>(null);

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
    await categoryService.delete(categoryToDelete.value.id);
    toast.success('Categoria excluída com sucesso!');
    loadCategories();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast.error('Já existem tickets com essa categoria e por isso não pode ser excluída.');
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
  () => filtersStore.filters,
  () => {
    loadCategories();
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
