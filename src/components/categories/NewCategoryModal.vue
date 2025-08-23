<template>
  <BaseModal
    title="Nova Categoria"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="createCategory"
    :confirmButtonText="isLoading ? '' : 'Cadastrar'"
    :cancelButtonText="'Cancelar'"
  >
    <div>
      <form id="cadastroCategoriaForm" @submit.prevent="createCategory">
        <div class="mb-4">
          <label
            for="nomeCategoria"
            class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
            >Nome</label
          >
          <input
            type="text"
            id="nomeCategoria"
            v-model="categoryData.name"
            placeholder="Digite o nome da categoria"
            required
            class="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div v-if="isLoading" class="flex justify-center my-2">
          <LoadingSpinner :size="22" />
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import { categoryService } from '@/services/categoryService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const emit = defineEmits(['close', 'categoryCreated']);

const categoryData = ref({
  name: '',
});

const isLoading = ref(false);

const resetForm = () => {
  categoryData.value = {
    name: '',
  };
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const createCategory = async () => {
  isLoading.value = true;
  try {
    await categoryService.create(categoryData.value);
    emit('categoryCreated');
    toast.success('Categoria criada com sucesso');
    closeModal();
  } catch {
    toast.error('Erro ao criar categoria');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-form-container {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}

.btn {
  width: 116px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}
</style>
