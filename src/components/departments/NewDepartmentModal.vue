<template>
  <BaseModal
    :isOpen="isOpen"
    title="Novo Setor"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="createDepartment"
    :confirmButtonText="isLoading ? '' : 'Cadastrar'"
    :cancelButtonText="'Cancelar'"
  >
    <form id="cadastroSetorForm" @submit.prevent="createDepartment">
      <div class="mb-5">
        <label
          for="nomeSetor"
          class="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
          >Nome</label
        >
        <input
          type="text"
          id="nomeSetor"
          v-model="departmentData.name"
          placeholder="Digite o nome do setor"
          required
          class="w-full px-[15px] py-[10px] border border-gray-200 rounded-md text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      <div v-if="isLoading" class="flex justify-center my-2">
        <LoadingSpinner :size="22" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import { departmentService } from '@/services/departmentService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

defineProps({
  isOpen: Boolean,
});

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
