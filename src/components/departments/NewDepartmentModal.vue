<template>
  <BaseModal
    title="Novo Setor"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="createDepartment"
    :confirmButtonText="'Cadastrar'"
    :cancelButtonText="'Cancelar'"
    :confirmButtonLoading="isLoading"
  >
    <form id="cadastroSetorForm" @submit.prevent="createDepartment">
      <div class="mb-5">
        <label
          for="nomeSetor"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Nome</label
        >
        <Input
          id="nomeSetor"
          v-model="departmentData.name"
          type="text"
          placeholder="Digite o nome do setor"
          required
          class="px-[15px] py-[10px] text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import Input from '../common/Input.vue';
import { departmentService } from '@/services/departmentService';
import { toast } from 'vue3-toastify';

const emit = defineEmits(['close', 'departmentCreated']);

const departmentData = ref({
  name: '',
});

const isLoading = ref(false);

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
  isLoading.value = true;
  try {
    await departmentService.create(departmentData.value);
    emit('departmentCreated');
    toast.success('Setor criado com sucesso!');
    closeModal();
  } catch {
    toast.error('Erro ao criar setor. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};
</script>
