import { defineStore } from 'pinia'

interface DashboardMetrics {
  clientesAtivos: {
    total: number
    crescimento: number
  }
  novosClientes: {
    total: number
    crescimento: number
  }
  clientesInativos: {
    total: number
    crescimento: number
  }
  cancelamentos: {
    total: number
    crescimento: number
  }
  taxaChurn: {
    valor: number
    crescimento: number
  }
  receitaMensal: {
    valor: number
    crescimento: number
  }
}

interface AdminUser {
  id: string
  nome: string
  nivelAcesso: string
  status: string
  ultimoAcesso: string
}

interface PlanoRecurso {
  id: string
  nome: string
  basico: string
  avancado: string
  empresarial: string
  status: string
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    metrics: {
      clientesAtivos: { total: 1256, crescimento: 12 },
      novosClientes: { total: 128, crescimento: 8 },
      clientesInativos: { total: 45, crescimento: 5 },
      cancelamentos: { total: 23, crescimento: 2 },
      taxaChurn: { valor: 1.8, crescimento: -0.5 },
      receitaMensal: { valor: 125000, crescimento: 15 }
    } as DashboardMetrics,
    adminUsers: [] as AdminUser[],
    planoRecursos: [] as PlanoRecurso[]
  }),

  actions: {
    async fetchMetrics() {
      try {
        // Aqui você fará a chamada à API para buscar as métricas
        // const response = await api.get('/admin/metrics')
        // this.metrics = response.data
      } catch (error) {
        console.error('Erro ao buscar métricas:', error)
      }
    },

    async fetchAdminUsers() {
      try {
        // Aqui você fará a chamada à API para buscar os usuários admin
        // const response = await api.get('/admin/users')
        // this.adminUsers = response.data
      } catch (error) {
        console.error('Erro ao buscar usuários admin:', error)
      }
    },

    async fetchPlanoRecursos() {
      try {
        // Aqui você fará a chamada à API para buscar os recursos dos planos
        // const response = await api.get('/admin/plano-recursos')
        // this.planoRecursos = response.data
      } catch (error) {
        console.error('Erro ao buscar recursos dos planos:', error)
      }
    }
  }
}) 