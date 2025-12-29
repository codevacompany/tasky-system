<template>
  <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
    <div class="space-y-4">
      <!-- Checklist Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3 flex-1">
          <h4 class="font-medium text-txt-primary dark:text-gray-100">Subtarefas</h4>
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
                  progressPercentage === 100
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-primary',
                ]"
                :stroke-dasharray="2 * Math.PI * 14"
                :stroke-dashoffset="2 * Math.PI * 14 * (1 - progressPercentage / 100)"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[8px] font-medium text-gray-700 dark:text-gray-300">
                {{ progressPercentage }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Checklist Items -->
      <div class="space-y-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="group flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <input
            type="checkbox"
            :checked="item.isCompleted"
            @change="toggleItem(item)"
            class="checklist-checkbox mt-1 w-4 h-4 rounded focus:ring-blue-500 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <div
              class="text-sm text-txt-primary dark:text-gray-100"
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
            @click="confirmDeleteItem(item)"
            class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Excluir item"
          >
            <font-awesome-icon icon="times" class="text-xs" />
          </button>
        </div>
      </div>

      <!-- Add Item Form -->
      <div
        v-if="showAddItem"
        ref="addItemFormRef"
        class="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
      >
        <Input
          v-model="newItemTitle"
          type="text"
          placeholder="Adicionar um item"
          class="mb-3"
          @keyup.enter="addItem"
          @keyup.escape="cancelAddItem"
          ref="itemInputRef"
          @focus="onInputFocus"
        />
        <div class="flex items-center gap-2">
          <button
            @click="addItem"
            class="px-3 py-1.5 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Adicionar
          </button>
          <button
            @click="cancelAddItem"
            class="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

      <!-- Add Item Button -->
      <button
        v-else-if="canEdit"
        @click="startAddItem"
        class="mt-3 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:text-txt-primary dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <font-awesome-icon icon="plus" class="text-xs" />
        Adicionar um item
      </button>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <ConfirmationModal
    v-if="confirmationModal.isOpen"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    @confirm="handleConfirmDelete"
    @cancel="confirmationModal.isOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import type { ChecklistItem } from '@/models/checklist';
import { checklistService } from '@/services/checklistService';
import { toast } from 'vue3-toastify';
import { formatDate } from '@/utils/date';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import Input from '@/components/common/Input.vue';

const props = defineProps<{
  ticketId: number;
  items: ChecklistItem[];
  canEdit: boolean;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const showAddItem = ref(false);
const newItemTitle = ref('');
const itemInputRef = ref<InstanceType<typeof Input> | null>(null);
const addItemFormRef = ref<HTMLElement | null>(null);
const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  itemToDelete: null as ChecklistItem | null,
});

const totalItems = computed(() => props.items.length);
const completedItems = computed(() => props.items.filter((item) => item.isCompleted).length);
const progressPercentage = computed(() => {
  if (totalItems.value === 0) return 0;
  return Math.round((completedItems.value / totalItems.value) * 100);
});

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

const onInputFocus = () => {
  // Input was focused successfully
};

const startAddItem = async () => {
  showAddItem.value = true;
  newItemTitle.value = '';
  await nextTick();

  // Try multiple approaches to focus the input
  const tryFocus = (attempt = 0): boolean => {
    // Method 1: Try via Input component's exposed focus method
    if (itemInputRef.value && typeof (itemInputRef.value as any).focus === 'function') {
      (itemInputRef.value as any).focus();
      return true;
    }

    // Method 2: Try via form container ref
    if (addItemFormRef.value) {
      const inputElement = addItemFormRef.value.querySelector('input');
      if (inputElement) {
        inputElement.focus();
        return true;
      }
    }

    // Method 3: Try via document query (fallback)
    const inputElement = document.querySelector(
      '#tarefas-section input[type="text"]',
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      return true;
    }

    return false;
  };

  // Try immediately
  if (!tryFocus(0)) {
    // Retry with increasing delays
    setTimeout(() => {
      if (!tryFocus(1)) {
        setTimeout(() => {
          tryFocus(2);
        }, 100);
      }
    }, 150);
  }
};

const cancelAddItem = () => {
  showAddItem.value = false;
  newItemTitle.value = '';
};

const addItem = async () => {
  const title = newItemTitle.value.trim();
  if (!title) return;

  try {
    await checklistService.createItem({
      title,
      ticketId: props.ticketId,
    });
    cancelAddItem();
    emit('update');
  } catch (error) {
    toast.error('Erro ao adicionar item');
  }
};

const confirmDeleteItem = (item: ChecklistItem) => {
  confirmationModal.value = {
    isOpen: true,
    title: 'Excluir Item',
    message: `Tem certeza que deseja excluir o item "${item.title}"?`,
    itemToDelete: item,
  };
};

const handleConfirmDelete = async () => {
  if (!confirmationModal.value.itemToDelete) return;

  try {
    await checklistService.deleteItem(confirmationModal.value.itemToDelete.id);
    emit('update');
    toast.success('Item excluído com sucesso');
  } catch (error) {
    toast.error('Erro ao remover item');
  } finally {
    confirmationModal.value = {
      isOpen: false,
      title: '',
      message: '',
      itemToDelete: null,
    };
  }
};

// Expose methods for parent component
defineExpose({
  startAddItem,
});
</script>

<style scoped>
.checklist-checkbox {
  accent-color: #3772f3;
  cursor: pointer;
}

.dark .checklist-checkbox {
  accent-color: #3b82f6;
}
</style>
