import apiClient from "@/utils/axiosInstance"

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
    const response = await apiClient.get('/reports/statistics')
    return response.data
  },

  async getTicketsByStatus(): Promise<ChartData> {
    const response = await apiClient.get('/reports/by-status')
    return response.data
  },

  async getTicketsByPriority(): Promise<ChartData> {
    const response = await apiClient.get('/reports/by-priority')
    return response.data
  },

  async getRecentTickets(limit: number = 10) {
    const response = await apiClient.get(`/reports/recent-tickets?limit=${limit}`)
    return response.data
  }
}
