import apiClient from "@/utils/axiosInstance"
import type { TicketPriority, TicketStatus } from "@/models"

export interface TicketStatistics {
  totalTickets: number
  openTickets: number
  closedTickets: number
  averageResolutionTime: string
  averageAcceptanceTime: string
  resolutionRate: number
  acceptanceRate: number
  ticketsByDepartment: DepartmentStats[]
  ticketTrends: TrendStats
}

export interface DepartmentStats {
  departmentId: number
  departmentName: string
  totalTickets: number
  resolvedTickets: number
  averageResolutionTime: string
  resolutionRate: number
}

export interface TrendStats {
  daily: TimeSeriesData[]
  weekly: TimeSeriesData[]
  monthly: TimeSeriesData[]
}

export interface TimeSeriesData {
  date: string
  total: number
  resolved: number
  created: number
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export interface PerformanceMetrics {
  departmentId?: number
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    totalTickets: number
    resolvedTickets: number
    averageResolutionTime: string
    resolutionRate: number
    ticketsByPriority: Record<TicketPriority, number>
    ticketsByStatus: Record<TicketStatus, number>
    responseTimeDistribution: {
      lessThan1Hour: number
      lessThan4Hours: number
      lessThan24Hours: number
      moreThan24Hours: number
    }
  }
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
  },

  async getDepartmentPerformance(departmentId: number, period: string): Promise<PerformanceMetrics> {
    const response = await apiClient.get(`/reports/department/${departmentId}/performance`, {
      params: { period }
    })
    return response.data
  },

  async getTicketTrends(period: 'daily' | 'weekly' | 'monthly'): Promise<TrendStats> {
    const response = await apiClient.get(`/reports/trends`, {
      params: { period }
    })
    return response.data
  },

  async getResponseTimeDistribution(): Promise<PerformanceMetrics['metrics']['responseTimeDistribution']> {
    const response = await apiClient.get('/reports/response-time-distribution')
    return response.data
  },

  async getDepartmentsComparison(): Promise<DepartmentStats[]> {
    const response = await apiClient.get('/reports/departments-comparison')
    return response.data
  },

  async getCustomDateRangeStats(startDate: string, endDate: string): Promise<TicketStatistics> {
    const response = await apiClient.get('/reports/custom-range', {
      params: { startDate, endDate }
    })
    return response.data
  }
}
