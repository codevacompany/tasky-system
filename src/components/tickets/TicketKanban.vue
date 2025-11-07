<template>
  <div
    class="flex gap-4 py-6 px-2 overflow-x-auto h-[calc(100vh-120px)] bg-white dark:bg-gray-900 rounded-lg relative w-full"
  >
    <!-- Skeleton while loading columns -->
    <template v-if="ticketsStore.statusColumns.isLoading || kanbanColumns.length === 0">
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
    <div
      v-for="column in kanbanColumns"
      :key="column.id"
      class="flex-1 min-w-[310px] w-0 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm relative flex flex-col h-full"
    >
      <div
        class="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-t-xl text-center flex-shrink-0"
      >
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
            'min-h-[100px] flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg p-3.5 cursor-pointer transition-all duration-200 border shadow-sm mb-3.5 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/8 dark:hover:shadow-black/30',
            ticket.ticketStatus?.key === DefaultTicketStatus.Returned ||
            ticket.status === DefaultTicketStatus.Returned
              ? 'border-orange-300 dark:border-orange-600 dark:bg-orange-900/10 hover:border-orange-400 dark:hover:border-orange-500'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          ]"
          @click="openTicketDetails(ticket)"
        >
          <div class="flex justify-between items-start mb-2 w-full p-0">
            <div class="flex-1 min-w-0 flex items-start">
              <div
                class="font-semibold text-sm leading-5 text-gray-900 dark:text-white overflow-hidden text-left flex-1 break-words m-0 p-0"
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
              >
                {{ ticket.name }}
              </div>
            </div>
            <div class="flex items-center gap-2 ml-auto flex-shrink-0">
              <div
                v-if="(ticket.comments?.length || 0) > 0"
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-80"
                title="Comentários"
              >
                <font-awesome-icon icon="comment" />
                <span class="text-xs min-w-2">{{ ticket.comments?.length || 0 }}</span>
              </div>
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
                title="Ticket devolvido"
              >
                <font-awesome-icon icon="undo" class="text-xs" />
              </div>
            </div>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-600 my-2 opacity-50"></div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-3 mb-0">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5">
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
                      backgroundColor: getAvatarColor(
                        targetUser.user.firstName + ' ' + targetUser.user.lastName,
                      ),
                    }"
                    :title="targetUser.user.firstName + ' ' + targetUser.user.lastName"
                  >
                    {{ getUserInitials(targetUser.user.firstName, targetUser.user.lastName) }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="text-xs text-gray-400 dark:text-gray-400">
                    {{
                      ticket.currentTargetUser?.department?.name ||
                      (ticket.currentTargetUserId && ticket.targetUsers?.length > 0
                        ? ticket.targetUsers.find((tu) => tu.userId === ticket.currentTargetUserId)
                            ?.user?.department?.name
                        : '') ||
                      (ticket.targetUsers && ticket.targetUsers.length > 0
                        ? ticket.targetUsers[0]?.user?.department?.name
                        : '-')
                    }}
                  </div>
                </div>
              </div>
              <div
                :class="[
                  'flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap text-white',
                  ticket.priority === TicketPriority.Low
                    ? 'bg-green-500'
                    : ticket.priority === TicketPriority.Medium
                      ? 'bg-yellow-500'
                      : 'bg-red-500',
                ]"
                :title="'Prioridade: ' + ticket.priority"
              >
                <font-awesome-icon
                  :icon="
                    ticket.priority === TicketPriority.Low
                      ? 'arrow-down'
                      : ticket.priority === TicketPriority.Medium
                        ? 'minus'
                        : 'arrow-up'
                  "
                  class="text-xs"
                />
                {{ ticket.priority }}
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
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : getDeadlineClass(ticket.dueAt) === 'urgent'
                        ? 'bg-orange-500 text-white'
                        : getDeadlineClass(ticket.dueAt) === 'critical'
                          ? 'bg-red-500 text-white'
                          : getDeadlineClass(ticket.dueAt) === 'overdue'
                            ? 'bg-red-600 text-white'
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
  </div>

  <TicketDetailsModal v-if="isModalOpen" :ticket="selectedTicket" @close="isModalOpen = false" />

  <!-- Verification Confirmation Modal -->
  <BaseModal
    v-if="showVerificationAlert"
    :is-open="showVerificationAlert"
    @close="showVerificationAlert = false"
    :show-footer="false"
  >
    <div class="p-6 text-center">
      <div class="text-3xl text-purple-700 dark:text-purple-400 mb-4">
        <font-awesome-icon icon="info-circle" />
      </div>
      <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
        Para visualizar os detalhes deste ticket, você precisa iniciar a verificação clicando no
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
          class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-200"
          @click="handleAlertVerification"
        >
          Verificar
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
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { formatDate, formatRelativeTime } from '@/utils/date';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { ticketService } from '@/services/ticketService';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';

const props = defineProps<{
  tickets: Ticket[];
}>();

const kanbanColumns = computed(() => ticketsStore.statusColumns.data);

const selectedTicket = ref<Ticket | null>(null);
const isModalOpen = ref(false);
const showVerificationAlert = ref(false);
const pendingVerificationTicket = ref<Ticket | null>(null);

const userStore = useUserStore();
const ticketsStore = useTicketsStore();

const getUserInitials = (firstName: string, lastName: string) => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#84cc16', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#d946ef', // fuchsia
    '#ec4899', // pink
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getSortedTargetUsers = (ticket: Ticket) => {
  if (!ticket?.targetUsers || ticket.targetUsers.length === 0)
    return [] as NonNullable<Ticket['targetUsers']>;
  return [...ticket.targetUsers].sort((a, b) => a.order - b.order);
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

  const now = new Date();
  const dueDate = new Date(ticket.dueAt);

  if (dueDate < now) {
    return 'Atrasado';
  }

  const diffTime = Math.abs(dueDate.getTime() - now.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hora restante' : `${diffHours} horas restantes`;
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1 ? '1 dia restante' : `${diffDays} dias restantes`;
};

const getDeadlineClass = (dueDate: string | null) => {
  if (!dueDate) return 'normal';

  const now = new Date();
  const due = new Date(dueDate);

  if (due < now) {
    return 'overdue';
  }

  const diffTime = Math.abs(due.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return 'critical';
  } else if (diffDays <= 2) {
    return 'urgent';
  } else if (diffDays <= 3) {
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

const openTicketDetails = (ticket: Ticket) => {
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

  selectedTicket.value = ticket;
  isModalOpen.value = true;
};

const handleStartVerification = async (ticket: Ticket) => {
  try {
    const ticketResponse = await ticketService.updateStatus(ticket.customId, {
      status: DefaultTicketStatus.UnderVerification,
    });

    selectedTicket.value = ticketResponse.data.ticketData;
    isModalOpen.value = true;

    await ticketsStore.fetchTicketDetails(ticket.customId);
  } catch {
    toast.error('Erro ao iniciar verificação');
  }
};

const handleAlertVerification = () => {
  if (pendingVerificationTicket.value) {
    handleStartVerification(pendingVerificationTicket.value);
    showVerificationAlert.value = false;
    pendingVerificationTicket.value = null;
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
</style>
