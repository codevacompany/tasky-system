<template>
  <div class="section-content">
    <h1>Meu Dashboard</h1>

    <!-- Primeira linha de estatísticas -->
    <div class="dashboard-stats">
      <!-- Total de Tickets -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="ticket" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Total de Tickets</span>
          <div class="stat-value">{{ totalTickets.total }}</div>
          <div class="stat-details">
            <span>Recebidos: {{ totalTickets.recebidos }}</span>
            <span>Criados: {{ totalTickets.criados }}</span>
          </div>
        </div>
      </div>

      <!-- Pendentes -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="clock" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Pendentes</span>
          <div class="stat-value">{{ ticketsPendentes.total }}</div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsPendentes.recebidos }}</span>
            <span>Criados: {{ ticketsPendentes.criados }}</span>
          </div>
        </div>
      </div>

      <!-- Em Andamento -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="spinner" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Em Andamento</span>
          <div class="stat-value">{{ ticketsEmAndamento.total }}</div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsEmAndamento.recebidos }}</span>
            <span>Criados: {{ ticketsEmAndamento.criados }}</span>
          </div>
        </div>
      </div>

      <!-- Finalizados -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="check-circle" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Finalizados</span>
          <div class="stat-value">{{ ticketsFinalizados.total }}</div>
          <div class="stat-details">
            <span>Recebidos: {{ ticketsFinalizados.recebidos }}</span>
            <span>Criados: {{ ticketsFinalizados.criados }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Segunda linha de estatísticas -->
    <div class="dashboard-stats">
      <!-- Taxa de Resolução -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="chart-pie" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Taxa de Resolução</span>
          <span class="stat-value">{{ taxaResolucao }}</span>
        </div>
      </div>

      <!-- Tempo Médio de Aceite -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="hourglass-half" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Tempo Médio de Aceite</span>
          <span class="stat-value">{{ calcularTempoMedioAceite(ticketsRecebidos) }}</span>
        </div>
      </div>

      <!-- Tempo Médio de Conclusão -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Tempo Médio de Conclusão</span>
          <span class="stat-value">{{ calcularTempoMedioConclusao(ticketsRecebidos) }}</span>
        </div>
      </div>
    </div>

    <!-- Tabelas de Tickets -->
    <div class="dashboard-tables">
      <div class="tickets-grid">
        <div class="tickets-section">
          <div class="tickets-header">
            <h2>Últimos Tickets Recebidos</h2>
            <a href="#" class="ver-todos">Ver todos</a>
          </div>
          <TicketTable :tickets="ticketsRecebidos" :isLoading="isLoading" />
        </div>

        <div class="tickets-section">
          <div class="tickets-header">
            <h2>Últimos Tickets Criados</h2>
            <a href="#" class="ver-todos">Ver todos</a>
          </div>
          <TicketTable :tickets="ticketsCriados" :isLoading="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TicketTable from '@/components/tickets/TicketTable.vue';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import type { Ticket } from '@/models';
import { toast } from 'vue3-toastify';
import { TicketStatus } from '@/models';

const userStore = useUserStore();
const ticketsRecebidos = ref<Ticket[]>([]);
const ticketsCriados = ref<Ticket[]>([]);
const isLoading = ref(true);

// Computed properties para estatísticas
const totalTickets = computed(() => ({
  total: ticketsRecebidos.value.length + ticketsCriados.value.length,
  recebidos: ticketsRecebidos.value.length,
  criados: ticketsCriados.value.length
}));

const ticketsPendentes = computed(() => ({
  total: ticketsRecebidos.value.filter(t => t.status === TicketStatus.Pending).length +
         ticketsCriados.value.filter(t => t.status === TicketStatus.Pending).length,
  recebidos: ticketsRecebidos.value.filter(t => t.status === TicketStatus.Pending).length,
  criados: ticketsCriados.value.filter(t => t.status === TicketStatus.Pending).length
}));

const ticketsEmAndamento = computed(() => ({
  total: ticketsRecebidos.value.filter(t => t.status === TicketStatus.InProgress).length +
         ticketsCriados.value.filter(t => t.status === TicketStatus.InProgress).length,
  recebidos: ticketsRecebidos.value.filter(t => t.status === TicketStatus.InProgress).length,
  criados: ticketsCriados.value.filter(t => t.status === TicketStatus.InProgress).length
}));

const ticketsFinalizados = computed(() => ({
  total: ticketsRecebidos.value.filter(t => t.status === TicketStatus.Completed).length +
         ticketsCriados.value.filter(t => t.status === TicketStatus.Completed).length,
  recebidos: ticketsRecebidos.value.filter(t => t.status === TicketStatus.Completed).length,
  criados: ticketsCriados.value.filter(t => t.status === TicketStatus.Completed).length
}));

const taxaResolucao = computed(() => {
  if (totalTickets.value.recebidos === 0) return '0%';
  return `${Math.round((totalTickets.value.recebidos / totalTickets.value.total) * 100)}%`;
});

const calcularTempoMedioAceite = (tickets: Ticket[]) => {
  const ticketsComAceite = tickets.filter(t => t.acceptedAt && t.createdAt);
  if (ticketsComAceite.length === 0) return 'N/A';

  const tempoTotal = ticketsComAceite.reduce((acc, ticket) => {
    const aceite = new Date(ticket.acceptedAt!);
    const criacao = new Date(ticket.createdAt);
    return acc + (aceite.getTime() - criacao.getTime());
  }, 0);

  const mediaHoras = (tempoTotal / ticketsComAceite.length) / (1000 * 60 * 60);
  return `${mediaHoras.toFixed(1)}h`;
};

const calcularTempoMedioConclusao = (tickets: Ticket[]) => {
  const ticketsConcluidos = tickets.filter(t => t.completedAt && t.createdAt);
  if (ticketsConcluidos.length === 0) return 'N/A';

  const tempoTotal = ticketsConcluidos.reduce((acc, ticket) => {
    const conclusao = new Date(ticket.completedAt!);
    const criacao = new Date(ticket.createdAt);
    return acc + (conclusao.getTime() - criacao.getTime());
  }, 0);

  const mediaDias = (tempoTotal / ticketsConcluidos.length) / (1000 * 60 * 60 * 24);
  return `${mediaDias.toFixed(1)}d`;
};

const fetchDashboardData = async () => {
  try {
    const [recebidosResponse, criadosResponse] = await Promise.all([
      ticketService.getByTargetUser(userStore.user!.id),
      ticketService.getByRequester(userStore.user!.id)
    ]);

    ticketsRecebidos.value = recebidosResponse.data.items;
    ticketsCriados.value = criadosResponse.data.items;
    isLoading.value = false;
  } catch {
    toast.error('Erro ao carregar dados do dashboard');
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>

<style scoped>
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

/* Cores dos ícones */
.stat-icon.teal {
  background-color: #0d9488;
}

.stat-icon.teal svg {
  color: white !important;
}

/* Primeira linha */
.stat-card:nth-child(1) .stat-icon {
  background-color: #4f46e5; /* Indigo */
}

.stat-card:nth-child(2) .stat-icon {
  background-color: #f97316; /* Laranja */
}

.stat-card:nth-child(3) .stat-icon {
  background-color: #3b82f6; /* Azul */
}

.stat-card:nth-child(4) .stat-icon {
  background-color: #22c55e; /* Verde */
}

/* Segunda linha */
.dashboard-stats:nth-child(3) .stat-card:nth-child(1) .stat-icon {
  background-color: #8b5cf6; /* Roxo */
}

.dashboard-stats:nth-child(3) .stat-card:nth-child(2) .stat-icon {
  background-color: #0d9488; /* Verde-água */
}

.dashboard-stats:nth-child(3) .stat-card:nth-child(3) .stat-icon {
  background-color: #6366f1; /* Indigo */
}

/* Forçar cor branca em todos os ícones */
.stat-icon svg {
  color: white !important;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a2233;
}

.stat-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.stat-details span {
  display: flex;
  align-items: center;
}

.dashboard-tables {
  margin-top: 24px;
  width: 100%;
}

.tickets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.tickets-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tickets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.tickets-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1a2233;
  margin: 0;
}

.ver-todos {
  font-size: 14px;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.ver-todos:hover {
  text-decoration: underline;
}

/* Dark mode */
:deep(body.dark-mode) .tickets-section {
  background: #141b2a;
}

:deep(body.dark-mode) .tickets-header {
  border-bottom-color: #2d3748;
}

:deep(body.dark-mode) .tickets-header h2 {
  color: #fff;
}

:deep(body.dark-mode) .ver-todos {
  color: #818cf8;
}

:deep(body.dark-mode) .stat-details {
  color: #94a3b8;
}
</style>
