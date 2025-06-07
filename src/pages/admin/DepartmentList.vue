<template>
  <section id="setoresSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Setores</h1>
      <button id="newSetorBtn" class="btn btn-primary" @click="openModal">
        <font-awesome-icon icon="plus" />
        <p>Novo Setor</p>
      </button>
    </div>

    <div class="search-group">
      <div class="search-input-wrapper">
        <font-awesome-icon icon="search" class="input-icon" />
        <input type="text" id="searchTickets" placeholder="Buscar setores" v-model="searchTerm" />
      </div>
    </div>

    <div class="table-container">
      <table class="data-table" id="setoresTable">
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
          <tr v-else v-for="department in departments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.name }}</td>
            <td>
              <div class="actions-container">
                <button class="action-button edit" @click="openEditModal(department)">
                  <font-awesome-icon icon="edit" />
                </button>
                <button class="action-button delete" @click="confirmDelete(department)">
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

    <NewDepartmentModal
      :isOpen="isModalOpen"
      @close="closeModal"
      @departmentCreated="loadDepartments"
    />

    <EditDepartmentModal
      :isOpen="isEditModalOpen"
      :department="departmentToEdit"
      @close="closeEditModal"
      @departmentUpdated="loadDepartments"
    />

    <ConfirmationModal
      :isOpen="showDeleteConfirmation"
      title="Excluir Setor"
      :message="`Tem certeza que deseja excluir o setor '${departmentToDelete?.name}'?`"
      @confirm="deleteDepartment"
      @cancel="cancelDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { departmentService } from '@/services/departmentService';
import type { Department } from '@/models';
import NewDepartmentModal from '@/components/departments/NewDepartmentModal.vue';
import EditDepartmentModal from '@/components/departments/EditDepartmentModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { debounce } from '@/utils/generic-helper';
import { AxiosError } from 'axios';

const isLoading = ref(false);
const departments = ref<Department[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const showDeleteConfirmation = ref(false);
const departmentToDelete = ref<Department | null>(null);
const departmentToEdit = ref<Department | null>(null);

const debouncedSearch = debounce(() => {
  loadDepartments();
}, 400);

const loadDepartments = async () => {
  isLoading.value = true;
  const name = searchTerm.value.trim() || undefined;
  const filters = { name, page: currentPage.value };

  try {
    const response = await departmentService.fetch(filters);
    departments.value = response.data.items;
    totalPages.value = response.data.totalPages;
  } catch {
    toast.error('Erro ao carregar setores. Tente novamente.');
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

const openEditModal = (department: Department) => {
  departmentToEdit.value = department;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  departmentToEdit.value = null;
};

const confirmDelete = (department: Department) => {
  departmentToDelete.value = department;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  departmentToDelete.value = null;
};

const deleteDepartment = async () => {
  if (!departmentToDelete.value) return;

  try {
    await departmentService.delete(departmentToDelete.value.id);
    toast.success('Setor excluído com sucesso!');
    loadDepartments();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast.error('Esse setor já possui colaboradores e não pode ser excluído.');
    } else {
      toast.error('Erro ao excluir setor. Tente novamente.');
    }
  } finally {
    showDeleteConfirmation.value = false;
    departmentToDelete.value = null;
  }
};

onMounted(loadDepartments);

watch(searchTerm, () => {
  debouncedSearch();
});

watch(currentPage, () => {
  loadDepartments();
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
