<template>
  <div class="section-content">
    <h1>Meu Dashboard</h1>

    <!-- Primeira linha de estatísticas -->
    <div class="dashboard-stats">
      <!-- Total de Tickets Recebidos -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="ticket" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Total de Tickets Recebidos</span>
          <span class="stat-value">5</span>
        </div>
      </div>

      <!-- Pendentes -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="clock" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Pendentes</span>
          <span class="stat-value">1</span>
        </div>
      </div>

      <!-- Em Andamento -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="spinner" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Em Andamento</span>
          <span class="stat-value">4</span>
        </div>
      </div>

      <!-- Finalizados -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="check-circle" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Finalizados</span>
          <span class="stat-value">0</span>
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
          <span class="stat-value">0%</span>
        </div>
      </div>

      <!-- Tempo Médio de Aceite -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="hourglass-half" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Tempo Médio de Aceite</span>
          <span class="stat-value">13.9h</span>
        </div>
      </div>

      <!-- Tempo Médio de Conclusão -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="stat-info">
          <span class="stat-label">Tempo Médio de Conclusão</span>
          <span class="stat-value">N/A</span>
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
import { ref, onMounted } from 'vue';
import TicketTable from '@/components/tickets/TicketTable.vue';
import { ticketService } from '@/services/ticketService';
import type { Ticket } from '@/models';
import { toast } from 'vue3-toastify';

const ticketsRecebidos = ref<Ticket[]>([]);
const ticketsCriados = ref<Ticket[]>([]);
const isLoading = ref(true);

const fetchDashboardData = async () => {
  try {
    const response = await ticketService.fetch();
    // Aqui você pode separar os tickets entre recebidos e criados
    // baseado em alguma propriedade do ticket
    ticketsRecebidos.value = response.data;
    ticketsCriados.value = response.data;
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
</style> 