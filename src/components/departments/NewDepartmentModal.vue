<template>
  <BaseModal :isOpen="isOpen" title="Novo Setor" @close="closeModal">
    <div class="modal-body">
      <div class="department-form-container">
        <form id="cadastroSetorForm" @submit.prevent="createDepartment">
          <div class="form-group">
            <label for="nomeSetor">Nome</label>
            <input
              type="text"
              id="nomeSetor"
              v-model="departmentData.name"
              placeholder="Digite o nome do setor"
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
import { departmentService } from '@/services/departmentService';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'departmentCreated']);

const departmentData = ref({
  name: '',
});

const resetForm = () => {
  departmentData.value = {
    name: '',
  };
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const createDepartment = async () => {
  try {
    await departmentService.create(departmentData.value);
    emit('departmentCreated');
    closeModal();
  } catch (error) {
    console.error('Erro ao criar setor:', error);
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
</style>

<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.department-form-container {
  flex: 1;
  min-width: 300px;
  max-width: 1000px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  width: 100%;
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
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons */
.modal-actions {
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
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}
</style>
