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
      <CompactTicketTable
        title="Últimos Tickets Recebidos"
        :tickets="latestReceivedTickets"
        :isLoading="isLoading"
      />
      <CompactTicketTable
        title="Últimos Tickets Criados"
        :tickets="latestCreatedTickets"
        :isLoading="isLoading"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { TicketStatus, type Ticket } from '@/models';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';
import CompactTicketTable from '@/components/tickets/CompactTicketTable.vue';

const latestReceivedTickets = ref<Ticket[]>([]);
const latestCreatedTickets = ref<Ticket[]>([]);

const totalTickets = ref(0);
const pendingTickets = ref(0);
const inProgressTickets = ref(0);
const resolvedTickets = ref(0);
const resolutionRate = ref(0);

const isLoading = ref(true);
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
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadTickets);
</script>

<style scoped>
.dashboard-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-card {
  flex: 1;
  min-width: 300px;
}

.loading-wrapper {
  width: 100%;
}
</style>
