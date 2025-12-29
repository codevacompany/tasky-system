<template>
  <div class="relative">
    <!-- Blur overlay for background content only -->
    <div
      v-if="showWelcomeModal"
      class="fixed inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-[999] pointer-events-none"
    ></div>

    <section
      id="dashboardSection"
      class="p-5 sm:px-6 sm:pt-4 sm:pb-10 transition-all duration-300"
      :class="{ 'pointer-events-none': showWelcomeModal }"
    >
      <WelcomeModal
        :isOpen="showWelcomeModal"
        @close="closeWelcomeModal"
        @openGuide="openUserGuide"
      />

      <!-- Estatísticas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg px-6 pt-4 pb-6 mb-5 shadow-soft-xs">
        <div class="mb-4 flex justify-between items-start">
          <div>
            <h1 class="text-lg font-bold text-txt-primary dark:text-white mb-1">Estatísticas</h1>
            <p class="text-xs text-txt-muted dark:text-gray-400">
              Visão geral do seu desempenho e métricas
            </p>
          </div>
          <button
            @click="showPerformanceModal = true"
            class="text-sm text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Ver detalhes
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <!-- Pendentes -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
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
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="clock"
                class="text-orange-500 dark:text-orange-400 text-2xl"
              />
            </div>
            <p
              id="pendingTicketsCount"
              class="text-2xl font-bold text-txt-primary dark:text-white mb-1"
            >
              {{ ticketsPendentes.total }}
            </p>
            <h3 class="text-xs font-medium text-txt-muted dark:text-gray-400">Pendentes</h3>
          </div>

          <!-- Em Andamento -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
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
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon icon="spinner" class="text-blue-500 dark:text-blue-400 text-2xl" />
            </div>
            <p
              id="inProgressTicketsCount"
              class="text-2xl font-bold text-txt-primary dark:text-white mb-1"
            >
              {{ ticketsEmAndamento.total }}
            </p>
            <h3 class="text-xs font-medium text-txt-muted dark:text-gray-400">Em Andamento</h3>
          </div>

          <!-- Finalizados -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
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
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="check-circle"
                class="text-green-500 dark:text-green-400 text-2xl"
              />
            </div>
            <p
              id="resolvedTicketsCount"
              class="text-2xl font-bold text-txt-primary dark:text-white mb-1"
            >
              {{ ticketsFinalizados.total }}
            </p>
            <h3 class="text-xs font-medium text-txt-muted dark:text-gray-400">Resolvidos</h3>
          </div>

          <!-- Tempo Médio de Aceite -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
            </div>
            <div
              class="h-7 w-14 bg-gray-300 dark:bg-gray-600 rounded mb-1 animate-pulse-custom"
            ></div>
            <div class="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          </div>
          <div
            v-else
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="hourglass-half"
                class="text-teal-600 dark:text-teal-400 text-2xl"
              />
            </div>
            <p id="tempoMedioAceite" class="text-2xl font-bold text-txt-primary dark:text-white mb-1">
              {{ userStats ? formatTimeShort(userStats.averageAcceptanceTimeSeconds) : 'N/A' }}
            </p>
            <h3 class="text-xs font-medium text-txt-muted dark:text-gray-400">
              Tempo Médio de Aceite
            </h3>
          </div>

          <!-- Tempo Médio de Resolução -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
            </div>
            <div
              class="h-7 w-14 bg-gray-300 dark:bg-gray-600 rounded mb-1 animate-pulse-custom"
            ></div>
            <div class="h-3 w-36 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          </div>
          <div
            v-else
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="calendar-check"
                class="text-indigo-500 dark:text-indigo-400 text-2xl"
              />
            </div>
            <p
              id="tempoMedioConclusao"
              class="text-2xl font-bold text-txt-primary dark:text-white mb-1"
            >
              {{ userStats ? formatTimeShort(userStats.averageResolutionTimeSeconds) : 'N/A' }}
            </p>
            <h3 class="text-xs font-medium text-txt-muted dark:text-gray-400">
              Tempo Médio de Resolução
            </h3>
          </div>

          <!-- Score de Desempenho -->
          <div
            v-if="isLoading"
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
            </div>
            <div
              class="h-7 w-14 bg-gray-300 dark:bg-gray-600 rounded mb-1 animate-pulse-custom"
            ></div>
            <div class="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          </div>
          <div
            v-else
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-surface-extraSoft dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="star"
                class="text-yellow-500 dark:text-yellow-400 text-2xl"
              />
            </div>
            <template v-if="userStats?.efficiencyScore !== undefined">
              <p id="efficiencyScore" class="text-2xl font-bold text-txt-primary dark:text-white mb-1">
                {{ (userStats.efficiencyScore * 100).toFixed(0) }}%
              </p>
              <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Score de Desempenho
              </h3>
            </template>
            <template v-else>
              <p class="text-base font-medium text-txt-secondary dark:text-gray-300 mb-1 text-center">
                Score indisponível
              </p>
              <p class="text-xs text-txt-muted dark:text-gray-400 text-center">
                Mínimo de 10 tarefas necessário
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Performance Explanation Modal -->
      <PerformanceExplanationModal
        v-if="showPerformanceModal"
        :isOpen="showPerformanceModal"
        :userStats="userStats"
        @close="showPerformanceModal = false"
      />

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
  </div>
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
import PerformanceExplanationModal from '@/components/user/PerformanceExplanationModal.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const router = useRouter();
const isLoading = ref(true);
const userStats = ref<UserStatistics | null>(null);
const showPerformanceModal = ref(false);
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
  // Use backend stats if available - prefer totalCompleted from detailedMetrics as it matches modal
  if (userStats.value?.detailedMetrics?.totalCompleted !== undefined) {
    return {
      total: userStats.value.detailedMetrics.totalCompleted,
    };
  }
  // Fallback to resolvedTickets if detailedMetrics not available
  if (userStats.value?.resolvedTickets !== undefined) {
    return {
      total: userStats.value.resolvedTickets,
    };
  }
  // Last fallback: local calculation from recent tickets
  const receivedCompleted = latestReceivedTickets.value.filter(
    (t) => getTicketStatus(t) === DefaultTicketStatus.Completed,
  ).length;
  return {
    total: receivedCompleted,
  };
});

const showWelcomeModal = computed(() => {
  const user = userStore.user;
  return user ? !user.termsAccepted || !user.privacyPolicyAccepted : false;
});

const closeWelcomeModal = () => {
  // Modal closes automatically when terms are accepted
  // This function is called by WelcomeModal after terms acceptance
  // No action needed as the computed will update automatically
};

const openUserGuide = () => {
  router.push('/faq');
};

onMounted(async () => {
  // Don't fetch data if terms haven't been accepted
  const user = userStore.user;
  if (user && (!user.termsAccepted || !user.privacyPolicyAccepted)) {
    isLoading.value = false;
    return;
  }

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
