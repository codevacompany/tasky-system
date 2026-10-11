<template>
  <BaseModal
    title="Editar Tag"
    confirm-button-text="Salvar"
    cancel-button-text="Cancelar"
    :confirm-button-loading="isLoading"
    overflow-visible
    @close="closeModal"
    @cancel="closeModal"
    @confirm="updateTag"
  >
    <form class="space-y-4" @submit.prevent="updateTag">
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
      <p v-else class="text-xs text-gray-500 dark:text-gray-400">
        Esta tag permanece sugerida para o seu setor.
      </p>

      <div class="pt-3">
        <Switch v-model="form.isActive" label="Ativa" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import Input from '@/components/common/Input.vue';
import Switch from '@/components/common/Switch.vue';
import TagColorField from '@/components/tags/TagColorField.vue';
import TagSuggestedForField from '@/components/tags/TagSuggestedForField.vue';
import type { Department, Tag } from '@/models';
import { departmentService } from '@/services/departmentService';
import { tagService } from '@/services/tagService';
import { toast } from 'vue-sonner';

const props = defineProps<{
  tag: Tag | null;
  /** When set (supervisor), keep tag scoped to this department. */
  lockToDepartmentId?: number;
}>();

const emit = defineEmits<{
  close: [];
  tagUpdated: [];
}>();

const form = reactive({
  name: '',
  color: '#2563EB',
  isActive: true,
  suggestedForDepartmentIds: [] as number[],
});

const departments = ref<Department[]>([]);
const isLoading = ref(false);

watch(
  () => props.tag,
  (tag) => {
    if (!tag) return;
    form.name = tag.name;
    form.color = tag.color;
    form.isActive = tag.isActive !== false;
    form.suggestedForDepartmentIds = (tag.suggestedForDepartments || []).map((d) => d.id);
  },
  { immediate: true },
);

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

const updateTag = async () => {
  if (!props.tag) return;
  isLoading.value = true;
  try {
    const suggestedForDepartmentIds = props.lockToDepartmentId
      ? [props.lockToDepartmentId]
      : form.suggestedForDepartmentIds;

    await tagService.update(props.tag.uuid, {
      name: form.name.trim(),
      color: form.color,
      isActive: form.isActive,
      suggestedForDepartmentIds,
    });
    toast.success('Tag atualizada com sucesso');
    emit('tagUpdated');
    closeModal();
  } catch {
    toast.error('Erro ao atualizar tag');
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadDepartments);
</script>
