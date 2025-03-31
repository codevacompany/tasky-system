<template>
  <section id="dashboardSection" class="section-content active">
    <h1>Dashboard</h1>

    <!-- Estatísticas -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-ticket-alt"></i>
        </div>
        <div class="stat-info">
          <h3>Total de Tickets</h3>
          <p id="totalTicketsCount">{{ totalTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h3>Pendentes</h3>
          <p id="pendingTicketsCount">{{ pendingTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fas fa-spinner"></i>
        </div>
        <div class="stat-info">
          <h3>Em Andamento</h3>
          <p id="inProgressTicketsCount">{{ inProgressTickets }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fas fa-check-circle"></i>
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
          <i class="fas fa-chart-pie"></i>
        </div>
        <div class="stat-info">
          <h3>Taxa de Resolução</h3>
          <p id="resolucaoPercentual">{{ resolutionRate }}%</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teal">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="stat-info">
          <h3>Tempo Médio de Aceite</h3>
          <p id="tempoMedioAceite">N/A</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon indigo">
          <i class="fas fa-calendar-check"></i>
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
                <td>{{ ticket.status }}</td>
              </tr>
              <tr v-if="latestReceivedTickets.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fas fa-inbox"></i> Nenhum ticket recebido recentemente
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
                <td>{{ ticket.status }}</td>
              </tr>
              <tr v-if="latestCreatedTickets.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fas fa-plus-circle"></i> Nenhum ticket criado recentemente
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
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
  }
};

onMounted(loadTickets);
</script>

<style scoped></style>
