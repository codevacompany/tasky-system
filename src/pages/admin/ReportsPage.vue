<!-- <script setup lang="ts"></script> -->

<template>
  <div class="reports-container p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Relatórios do Sistema</h1>
      <p class="text-gray-600">Visualize estatísticas e métricas importantes dos chamados</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Card de Estatísticas Gerais -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <font-awesome-icon icon="chart-line" class="text-blue-500 text-xl mr-3" />
          <h2 class="text-lg font-semibold text-gray-800">Estatísticas Gerais</h2>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">Total de Chamados</span>
            <span class="font-semibold text-gray-800 text-lg">{{ statistics.totalTickets || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">Chamados Abertos</span>
            <span class="font-semibold text-yellow-500 text-lg">{{ statistics.openTickets || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">Chamados Fechados</span>
            <span class="font-semibold text-green-500 text-lg">{{ statistics.closedTickets || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">Tempo Médio de Resolução</span>
            <span class="font-semibold text-gray-800 text-lg">{{ statistics.averageResolutionTime || '0 dias' }}</span>
          </div>
        </div>
      </div>

      <!-- Card de Chamados por Status -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <font-awesome-icon icon="chart-pie" class="text-purple-500 text-xl mr-3" />
          <h2 class="text-lg font-semibold text-gray-800">Chamados por Status</h2>
        </div>
        <div class="h-64">
          <Pie
            v-if="ticketsByStatus.labels.length"
            :data="{
              labels: ticketsByStatus.labels,
              datasets: [{
                data: ticketsByStatus.data,
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 1
              }]
            }"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center">
            <font-awesome-icon icon="spinner" spin class="text-gray-400 text-2xl mr-2" />
            <p class="text-gray-500">Carregando dados...</p>
          </div>
        </div>
      </div>

      <!-- Card de Chamados por Prioridade -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div class="flex items-center mb-4">
          <font-awesome-icon icon="chart-bar" class="text-indigo-500 text-xl mr-3" />
          <h2 class="text-lg font-semibold text-gray-800">Chamados por Prioridade</h2>
        </div>
        <div class="h-64">
          <Bar
            v-if="ticketsByPriority.labels.length"
            :data="{
              labels: ticketsByPriority.labels,
              datasets: [{
                label: 'Quantidade',
                data: ticketsByPriority.data,
                backgroundColor: '#6366F1',
                borderRadius: 4
              }]
            }"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center">
            <font-awesome-icon icon="spinner" spin class="text-gray-400 text-2xl mr-2" />
            <p class="text-gray-500">Carregando dados...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Últimos Chamados -->
    <div class="bg-white rounded-lg shadow-md border border-gray-100">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center">
          <font-awesome-icon icon="list" class="text-gray-500 text-xl mr-3" />
          <h2 class="text-lg font-semibold text-gray-800">Últimos Chamados</h2>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="ticket in recentTickets" :key="ticket.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ ticket.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ ticket.subject }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(ticket.status)
                ]">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getPriorityClass(ticket.priority)
                ]">
                  {{ ticket.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(ticket.createdAt) }}</td>
            </tr>
            <tr v-if="!recentTickets.length" class="hover:bg-gray-50">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                <font-awesome-icon icon="inbox" class="text-gray-400 text-xl mb-2" />
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
import { ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import { formatDate } from '@/utils/date'
import { reportService } from '@/services/reportService'
import type { TicketStatistics, ChartData } from '@/services/reportService'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

const ticketsByStatus = ref<ChartData>({
  labels: [],
  data: []
})

const ticketsByPriority = ref<ChartData>({
  labels: [],
  data: []
})

const statistics = ref<TicketStatistics>({
  totalTickets: 0,
  openTickets: 0,
  closedTickets: 0,
  averageResolutionTime: '0 dias'
})

const recentTickets = ref([])

const getStatusClass = (status: string) => {
  const classes = {
    'EM ANDAMENTO': 'bg-yellow-100 text-yellow-800',
    'CONCLUÍDO': 'bg-green-100 text-green-800',
    'ATRASADO': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority: string) => {
  const classes = {
    'ALTA': 'bg-red-100 text-red-800',
    'MÉDIA': 'bg-yellow-100 text-yellow-800',
    'BAIXA': 'bg-blue-100 text-blue-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  try {
    const [statsData, statusData, priorityData, ticketsData] = await Promise.all([
      reportService.getTicketStatistics(),
      reportService.getTicketsByStatus(),
      reportService.getTicketsByPriority(),
      reportService.getRecentTickets(10)
    ])

    statistics.value = statsData
    ticketsByStatus.value = statusData
    ticketsByPriority.value = priorityData
    recentTickets.value = ticketsData
  } catch (error) {
    console.error('Erro ao carregar dados dos relatórios:', error)
    // Aqui você pode adicionar uma notificação de erro para o usuário
  }
})
</script>

<style scoped>
.reports-container {
  padding: 2rem;
}
</style>
