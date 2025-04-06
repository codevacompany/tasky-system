import { api } from '@/plugins/axios'

export interface TicketStatistics {
  totalTickets: number
  openTickets: number
  closedTickets: number
  averageResolutionTime: string
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export const reportService = {
  async getTicketStatistics(): Promise<TicketStatistics> {
    const response = await api.get('/api/reports/statistics')
    return response.data
  },

  async getTicketsByStatus(): Promise<ChartData> {
    const response = await api.get('/api/reports/by-status')
    return response.data
  },

  async getTicketsByPriority(): Promise<ChartData> {
    const response = await api.get('/api/reports/by-priority')
    return response.data
  },

  async getRecentTickets(limit: number = 10) {
    const response = await api.get(`/api/reports/recent-tickets?limit=${limit}`)
    return response.data
  }
} 