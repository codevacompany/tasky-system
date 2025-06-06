<template>
  <section id="dashboardSection" class="section-content active">
    <h1>Dashboard</h1>

    <WelcomeModal
      :isOpen="showWelcomeModal"
      @close="closeWelcomeModal"
      @openGuide="openUserGuide"
    />

    <!-- Estatísticas -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="ticket" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Total de Tickets</h3>
            <p id="totalTicketsCount">{{ totalTickets.total }}</p>
          </div>
          <div class="stat-details">
            <span>Recebidos: {{ totalTickets.recebidos }}</span>
            <span>Criados: {{ totalTickets.criados }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <font-awesome-icon icon="clock" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Pendentes</h3>
            <p id="pendingTicketsCount">{{ ticketsPendentes.total }}</p>
          </div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsPendentes.recebidos }}</span>
            <span>Criados: {{ ticketsPendentes.criados }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <font-awesome-icon icon="spinner" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Em Andamento</h3>
            <p id="inProgressTicketsCount">{{ ticketsEmAndamento.total }}</p>
          </div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsEmAndamento.recebidos }}</span>
            <span>Criados: {{ ticketsEmAndamento.criados }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <font-awesome-icon icon="check-circle" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Finalizados</h3>
            <p id="resolvedTicketsCount">{{ ticketsFinalizados.total }}</p>
          </div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsFinalizados.recebidos }}</span>
            <span>Criados: {{ ticketsFinalizados.criados }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas Adicionais -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon purple">
          <font-awesome-icon icon="chart-pie" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Taxa de Resolução</h3>
            <p id="resolucaoPercentual">{{ resolutionRate }}%</p>
          </div>
          <div class="stat-details">
            <!-- <span class="text-green-500">
              <font-awesome-icon icon="arrow-up" /> 5% vs mês anterior
            </span> -->
            <span class="text-green-500" v-if="userStats && userStats.averageAcceptanceTimeSeconds">
              <font-awesome-icon icon="clock" /> {{ userStats.resolvedTickets }} tickets resolvidos
            </span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="hourglass-half" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Tempo Médio de Aceite</h3>
            <p id="tempoMedioAceite">
              {{ userStats ? formatTimeInSeconds(userStats.averageAcceptanceTimeSeconds) : 'N/A' }}
            </p>
          </div>
          <div class="stat-details">
            <span class="text-green-500" v-if="userStats && userStats.averageAcceptanceTimeSeconds">
              <!-- <font-awesome-icon icon="arrow-down" /> 2h vs mês anterior -->
              <font-awesome-icon icon="clock" /> {{ userStats.totalTickets }} tickets analisados
            </span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon indigo">
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Tempo Médio de Conclusão</h3>
            <p id="tempoMedioConclusao">
              {{ userStats ? formatTimeInSeconds(userStats.averageResolutionTimeSeconds) : 'N/A' }}
            </p>
          </div>
          <div class="stat-details">
            <span class="text-green-500" v-if="userStats && userStats.closedTickets">
              <!-- <font-awesome-icon icon="arrow-up" /> 1d vs mês anterior -->
              <font-awesome-icon icon="check-circle" /> {{ userStats.closedTickets }} tickets
              concluídos
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Últimos Tickets Recebidos e Criados -->
    <div class="dashboard-row">
      <CompactTicketTable title="Últimos Tickets Recebidos" type="received" />
      <CompactTicketTable title="Últimos Tickets Criados" type="created" />
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

<style scoped>
.dashboard-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.dashboard-card {
  flex: 1;
  min-width: 220px;
}

.loading-wrapper {
  width: 100%;
}

.stat-card {
  text-align: left;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  align-items: center;
}

.stat-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

/* Dark mode */
:deep(body.dark-mode) .stat-card {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
}

:deep(body.dark-mode) .stat-card:hover {
  border-color: #475569;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  background-color: #4f46e5;
}

.stat-icon.orange {
  background-color: #f97316;
}

.stat-icon.blue {
  background-color: #3b82f6;
}

.stat-icon.green {
  background-color: #22c55e;
}

.stat-icon.purple {
  background-color: #9333ea;
}

.stat-icon.teal {
  background-color: #0d9488;
}

.stat-icon.indigo {
  background-color: #6366f1;
}

.stat-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 8px;
}

.stat-info h3 {
  margin: 0;
  font-size: 0.925rem;
  font-weight: 500;
  color: var(--text-color);
}

.stat-info p {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  color: #1a2233;
}

.stat-details {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 4px;
  justify-content: flex-end;
}

.stat-details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Dark mode */
:deep(body.dark-mode) .stat-details {
  color: var(--text-light-dark);
}

:deep(body.dark-mode) .stat-info h3 {
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .stat-info p {
  color: #e2e8f0;
}

:deep(body.dark-mode) .dashboard-row {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
}

/* Tabelas no modo escuro */
:deep(body.dark-mode) table {
  background-color: var(--card-bg-dark);
  color: var(--text-color-dark);
}

:deep(body.dark-mode) th {
  background-color: var(--header-bg-dark);
  color: var(--text-color-dark);
  border-color: var(--border-color-dark);
}

:deep(body.dark-mode) td {
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

:deep(body.dark-mode) tr:hover {
  background-color: var(--hover-bg);
}
</style>
