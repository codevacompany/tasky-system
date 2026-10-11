<template>
  <BaseModal
    title="Nova Tag"
    confirm-button-text="Cadastrar"
    cancel-button-text="Cancelar"
    :confirm-button-loading="isLoading"
    overflow-visible
    tag-create-modal
    @close="closeModal"
    @cancel="closeModal"
    @confirm="createTag"
  >
    <form class="space-y-4" @submit.prevent="createTag">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">Nome</label>
        <Input
          v-model="form.name"
          type="text"
          placeholder="Ex.: Aguardando NF"
          required
          class="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <TagColorField v-model="form.color" />

      <TagSuggestedForField
        v-if="!lockToDepartmentId"
        v-model="form.suggestedForDepartmentIds"
        :departments="departments"
      />
      <p
        v-else
        class="text-xs text-gray-500 dark:text-gray-400"
      >
        Esta tag será sugerida para o seu setor.
      </p>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import Input from '@/components/common/Input.vue';
import TagColorField from '@/components/tags/TagColorField.vue';
import TagSuggestedForField from '@/components/tags/TagSuggestedForField.vue';
import type { Department, Tag } from '@/models';
import { departmentService } from '@/services/departmentService';
import { tagService } from '@/services/tagService';
import { toast } from 'vue-sonner';

const props = defineProps<{
  /** When set (supervisor), tag is always suggested for this department. */
  lockToDepartmentId?: number;
}>();

const emit = defineEmits<{
  close: [];
  tagCreated: [tag?: Tag];
}>();

const form = reactive({
  name: '',
  color: '#2563EB',
  suggestedForDepartmentIds: [] as number[],
});

const departments = ref<Department[]>([]);
const isLoading = ref(false);

const loadDepartments = async () => {
  if (props.lockToDepartmentId) return;
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    departments.value = [];
  }
};

const closeModal = () => emit('close');

const createTag = async () => {
  if (!form.name.trim()) {
    toast.error('Informe o nome da tag');
    return;
  }
  isLoading.value = true;
  try {
    const suggestedForDepartmentIds = props.lockToDepartmentId
      ? [props.lockToDepartmentId]
      : form.suggestedForDepartmentIds;

    const { data } = await tagService.create({
      name: form.name.trim(),
      color: form.color,
      suggestedForDepartmentIds,
    });
    toast.success('Tag criada com sucesso');
    emit('tagCreated', data);
    closeModal();
  } catch {
    toast.error('Erro ao criar tag');
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadDepartments);
</script>
