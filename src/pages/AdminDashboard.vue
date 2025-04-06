<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Cards de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <!-- Card Clientes Ativos -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Clientes Ativos</h3>
            <p class="text-2xl font-bold">{{ metrics.clientesAtivos.total }}</p>
          </div>
          <div class="text-blue-500">
            <i class="fas fa-users text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-green-500 mt-2">
          <i class="fas fa-arrow-up"></i> {{ metrics.clientesAtivos.crescimento }}% este mês
        </p>
      </div>

      <!-- Card Novos Clientes -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Novos Clientes</h3>
            <p class="text-2xl font-bold">{{ metrics.novosClientes.total }}</p>
          </div>
          <div class="text-green-500">
            <i class="fas fa-user-plus text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-green-500 mt-2">
          <i class="fas fa-arrow-up"></i> {{ metrics.novosClientes.crescimento }}% vs mês anterior
        </p>
      </div>

      <!-- Card Clientes Inativos -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Clientes Inativos</h3>
            <p class="text-2xl font-bold">{{ metrics.clientesInativos.total }}</p>
          </div>
          <div class="text-yellow-500">
            <i class="fas fa-user-clock text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-red-500 mt-2">
          <i class="fas fa-arrow-up"></i> {{ metrics.clientesInativos.crescimento }}% este mês
        </p>
      </div>

      <!-- Card Cancelamentos -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Cancelamentos</h3>
            <p class="text-2xl font-bold">{{ metrics.cancelamentos.total }}</p>
          </div>
          <div class="text-red-500">
            <i class="fas fa-user-minus text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-red-500 mt-2">
          <i class="fas fa-arrow-up"></i> {{ metrics.cancelamentos.crescimento }}% este mês
        </p>
      </div>

      <!-- Card Taxa de Churn -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Taxa de Churn</h3>
            <p class="text-2xl font-bold">{{ metrics.taxaChurn.valor }}%</p>
          </div>
          <div class="text-purple-500">
            <i class="fas fa-chart-line text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-green-500 mt-2">
          <i class="fas fa-arrow-down"></i> {{ Math.abs(metrics.taxaChurn.crescimento) }}% vs mês anterior
        </p>
      </div>

      <!-- Card Receita Mensal -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm text-gray-600">Receita Mensal</h3>
            <p class="text-2xl font-bold">R$ {{ formatCurrency(metrics.receitaMensal.valor) }}</p>
          </div>
          <div class="text-green-500">
            <i class="fas fa-dollar-sign text-xl"></i>
          </div>
        </div>
        <p class="text-sm text-green-500 mt-2">
          <i class="fas fa-arrow-up"></i> {{ metrics.receitaMensal.crescimento }}% vs mês anterior
        </p>
      </div>
    </div>

    <!-- Gestão de Usuários Admin -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-4 flex justify-between items-center border-b">
        <h2 class="text-lg font-semibold">Gestão de Usuários Admin</h2>
        <button @click="openNovoAdmin" class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
          <i class="fas fa-plus mr-2"></i> NOVO ADMIN
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível de Acesso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in adminUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.nome }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.nivelAcesso }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(user.status)">{{ user.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.ultimoAcesso }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="editarAdmin(user)" class="text-blue-500 hover:text-blue-700 mr-3">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="excluirAdmin(user)" class="text-red-500 hover:text-red-700">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Controle de Recursos por Plano -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 flex justify-between items-center border-b">
        <h2 class="text-lg font-semibold">Controle de Recursos por Plano</h2>
        <button @click="openConfigurarRecursos" class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
          <i class="fas fa-cog mr-2"></i> CONFIGURAR RECURSOS
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Básico</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresarial</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="recurso in planoRecursos" :key="recurso.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i class="fas fa-phone-alt mr-2 text-gray-400"></i>
                  {{ recurso.nome }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ recurso.basico }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ recurso.profissional }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ recurso.empresarial }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(recurso.status)">{{ recurso.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="editarRecurso(recurso)" class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '../stores/dashboard'

const store = useDashboardStore()
const { metrics, adminUsers, planoRecursos } = store

// Funções auxiliares
const formatCurrency = (value: number) => {
  return (value / 1000).toFixed(0) + 'K'
}

const getStatusClass = (status: string) => {
  const classes = 'px-2 py-1 text-xs font-semibold rounded-full '
  switch (status.toLowerCase()) {
    case 'ativo':
      return classes + 'bg-green-100 text-green-800'
    case 'inativo':
      return classes + 'bg-red-100 text-red-800'
    default:
      return classes + 'bg-gray-100 text-gray-800'
  }
}

// Funções de ação
const openNovoAdmin = () => {
  // Implementar lógica para abrir modal de novo admin
}

const editarAdmin = (user: any) => {
  // Implementar lógica para editar admin
}

const excluirAdmin = (user: any) => {
  // Implementar lógica para excluir admin
}

const openConfigurarRecursos = () => {
  // Implementar lógica para abrir modal de configuração de recursos
}

const editarRecurso = (recurso: any) => {
  // Implementar lógica para editar recurso
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await Promise.all([
    store.fetchMetrics(),
    store.fetchAdminUsers(),
    store.fetchPlanoRecursos()
  ])
})
</script>

<style scoped>
/* Estilos específicos do componente, se necessário */
</style> 