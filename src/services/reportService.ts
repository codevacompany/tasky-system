import apiClient from '@/utils/axiosInstance';
import type { TicketPriority, DefaultTicketStatus } from '@/models';
import type { PaginatedResponse } from '@/types/http';
export type { PaginatedResponse };

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
  efficiencyScore: number;
  overdueRate: number;
  userCount: number;
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
  efficiencyScore: number; // Wilson Score for ranking
  averageAcceptanceTimeSeconds: number;
  averageResolutionTimeSeconds: number;
  overdueRate: number; // Percentage of completed tickets that were overdue (completedAt > dueAt)
  avatarUrl?: string;
  isActive: boolean;
};

export type UserRankingResponseDto = {
  users: UserRankingItemDto[];
};

export interface PerformanceTrendsResponseDto {
  totalCreated: number;
  totalResolved: number;
}

export const reportService = {
  /**
   * Fetches tenant-level statistics including total tickets, resolution rate, and average times.
   * Used in ReportsPage.vue:
   * - Metrics Grid (Overview tab): Displays totalTickets, resolutionRate, averageResolutionTimeSeconds, averageAcceptanceTimeSeconds
   * - UserStatsTable component: Receives averageResolutionTimeSeconds as prop
   * - Excel/CSV Export: Includes general metrics (total tickets, resolution rate, average times)
   */
  async getTenantStatistics(params?: {
    period?: string;
    excludeCanceled?: boolean;
  }): Promise<TenantStatistics> {
    const response = await apiClient.get('/stats/by-tenant', {
      params,
    });
    return response.data;
  },

  /**
   * Fetches user-level statistics for the current logged-in user.
   * Currently not used in ReportsPage.vue (reserved for future user-specific dashboard).
   */
  async getUserStatistics(): Promise<UserStatistics> {
    const response = await apiClient.get('/stats/by-user');
    return response.data;
  },


  /**
   * Fetches ticket count distribution by status.
   * Used in ReportsPage.vue:
   * - Distribuição por Status chart (Overview tab): Doughnut chart showing percentage of tickets per status
   * - Excel/CSV Export: Status distribution section in general metrics
   */
  async getTicketsByStatus(period?: string): Promise<TicketStatusCountResponseDto> {
    const response = await apiClient.get('/stats/by-status', {
      params: period ? { period } : undefined,
    });
    return response.data;
  },

  /**
   * Fetches ticket count distribution by priority.
   * Used in ReportsPage.vue:
   * - Distribuição por Prioridade chart (Overview tab): Doughnut chart showing percentage of tickets per priority
   * - Excel/CSV Export: Priority distribution section in general metrics
   */
  async getTicketsByPriority(period?: string): Promise<TicketPriorityCountResponseDto> {
    const response = await apiClient.get('/stats/by-priority', {
      params: period ? { period } : undefined,
    });
    return response.data;
  },

  /**
   * Fetches ticket trends data (created vs completed) over time.
   * Used in ReportsPage.vue:
   * - Criados vs Concluídos chart (Overview tab): Bar chart comparing created vs completed tickets
   * - Criados vs Concluídos chart (Trends tab): Same bar chart with period selector
   * - Trend summary text (Overview tab): Shows total created/resolved and percentage changes
   * - Excel/CSV Export: Trend Data sheet/section with date, created, resolved, total columns
   * Called dynamically when user changes trend period (daily/weekly/monthly) via updateTrendPeriod()
   */
  async getTicketTrends(period: 'daily' | 'weekly' | 'monthly'): Promise<TrendStats> {
    const response = await apiClient.get(`/stats/ticket-trends`, {
      params: { period },
    });
    return response.data;
  },

  /**
   * Fetches tenant statistics for a custom date range.
   * Currently not used in ReportsPage.vue (reserved for future custom period analysis tab).
   */
  async getCustomDateRangeStats(startDate: string, endDate: string): Promise<TenantStatistics> {
    const response = await apiClient.get('/stats/custom-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Fetches average duration (time spent) for each ticket status.
   * Used in ReportsPage.vue:
   * - Tempo Médio Por Status widget (Overview tab): Bar chart showing average time per status
   * - Tempo Médio Por Status widget (Trends tab): Same bar chart visualization
   */
  async getStatusDurations(period?: string): Promise<StatusDurationResponseDto> {
    const response = await apiClient.get('/stats/status-durations', {
      params: period ? { period } : undefined,
    });
    return response.data;
  },

  /**
   * Fetches department statistics for the tenant.
   * Used in ReportsPage.vue:
   * - DepartmentStatsTable component (Setores tab): Main table displaying all departments with statistics
   * - Top Setores widget (Overview tab): Shows top 5 departments
   * - Tempo de Resolução Por Setor widget (Overview tab): Shows resolution time by department
   * - Excel/CSV Export: Department Statistics sheet/section with all department metrics
   */
  async getTenantDepartmentsStatistics(
    period?: string,
    sortBy: 'efficiency' | 'resolution_time' | 'overdue_rate' = 'efficiency',
  ): Promise<DepartmentStats[]> {
    const response = await apiClient.get('/stats/department-stats', {
      params: {
        ...(period ? { period } : {}),
        sortBy,
      },
    });
    return response.data;
  },

  /**
   * Fetches resolution time data over time (time series).
   * Used in ReportsPage.vue:
   * - Tempo de Resolução - Análise Temporal widget (Trends tab): Line chart showing resolution time evolution
   * - Displays average resolution time with period selector (week/month/quarter)
   * - Shows trend comparison with previous period
   */
  async getResolutionTimeData(): Promise<ResolutionTimeResponseDto> {
    const response = await apiClient.get('/stats/resolution-time');
    return response.data;
  },

  /**
   * Fetches time series data for a specific status duration.
   * Used in ReportsPage.vue:
   * - Tempo Gasto no Status "Em Andamento" widget (Trends tab): Line chart showing time spent in "In Progress" status over time
   * - Displays average duration and trend analysis
   * - Called dynamically when user changes period (week/month/quarter) via handleInProgressPeriodChange()
   * - Also used in Em Andamento tab for time analysis (though the tab primarily uses ticketService.fetch)
   */
  async getStatusDurationTimeSeries(
    status: DefaultTicketStatus,
    period?: 'week' | 'month' | 'quarter',
  ): Promise<StatusDurationTimeSeriesResponseDto> {
    const params = new URLSearchParams({ status });
    if (period) params.append('period', period);
    const response = await apiClient.get<StatusDurationTimeSeriesResponseDto>(
      `/stats/status-duration-time-series?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Fetches user ranking/statistics data.
   * Used in ReportsPage.vue:
   * - Top Colaboradores widget (Overview tab): Shows top 5 users by efficiency score
   * - UserStatsTable component (Colaboradores tab): Main table displaying all users with statistics
   * - Melhor Desempenho widget (Colaboradores tab): Shows top 3 performers
   * - Pior Desempenho widget (Colaboradores tab): Shows bottom 3 performers
   * - Excel/CSV Export: Top Colaboradores sheet/section with user statistics
   * Called multiple times with different parameters:
   *   - limit=undefined, all=true: For Colaboradores tab (all users)
   *   - limit=5, sort='top': For Top Colaboradores widget
   *   - limit=5, sort='bottom': For Pior Desempenho widget
   */
  async getTopUsers(
    limit = 5,
    all = false,
    sort = 'top',
    period?: string,
    sortBy: 'efficiency' | 'resolution_time' | 'overdue_rate' = 'efficiency',
  ): Promise<UserRankingResponseDto> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      sort,
      sortBy,
    });
    if (all) params.append('all', 'true');
    if (period) params.append('period', period);
    const response = await apiClient.get(`/stats/top-users?${params.toString()}`);
    return response.data;
  },

  async getUserStatsList(
    page = 1,
    limit = 10,
    search = '',
    period?: string,
    sortBy: 'efficiency' | 'resolution_time' | 'overdue_rate' = 'efficiency',
    sortDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResponse<UserRankingItemDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      sortBy,
      sortDirection,
    });
    if (period) params.append('period', period);
    const response = await apiClient.get(`/stats/user-stats-list?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetches performance trends data (total created vs resolved).
   * Currently not used in ReportsPage.vue (reserved for future performance analysis features).
   */
  async getPerformanceTrends(period?: string): Promise<PerformanceTrendsResponseDto> {
    const response = await apiClient.get('/stats/performance-trends', {
      params: period ? { period } : undefined,
    });
    return response.data;
  },
  async getDepartmentStatsList(
    page = 1,
    limit = 10,
    search = '',
    period?: string,
    sortBy: string = 'efficiencyScore',
    sortDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResponse<DepartmentStats>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      sortBy,
      sortDirection,
    });
    if (period) params.append('period', period);
    const response = await apiClient.get(`/stats/department-stats-list?${params.toString()}`);
    return response.data;
  },
};

