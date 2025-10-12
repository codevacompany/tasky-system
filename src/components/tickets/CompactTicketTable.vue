<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex-1 min-w-0"
  >
    <div
      class="flex justify-between items-center px-6 py-6 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white m-0">{{ title }}</h2>
      <router-link
        :to="viewAllUrl"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
        >Ver todos</router-link
      >
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse min-w-[600px]">
        <tbody>
          <tr v-if="isLoading" v-for="n in 5" :key="`skeleton-${n}`">
            <td class="max-w-[200px] pl-8 py-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex flex-col gap-1">
                <div
                  class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"
                ></div>
                <div
                  class="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"
                ></div>
              </div>
            </td>
            <td class="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
              <div
                class="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom ml-auto"
              ></div>
            </td>
            <td class="px-3 py-3 text-center border-b border-gray-200 dark:border-gray-700">
              <div
                class="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse-custom mx-auto"
              ></div>
            </td>
          </tr>
          <tr
            v-else
            v-for="ticket in tickets"
            :key="ticket.id"
            class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <td
              class="max-w-[200px] pl-8 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis w-1/2"
              :title="ticket.name"
            >
              <div class="flex flex-col gap-1">
                <p class="text-sm font-medium truncate">{{ ticket.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ ticket.department.name }}</p>
              </div>
            </td>
            <td
              class="px-3 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white whitespace-nowrap w-1/4"
            >
              <template
                v-if="title === 'Últimos Tickets Criados' || title === 'Últimos Tickets Recebidos'"
              >
                <span v-if="ticket.dueAt" class="flex items-center gap-2 justify-end">
                  <span
                    :class="getDeadlineDotClass(ticket.dueAt)"
                    class="inline-block w-[9px] h-[9px] rounded-full"
                  ></span>
                  {{ formatDeadlineRelative(ticket.dueAt) }}
                </span>
              </template>
              <template v-else>
                {{ formatDate(ticket.createdAt) }}
              </template>
            </td>
            <td
              class="px-3 py-3 text-center border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white whitespace-nowrap w-1/4"
            >
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-2 whitespace-nowrap',
                  getStatusClasses(ticket.status),
                ]"
                >{{ formatSnakeToNaturalCase(ticket.status).toUpperCase() }}</span
              >
            </td>
          </tr>
          <tr v-if="!isLoading && tickets.length === 0" class="last:border-b-0">
            <td
              :colspan="title === 'Últimos Tickets Criados' ? 4 : 5"
              class="px-3 py-6 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center gap-2"
            >
              <font-awesome-icon icon="inbox" class="text-lg" /> Nenhum ticket encontrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { TicketStatus, type Ticket } from '@/models';
import { formatDate } from '@/utils/date';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { useTicketsStore } from '@/stores/tickets';

const props = defineProps<{
  title: string;
  type: 'received' | 'created' | 'department';
  viewAllUrl: string;
}>();

const ticketsStore = useTicketsStore();

const tickets = computed(() => {
  switch (props.type) {
    case 'received':
      return ticketsStore.recentReceivedTickets;
    case 'created':
      return ticketsStore.recentCreatedTickets;
    case 'department':
      return ticketsStore.departmentTickets.data.slice(0, 5);
    default:
      return [];
  }
});

const isLoading = computed(() => {
  switch (props.type) {
    case 'received':
      return ticketsStore.receivedTickets.isLoading;
    case 'created':
      return ticketsStore.myTickets.isLoading;
    case 'department':
      return ticketsStore.departmentTickets.isLoading;
    default:
      return false;
  }
});

const statusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'status-pending';
    case TicketStatus.InProgress:
      return 'status-in-progress';
    case TicketStatus.AwaitingVerification:
    case TicketStatus.UnderVerification:
      return 'status-awaiting-verification';
    case TicketStatus.Completed:
      return 'status-completed';
    case TicketStatus.Returned:
      return 'status-returned';
    case TicketStatus.Rejected:
      return 'status-rejected';
    default:
      return '';
  }
};

function calculateDeadlineCompact(ticket: Ticket) {
  if (!ticket.dueAt) return '—';
  if (ticket.status !== TicketStatus.Pending && ticket.status !== TicketStatus.InProgress) {
    return '—';
  }
  const deadline = new Date(ticket.dueAt);
  const today = new Date();
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return 'Atrasado';
  }
  // Se faltar menos de 1 dia, mostrar em horas
  if (diffDays === 0) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours}h`;
    return 'Hoje';
  }
  return `${diffDays}d`;
}

function getStatusClasses(status: TicketStatus) {
  switch (status) {
    case TicketStatus.Pending:
      return 'bg-orange-50 text-orange-500 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case TicketStatus.InProgress:
      return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case TicketStatus.AwaitingVerification:
    case TicketStatus.UnderVerification:
      return 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
    case TicketStatus.Completed:
      return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case TicketStatus.Returned:
      return 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case TicketStatus.Rejected:
      return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    default:
      return '';
  }
}

function isDeadlineExceeded(dueAt: string) {
  return new Date(dueAt) < new Date();
}

function formatDeadlineDate(dueAt: string) {
  const date = new Date(dueAt);
  return date
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '');
}

function getDeadlineDotClass(dueAt: string) {
  const deadline = new Date(dueAt);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays < 0) {
    return 'bg-red-500';
  } else if (diffDays === 0 || (diffDays === 1 && diffHours < 8)) {
    return 'bg-yellow-500';
  } else {
    return 'bg-emerald-400';
  }
}

function formatDeadlineRelative(dueAt: string) {
  const deadline = new Date(dueAt);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays < 0) {
    const overdueHours = Math.abs(diffHours);
    const overdueDays = Math.abs(diffDays);

    if (overdueHours < 1) {
      return 'Vencendo agora';
    } else if (overdueDays === 0) {
      // Overdue but less than 1 day
      return overdueHours === 1 ? 'Atrasado há 1 hora' : `Atrasado há ${overdueHours} horas`;
    } else {
      // Overdue more than 1 day
      return overdueDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${overdueDays} dias`;
    }
  } else if (diffDays === 0) {
    // Today
    if (diffHours === 1) {
      return '1 hora restante';
    } else {
      return `${diffHours} horas restantes`;
    }
  } else if (diffDays === 1) {
    // Tomorrow
    if (diffHours < 8) {
      // Less than 8 hours until tomorrow
      if (diffHours === 1) {
        return '1 hora restante';
      } else {
        return `${diffHours} horas restantes`;
      }
    } else {
      // More than 8 hours until tomorrow
      return '1 dia restante';
    }
  } else {
    // 2+ days
    return `${diffDays} dias restantes`;
  }
}
</script>

<style scoped>
@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse-custom {
  animation: fadeInOut 2s ease-in-out infinite;
}
</style>
