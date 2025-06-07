<template>
  <section id="categoriasSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Categorias</h1>
      <button id="newCategoriaBtn" class="btn btn-primary" @click="openModal">
        <font-awesome-icon icon="plus" />
        <p>Nova Categoria</p>
      </button>
    </div>

    <div class="search-group">
      <div class="search-input-wrapper">
        <font-awesome-icon icon="search" class="input-icon" />
        <input
          type="text"
          id="searchTickets"
          placeholder="Buscar categorias"
          v-model="searchTerm"
        />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table" id="categoriasTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="3" class="loading-cell">
              <div class="loading-wrapper">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
              <div class="actions-container">
                <button class="action-button edit" @click="openEditModal(category)">
                  <font-awesome-icon icon="edit" />
                </button>
                <button class="action-button delete" @click="confirmDelete(category)">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button class="btn btn-icon" :disabled="currentPage === 1" @click="currentPage--">
        <font-awesome-icon icon="chevron-left" />
      </button>

      <span>Página {{ currentPage }} de {{ totalPages }}</span>

      <button class="btn btn-icon" :disabled="currentPage === totalPages" @click="currentPage++">
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <NewCategoryModal :isOpen="isModalOpen" @close="closeModal" @categoryCreated="loadCategories" />

    <EditCategoryModal
      :isOpen="isEditModalOpen"
      :category="categoryToEdit"
      @close="closeEditModal"
      @categoryUpdated="loadCategories"
    />

    <ConfirmationModal
      :isOpen="showDeleteConfirmation"
      title="Excluir Categoria"
      :message="`Tem certeza que deseja excluir a categoria '${categoryToDelete?.name}'?`"
      @confirm="deleteCategory"
      @cancel="cancelDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/models';
import NewCategoryModal from '@/components/categories/NewCategoryModal.vue';
import EditCategoryModal from '@/components/categories/EditCategoryModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { debounce } from '@/utils/generic-helper';
import { AxiosError } from 'axios';

const isLoading = ref(false);
const categories = ref<Category[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const showDeleteConfirmation = ref(false);
const categoryToDelete = ref<Category | null>(null);
const categoryToEdit = ref<Category | null>(null);

const debouncedSearch = debounce(() => {
  loadCategories();
}, 400);

const loadCategories = async () => {
  isLoading.value = true;
  const name = searchTerm.value.trim() || undefined;
  const filters = { name, page: currentPage.value };

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

onMounted(loadCategories);

watch(searchTerm, () => {
  debouncedSearch();
});

watch(currentPage, () => {
  loadCategories();
});
</script>

<style scoped>
.loading-cell {
  margin: 2rem 0;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

h1,
h3 {
  color: black;
}

.header-action-btn {
  gap: 5px;
}

.search-group {
  width: 250px;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input-wrapper input {
  padding-left: 2rem; /* space for the icon */
}

.input-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
  height: 15px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.btn-icon:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#paginationInfo {
  font-size: 0.9rem;
  color: var(--text-light);
}

.actions-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.edit {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-button.edit:hover {
  background-color: #3b82f6;
  color: white;
}

.action-button.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-button.delete:hover {
  background-color: #ef4444;
  color: white;
}
</style>
