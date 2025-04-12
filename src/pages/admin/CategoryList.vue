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
        <input type="text" id="searchTickets" placeholder="Buscar categorias" v-model="searchTerm" />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table" id="categoriasTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="2" class="loading-cell">
              <div class="loading-wrapper">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Category Modal -->
    <NewCategoryModal :isOpen="isModalOpen" @close="closeModal" @categoryCreated="loadCategories" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/models';
import NewCategoryModal from '@/components/categories/NewCategoryModal.vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { debounce } from '@/utils/debounce';

const isLoading = ref(false);
const categories = ref<Category[]>([]);
const isModalOpen = ref(false);
const searchTerm = ref('');

const debouncedSearch = debounce(() => {
  loadCategories();
}, 400);

const loadCategories = async () => {
  isLoading.value = true;
  const name = searchTerm.value.trim() || undefined;

  try {
    const response = await categoryService.fetch({ name });
    categories.value = response.data;
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

onMounted(loadCategories);

watch(searchTerm, () => {
  debouncedSearch();
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
</style>
