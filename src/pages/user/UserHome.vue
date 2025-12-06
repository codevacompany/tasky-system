<template>
  <section id="dashboardSection" class="p-5 sm:px-6 sm:pt-4 sm:pb-10">
    <WelcomeModal
      :isOpen="showWelcomeModal"
      @close="closeWelcomeModal"
      @openGuide="openUserGuide"
    />

    <!-- Estatísticas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg px-6 pt-4 pb-6 mb-5 shadow">
      <div class="mb-4">
        <h1 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Estatísticas</h1>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Visão geral do seu desempenho e métricas
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <!-- Pendentes -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div
            class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 animate-pulse-custom"
          ></div>
          <div
            class="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
          ></div>
          <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon icon="clock" class="text-orange-500 dark:text-orange-400 text-2xl" />
          </div>
          <p id="pendingTicketsCount" class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ ticketsPendentes.total }}
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Pendentes</h3>
        </div>

        <!-- Em Andamento -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          </div>
          <div
            class="h-7 w-14 bg-gray-300 dark:bg-gray-600 rounded mb-1 animate-pulse-custom"
          ></div>
          <div class="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon icon="spinner" class="text-blue-500 dark:text-blue-400 text-2xl" />
          </div>
          <p
            id="inProgressTicketsCount"
            class="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          >
            {{ ticketsEmAndamento.total }}
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Em Andamento</h3>
        </div>

        <!-- Finalizados -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div
            class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 animate-pulse-custom"
          ></div>
          <div
            class="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
          ></div>
          <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon
              icon="check-circle"
              class="text-green-500 dark:text-green-400 text-2xl"
            />
          </div>
          <p
            id="resolvedTicketsCount"
            class="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          >
            {{ ticketsFinalizados.total }}
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Resolvidos</h3>
        </div>

        <!-- Taxa de Resolução -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg px-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div
            class="w-12 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 animate-pulse-custom"
          ></div>
          <div
            class="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
          ></div>
          <div class="h-3 w-28 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon
              icon="chart-pie"
              class="text-purple-600 dark:text-purple-400 text-2xl"
            />
          </div>
          <p id="resolucaoPercentual" class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ resolutionRate }}%
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Taxa de Resolução</h3>
        </div>

        <!-- Tempo Médio de Aceite -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div
            class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 animate-pulse-custom"
          ></div>
          <div
            class="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
          ></div>
          <div class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon
              icon="hourglass-half"
              class="text-teal-600 dark:text-teal-400 text-2xl"
            />
          </div>
          <p id="tempoMedioAceite" class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ userStats ? formatTimeShort(userStats.averageAcceptanceTimeSeconds) : 'N/A' }}
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Tempo Médio de Aceite
          </h3>
        </div>

        <!-- Tempo Médio de Resolução -->
        <div
          v-if="isLoading"
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div
            class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 animate-pulse-custom"
          ></div>
          <div
            class="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse-custom"
          ></div>
          <div class="h-4 w-36 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
        <div
          v-else
          class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
        >
          <div class="mb-3">
            <font-awesome-icon
              icon="calendar-check"
              class="text-indigo-500 dark:text-indigo-400 text-2xl"
            />
          </div>
          <p id="tempoMedioConclusao" class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ userStats ? formatTimeShort(userStats.averageResolutionTimeSeconds) : 'N/A' }}
          </p>
          <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Tempo Médio de Resolução
          </h3>
        </div>
      </div>
    </div>

    <!-- Últimos Tickets Recebidos e Criados -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <CompactTicketTable
        title="Últimas Tarefas Recebidas"
        type="received"
        :viewAllUrl="'/minhas-tarefas?tab=recebidas'"
      />
      <CompactTicketTable
        title="Últimas Tarefas Criadas"
        type="created"
        :viewAllUrl="'/minhas-tarefas?tab=criadas'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { reportService, type UserStatistics } from '@/services/reportService';
import { DefaultTicketStatus, type Ticket } from '@/models';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { toast } from 'vue3-toastify';
import CompactTicketTable from '@/components/tickets/CompactTicketTable.vue';
import { formatTimeShort } from '@/utils/generic-helper';
import WelcomeModal from '@/components/common/WelcomeModal.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const router = useRouter();
const isLoading = ref(true);
const userStats = ref<UserStatistics | null>(null);
const latestReceivedTickets = computed(() => ticketsStore.recentReceivedTickets);
const latestCreatedTickets = computed(() => ticketsStore.recentCreatedTickets);

const getTicketStatus = (ticket: Ticket): string => {
  return ticket.ticketStatus?.key || ticket.status || '';
};

const ticketsPendentes = computed(() => {
  const receivedPending = latestReceivedTickets.value.filter(
    (t) => getTicketStatus(t) === DefaultTicketStatus.Pending,
  ).length;
  return {
    total: receivedPending,
  };
});

const ticketsEmAndamento = computed(() => {
  // Em Andamento includes all statuses except Pending, Completed, Canceled, Rejected
  const excludedStatuses = new Set([
    DefaultTicketStatus.Pending,
    DefaultTicketStatus.Completed,
    DefaultTicketStatus.Canceled,
    DefaultTicketStatus.Rejected,
  ]);

  const receivedInProgress = latestReceivedTickets.value.filter(
    (t) => !excludedStatuses.has(getTicketStatus(t) as DefaultTicketStatus),
  ).length;

  return {
    total: receivedInProgress,
  };
});

const ticketsFinalizados = computed(() => {
  const receivedCompleted = latestReceivedTickets.value.filter(
    (t) => getTicketStatus(t) === DefaultTicketStatus.Completed,
  ).length;
  return {
    total: receivedCompleted,
  };
});

const resolutionRate = computed(() => {
  if (userStats.value) {
    return Math.round(userStats.value.resolutionRate * 100);
  }
  return 0;
});

const showWelcomeModal = ref(userStore.isNewUser);

const closeWelcomeModal = () => {
  showWelcomeModal.value = false;
  userStore.setIsNewUser(false);
};

const openUserGuide = () => {
  userStore.setIsNewUser(false);
  router.push('/faq');
};

onMounted(async () => {
  isLoading.value = true;

  if (ticketsStore.receivedTickets.currentPage !== 1) {
    await ticketsStore.fetchReceivedTickets(1);
  }

  if (ticketsStore.myTickets.currentPage !== 1) {
    await ticketsStore.fetchMyTickets(1);
  }

  try {
    if (userStore.user?.id) {
      const userStatsResponse = await reportService.getUserStatistics();
      userStats.value = userStatsResponse;
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    toast.error('Erro ao carregar dados do dashboard');
  } finally {
    isLoading.value = false;
  }
});
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
