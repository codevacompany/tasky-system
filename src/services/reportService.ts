import apiClient from '@/utils/axiosInstance';
import type { TicketPriority, TicketStatus } from '@/models';

export interface TenantStatistics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  resolvedTickets: number;
  averageResolutionTimeSeconds: number;
  averageAcceptanceTimeSeconds: number;
  averageTotalTimeSeconds: number;
  resolutionRate: number;
  ticketTrends: TrendStats;
}

export interface UserStatistics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  resolvedTickets: number;
  averageResolutionTimeSeconds: number;
  averageAcceptanceTimeSeconds: number;
  averageTotalTimeSeconds: number;
  resolutionRate: number;
}

export interface DepartmentStats {
  departmentId: number;
  departmentName: string;
  totalTickets: number;
  resolvedTickets: number;
  averageResolutionTimeSeconds: number;
  averageAcceptanceTimeSeconds: number;
  averageTotalTimeSeconds: number;
  resolutionRate: number;
}

export interface TrendStats {
  daily: TimeSeriesData[];
  weekly: TimeSeriesData[];
  monthly: TimeSeriesData[];
  trimestral: TimeSeriesData[];
}

export interface TimeSeriesData {
  date: string;
  total: number;
  resolved: number;
  created: number;
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

export interface StatusDurationDto {
  status: TicketStatus;
  averageDurationSeconds: number;
  totalDurationSeconds: number;
  count: number;
}

export interface StatusDurationResponseDto {
  statusDurations: StatusDurationDto[];
}

export const reportService = {
  async getTenantStatistics(): Promise<TenantStatistics> {
    const response = await apiClient.get('/stats/by-tenant');
    return response.data;
  },

  async getUserStatistics(): Promise<UserStatistics> {
    const response = await apiClient.get('/stats/by-user');
    return response.data;
  },

  async getTenantDepartmentsStatistics(): Promise<DepartmentStats[]> {
    const response = await apiClient.get('/stats/department-stats');
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

  async getTicketTrends(period: 'daily' | 'weekly' | 'monthly'): Promise<TrendStats> {
    const response = await apiClient.get(`/stats/ticket-trends`, {
      params: { period },
    });
    return response.data;
  },

  async getCustomDateRangeStats(startDate: string, endDate: string): Promise<TenantStatistics> {
    const response = await apiClient.get('/stats/custom-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getStatusDurations(period?: string): Promise<StatusDurationResponseDto> {
    const response = await apiClient.get('/stats/status-durations', {
      params: period ? { period } : undefined,
    });
    return response.data;
  },
};
