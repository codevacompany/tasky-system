<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow flex-1 min-w-0"
  >
    <div
      class="flex justify-between items-center px-6 py-[22px] border-b border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white m-0">{{ title }}</h2>
      <router-link
        :to="viewAllUrl"
        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
        >Ver todos</router-link
      >
    </div>
    <div v-if="title === 'Últimos Tickets Criados' || title === 'Últimos Tickets Recebidos'">
      <!-- New Design for Received/Created Tickets -->
      <div class="px-6 pb-6">
        <div v-if="isLoading" class="space-y-4">
          <div
            v-for="n in 5"
            :key="`skeleton-${n}`"
            class="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div
              class="w-[34px] h-[34px] bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse-custom flex-shrink-0"
            ></div>
            <div class="flex-1">
              <div
                class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
              ></div>
              <div class="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
            </div>
            <div class="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          </div>
        </div>
        <div v-else-if="tickets.length === 0" class="py-12 text-center h-[300px]">
          <div class="flex flex-col items-center justify-center gap-3 h-full">
            <div
              class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              <font-awesome-icon icon="inbox" class="text-2xl text-gray-400 dark:text-gray-500" />
            </div>
            <div class="flex flex-col items-center gap-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 m-0">
                Nenhum ticket encontrado
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                Tickets recentes aparecerão aqui
              </p>
            </div>
          </div>
        </div>
        <div v-else class="space-y-3 pt-4">
          <div
            v-for="(ticket, index) in tickets"
            :key="ticket.id"
            class="flex items-center gap-4 py-4 px-4 border border-dashed dark:border-solid border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            @click="handleTicketClick(ticket)"
          >
            <!-- Avatar and User Info -->
            <div class="flex items-center gap-3 flex-shrink-0 w-[200px]">
              <div
                class="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                :style="
                  title === 'Últimos Tickets Criados'
                    ? getAvatarStyle(
                        ticket.currentTargetUser?.department?.name ||
                          ticket.targetUsers?.[0]?.user?.department?.name ||
                          getTargetUserName(ticket),
                      )
                    : getAvatarStyle(
                        ticket.requester?.department?.name || getRequesterName(ticket),
                      )
                "
              >
                <template v-if="title === 'Últimos Tickets Criados'">
                  {{ getTargetUserInitials(ticket) }}
                </template>
                <template v-else>
                  {{ getRequesterInitials(ticket) }}
                </template>
              </div>
              <div class="flex flex-col min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white m-0 truncate">
                  <template v-if="title === 'Últimos Tickets Criados'">
                    {{ getTargetUserName(ticket) }}
                  </template>
                  <template v-else>
                    {{ getRequesterName(ticket) }}
                  </template>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 m-0 truncate">
                  <template v-if="title === 'Últimos Tickets Criados'">
                    {{
                      ticket.currentTargetUser?.department?.name ||
                      ticket.targetUsers?.[0]?.user?.department?.name ||
                      '-'
                    }}
                  </template>
                  <template v-else>
                    {{ ticket.requester?.department?.name || '-' }}
                  </template>
                </p>
              </div>
            </div>
            <!-- Ticket Title -->
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate m-0">
                {{ ticket.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="overflow-x-auto">
      <!-- Original Table Design for Department Tickets -->
      <table class="w-full border-collapse min-w-[600px]">
        <tbody :class="{ 'min-h-[300px]': !isLoading && tickets.length === 0 }">
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
            v-for="(ticket, index) in tickets"
            :key="ticket.id"
            class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            @click="handleTicketClick(ticket)"
          >
            <td
              :class="[
                'max-w-[200px] pl-8 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis w-2/3',
                index < 4 ? 'border-b border-gray-200 dark:border-gray-700' : '',
              ]"
              :title="ticket.name"
            >
              <div class="flex flex-col gap-1">
                <p class="text-sm font-medium truncate">{{ ticket.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ ticket.targetUsers?.[0]?.user?.department?.name || '-' }}
                </p>
              </div>
            </td>
            <td
              :class="[
                'px-3 py-3 text-center text-sm text-gray-900 dark:text-white whitespace-nowrap w-1/2',
                index < 4 ? 'border-b border-gray-200 dark:border-gray-700' : '',
              ]"
            >
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-2 whitespace-nowrap',
                  getStatusClasses(getTicketStatus(ticket)),
                ]"
                >{{ formatSnakeToNaturalCase(getTicketStatus(ticket)) }}</span
              >
            </td>
          </tr>
          <tr v-if="!isLoading && tickets.length === 0" class="last:border-b-0">
            <td colspan="2" class="px-6 py-12 text-center h-[300px]">
              <div class="flex flex-col items-center justify-center gap-3 h-full">
                <div
                  class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <font-awesome-icon
                    icon="inbox"
                    class="text-2xl text-gray-400 dark:text-gray-500"
                  />
                </div>
                <div class="flex flex-col items-center gap-1">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-300 m-0">
                    Nenhum ticket encontrado
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                    Tickets recentes aparecerão aqui
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { DefaultTicketStatus, type Ticket } from '@/models';
import { formatDate } from '@/utils/date';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  getDeadlineInfo,
  getUserInitials,
  getAvatarStyle,
} from '@/utils/generic-helper';
import { useTicketsStore } from '@/stores/tickets';

