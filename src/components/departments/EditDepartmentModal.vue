<template>
  <BaseModal
    title="Editar Setor"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="updateDepartment"
    :confirmButtonText="isLoading ? '' : 'Salvar'"
    :cancelButtonText="'Cancelar'"
  >
    <div>
      <form id="editSetorForm" @submit.prevent="updateDepartment">
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
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import { departmentService } from '@/services/departmentService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import type { Department } from '@/models';

const props = defineProps<{
  department: Department | null;
}>();

const emit = defineEmits(['close', 'departmentUpdated']);

const departmentData = ref({
  name: '',
});

const isLoading = ref(false);

watch(
  () => props.department,
  (newDepartment) => {
    if (newDepartment) {
      departmentData.value.name = newDepartment.name;
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit('close');
};

const updateDepartment = async () => {
  if (!props.department) return;

  isLoading.value = true;
  try {
    await departmentService.update(props.department.id, departmentData.value);
    emit('departmentUpdated');
    toast.success('Setor atualizado com sucesso');
    closeModal();
  } catch {
    toast.error('Erro ao atualizar setor');
  } finally {
    isLoading.value = false;
  }
};
</script>
