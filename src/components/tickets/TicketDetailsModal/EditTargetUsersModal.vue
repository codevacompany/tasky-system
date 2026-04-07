<template>
  <BaseModal
    v-if="isOpen"
    title="Gerenciar Responsáveis"
    :showFooter="false"
    @close="onClose"
  >
    <div class="p-4 sm:p-6" style="overflow: visible">
      <div v-if="!isEditingAssignee && !isAddingAssignee" class="space-y-3">
        <div
          v-for="targetUser in sortedTargetUsers"
          :key="targetUser.userId"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-soft-xs"
              :style="getAvatarStyle(targetUser.user.department?.name || '')"
            >
              {{
                getUserInitials({
                  firstName: targetUser.user.firstName,
                  lastName: targetUser.user.lastName,
                })
              }}
            </div>
            <div class="flex-1 min-w-0">
              <div
                class="flex items-center gap-2"
                :class="{
                  'font-semibold text-blue-600 dark:text-blue-400':
                    sortedTargetUsers.length > 1 &&
                    targetUser.userId === ticket?.currentTargetUserId,
                }"
              >
                <span class="text-sm"
                  >{{ targetUser.user.firstName }} {{ targetUser.user.lastName }}</span
                >
                <div
                  v-if="!targetUser.user.isActive"
                  class="flex items-center gap-1"
                  title="Conta desativada"
                >
                  <font-awesome-icon icon="exclamation-triangle" class="text-orange-500 text-xs" />
                  <span class="text-orange-500 text-xs">Desativado</span>
                </div>
              </div>
              <p
                v-if="targetUser.user.department?.name"
                class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
              >
                {{ targetUser.user.department.name }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-3">
            <font-awesome-icon
              v-if="canEditTargetUser(targetUser.userId)"
              icon="edit"
              class="text-gray-400 text-sm cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="startEditingAssignee(targetUser.userId)"
              title="Editar responsável"
            />
            <font-awesome-icon
              v-if="canRemoveTargetUser(targetUser.userId)"
              icon="trash"
              class="text-gray-400 text-sm cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors"
              @click="emit('removeTargetUser', targetUser.userId)"
              title="Remover responsável"
            />
          </div>
        </div>

        <button
          v-if="canAddNewAssignee"
          type="button"
          @click="startAddingAssignee"
          class="w-full mt-3 px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
        >
          <font-awesome-icon icon="plus" class="text-xs" />
          Adicionar Responsável
        </button>
      </div>

      <div v-else-if="isAddingAssignee" class="space-y-4" style="overflow: visible">
        <div
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          style="overflow: visible"
        >
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adicionar Responsável
          </p>
          <div class="relative" style="overflow: visible; z-index: 1">
            <DepartmentUserSelector
              v-model="newAssigneeSelection"
              @change="saveNewAssignee"
              placeholder="Selecionar responsável"
              :excludedUserIds="excludedUserIds"
            />
          </div>
          <div class="flex gap-2 mt-3">
            <button
              type="button"
              @click="cancelAddingAssignee"
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4" style="overflow: visible">
        <div
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          style="overflow: visible"
        >
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Editar Responsável
          </p>
          <div class="relative" style="overflow: visible; z-index: 1">
            <DepartmentUserSelector
              v-model="assigneeSelection"
              @change="saveAssigneeChange"
              placeholder="Selecionar responsável"
              :excludedUserIds="excludedUserIds"
            />
          </div>
          <div class="flex gap-2 mt-3">
            <button
              type="button"
              @click="cancelEditingAssignee"
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Ticket } from '@/models';
import BaseModal from '@/components/common/BaseModal.vue';
import DepartmentUserSelector from '@/components/common/DepartmentUserSelector.vue';
import { getAvatarStyle, getUserInitials } from '@/utils/generic-helper';
import { ticketService } from '@/services/ticketService';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  isOpen: boolean;
  ticket: Ticket | null;
  canAddNewAssignee: boolean;
  canEditTargetUser: (targetUserId: number) => boolean;
  canRemoveTargetUser: (targetUserId: number) => boolean;
}>();

