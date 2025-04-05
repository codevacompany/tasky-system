<template>
  <section id="dashboardSection" class="section-content active">
    <h1>Dashboard</h1>

    <!-- Estatísticas -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="ticket" />
        </div>
        <div class="stat-info">
          <h3>Total de Tickets</h3>
          <p id="totalTicketsCount">{{ totalTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <font-awesome-icon icon="clock" />
        </div>
        <div class="stat-info">
          <h3>Pendentes</h3>
          <p id="pendingTicketsCount">{{ pendingTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <font-awesome-icon icon="spinner" />
        </div>
        <div class="stat-info">
          <h3>Em Andamento</h3>
          <p id="inProgressTicketsCount">{{ inProgressTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <font-awesome-icon icon="check-circle" />
        </div>
        <div class="stat-info">
          <h3>Finalizados</h3>
          <p id="resolvedTicketsCount">{{ resolvedTickets }}</p>
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
          <h3>Taxa de Resolução</h3>
          <p id="resolucaoPercentual">{{ resolutionRate }}%</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="hourglass-half" />
        </div>
        <div class="stat-info">
          <h3>Tempo Médio de Aceite</h3>
          <p id="tempoMedioAceite">N/A</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon indigo">
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="stat-info">
          <h3>Tempo Médio de Conclusão</h3>
          <p id="tempoMedioConclusao">N/A</p>
        </div>
      </div>
    </div>

    <!-- Últimos Tickets Recebidos e Criados -->
    <div class="dashboard-row">
      <div class="dashboard-card">
        <div class="card-header">
          <h2>Últimos Tickets Recebidos</h2>
          <a href="#tickets" class="card-action">Ver todos</a>
        </div>
        <div class="card-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>Assunto</th>
                <th>Solicitante</th>
                <th>Setor</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in latestReceivedTickets" :key="ticket.id">
                <td>{{ ticket.name }}</td>
                <td>{{ ticket.requester.firstName }}</td>
                <td>{{ ticket.department.name }}</td>
                <td>{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
                <td>
                  <span :class="['status-label', statusColor(ticket.status)]">{{
                    ticket.status
                  }}</span>
                </td>
              </tr>
              <tr v-if="latestReceivedTickets.length === 0">
                <td colspan="5" class="empty-state">
                  <font-awesome-icon icon="inbox" /> Nenhum ticket recebido recentemente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h2>Últimos Tickets Criados</h2>
          <a href="#tickets" class="card-action">Ver todos</a>
        </div>
        <div class="card-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>Assunto</th>
                <th>Solicitante</th>
                <th>Setor</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in latestCreatedTickets" :key="ticket.id">
                <td>{{ ticket.name }}</td>
                <td>{{ ticket.requester.firstName }}</td>
                <td>{{ ticket.department.name }}</td>
                <td>{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
                <td>
                  <span :class="['status-label', statusColor(ticket.status)]">{{
                    ticket.status
                  }}</span>
                </td>
              </tr>
              <tr v-if="latestCreatedTickets.length === 0">
                <td colspan="5" class="empty-state">
                  <font-awesome-icon icon="plus-cicle" /> Nenhum ticket criado recentemente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { TicketStatus, type Ticket } from '@/models';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';

const latestReceivedTickets = ref<Ticket[]>([]);
const latestCreatedTickets = ref<Ticket[]>([]);

const totalTickets = ref(0);
const pendingTickets = ref(0);
const inProgressTickets = ref(0);
const resolvedTickets = ref(0);
const resolutionRate = ref(0);

const user = useUserStore().user;

const loadTickets = async () => {
  try {
    const [receivedResponse, createdResponse] = await Promise.all([
      ticketService.getByTargetUser(user!.id),
      ticketService.getByRequester(user!.id),
    ]);

    // Set latest tickets
    latestReceivedTickets.value = receivedResponse.data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    latestCreatedTickets.value = createdResponse.data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Calculate total tickets (by target user + by requester)
    const allUserTickets = [...receivedResponse.data, ...createdResponse.data];

    totalTickets.value = allUserTickets.length;
    pendingTickets.value = allUserTickets.filter(
      (ticket) => ticket.status === TicketStatus.Pending,
    ).length;
    inProgressTickets.value = allUserTickets.filter(
      (ticket) => ticket.status === TicketStatus.InProgress,
    ).length;
    resolvedTickets.value = allUserTickets.filter(
      (ticket) => ticket.status === TicketStatus.Completed,
    ).length;

    // Calculate resolution rate
    const resolvedCount = resolvedTickets.value;
    resolutionRate.value =
      totalTickets.value > 0 ? Math.round((resolvedCount / totalTickets.value) * 100) : 0;
  } catch {
    toast.error('Erro aos buscar tickets. Tente novamente.');
  }
};

const statusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'status-pending';
    case TicketStatus.InProgress:
      return 'status-in-progress';
    case TicketStatus.AwaitingVerification:
      return 'status-awaiting-verification';
    case TicketStatus.Overdue:
      return 'status-overdue';
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

onMounted(loadTickets);
</script>

<style scoped>
.status-label {
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  color: #fff;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  font-size: small;
}

.status-pending {
  background-color: #ffecb3;
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.status-in-progress {
  background-color: #e8f4fd;
  color: #288fe4;
  border: 1px solid rgba(40, 143, 228, 0.3);
}

.status-awaiting-verification {
  background-color: #e1bee7;
  color: #9c27b0;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.status-overdue {
  background-color: #ffcdd2;
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-completed {
  background-color: #c8e6c9;
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-returned {
  background-color: #ffccbc;
  color: #ff5722;
  border: 1px solid rgba(255, 87, 34, 0.3);
}

.status-rejected {
  background-color: #f8bbd0;
  color: #e91e63;
  border: 1px solid rgba(233, 30, 99, 0.3);
}
</style>
