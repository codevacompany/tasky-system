<template>
  <section id="setoresSection" class="p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Setores</h1>
      <button
        id="newSetorBtn"
        class="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        @click="openModal"
      >
        <font-awesome-icon icon="plus" />
        <span>Novo Setor</span>
      </button>
    </div>

    <div class="w-64 mb-6">
      <div class="relative">
        <font-awesome-icon
          icon="search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
        />
        <input
          type="text"
          id="searchTickets"
          placeholder="Buscar setores"
          v-model="searchTerm"
          class="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full" id="setoresTable">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">Nome</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="3" class="px-6 py-8">
                <div class="flex justify-center items-center">
                  <LoadingSpinner :size="28" />
                </div>
              </td>
            </tr>
            <tr v-else v-for="department in departments" :key="department.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ department.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ department.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-200"
                    @click="openEditModal(department)"
                    title="Editar setor"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    class="w-8 h-8 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all duration-200"
                    @click="confirmDelete(department)"
                    title="Excluir setor"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4 mt-6">
      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <span class="text-sm text-gray-600 dark:text-gray-400">Página {{ currentPage }} de {{ totalPages }}</span>

      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <NewDepartmentModal
      v-if="isModalOpen"
      @close="closeModal"
      @departmentCreated="loadDepartments"
    />

    <EditDepartmentModal
      v-if="isEditModalOpen"
      :department="departmentToEdit"
      @close="closeEditModal"
      @departmentUpdated="loadDepartments"
    />

    <ConfirmationModal
      v-if="showDeleteConfirmation"
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