const emit = defineEmits<{
  close: [];
  refresh: [];
  removeTargetUser: [userId: number];
}>();

const isEditingAssignee = ref(false);
const isAddingAssignee = ref(false);
const currentlyEditingUser = ref<number | null>(null);
const assigneeSelection = ref<{ departmentId: number | null; userId: number | null }>({
  departmentId: null,
  userId: null,
});
const newAssigneeSelection = ref<{ departmentId: number | null; userId: number | null }>({
  departmentId: null,
  userId: null,
});

const sortedTargetUsers = computed(() => {
  if (!props.ticket?.targetUsers) return [];
  return [...props.ticket.targetUsers].sort((a, b) => a.order - b.order);
});

const excludedUserIds = computed(() => {
  if (!props.ticket?.targetUsers) return [];

  if (currentlyEditingUser.value) {
    return props.ticket.targetUsers
      .filter((tu) => tu.userId !== currentlyEditingUser.value)
      .map((tu) => tu.userId)
      .filter((id): id is number => id !== null && id !== undefined);
  }

  return props.ticket.targetUsers
    .map((tu) => tu.userId)
    .filter((id): id is number => id !== null && id !== undefined);
});

function resetAssigneeUi() {
  isEditingAssignee.value = false;
  isAddingAssignee.value = false;
  currentlyEditingUser.value = null;
  assigneeSelection.value = { departmentId: null, userId: null };
  newAssigneeSelection.value = { departmentId: null, userId: null };
}

watch(() => props.isOpen, () => resetAssigneeUi());

function onClose() {
  emit('close');
}

function startEditingAssignee(targetUserId?: number) {
  const userIdToEdit = targetUserId ?? props.ticket?.currentTargetUserId ?? null;
  if (!userIdToEdit) return;
  if (!props.canEditTargetUser(userIdToEdit)) return;

  currentlyEditingUser.value = userIdToEdit;
  const targetUser = props.ticket?.targetUsers?.find((tu) => tu.userId === userIdToEdit);
  assigneeSelection.value = {
    departmentId: targetUser?.user?.departmentId || null,
    userId: userIdToEdit,
  };
  isEditingAssignee.value = true;
}

function cancelEditingAssignee() {
  isEditingAssignee.value = false;
  currentlyEditingUser.value = null;
  assigneeSelection.value = { departmentId: null, userId: null };
}

async function saveAssigneeChange(selection: { department: unknown; user: { id: number } | null }) {
  if (!selection.user || !props.ticket) return;

  try {
    const editingUser = props.ticket.targetUsers?.find(
      (tu) => tu.userId === currentlyEditingUser.value,
    );
    const order = editingUser?.order || 1;

    await ticketService.updateAssignee(props.ticket.customId, selection.user.id, order);
    emit('refresh');
    cancelEditingAssignee();
    toast.success('Sucesso');
  } catch (error) {
    console.error('Erro ao alterar responsável:', error);
    toast.error('Erro ao alterar responsável');
  }
}

function startAddingAssignee() {
  isAddingAssignee.value = true;
  isEditingAssignee.value = false;
  currentlyEditingUser.value = null;
  newAssigneeSelection.value = { departmentId: null, userId: null };
}

function cancelAddingAssignee() {
  isAddingAssignee.value = false;
  newAssigneeSelection.value = { departmentId: null, userId: null };
}

async function saveNewAssignee(selection: { department: unknown; user: { id: number } | null }) {
  if (!selection.user || !props.ticket) return;

  try {
    await ticketService.addAssignee(props.ticket.customId, selection.user.id);
    emit('refresh');
    cancelAddingAssignee();
    toast.success('Responsável adicionado com sucesso!');
  } catch (error: unknown) {
    console.error('Erro ao adicionar responsável:', error);
    const err = error as { response?: { data?: { message?: string } } };
    const errorMessage = err.response?.data?.message || 'Erro ao adicionar responsável';
    toast.error(errorMessage);
  }
}
</script>
