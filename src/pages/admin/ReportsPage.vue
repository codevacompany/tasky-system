<template>
  <div class="reports-container">
    <div class="header">
      <h1 class="title">Relatórios do Sistema</h1>
      <p class="subtitle">Visualize estatísticas e métricas importantes dos chamados</p>
    </div>

    <div class="cards-grid">
      <!-- Estatísticas Gerais -->
      <div class="card">
        <div class="card-header">
          <font-awesome-icon icon="chart-line" class="icon blue" />
          <h2 class="card-title">Estatísticas Gerais</h2>
        </div>
        <div class="card-content">
          <div class="stat-item">
            <span>Total de Chamados</span>
            <span class="value">{{ statistics.totalTickets || 0 }}</span>
          </div>
          <div class="stat-item">
            <span>Chamados Abertos</span>
            <span class="value warning">{{ statistics.openTickets || 0 }}</span>
          </div>
          <div class="stat-item">
            <span>Chamados Fechados</span>
            <span class="value success">{{ statistics.closedTickets || 0 }}</span>
          </div>
          <div class="stat-item">
            <span>Tempo Médio de Resolução</span>
            <span class="value">{{ statistics.averageResolutionTime || '0 dias' }}</span>
          </div>
        </div>
      </div>

      <!-- Chamados por Status -->
      <div class="card">
        <div class="card-header">
          <font-awesome-icon icon="chart-pie" class="icon purple" />
          <h2 class="card-title">Chamados por Status</h2>
        </div>
        <div class="chart-wrapper">
          <Pie
            v-if="ticketsByStatus.labels.length"
            :data="{
              labels: ticketsByStatus.labels,
              datasets: [
                {
                  data: ticketsByStatus.data,
                  backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                  borderWidth: 1,
                },
              ],
            }"
            :options="chartOptions"
          />
          <div v-else class="loading">
            <font-awesome-icon icon="spinner" spin class="spinner" />
            <p>Carregando dados...</p>
          </div>
        </div>
      </div>

      <!-- Chamados por Prioridade -->
      <div class="card">
        <div class="card-header">
          <font-awesome-icon icon="chart-bar" class="icon indigo" />
          <h2 class="card-title">Chamados por Prioridade</h2>
        </div>
        <div class="chart-wrapper">
          <Bar
            v-if="ticketsByPriority.labels.length"
            :data="{
              labels: ticketsByPriority.labels,
              datasets: [
                {
                  label: 'Quantidade',
                  data: ticketsByPriority.data,
                  backgroundColor: '#6366F1',
                  borderRadius: 4,
                },
              ],
            }"
            :options="chartOptions"
          />
          <div v-else class="loading">
            <font-awesome-icon icon="spinner" spin class="spinner" />
            <p>Carregando dados...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Últimos Chamados -->
    <div class="table-card">
      <div class="table-header">
        <font-awesome-icon icon="list" class="icon gray" />
        <h2 class="card-title">Últimos Chamados</h2>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in recentTickets" :key="ticket.id">
              <td>#{{ ticket.id }}</td>
              <td>{{ ticket.name }}</td>
              <td>
                <span :class="['badge', getStatusClass(ticket.status)]">
                  {{ ticket.status }}
                </span>
              </td>
              <td>
                <span :class="['badge', getPriorityClass(ticket.priority)]">
                  {{ ticket.priority }}
                </span>
              </td>
              <td>{{ formatDate(ticket.createdAt) }}</td>
            </tr>
            <tr v-if="!recentTickets.length">
              <td colspan="5" class="empty-row">
                <font-awesome-icon icon="inbox" class="spinner" />
                <p>Nenhum chamado encontrado</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar, Pie } from 'vue-chartjs';
import { formatDate } from '@/utils/date';

// Chart.js setup
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface TicketComment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

interface Category {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  name: string;
  priority: TicketPriority;
  description: string;
  department: Department;
  requester: User;
  targetUser: User;
  status: TicketStatus;
  completionDate?: string;
  acceptanceDate?: string;
  category?: Category;
  comments: TicketComment[];
  disapprovalReason?: string;
  createdAt: string;
}

interface ChartData {
  labels: string[];
  data: number[];
}

interface TicketStatistics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  averageResolutionTime: string;
}

type TicketStatus = 'Em andamento' | 'Finalizado' | 'Atrasado' | 'Outro';

