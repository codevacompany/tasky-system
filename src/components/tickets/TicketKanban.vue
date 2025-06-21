<template>
  <div
    class="flex gap-6 p-6 overflow-x-auto min-h-[70vh] bg-white dark:bg-gray-900 rounded-lg relative w-full"
  >
    <div
      v-for="status in statusColumns"
      :key="status"
      class="flex-1 min-w-[300px] w-0 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm relative"
    >
      <div
        class="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-t-xl text-center"
      >
        <h3
          class="m-0 inline-flex items-center gap-3 text-base font-semibold text-gray-900 dark:text-white py-2"
        >
          {{ formatSnakeToNaturalCase(status) }}
          <span
            class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-xl text-xs text-gray-600 dark:text-gray-300"
          >
            {{ getTicketsByStatus(status).length }}
          </span>
        </h3>
      </div>

      <div class="p-4 flex flex-col min-h-[100px] max-h-[calc(100vh-200px)] overflow-y-auto">
        <div
          v-for="ticket in getTicketsByStatus(status)"
          :key="ticket.customId"
          class="bg-white dark:bg-gray-700 rounded-lg p-3.5 cursor-pointer transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm mb-3.5 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-black/8 dark:hover:shadow-black/30"
          @click="openTicketDetails(ticket)"
        >
          <div class="flex justify-between items-start gap-3 mb-2 w-full p-0">
            <div class="flex-1 min-w-0 flex items-start">
              <div
                class="font-semibold text-sm leading-5 text-gray-900 dark:text-white overflow-hidden text-left w-full break-words m-0 p-0"
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
              >
                {{ ticket.name }}
              </div>
            </div>
            <div class="flex items-center gap-2 ml-auto flex-shrink-0">
              <div
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-80"
                title="Comentários"
              >
                <font-awesome-icon icon="comment" />
                <span class="text-xs min-w-4">{{ ticket.comments?.length || 0 }}</span>
              </div>
              <div
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-80"
                title="Anexos"
              >
                <font-awesome-icon icon="paperclip" />
                <span class="text-xs min-w-4">{{ ticket.files?.length || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-600 my-2 opacity-50"></div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-3 mb-0">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <span>{{ ticket.targetUser.firstName }} {{ ticket.targetUser.lastName }}</span>
                  <font-awesome-icon
                    v-if="!ticket.targetUser.isActive"
                    icon="exclamation-triangle"
                    class="text-orange-500 text-xs"
                    title="Conta desativada"
                  />
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500">
                  {{ ticket.department.name }}
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
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 opacity-70"
                title="Última atualização"
              >
                <font-awesome-icon icon="clock-rotate-left" />
                {{ formatRelativeTime(ticket.updatedAt) }}
              </div>
              <div
                v-if="ticket.dueAt"
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

  <TicketDetailsModal
    v-if="isModalOpen"
    :isOpen="isModalOpen"
    :ticket="selectedTicket"
    @close="isModalOpen = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ticket } from '@/models';
import { TicketStatus, TicketPriority } from '@/models';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { formatDate, formatRelativeTime } from '@/utils/date';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';

const props = defineProps<{
  tickets: Ticket[];
}>();

const statusColumns = [
  TicketStatus.Pending,
  TicketStatus.InProgress,
  TicketStatus.AwaitingVerification,
  TicketStatus.UnderVerification,
];

const selectedTicket = ref<Ticket | null>(null);
const isModalOpen = ref(false);

const getTicketsByStatus = (status: string) => {
  return props.tickets.filter((ticket) => ticket.status === status);
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
  selectedTicket.value = ticket;
  isModalOpen.value = true;
};
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
