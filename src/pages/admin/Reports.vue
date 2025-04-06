<template>
  <div class="reports-container">
    <h1 class="text-2xl font-bold mb-6">Relatórios do Sistema</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card de Chamados por Status -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Chamados por Status</h2>
        <div class="h-64">
          <PieChart 
            v-if="ticketsByStatus.labels.length"
            :chartData="{
              labels: ticketsByStatus.labels,
              datasets: [{
                data: ticketsByStatus.data,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
              }]
            }"
          />
        </div>
      </div>

      <!-- Card de Chamados por Prioridade -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Chamados por Prioridade</h2>
        <div class="h-64">
          <BarChart 
            v-if="ticketsByPriority.labels.length"
            :chartData="{
              labels: ticketsByPriority.labels,
              datasets: [{
                label: 'Quantidade',
                data: ticketsByPriority.data,
                backgroundColor: '#2196F3'
              }]
            }"
          />
        </div>
      </div>

      <!-- Card de Estatísticas Gerais -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Estatísticas Gerais</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span>Total de Chamados:</span>
            <span class="font-semibold">{{ statistics.totalTickets }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Chamados Abertos:</span>
            <span class="font-semibold text-yellow-500">{{ statistics.openTickets }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Chamados Fechados:</span>
            <span class="font-semibold text-green-500">{{ statistics.closedTickets }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Tempo Médio de Resolução:</span>
            <span class="font-semibold">{{ statistics.averageResolutionTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Últimos Chamados -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mb-4">Últimos Chamados</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Assunto</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Prioridade</th>
              <th class="px-4 py-2 text-left">Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in recentTickets" :key="ticket.id" class="border-b">
              <td class="px-4 py-2">#{{ ticket.id }}</td>
              <td class="px-4 py-2">{{ ticket.subject }}</td>
              <td class="px-4 py-2">
                <span :class="getStatusClass(ticket.status)">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-4 py-2">{{ ticket.priority }}</td>
              <td class="px-4 py-2">{{ formatDate(ticket.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PieChart, BarChart } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useTicketStore } from '@/stores/ticket'
import { formatDate } from '@/utils/date'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ticketStore = useTicketStore()

const ticketsByStatus = ref({
  labels: [],
  data: []
})

const ticketsByPriority = ref({
  labels: [],
  data: []
})

const statistics = ref({
  totalTickets: 0,
  openTickets: 0,
  closedTickets: 0,
  averageResolutionTime: '0 dias'
})

const recentTickets = ref([])

const getStatusClass = (status: string) => {
  const classes = {
    'EM ANDAMENTO': 'text-yellow-500',
    'CONCLUÍDO': 'text-green-500',
    'ATRASADO': 'text-red-500'
  }
  return classes[status] || ''
}

onMounted(async () => {
  // Aqui você deve implementar a lógica para buscar os dados do backend
  // Por enquanto, vamos usar dados de exemplo
  ticketsByStatus.value = {
    labels: ['Em Andamento', 'Concluído', 'Atrasado'],
    data: [15, 25, 5]
  }

  ticketsByPriority.value = {
    labels: ['Baixa', 'Média', 'Alta'],
    data: [20, 15, 10]
  }

  statistics.value = {
    totalTickets: 45,
    openTickets: 20,
    closedTickets: 25,
    averageResolutionTime: '3 dias'
  }

  // Dados de exemplo para a tabela
  recentTickets.value = [
    {
      id: 1,
      subject: 'Problema no sistema',
      status: 'EM ANDAMENTO',
      priority: 'Alta',
      createdAt: new Date()
    },
    // Adicione mais tickets conforme necessário
  ]
})
</script>

<style scoped>
.reports-container {
  padding: 2rem;
}
</style> 