type TicketPriority = 'Alta' | 'Média' | 'Baixa';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

const ticketsByStatus = ref<ChartData>({
  labels: [],
  data: [],
});

const ticketsByPriority = ref<ChartData>({
  labels: [],
  data: [],
});

const statistics = ref<TicketStatistics>({
  totalTickets: 0,
  openTickets: 0,
  closedTickets: 0,
  averageResolutionTime: '0 dias',
});

const recentTickets = ref<Ticket[]>([]);

// Mocked reportService
const reportService = {
  getTicketStatistics: async (): Promise<TicketStatistics> => ({
    totalTickets: 120,
    openTickets: 45,
    closedTickets: 75,
    averageResolutionTime: '3 dias',
  }),
  getTicketsByStatus: async (): Promise<ChartData> => ({
    labels: ['EM ANDAMENTO', 'CONCLUÍDO', 'ATRASADO'],
    data: [30, 75, 15],
  }),
  getTicketsByPriority: async (): Promise<ChartData> => ({
    labels: ['ALTA', 'MÉDIA', 'BAIXA'],
    data: [40, 50, 30],
  }),
  getRecentTickets: async (count: number): Promise<Ticket[]> => {
    const user: User = { id: 1, firstName: 'João', lastName: 'Silva' };
    const department: Department = { id: 1, name: 'TI' };

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `ticket-${i + 1}`,
      priority: ['ALTA', 'MÉDIA', 'BAIXA'][i % 3] as TicketPriority,
      description: 'Descrição do chamado',
      department,
      requester: user,
      targetUser: user,
      status: ['EM ANDAMENTO', 'CONCLUÍDO', 'ATRASADO'][i % 3] as TicketStatus,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      comments: [],
    }));
  },
};

const statusClassMap: Record<TicketStatus, string> = {
  'Em andamento': 'bg-yellow-100 text-yellow-800',
  Finalizado: 'bg-green-100 text-green-800',
  Atrasado: 'bg-red-100 text-red-800',
  Outro: 'bg-gray-100 text-gray-800',
};

const getStatusClass = (status: TicketStatus): string => {
  return statusClassMap[status];
};

const priorityClassMap: Record<TicketPriority, string> = {
  Alta: 'bg-red-100 text-red-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Baixa: 'bg-blue-100 text-blue-800',
};

const getPriorityClass = (priority: TicketPriority): string => {
  return priorityClassMap[priority];
};

onMounted(async () => {
  try {
    const [statsData, statusData, priorityData, ticketsData] = await Promise.all([
      reportService.getTicketStatistics(),
      reportService.getTicketsByStatus(),
      reportService.getTicketsByPriority(),
      reportService.getRecentTickets(10),
    ]);

    statistics.value = statsData;
    ticketsByStatus.value = statusData;
    ticketsByPriority.value = priorityData;
    recentTickets.value = ticketsData;
  } catch (error) {
    console.error('Erro ao carregar dados dos relatórios:', error);
  }
});
</script>

<style scoped>
.reports-container {
  padding: 1.5rem;
}

.heading-main {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937; /* gray-800 */
  margin-bottom: 0.5rem;
}

.subtext {
  color: #4b5563; /* gray-600 */
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #f3f4f6; /* gray-100 */
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb; /* gray-50 */
  border-radius: 0.5rem;
}

.text-gray {
  color: #4b5563;
}

.text-yellow {
  color: #d97706; /* yellow-500 */
}

.text-green {
  color: #10b981;
}

.chart-container {
  height: 16rem; /* h-64 */
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: #f9fafb;
}

.table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.table td {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #1f2937;
}

.table-row:hover {
  background-color: #f9fafb;
}

.status-tag,
.priority-tag {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  display: inline-block;
}

.status-em-andamento {
  background-color: #fef3c7;
  color: #92400e;
}

.status-finalizado {
  background-color: #d1fae5;
  color: #065f46;
}

.status-atrasado {
  background-color: #fecaca;
  color: #991b1b;
}

.priority-alta {
  background-color: #fecaca;
  color: #991b1b;
}

.priority-media {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-baixa {
  background-color: #dbeafe;
  color: #1e40af;
}

.centered-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 1.25rem;
}

.empty-row {
  text-align: center;
  color: #6b7280;
  padding: 1rem 0;
}
</style>
