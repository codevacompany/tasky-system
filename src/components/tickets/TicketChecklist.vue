<template>
  <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
    <div class="space-y-4">
      <div v-for="checklist in checklists" :key="checklist.id">
        <!-- Checklist Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3 flex-1">
            <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ checklist.title }}</h4>
            <!-- Progress Circle -->
            <div class="relative w-8 h-8 flex-shrink-0">
              <svg class="transform -rotate-90 w-8 h-8">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  :class="[
                    'transition-all duration-300',
                    getProgressPercentage(checklist) === 100
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-primary',
                  ]"
                  :stroke-dasharray="2 * Math.PI * 14"
                  :stroke-dashoffset="
                    2 * Math.PI * 14 * (1 - getProgressPercentage(checklist) / 100)
                  "
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-[8px] font-medium text-gray-700 dark:text-gray-300">
                  {{ getProgressPercentage(checklist) }}%
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="canEdit"
              class="px-2 py-1 text-xs dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              @click="deleteChecklist(checklist)"
            >
              Excluir
            </button>
          </div>
        </div>

        <!-- Checklist Items -->
        <div class="space-y-2">
          <div
            v-for="item in getVisibleItems(checklist)"
            :key="item.id"
            class="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <input
              type="checkbox"
              :checked="item.isCompleted"
              @change="toggleItem(item)"
              class="mt-1 w-4 h-4 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500 flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div
                class="text-sm text-gray-900 dark:text-gray-100"
                :class="{
                  'line-through opacity-60': item.isCompleted,
                }"
              >
                {{ item.title }}
              </div>
              <div v-if="item.assignedTo || item.dueDate" class="flex items-center gap-3 mt-1">
                <span
                  v-if="item.assignedTo"
                  class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                >
                  <font-awesome-icon icon="user" class="text-xs" />
                  {{ item.assignedTo.firstName }} {{ item.assignedTo.lastName }}
                </span>
                <span
                  v-if="item.dueDate"
                  class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                >
                  <font-awesome-icon icon="calendar" class="text-xs" />
                  {{ formatDate(item.dueDate) }}
                </span>
              </div>
            </div>
            <button
              v-if="canEdit"
              @click="deleteItem(item)"
              class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <font-awesome-icon icon="times" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- Add Item Form -->
        <div
          v-if="showAddItem[checklist.id]"
          class="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <Input
            v-model="newItemTitles[checklist.id]"
            type="text"
            placeholder="Adicionar um item"
            class="mb-3"
            @keyup.enter="addItem(checklist)"
            @keyup.escape="cancelAddItem(checklist.id)"
            ref="itemInputRef"
          />
          <div class="flex items-center gap-2">
            <button
              @click="addItem(checklist)"
              class="px-3 py-1.5 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Adicionar
            </button>
            <button
              @click="cancelAddItem(checklist.id)"
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>

        <!-- Add Item Button -->
        <button
          v-else-if="canEdit"
          @click="startAddItem(checklist.id)"
          class="mt-3 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <font-awesome-icon icon="plus" class="text-xs" />
          Adicionar um item
        </button>
      </div>
    </div>

    <!-- Confirmation Modal for Delete Checklist -->
    <ConfirmationModal
      v-if="showDeleteChecklistConfirmation"
      title="Excluir Checklist"
      :message="deleteChecklistMessage"
      confirmButtonText="Excluir"
      cancelButtonText="Cancelar"
      @close="showDeleteChecklistConfirmation = false"
      @cancel="showDeleteChecklistConfirmation = false"
      @confirm="confirmDeleteChecklist"
      confirmButtonClass="bg-red-600 hover:bg-red-700"
      :isLoading="isDeletingChecklist"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import type { Checklist, ChecklistItem } from '@/models/checklist';
import { checklistService } from '@/services/checklistService';
import { toast } from 'vue3-toastify';
import { formatDate } from '@/utils/date';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import Input from '@/components/common/Input.vue';

const props = defineProps<{
  ticketId: number;
  checklists: Checklist[];
  canEdit: boolean;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const showAddItem = ref<Record<number, boolean>>({});
const newItemTitles = ref<Record<number, string>>({});
const itemInputRef = ref<InstanceType<typeof Input> | null>(null);
const showDeleteChecklistConfirmation = ref(false);
const checklistToDelete = ref<Checklist | null>(null);
const isDeletingChecklist = ref(false);

const deleteChecklistMessage = computed(() => {
  if (!checklistToDelete.value) return '';
  return `Tem certeza que deseja excluir o checklist "${checklistToDelete.value.title}"?`;
});

const getCompletedCount = (checklist: Checklist) => {
  return checklist.items.filter((item) => item.isCompleted).length;
};

const getProgressPercentage = (checklist: Checklist) => {
  if (checklist.items.length === 0) return 0;
  return Math.round((getCompletedCount(checklist) / checklist.items.length) * 100);
};

const getVisibleItems = (checklist: Checklist): ChecklistItem[] => {
  return checklist.items;
};

const toggleItem = async (item: ChecklistItem) => {
  try {
    await checklistService.updateItem(item.id, {
      isCompleted: !item.isCompleted,
    });
    emit('update');
  } catch (error) {
    toast.error('Erro ao atualizar item');
  }
};

const startAddItem = async (checklistId: number) => {
  showAddItem.value[checklistId] = true;
  newItemTitles.value[checklistId] = '';
  await nextTick();
  // Focus will be handled by the Input component when it's mounted
  if (itemInputRef.value?.$el) {
    const inputElement = itemInputRef.value.$el.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }
};

const cancelAddItem = (checklistId: number) => {
  showAddItem.value[checklistId] = false;
  newItemTitles.value[checklistId] = '';
};

const addItem = async (checklist: Checklist) => {
  const title = newItemTitles.value[checklist.id]?.trim();
  if (!title) return;

  try {
    await checklistService.createItem({
      title,
      checklistId: checklist.id,
    });
    cancelAddItem(checklist.id);
    emit('update');
  } catch (error) {
    toast.error('Erro ao adicionar item');
  }
};

const deleteItem = async (item: ChecklistItem) => {
  try {
    await checklistService.deleteItem(item.id);
    emit('update');
  } catch (error) {
    toast.error('Erro ao remover item');
  }
};

const deleteChecklist = (checklist: Checklist) => {
  checklistToDelete.value = checklist;
  showDeleteChecklistConfirmation.value = true;
};

const confirmDeleteChecklist = async () => {
  if (!checklistToDelete.value) return;

  isDeletingChecklist.value = true;
  try {
    await checklistService.delete(checklistToDelete.value.id);
    emit('update');
    showDeleteChecklistConfirmation.value = false;
    checklistToDelete.value = null;
    toast.success('Checklist excluído com sucesso');
  } catch (error) {
    toast.error('Erro ao remover checklist');
  } finally {
    isDeletingChecklist.value = false;
  }
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
