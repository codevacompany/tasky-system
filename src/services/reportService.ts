import apiClient from '@/utils/axiosInstance';
import type { TicketPriority, DefaultTicketStatus } from '@/models';

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
  status: DefaultTicketStatus;
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
  status:
    | DefaultTicketStatus
    | { id: number; key: string; name: string; statusColumnId: number; isDefault: boolean };
  averageDurationSeconds: number;
  totalDurationSeconds: number;
  count: number;
}

export interface StatusDurationResponseDto {
  statusDurations: StatusDurationDto[];
}

export interface ResolutionTimePointDto {
  label: string;
  value: number;
}

export interface ResolutionTimeDataDto {
  week: ResolutionTimePointDto[];
  month: ResolutionTimePointDto[];
  quarter: ResolutionTimePointDto[];
}

export interface ResolutionTimeAverageDto {
  week: number;
  month: number;
  quarter: number;
}

export interface ResolutionTimeResponseDto {
  data: ResolutionTimeDataDto;
  average: ResolutionTimeAverageDto;
}

export interface StatusDurationTimePointDto {
  month: string;
  value: number;
  count: number;
}

export interface StatusDurationTimeSeriesResponseDto {
  status: DefaultTicketStatus;
  data: StatusDurationTimePointDto[];
  averageDuration: number;
}

export type UserRankingItemDto = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentName: string;
  totalTickets: number;
  resolvedTickets: number;
  resolutionRate: number;
  avatarUrl?: string;
};

export type UserRankingResponseDto = {
  users: UserRankingItemDto[];
};

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

  async getResolutionTimeData(): Promise<ResolutionTimeResponseDto> {
    const response = await apiClient.get('/stats/resolution-time');
    return response.data;
  },

  async getStatusDurationTimeSeries(
    status: DefaultTicketStatus,
  ): Promise<StatusDurationTimeSeriesResponseDto> {
    const response = await apiClient.get<StatusDurationTimeSeriesResponseDto>(
      `/stats/status-duration-time-series?status=${status}`,
    );
    return response.data;
  },

  async getTopUsers(limit = 5, all = false, sort = 'top'): Promise<UserRankingResponseDto> {
    const response = await apiClient.get(
      `/stats/top-users?limit=${limit}${all ? '&all=true' : ''}&sort=${sort}`,
    );
    return response.data;
  },
};
