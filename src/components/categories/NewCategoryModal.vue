<template>
  <BaseModal :isOpen="isOpen" title="Nova Categoria" @close="closeModal">
    <div class="modal-body">
      <div class="category-form-container">
        <form id="cadastroCategoriaForm" class="form-grid" @submit.prevent="createCategory">
          <div class="form-group">
            <label for="nomeCategoria">Nome</label>
            <input
              type="text"
              id="nomeCategoria"
              v-model="categoryData.name"
              placeholder="Digite o nome da categoria"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import { categoryService } from '@/services/categoryService';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'categoryCreated']);

const categoryData = ref({
  name: '',
});

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
  try {
    await categoryService.create(categoryData.value);
    emit('categoryCreated');
    closeModal();
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
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

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
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
