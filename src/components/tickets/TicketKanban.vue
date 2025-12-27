<template>
  <div
    class="kanban-container flex gap-4 p-3 px-2 overflow-x-auto h-[calc(100vh-234px)] bg-white dark:bg-gray-900 rounded-lg relative w-full"
  >
    <!-- Skeleton while loading columns or tickets -->
    <template
      v-if="props.isLoading || ticketsStore.statusColumns.isLoading || kanbanColumns.length === 0"
    >
      <div
        v-for="n in 5"
        :key="`col-skeleton-${n}`"
        class="flex-1 min-w-[310px] w-0 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm relative flex flex-col h-full"
      >
        <div
          class="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-t-xl"
        >
          <div class="h-6 w-40 bg-gray-200 dark:bg-gray-600 rounded mx-auto my-2"></div>
        </div>
        <div class="p-1.5 flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
          <div
            v-for="m in 3"
            :key="`card-skeleton-${n}-${m}`"
            class="bg-white dark:bg-gray-700 rounded-lg p-3.5 border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </template>
    <!-- Real columns - only show when not loading -->
    <template v-else>
      <div
        v-for="column in kanbanColumns"
        :key="column.id"
        class="flex-1 min-w-[310px] w-0 bg-[#F8F9FB] dark:bg-gray-800 rounded-2xl shadow-sm relative flex flex-col h-full"
      >
        <div class="p-2 text-center flex-shrink-0">
          <h3
            class="m-0 inline-flex items-center gap-3 text-base font-semibold text-gray-900 dark:text-white py-2"
          >
            {{ column.name }}
            <span
              class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-xl text-xs text-gray-600 dark:text-gray-300"
            >
              {{ getTicketsByColumn(column).length }}
            </span>
          </h3>
        </div>

        <div class="p-1.5 flex flex-col flex-1 overflow-y-auto min-h-0">
          <div
            v-for="ticket in getTicketsByColumn(column)"
            :key="ticket.customId"
            :class="[
              'min-h-[100px] flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg p-3.5 cursor-pointer transition-all duration-200 border shadow-sm mb-3.5 flex flex-col hover:shadow-md hover:shadow-black/8 dark:hover:shadow-black/30',
              ticket.ticketStatus?.key === DefaultTicketStatus.Returned ||
              ticket.status === DefaultTicketStatus.Returned
                ? 'border-orange-300 dark:border-orange-600 dark:bg-orange-900/10 hover:border-orange-400 dark:hover:border-orange-500'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
              shouldBeGrayscale(ticket) ? 'opacity-60 grayscale-[0.3]' : '',
            ]"
            @click="openTicketDetails(ticket)"
          >
            <div class="flex justify-between items-start gap-3 mb-2 w-full p-0">
              <div
                class="flex-1 min-w-0 flex items-start"
                :class="{ 'pb-1': hasRightIcons(ticket) }"
              >
                <div
                  class="font-semibold text-sm leading-5 text-gray-900 dark:text-white text-left flex-1 break-words m-0 p-0"
                  :class="hasRightIcons(ticket) ? 'line-clamp-2' : ''"
                >
                  {{ ticket.name }}
                </div>
              </div>
              <div v-if="hasRightIcons(ticket)" class="flex items-center gap-2 ml-3 flex-shrink-0">
                <div
                  v-if="(ticket.comments?.length || 0) > 0"
                  class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 opacity-80"
                  title="Comentários"
                >
                  <font-awesome-icon :icon="['far', 'comment']" />
                  <span class="text-xs min-w-2">{{ ticket.comments?.length || 0 }}</span>
                </div>
                <font-awesome-icon
                  v-if="ticket.isPrivate"
                  icon="lock"
                  class="text-gray-500 dark:text-gray-400 text-xs flex-shrink-0"
                  title="Tarefa Privada"
                />
                <div
                  v-if="(ticket.files?.length || 0) > 0"
                  class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-80"
                  title="Anexos"
                >
                  <font-awesome-icon icon="paperclip" />
                  <span class="text-xs min-w-4">{{ ticket.files?.length || 0 }}</span>
                </div>
                <div
                  v-if="
                    ticket.ticketStatus?.key === DefaultTicketStatus.Returned ||
                    ticket.status === DefaultTicketStatus.Returned
                  "
                  class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 flex-shrink-0"
                  title="Tarefa devolvida"
                >
                  <font-awesome-icon icon="undo" class="text-xs" />
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-200 dark:bg-gray-600 my-2 opacity-50"></div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-3 mb-0">
                <div class="flex items-center gap-2">
                  <div
                    v-if="props.activeTab === 'recebidas' && ticket.requester"
                    class="flex items-center gap-1.5"
                  >
                    <div class="relative">
                      <div
                        :class="[
                          'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold',
                        ]"
                        :style="{
                          backgroundColor: getAvatarColor(ticket.requester.department?.name || ''),
                        }"
                        :title="`Solicitante: ${ticket.requester.firstName} ${ticket.requester.lastName}${ticket.requester.department?.name ? ' - ' + ticket.requester.department.name : ''}`"
                      >
                        {{
                          getUserInitials({
                            firstName: ticket.requester.firstName,
                            lastName: ticket.requester.lastName,
                          })
                        }}
                      </div>
                      <!-- Requester indicator badge -->
                      <div
                        class="absolute -bottom-[6px] -right-1.5 w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                        title="Solicitante"
                      >
                        <font-awesome-icon icon="arrow-down" class="text-white text-[8px]" />
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="props.activeTab !== 'recebidas'"
                    class="flex items-center gap-1.5"
                  >
                    <div
                      v-if="ticket.targetUsers && ticket.targetUsers.length > 0"
                      v-for="targetUser in getSortedTargetUsers(ticket)"
                      :key="targetUser.userId"
                      :class="[
                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold',
                        ticket.targetUsers.length > 1 &&
                        targetUser.userId === ticket.currentTargetUserId
                          ? 'ring-2 ring-blue-500'
                          : '',
                      ]"
                      :style="{
                        backgroundColor: getAvatarColor(targetUser.user.department?.name || ''),
                      }"
                      :title="`${targetUser.user.firstName} ${targetUser.user.lastName}${targetUser.user.department?.name ? ' - ' + targetUser.user.department.name : ''}`"
                    >
                      {{
                        getUserInitials({
                          firstName: targetUser.user.firstName,
                          lastName: targetUser.user.lastName,
                        })
                      }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    v-if="getChecklistProgress(ticket)"
                    class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"
                    :title="`Checklist: ${getChecklistProgress(ticket)}`"
                  >
                    <font-awesome-icon icon="tasks" />
                    <span class="text-xs">{{ getChecklistProgress(ticket) }}</span>
                  </div>
                  <font-awesome-icon
                    v-if="
                      props.activeTab === 'recebidas' &&
                      ticket.targetUsers &&
                      ticket.targetUsers.length > 1
                    "
                    icon="users"
                    class="text-[13px] text-gray-500 dark:text-gray-400"
                    :title="`${ticket.targetUsers.length} usuários de destino`"
                  />
                  <div
                    :class="[
                      'flex items-center justify-center text-sm',
                      ticket.priority === TicketPriority.Low
                        ? 'text-green-500'
                        : ticket.priority === TicketPriority.Medium
                          ? 'text-yellow-500'
                          : 'text-red-500',
                    ]"
                    :title="'Prioridade ' + ticket.priority"
                  >
                    <font-awesome-icon
                      v-if="ticket.priority !== TicketPriority.Medium"
                      :icon="ticket.priority === TicketPriority.Low ? 'angles-down' : 'angles-up'"
                      class="text-sm"
                    />
                    <font-awesome-icon v-else icon="equals" class="text-sm" />
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between gap-3 mb-0">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap"
                    title="ID do Ticket"
                  >
                    {{ ticket.customId }}
                  </div>
                  <div
                    class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-300 opacity-70 whitespace-nowrap"
                    title="Última atualização"
                  >
                    <font-awesome-icon icon="clock-rotate-left" />
                    {{ formatRelativeTime(ticket.updatedAt) }}
                  </div>
                </div>
                <div
                  v-if="
                    ticket.dueAt &&
                    ticket.ticketStatus?.key !== DefaultTicketStatus.Completed &&
                    ticket.status !== DefaultTicketStatus.Completed
                  "
                  :class="[
                    'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
                    getDeadlineClass(ticket.dueAt) === 'normal'
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      : getDeadlineClass(ticket.dueAt) === 'warning'
                        ? 'bg-yellow-100 dark:bg-yellow-400/60 text-yellow-800 dark:text-white'
                        : getDeadlineClass(ticket.dueAt) === 'urgent'
                          ? 'bg-orange-400 dark:bg-orange-500 text-white'
                          : getDeadlineClass(ticket.dueAt) === 'overdue'
                            ? 'bg-red-500 dark:bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-600',
                  ]"
                  :title="'Prazo: ' + (ticket.dueAt ? formatDate(ticket.dueAt) : 'Não definido')"
                >
                  <font-awesome-icon :icon="getDeadlineIcon(ticket)" />
                  {{ calculateDeadline(ticket) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Verification Confirmation Modal -->
  <BaseModal
    v-if="showVerificationAlert"
    :is-open="showVerificationAlert"
    @close="showVerificationAlert = false"
    :show-footer="false"
    title="Iniciar Verificação"
  >
    <div class="p-6 text-center">
      <div class="text-3xl text-purple-700 dark:text-purple-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>
      <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
        Para visualizar os detalhes desta tarefa, você precisa iniciar a verificação clicando no
        botão "Verificar".
      </p>
      <div class="flex justify-center gap-4">
        <button
          class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
          @click="showVerificationAlert = false"
        >
          Cancelar
        </button>
        <button
          class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleAlertVerification"
          :disabled="isVerifying"
        >
          <font-awesome-icon v-if="isVerifying" icon="spinner" spin class="text-sm" />
          {{ isVerifying ? '' : 'Verificar' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Ticket } from '@/models';
import type { StatusColumn, TicketStatus as ColumnTicketStatus } from '@/models/statusColumn';
import { DefaultTicketStatus, TicketPriority } from '@/models';
import {
  formatSnakeToNaturalCase,
  getUserInitials,
  getAvatarColor,
  calculateDeadline as calculateDeadlineHelper,
} from '@/utils/generic-helper';
import { formatDate, formatRelativeTime, getBusinessDayDifference } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { useRoles } from '@/composables/useRoles';
import { ticketService } from '@/services/ticketService';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';

const props = defineProps<{
  tickets: Ticket[];
  activeTab?: 'recebidas' | 'criadas' | 'setor' | 'arquivadas' | 'gerais';
  isLoading?: boolean;
}>();

const emit = defineEmits(['viewTicket']);

const kanbanColumns = computed(() => ticketsStore.statusColumns.data);

const showVerificationAlert = ref(false);
const pendingVerificationTicket = ref<Ticket | null>(null);

const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const { isSupervisor } = useRoles();

const getSortedTargetUsers = (ticket: Ticket) => {
  if (!ticket?.targetUsers || ticket.targetUsers.length === 0)
    return [] as NonNullable<Ticket['targetUsers']>;
  return [...ticket.targetUsers].sort((a, b) => a.order - b.order);
};

const shouldBeGrayscale = (ticket: Ticket) => {
  return (
    !isCurrentTargetUser(ticket) &&
    (ticket.ticketStatus?.key === DefaultTicketStatus.Pending ||
      ticket.ticketStatus?.key === DefaultTicketStatus.InProgress ||
      ticket.ticketStatus?.key === DefaultTicketStatus.Returned)
  );
};

const isCurrentTargetUser = (ticket: Ticket) => {
  // Only apply grayed out effect in "recebidas" tab
  if (props.activeTab !== 'recebidas') return true;
  if (!userStore.user?.id || !ticket.currentTargetUserId) return true;
  return userStore.user.id === ticket.currentTargetUserId;
};

const hasRightIcons = (ticket: Ticket) => {
  return (
    (ticket.comments?.length ?? 0) > 0 ||
    Boolean(ticket.isPrivate) ||
    (ticket.files?.length ?? 0) > 0 ||
    getChecklistProgress(ticket) !== null ||
    ticket.ticketStatus?.key === DefaultTicketStatus.Returned ||
    ticket.status === DefaultTicketStatus.Returned
  );
};

const getChecklistProgress = (ticket: Ticket): string | null => {
  if (!ticket.checklistItems || ticket.checklistItems.length === 0) {
    return null;
  }

  const totalItems = ticket.checklistItems.length;
  const completedItems = ticket.checklistItems.filter((item) => item.isCompleted).length;

  if (totalItems === 0) {
    return null;
  }

  return `${completedItems}/${totalItems}`;
};

const getTicketsByColumn = (column: StatusColumn) => {
  const statusKeys = column.statuses.map((status: ColumnTicketStatus) => status.key);

  // Special handling for "Pendente" column - also include "devolvido" status
  const isPendenteColumn = column.statuses.some(
    (status: ColumnTicketStatus) => status.key === DefaultTicketStatus.Pending,
  );

  if (isPendenteColumn) {
    return props.tickets.filter(
      (ticket) =>
        statusKeys.includes(ticket.ticketStatus?.key || ticket.status) ||
        ticket.status === DefaultTicketStatus.Returned ||
        ticket.ticketStatus?.key === DefaultTicketStatus.Returned,
    );
  }

  return props.tickets.filter((ticket) =>
    statusKeys.includes(ticket.ticketStatus?.key || ticket.status),
  );
};

const calculateDeadline = (ticket: Ticket) => {
  if (!ticket.dueAt) return '—';

  const result = calculateDeadlineHelper(ticket);
  if (!result || result === '—') return '—';

  // Convert to abbreviated format for Kanban card
  // Replace "dias" with "d" and "horas" with "h"
  return result
    .replace(/\s+dia\s+/gi, 'd ')
    .replace(/\s+dias\s+/gi, 'd ')
    .replace(/\s+hora\s+/gi, 'h ')
    .replace(/\s+horas\s+/gi, 'h ')
    .replace(/\s+dia$/gi, 'd')
    .replace(/\s+dias$/gi, 'd')
    .replace(/\s+hora$/gi, 'h')
    .replace(/\s+horas$/gi, 'h')
    .replace(/\s+/g, ' ')
    .trim();
};

const getDeadlineClass = (dueDate: string | null) => {
  if (!dueDate) return 'normal';

  const now = new Date();
  const due = new Date(dueDate);

  if (due < now) {
    return 'overdue';
  }

  // Use business days difference to match the logic used in calculateDeadline
  // This ensures consistency between the text display and color coding
  const businessDays = getBusinessDayDifference(due, now);

  if (businessDays <= 2) {
    return 'urgent';
  } else if (businessDays <= 3) {
    return 'warning';
  }

  return 'normal';
};

const getDeadlineIcon = (ticket: Ticket) => {
  if (!ticket.dueAt) return 'clock';

  const now = new Date();
  const dueDate = new Date(ticket.dueAt);

  if (dueDate < now) {
    return 'exclamation-circle';
  }

  const diffTime = Math.abs(dueDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) {
    return 'exclamation-triangle';
  } else if (diffDays <= 3) {
    return 'clock';
  }

  return 'calendar-day';
};

// test
const openTicketDetails = (ticket: Ticket) => {
  if (isSupervisor.value && props.activeTab === 'setor' && ticket.isPrivate) {
    toast.warning('Esta tarefa é privada');
    return;
  }

  // If ticket is awaiting verification and user is the reviewer, show confirmation first
  const currentStatus = ticket.ticketStatus?.key || ticket.status || '';
  if (
    currentStatus === DefaultTicketStatus.AwaitingVerification &&
    ticket.reviewer?.id === userStore.user?.id
  ) {
    pendingVerificationTicket.value = ticket;
    showVerificationAlert.value = true;
    return;
  }

  // Emit the viewTicket event with the ticket
  emit('viewTicket', ticket);
};

const handleStartVerification = async (ticket: Ticket) => {
  await ticketService.updateStatus(ticket.customId, {
    status: DefaultTicketStatus.UnderVerification,
  });

  // Emit viewTicket to navigate to URL
  emit('viewTicket', ticket);
};

const isVerifying = ref(false);

const handleAlertVerification = async () => {
  if (!pendingVerificationTicket.value) return;

  isVerifying.value = true;
  try {
    await handleStartVerification(pendingVerificationTicket.value);
    // Only close modal after updateStatus completes successfully
    showVerificationAlert.value = false;
    pendingVerificationTicket.value = null;
  } catch (error) {
    // Show error toast and keep modal open so user can try again
    toast.error('Erro ao iniciar verificação');
  } finally {
    isVerifying.value = false;
  }
};

onMounted(() => {
  ticketsStore.fetchStatusColumns();
});
</script>

<style scoped>
/* Custom scrollbar for column content */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

.kanban-container::-webkit-scrollbar {
  height: 7px;
}

.kanban-container::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

.kanban-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
