<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Cards de Métricas -->
    <div class="dashboard-stats">
      <!-- Card Clientes Ativos -->
      <div class="stat-card">
        <div class="stat-icon blue">
          <font-awesome-icon icon="users" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Clientes Ativos</h3>
            <p>{{ metrics.clientesAtivos.total }}</p>
          </div>
          <div class="stat-details">
            <span><font-awesome-icon icon="arrow-up" /> {{ metrics.clientesAtivos.crescimento }}% este mês</span>
          </div>
        </div>
      </div>

      <!-- Card Novos Clientes -->
      <div class="stat-card">
        <div class="stat-icon green">
          <font-awesome-icon icon="user-plus" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Novos Clientes</h3>
            <p>{{ metrics.novosClientes.total }}</p>
          </div>
          <div class="stat-details">
            <span><font-awesome-icon icon="arrow-up" /> {{ metrics.novosClientes.crescimento }}% vs mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Card Clientes Inativos -->
      <div class="stat-card">
        <div class="stat-icon orange">
          <font-awesome-icon icon="user-clock" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Clientes Inativos</h3>
            <p>{{ metrics.clientesInativos.total }}</p>
          </div>
          <div class="stat-details">
            <span class="text-red-500"><font-awesome-icon icon="arrow-up" /> {{ metrics.clientesInativos.crescimento }}% este mês</span>
          </div>
        </div>
      </div>

      <!-- Card Cancelamentos -->
      <div class="stat-card">
        <div class="stat-icon red">
          <font-awesome-icon icon="user-minus" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Cancelamentos</h3>
            <p>{{ metrics.cancelamentos.total }}</p>
          </div>
          <div class="stat-details">
            <span class="text-red-500"><font-awesome-icon icon="arrow-up" /> {{ metrics.cancelamentos.crescimento }}% este mês</span>
          </div>
        </div>
      </div>

      <!-- Card Taxa de Churn -->
      <div class="stat-card">
        <div class="stat-icon purple">
          <font-awesome-icon icon="chart-line" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Taxa de Churn</h3>
            <p>{{ metrics.taxaChurn.valor }}%</p>
          </div>
          <div class="stat-details">
            <span><font-awesome-icon icon="arrow-down" /> {{ Math.abs(metrics.taxaChurn.crescimento) }}% vs mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Card Receita Mensal -->
      <div class="stat-card">
        <div class="stat-icon teal">
          <font-awesome-icon icon="dollar-sign" />
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <h3>Receita Mensal</h3>
            <p>R$ {{ formatCurrency(metrics.receitaMensal.valor) }}</p>
          </div>
          <div class="stat-details">
            <span><font-awesome-icon icon="arrow-up" /> {{ metrics.receitaMensal.crescimento }}% vs mês anterior</span>
          </div>
        </div>
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
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  text-align: left;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  align-items: center;
}

.stat-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
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

.stat-icon.blue {
  background-color: #3b82f6;
}

.stat-icon.green {
  background-color: #22c55e;
}

.stat-icon.orange {
  background-color: #f97316;
}

.stat-icon.red {
  background-color: #ef4444;
}

.stat-icon.purple {
  background-color: #9333ea;
}

.stat-icon.teal {
  background-color: #0d9488;
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
  font-size: 1.000rem;
  font-weight: 500;
  color: #64748b;
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
  color: #64748b;
  margin-top: 4px;
  justify-content: flex-end;
}

.stat-details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-details .text-red-500 {
  color: #ef4444;
}

/* Dark mode */
:deep(body.dark-mode) .stat-card {
  background: #1e293b;
  border-color: #334155;
}

:deep(body.dark-mode) .stat-card:hover {
  border-color: #475569;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

:deep(body.dark-mode) .stat-details {
  color: #94a3b8;
}

:deep(body.dark-mode) .stat-info h3 {
  color: #94a3b8;
}

:deep(body.dark-mode) .stat-info p {
  color: #e2e8f0;
}

/* Tabelas */
.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}

:deep(body.dark-mode) .table-container {
  background: #1e293b;
  border-color: #334155;
}
</style>