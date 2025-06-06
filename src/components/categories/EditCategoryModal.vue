<template>
  <BaseModal
    :isOpen="isOpen"
    title="Editar Categoria"
    @close="closeModal"
    @cancel="closeModal"
    @confirm="updateCategory"
    :confirmButtonText="isLoading ? '' : 'Salvar'"
    :cancelButtonText="'Cancelar'"
  >
    <div>
      <form id="editCategoriaForm" @submit.prevent="updateCategory">
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
import { categoryService } from '@/services/categoryService';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import type { Category } from '@/models';

const props = defineProps<{
  isOpen: boolean;
  category: Category | null;
}>();

const emit = defineEmits(['close', 'categoryUpdated']);

const categoryData = ref({
  name: '',
});

const isLoading = ref(false);

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      categoryData.value.name = newCategory.name;
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit('close');
};

const updateCategory = async () => {
  if (!props.category) return;

  isLoading.value = true;
  try {
    await categoryService.update(props.category.id, categoryData.value);
    emit('categoryUpdated');
    toast.success('Categoria atualizada com sucesso');
    closeModal();
  } catch {
    toast.error('Erro ao atualizar categoria');
  } finally {
    isLoading.value = false;
  }
};
</script>