const props = defineProps<{
  title: string;
  type: 'received' | 'created' | 'department';
  viewAllUrl: string;
}>();

const router = useRouter();
const route = useRoute();
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

function getStatusClasses(status: string) {
  switch (status) {
    case DefaultTicketStatus.Pending:
      return 'bg-orange-50 text-orange-500 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case DefaultTicketStatus.InProgress:
      return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case DefaultTicketStatus.AwaitingVerification:
    case DefaultTicketStatus.UnderVerification:
      return 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
    case DefaultTicketStatus.Completed:
      return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case DefaultTicketStatus.Returned:
      return 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case DefaultTicketStatus.Rejected:
      return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    default:
      return '';
  }
}

function getDeadlineInfoFromDate(dueAt: string) {
  const info = getDeadlineInfo(dueAt);
  return info.isValid ? info : null;
}

function getDeadlineDotClass(dueAt: string) {
  const info = getDeadlineInfoFromDate(dueAt);
  if (!info) {
    return 'bg-emerald-400';
  }

  if (info.isOverdue) {
    return 'bg-red-500';
  }

  // Red when 6 hours or less remaining
  if (!info.isOverdue && info.hoursDifference <= 6) {
    return 'bg-red-500';
  }

  if (info.businessDaysRemaining <= 2) {
    return 'bg-orange-500';
  }

  return 'bg-emerald-400';
}

function isDeadlineOverdue(dueAt: string) {
  const info = getDeadlineInfoFromDate(dueAt);
  return info ? info.isOverdue : false;
}

function getTicketStatus(ticket: Ticket): string {
  return ticket.ticketStatus?.key || ticket.status || '';
}

function getTargetUserName(ticket: Ticket): string {
  if (ticket.currentTargetUser) {
    return `${ticket.currentTargetUser.firstName} ${ticket.currentTargetUser.lastName}`;
  }
  if (ticket.targetUsers && ticket.targetUsers.length > 0 && ticket.targetUsers[0]?.user) {
    return `${ticket.targetUsers[0].user.firstName} ${ticket.targetUsers[0].user.lastName}`;
  }
  return '-';
}

function getTargetUserInitials(ticket: Ticket): string {
  if (ticket.currentTargetUser) {
    return getUserInitials(ticket.currentTargetUser);
  }
  if (ticket.targetUsers && ticket.targetUsers.length > 0 && ticket.targetUsers[0]?.user) {
    return getUserInitials(ticket.targetUsers[0].user);
  }
  return '??';
}

function getRequesterName(ticket: Ticket): string {
  if (ticket.requester) {
    return `${ticket.requester.firstName} ${ticket.requester.lastName}`;
  }
  return '-';
}

function getRequesterInitials(ticket: Ticket): string {
  if (ticket.requester) {
    return getUserInitials(ticket.requester);
  }
  return '??';
}

const handleTicketClick = (ticket: Ticket) => {
  if (!ticket.customId) return;

  const isOnTicketsPage = route.path === '/minhas-tarefas';
  const query = isOnTicketsPage
    ? { ...route.query, ticket: ticket.customId }
    : { tab: 'recebidas', ticket: ticket.customId };

  router.push({
    path: '/minhas-tarefas',
    query,
  });
};
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
