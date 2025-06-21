<template>
  <section id="dashboardSection" class="p-4 sm:p-6">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Dashboard</h1>

    <WelcomeModal
      :isOpen="showWelcomeModal"
      @close="closeWelcomeModal"
      @openGuide="openUserGuide"
    />

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="ticket" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">Total de Tickets</h3>
            <p id="totalTicketsCount" class="text-xl font-bold text-gray-900 dark:text-gray-100">
              {{ totalTickets.total }}
            </p>
          </div>
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-3 text-xs text-gray-600 dark:text-gray-400"
          >
            <span>Recebidos: {{ totalTickets.recebidos }}</span>
            <span>Criados: {{ totalTickets.criados }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="clock" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">Pendentes</h3>
            <p
              id="pendingTicketsCount"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ ticketsPendentes.total }}
            </p>
          </div>
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-3 text-xs text-gray-600 dark:text-gray-400"
          >
            <span>Recebidos: {{ ticketsPendentes.recebidos }}</span>
            <span>Criados: {{ ticketsPendentes.criados }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="spinner" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">Em Andamento</h3>
            <p
              id="inProgressTicketsCount"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ ticketsEmAndamento.total }}
            </p>
          </div>
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-3 text-xs text-gray-600 dark:text-gray-400"
          >
            <span>Recebidos: {{ ticketsEmAndamento.recebidos }}</span>
            <span>Criados: {{ ticketsEmAndamento.criados }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="check-circle" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">Finalizados</h3>
            <p
              id="resolvedTicketsCount"
              class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ ticketsFinalizados.total }}
            </p>
          </div>
          <div
            class="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-3 text-xs text-gray-600 dark:text-gray-400"
          >
            <span>Recebidos: {{ ticketsFinalizados.recebidos }}</span>
            <span>Criados: {{ ticketsFinalizados.criados }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas Adicionais -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="chart-pie" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Taxa de Resolução
            </h3>
            <p
              id="resolucaoPercentual"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ resolutionRate }}%
            </p>
          </div>
          <div
            class="flex justify-end text-xs text-green-600 dark:text-green-400"
            v-if="userStats && userStats.averageAcceptanceTimeSeconds"
          >
            <font-awesome-icon icon="clock" class="mr-1" />
            {{ userStats.resolvedTickets }} tickets resolvidos
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-teal-600 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="hourglass-half" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Tempo Médio de Aceite
            </h3>
            <p
              id="tempoMedioAceite"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ userStats ? formatTimeInSeconds(userStats.averageAcceptanceTimeSeconds) : 'N/A' }}
            </p>
          </div>
          <div
            class="flex justify-end text-xs text-green-600 dark:text-green-400"
            v-if="userStats && userStats.averageAcceptanceTimeSeconds"
          >
            <font-awesome-icon icon="clock" class="mr-1" />
            {{ userStats.totalTickets }} tickets analisados
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-200"
      >
        <div
          class="p-2.5 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
        >
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Tempo Médio de Conclusão
            </h3>
            <p
              id="tempoMedioConclusao"
              class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ userStats ? formatTimeInSeconds(userStats.averageResolutionTimeSeconds) : 'N/A' }}
            </p>
          </div>
          <div
            class="flex justify-end text-xs text-green-600 dark:text-green-400"
            v-if="userStats && userStats.closedTickets"
          >
            <font-awesome-icon icon="check-circle" class="mr-1" />
            {{ userStats.closedTickets }} tickets concluídos
          </div>
        </div>
      </div>
    </div>

    <!-- Últimos Tickets Recebidos e Criados -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <CompactTicketTable
        title="Últimos Tickets Recebidos"
        type="received"
        :viewAllUrl="'/meus-tickets?tab=recebidos'"
      />
      <CompactTicketTable
        title="Últimos Tickets Criados"
        type="created"
        :viewAllUrl="'/meus-tickets?tab=criados'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { reportService, type UserStatistics } from '@/services/reportService';
import { TicketStatus } from '@/models';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { toast } from 'vue3-toastify';
import CompactTicketTable from '@/components/tickets/CompactTicketTable.vue';
import { formatTimeInSeconds } from '@/utils/generic-helper';
import WelcomeModal from '@/components/common/WelcomeModal.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const router = useRouter();
const isLoading = ref(true);
const userStats = ref<UserStatistics | null>(null);
const latestReceivedTickets = computed(() => ticketsStore.recentReceivedTickets);
const latestCreatedTickets = computed(() => ticketsStore.recentCreatedTickets);

const totalTickets = computed(() => ({
  total: latestReceivedTickets.value.length + latestCreatedTickets.value.length,
  recebidos: latestReceivedTickets.value.length,
  criados: latestCreatedTickets.value.length,
}));

const ticketsPendentes = computed(() => ({
  total:
    latestReceivedTickets.value.filter((t) => t.status === TicketStatus.Pending).length +
    latestCreatedTickets.value.filter((t) => t.status === TicketStatus.Pending).length,
  recebidos: latestReceivedTickets.value.filter((t) => t.status === TicketStatus.Pending).length,
  criados: latestCreatedTickets.value.filter((t) => t.status === TicketStatus.Pending).length,
}));

const ticketsEmAndamento = computed(() => ({
  total:
    latestReceivedTickets.value.filter((t) => t.status === TicketStatus.InProgress).length +
    latestCreatedTickets.value.filter((t) => t.status === TicketStatus.InProgress).length,
  recebidos: latestReceivedTickets.value.filter((t) => t.status === TicketStatus.InProgress).length,
  criados: latestCreatedTickets.value.filter((t) => t.status === TicketStatus.InProgress).length,
}));

const ticketsFinalizados = computed(() => ({
  total:
    latestReceivedTickets.value.filter((t) => t.status === TicketStatus.Completed).length +
    latestCreatedTickets.value.filter((t) => t.status === TicketStatus.Completed).length,
  recebidos: latestReceivedTickets.value.filter((t) => t.status === TicketStatus.Completed).length,
  criados: latestCreatedTickets.value.filter((t) => t.status === TicketStatus.Completed).length,
}));

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
