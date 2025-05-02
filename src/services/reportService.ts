import apiClient from "@/utils/axiosInstance"
import type { TicketPriority, TicketStatus } from "@/models"

export interface TicketStatistics {
  totalTickets: number
  openTickets: number
  closedTickets: number
  averageResolutionTimeSeconds: number
  averageAcceptanceTimeSeconds: number
  averageTotalTimeSeconds: number
  resolutionRate: number
  ticketsByDepartment: DepartmentStats[]
  ticketTrends: TrendStats
}

export interface DepartmentStats {
  departmentId: number
  departmentName: string
  totalTickets: number
  resolvedTickets: number
  averageResolutionTimeSeconds: number
  averageAcceptanceTimeSeconds: number
  averageTotalTimeSeconds: number
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

export interface TicketStatusCountDto {
  status: TicketStatus;
  count: number;
}

export interface TicketPriorityCountDto {
  priority: TicketPriority;
  count: number;
}

export interface TicketPriorityCountResponseDto {
  priorityCounts: TicketPriorityCountDto[];
  total: number;
}


export interface TicketStatusCountResponseDto {
  statusCounts: TicketStatusCountDto[];
  total: number;
}

export interface PerformanceMetrics {
  departmentId?: number
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    totalTickets: number
    resolvedTickets: number
    averageResolutionTime: string
    averageAcceptanceTime: string
    averageTotalTime: string
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
    const response = await apiClient.get('/stats');
    return response.data;
  },

  async getTicketsByStatus(): Promise<TicketStatusCountResponseDto> {
    const response = await apiClient.get('/stats/by-status');
    return response.data;
  },

  async getTicketsByPriority(): Promise<TicketPriorityCountResponseDto> {
    const response = await apiClient.get('/stats/by-priority');
    return response.data;
  },

  async getDepartmentPerformance(
    departmentId: number,
    period: string,
  ): Promise<PerformanceMetrics> {
    const response = await apiClient.get(`/stats/department/${departmentId}/performance`, {
      params: { period },
    });
    return response.data;
  },

  async getTicketTrends(period: 'daily' | 'weekly' | 'monthly'): Promise<TrendStats> {
    const response = await apiClient.get(`/stats/ticket-trends`, {
      params: { period },
    });
    return response.data;
  },

  async getResponseTimeDistribution(): Promise<
    PerformanceMetrics['metrics']['responseTimeDistribution']
  > {
    const response = await apiClient.get('/stats/response-time-distribution');
    return response.data;
  },

  async getDepartmentsComparison(): Promise<DepartmentStats[]> {
    const response = await apiClient.get('/stats/departments-comparison');
    return response.data;
  },

  async getCustomDateRangeStats(startDate: string, endDate: string): Promise<TicketStatistics> {
    const response = await apiClient.get('/stats/custom-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
