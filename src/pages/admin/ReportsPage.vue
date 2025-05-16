<template>
  <div class="reports-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-modal">
        <font-awesome-icon icon="spinner" spin class="loading-icon" />
        <p class="loading-text">Carregando dados dos relatórios...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <div class="error-header">
          <font-awesome-icon icon="exclamation-circle" class="error-icon" />
          <div>
            <p class="error-title">Erro ao carregar dados</p>
            <p class="error-text">{{ error }}</p>
          </div>
          <button @click="loadData" class="error-action">Tentar Novamente</button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error">
      <!-- Cabeçalho -->
    <div class="header">
        <div class="breadcrumb">
          <span>Dashboard</span>
          <font-awesome-icon icon="chevron-right" class="breadcrumb-separator" />
          <span class="breadcrumb-active">Relatórios</span>
        </div>
        <div class="header-content">
          <div>
            <h1 class="header-title">Relatórios do Sistema</h1>
            <p class="header-subtitle">Acompanhe métricas e indicadores importantes dos tickets</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline secondary">
              <font-awesome-icon icon="filter" />
              Filtros
            </button>
            <button class="btn btn-primary">
              <font-awesome-icon icon="file-export" />
              Exportar Relatório
            </button>
          </div>
        </div>
    </div>

      <div class="content">
        <!-- Cards de Métricas -->
        <div class="metrics-grid">
          <div class="metric-card blue-border">
            <div class="metric-content">
              <div class="metric-info">
                <p class="metric-label">Total de Tickets</p>
                <h3 class="metric-value">{{ statistics?.totalTickets }}</h3>
        </div>
              <div class="metric-icon blue">
                <font-awesome-icon icon="ticket" />
          </div>
          </div>
          </div>

          <div class="metric-card yellow-border">
            <div class="metric-content">
              <div class="metric-info">
                <p class="metric-label">Taxa de Resolução</p>
                <h3 class="metric-value">{{ formatPercentage(statistics?.resolutionRate) }}</h3>
              </div>
              <div class="metric-icon yellow">
                <font-awesome-icon icon="chart-line" />
          </div>
        </div>
      </div>

          <div class="metric-card green-border">
            <div class="metric-content">
              <div class="metric-info">
                <p class="metric-label">Tempo Médio de Resolução</p>
                <h3 class="metric-value">
                  {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }}
                </h3>
        </div>
              <div class="metric-icon green">
                <font-awesome-icon icon="clock" />
              </div>
            </div>
          </div>

          <div class="metric-card purple-border">
            <div class="metric-content">
              <div class="metric-info">
                <p class="metric-label">Tempo médio de Aceitação</p>
                <h3 class="metric-value">
                  {{ formatTimeInSeconds(statistics?.averageAcceptanceTimeSeconds) }}
                </h3>
              </div>
              <div class="metric-icon purple">
                <font-awesome-icon icon="thumbs-up" />
              </div>
            </div>
          </div>
        </div>

        <!-- Abas -->
        <div class="tabs-container">
          <div class="tabs-header">
            <nav class="tabs-nav">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="['tab-button', { active: currentTab === tab.id }]"
              >
                <font-awesome-icon :icon="tab.icon" />
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <div class="tab-content">
            <!-- Visão Geral -->
            <div v-if="currentTab === 'overview'" class="tab-panel">
              <!-- Nova seção Created vs Completed -->
              <div class="created-vs-completed">
                <div class="created-vs-completed-header">
                  <h2>CRIADOS VS CONCLUÍDOS</h2>
                </div>

                <div class="created-vs-completed-content">
                  <div class="created-vs-completed-info">
                    <p class="info-title">Novos tickets criados vs concluídos</p>
                    <p class="info-text" v-if="trendData && trendData.length > 0">
                      <span class="highlight">{{ getTotalResolved() }} tickets</span> concluídos no
                      período selecionado
                    </p>
                    <p class="info-text" v-if="trendData && trendData.length > 0">
                      <span class="highlight">{{ getTotalCreated() }} tickets</span> criados no
                      período selecionado
                    </p>
                    <p
                      class="info-trend"
                      v-if="
                        trendData &&
                        trendData.length > 1 &&
                        (createdTrendPercentage !== 0 || resolvedTrendPercentage !== 0)
                      "
                    >
                      Isso é
                      <span
                        v-if="createdTrendPercentage > 0"
                        :class="createdTrendPercentage >= 0 ? 'trend-value' : 'trend-value-down'"
                      >
                        {{ createdTrendPercentage }}%
                        {{ createdTrendPercentage >= 0 ? 'mais' : 'menos' }} criados
                      </span>
                      <span v-if="createdTrendPercentage > 0 && resolvedTrendPercentage > 0">
                        e
                      </span>
                      <span
                        v-if="resolvedTrendPercentage > 0"
                        :class="resolvedTrendPercentage >= 0 ? 'trend-value' : 'trend-value-down'"
                      >
                        {{ resolvedTrendPercentage }}%
                        {{ resolvedTrendPercentage >= 0 ? 'mais' : 'menos' }} concluídos
                      </span>
                      comparado a
                      <span class="date-reference">{{ firstDate }}</span>
                    </p>
                  </div>

                  <div class="created-vs-completed-chart">
                    <div class="period-selector">
                      <button
                        v-for="period in ['daily', 'weekly', 'monthly']"
                        :key="period"
                        @click="updateTrendPeriod(period as 'daily' | 'weekly' | 'monthly')"
                        :class="['period-button', { active: selectedTrendPeriod === period }]"
                      >
                        {{
                          period === 'daily' ? 'Diário' : period === 'weekly' ? 'Semanal' : 'Mensal'
                        }}
                      </button>
                    </div>
                    <div class="chart-legend" v-if="trendData && trendData.length > 0">
                      <div class="legend-item">
                        <span class="legend-color completed"></span>
                        <span>Concluídos (no período)</span>
                        <span class="legend-value">{{ getTotalResolved() }}</span>
                        <span v-if="resolvedTrendPercentage !== 0" class="legend-trend">
                          {{ resolvedTrendPercentage >= 0 ? '↑' : '↓' }}
                          {{ Math.abs(resolvedTrendPercentage) }}%
                        </span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color created"></span>
                        <span>Criados (no período)</span>
                        <span class="legend-value">{{ getTotalCreated() }}</span>
                        <span v-if="createdTrendPercentage !== 0" class="legend-trend">
                          {{ createdTrendPercentage >= 0 ? '↑' : '↓' }}
                          {{ Math.abs(createdTrendPercentage) }}%
                        </span>
                      </div>
                    </div>

                    <div class="chart-container">
                      <Line
                        v-if="trendData && trendData.length > 0"
                        :data="createdVsCompletedChartData"
                        :options="chartOptions"
                      />
                      <div v-else class="loading-state">
                        <font-awesome-icon icon="spinner" spin class="loading-icon" />
                        <p class="loading-text">Carregando dados...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="charts-grid">
                <!-- Gráfico de Status -->
                <div class="chart-card">
                  <div class="chart-header">
                    <h2 class="chart-title">Distribuição por Status</h2>
                    <div class="chart-icon">
                      <font-awesome-icon icon="chart-pie" />
                    </div>
                  </div>
                  <div class="chart-container">
        <div class="chart-wrapper">
          <Pie
            v-if="ticketsByStatus.labels.length"
                        :data="statusChartData"
            :options="chartOptions"
          />
                      <div v-else class="loading-state">
                        <font-awesome-icon icon="spinner" spin class="loading-icon" />
                        <p class="loading-text">Carregando dados...</p>
                      </div>
          </div>
        </div>
      </div>

                <!-- Gráfico de Prioridade -->
                <div class="chart-card">
                  <div class="chart-header">
                    <h2 class="chart-title">Distribuição por Prioridade</h2>
                    <div class="chart-icon">
                      <font-awesome-icon icon="chart-bar" />
        </div>
                  </div>
                  <div class="chart-container">
        <div class="chart-wrapper">
          <Bar
            v-if="ticketsByPriority.labels.length"
                        :data="priorityChartData"
            :options="chartOptions"
          />
                      <div v-else class="loading-state">
                        <font-awesome-icon icon="spinner" spin class="loading-icon" />
                        <p class="loading-text">Carregando dados...</p>
                      </div>
          </div>
        </div>
      </div>
    </div>

              <!-- Tabela -->
              <div class="table-container">
      <div class="table-header">
                  <div class="table-header-content">
                    <div>
                      <h2 class="table-title">Últimos Tickets</h2>
                      <p class="table-subtitle">Acompanhe os tickets mais recentes do sistema</p>
                    </div>
                    <button class="btn btn-outline primary">
                      <font-awesome-icon icon="download" />
                      Exportar
                    </button>
                  </div>
      </div>
      <div class="table-wrapper">
                  <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Status</th>
              <th>Prioridade</th>
                        <th>Data</th>
            </tr>
          </thead>
          <tbody>
                      <tr v-for="ticket in recentTickets" :key="ticket.customId">
                        <td>{{ ticket.customId }}</td>
              <td>{{ ticket.name }}</td>
              <td>
                          <span :class="['status-badge', getStatusClass(ticket.status)]">
                            {{ formatSnakeToNaturalCase(ticket.status) }}
                </span>
              </td>
              <td>
                          <span :class="['priority-badge', getPriorityClass(ticket.priority)]">
                            {{ formatSnakeToNaturalCase(ticket.priority) }}
                </span>
              </td>
              <td>{{ formatDate(ticket.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
                </div>
              </div>

              <!-- Cycle Time per Segment -->
              <div class="cycle-time-section">
                <div class="cycle-time-header">
                  <div class="cycle-time-title">
                    <h3>Tempo de Resolução Por Segmento:</h3>
                    <p>
                      {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }} (média)
                    </p>
                  </div>
                  <div class="cycle-time-filters">
                    <button class="btn btn-outline secondary">
                      Por Departamento
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="cycle-time-content">
                  <div class="cycle-time-info">
                    <p class="info-title">Setores com maior tempo de resolução:</p>
                    <div class="info-list">
                      <div
                        v-for="dept in departmentsWithLongestResolutionTime"
                        :key="dept.departmentId"
                        class="info-item"
                      >
                        <span class="label">{{ dept.departmentName }}</span>
                        <span class="time">{{
                          formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                        }}</span>
                      </div>
                    </div>

                    <p class="info-title mt-4">Setores com menor tempo de resolução:</p>
                    <div class="info-list">
                      <div
                        v-for="dept in departmentsWithShortestResolutionTime"
                        :key="dept.departmentId"
                        class="info-item"
                      >
                        <span class="label">{{ dept.departmentName }}</span>
                        <span class="time">{{
                          formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="cycle-time-chart">
                    <div class="chart-bars">
                      <template v-if="sortedDepartmentsByResolutionTime.length">
                        <div
                          v-for="dept in sortedDepartmentsByResolutionTime"
                          :key="dept.departmentId"
                          class="chart-item"
                        >
                          <span class="chart-label">{{ dept.departmentName }}</span>
                          <div
                            v-if="dept.averageResolutionTimeSeconds > 0"
                            class="chart-bar"
                            :style="{
                              width: `${(dept.averageResolutionTimeSeconds / sortedDepartmentsByResolutionTime[0].averageResolutionTimeSeconds) * 100}%`,
                            }"
                          >
                            {{ formatTimeInSeconds(dept.averageResolutionTimeSeconds) }}
                      </div>
                      </div>
                      </template>
                      </div>
                      </div>
                </div>
              </div>

              <!-- Existing department cards -->
              <div class="departments-grid">
                <div
                  v-for="dept in departmentStats"
                  :key="dept.departmentId"
                  class="department-card"
                >
                  <h4 class="department-title">{{ dept.departmentName }}</h4>
                  <div class="department-stats">
                    <div class="stat-row">
                      <span class="stat-label">Total de Chamados</span>
                      <span class="stat-value">{{ dept.totalTickets }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Chamados Resolvidos</span>
                      <span class="stat-value">{{ dept.resolvedTickets }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Taxa de Resolução</span>
                      <span class="stat-value">{{ formatPercentage(dept.resolutionRate) }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Tempo Médio</span>
                      <span class="stat-value">{{
                        formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Em Andamento -->
            <div v-if="currentTab === 'in-progress'" class="tab-panel">
              <div class="work-in-progress">
                <div class="wip-header">
                  <h2 class="wip-title">EM ANDAMENTO</h2>
                </div>

                <div class="task-list">
                  <div class="task-header">
                    <div class="task-column assignees">RESPONSÁVEL</div>
                    <div class="task-column task-name">TÍTULO DO CHAMADO</div>
                    <div class="task-column workflow-state">STATUS</div>
                    <div class="task-column time-progress">TEMPO EM ANDAMENTO</div>
                  </div>

                  <div v-for="task in inProgressTasks" :key="task.id" class="task-row">
                    <div class="task-column assignees">
                      <div class="avatar-group">
                        <div class="avatar-placeholder">
                          {{ task.assignee?.initials || '?' }}
                        </div>
                      </div>
                    </div>
                    <div class="task-column task-name">
                      <span class="task-title">{{ task.name }}</span>
                    </div>
                    <div class="task-column workflow-state">
                      <span class="status-badge">{{ task.status }}</span>
                    </div>
                    <div class="task-column time-progress">
                      <span class="time-badge">{{ task.timeInProgress }}</span>
                      <font-awesome-icon
                        v-if="task.isOverdue"
                        icon="exclamation-circle"
                        class="overdue-icon"
                        :title="task.overdueReason || 'Ticket atrasado'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Departamentos -->
            <div v-if="currentTab === 'department'" class="tab-panel">
              <!-- Timings by Segment -->
              <div class="timings-section">
                <div class="timings-header">
                  <h2 class="timings-title">TEMPOS POR SETOR</h2>
                  <div class="timings-actions">
                    <button class="btn btn-outline secondary">
                      Por Setor
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="timings-table-container">
                  <table class="timings-table">
                    <thead>
                      <tr>
                        <th>SETOR</th>
                        <th>QUANTIDADE (CONCLUÍDOS)</th>
                        <th>TEMPO DE REAÇÃO (ACEITAÇÃO)</th>
                        <th>TEMPO DE RESOLUÇÃO</th>
                        <th>TEMPO TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dept in departmentStats" :key="dept.departmentId">
                        <td>{{ dept.departmentName }}</td>
                        <td>{{ dept.resolvedTickets }}</td>
                        <td>{{ formatTimeInSeconds(dept.averageAcceptanceTimeSeconds) }}</td>
                        <td>{{ formatTimeInSeconds(dept.averageResolutionTimeSeconds) }}</td>
                        <td>{{ formatTimeInSeconds(dept.averageTotalTimeSeconds) }}</td>
                      </tr>
                      <tr class="summary-row" v-if="departmentStatsSummary">
                        <td>Resumo</td>
                        <td>{{ departmentStatsSummary.totalResolved }}</td>
                        <td>
                          {{
                            formatTimeInSeconds(departmentStatsSummary.averageAcceptanceTimeSeconds)
                          }}
                        </td>
                        <td>
                          {{
                            formatTimeInSeconds(departmentStatsSummary.averageResolutionTimeSeconds)
                          }}
                        </td>
                        <td>
                          {{ formatTimeInSeconds(departmentStatsSummary.averageTotalTimeSeconds) }}
                        </td>
            </tr>
          </tbody>
        </table>
                </div>

                <div class="pagination">
                  <button class="pagination-button active">1</button>
                  <button class="pagination-button">2</button>
                </div>
              </div>

              <!-- Cycle Time per Segment -->
              <div class="cycle-time-section">
                <div class="cycle-time-header">
                  <div class="cycle-time-title">
                    <h3>Tempo de resolução:</h3>
                    <p>
                      {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }} (média)
                    </p>
                  </div>
                </div>

                <div class="cycle-time-content">
                  <div class="cycle-time-info">
                    <p class="info-title">Setores com maior tempo de resolução:</p>
                    <div class="info-list">
                      <div
                        v-for="dept in departmentsWithLongestResolutionTime"
                        :key="dept.departmentId"
                        class="info-item"
                      >
                        <span class="label">{{ dept.departmentName }}</span>
                        <span class="time">{{
                          formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                        }}</span>
                      </div>
                    </div>

                    <p class="info-title mt-4">Setores com menor tempo de resolução:</p>
                    <div class="info-list">
                      <div
                        v-for="dept in departmentsWithShortestResolutionTime"
                        :key="dept.departmentId"
                        class="info-item"
                      >
                        <span class="label">{{ dept.departmentName }}</span>
                        <span class="time">{{
                          formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="cycle-time-chart">
                    <div class="chart-bars">
                      <template v-if="sortedDepartmentsByResolutionTime.length">
                        <div
                          v-for="dept in sortedDepartmentsByResolutionTime"
                          :key="dept.departmentId"
                          class="chart-item"
                        >
                          <span class="chart-label">{{ dept.departmentName }}</span>
                          <div
                            v-if="dept.averageResolutionTimeSeconds > 0"
                            class="chart-bar"
                            :style="{
                              width: `${(dept.averageResolutionTimeSeconds / sortedDepartmentsByResolutionTime[0].averageResolutionTimeSeconds) * 100}%`,
                            }"
                          >
                            {{ formatTimeInSeconds(dept.averageResolutionTimeSeconds) }}
                      </div>
                      </div>
                      </template>
                  </div>
                </div>

                <!-- Existing department cards -->
                <div class="departments-grid">
                  <div
                    v-for="dept in departmentStats"
                    :key="dept.departmentId"
                    class="department-card"
                  >
                    <h4 class="department-title">{{ dept.departmentName }}</h4>
                    <div class="department-stats">
                      <div class="stat-row">
                        <span class="stat-label">Total de Chamados</span>
                        <span class="stat-value">{{ dept.totalTickets }}</span>
                      </div>
                      <div class="stat-row">
                        <span class="stat-label">Chamados Resolvidos</span>
                        <span class="stat-value">{{ dept.resolvedTickets }}</span>
                      </div>
                      <div class="stat-row">
                        <span class="stat-label">Taxa de Resolução</span>
                          <span class="stat-value">{{
                            formatPercentage(dept.resolutionRate)
                          }}</span>
                      </div>
                      <div class="stat-row">
                        <span class="stat-label">Tempo Médio</span>
                          <span class="stat-value">{{
                            formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tendências -->
            <div v-if="currentTab === 'trends'" class="tab-panel">
              <!-- Period Selector at the top of the tab -->
              <div class="stats-period-selector">
                <label for="statsPeriod" class="stats-period-label">Período de análise:</label>
                <select
                  id="statsPeriod"
                  v-model="selectedStatsPeriod"
                  class="stats-period-select"
                  @change="handlePeriodChange"
                >
                  <option value="annual">12 meses</option>
                  <option value="semestral">6 meses</option>
                  <option value="trimestral">3 meses</option>
                  <option value="monthly">Último mês</option>
                  <option value="weekly">Última semana</option>
                </select>
              </div>

              <!-- Nova seção Created vs Completed em Tendências -->
              <div class="created-vs-completed">
                <div class="created-vs-completed-header">
                  <h2>CRIADOS VS CONCLUÍDOS</h2>
                </div>

                <div class="created-vs-completed-content">
                  <div class="created-vs-completed-info">
                    <p class="info-title">Novos tickets criados vs concluídos</p>
                    <p class="info-text" v-if="trendData && trendData.length > 0">
                      <span class="highlight">{{ getTotalResolved() }} tickets</span> concluídos no
                      período selecionado
                    </p>
                    <p
                      class="info-text"
                      v-if="
                        trendData &&
                        trendData.length > 0 &&
                        (createdTrendPercentage !== 0 || resolvedTrendPercentage !== 0)
                      "
                    >
                      <span class="highlight">{{ getTotalCreated() }} tickets</span> criados no
                      período selecionado
                    </p>
                    <p class="info-trend" v-if="trendData && trendData.length > 1">
                      Isso é
                      <span
                        v-if="createdTrendPercentage > 0"
                        :class="createdTrendPercentage >= 0 ? 'trend-value' : 'trend-value-down'"
                      >
                        {{ createdTrendPercentage }}%
                        {{ createdTrendPercentage >= 0 ? 'mais' : 'menos' }} criados
                      </span>
                      <span v-if="createdTrendPercentage > 0 && resolvedTrendPercentage > 0">
                        e
                      </span>
                      <span
                        v-if="resolvedTrendPercentage > 0"
                        :class="resolvedTrendPercentage >= 0 ? 'trend-value' : 'trend-value-down'"
                      >
                        {{ resolvedTrendPercentage }}%
                        {{ resolvedTrendPercentage >= 0 ? 'mais' : 'menos' }} concluídos
                      </span>
                      comparado a
                      <span class="date-reference">{{ firstDate }}</span>
                    </p>
                  </div>

                  <div class="created-vs-completed-chart">
                    <div class="period-selector">
                      <button
                        v-for="period in ['daily', 'weekly', 'monthly']"
                        :key="period"
                        @click="updateTrendPeriod(period as 'daily' | 'weekly' | 'monthly')"
                        :class="['period-button', { active: selectedTrendPeriod === period }]"
                      >
                        {{
                          period === 'daily' ? 'Diário' : period === 'weekly' ? 'Semanal' : 'Mensal'
                        }}
                      </button>
                    </div>
                    <div class="chart-legend" v-if="trendData && trendData.length > 0">
                      <div class="legend-item">
                        <span class="legend-color completed"></span>
                        <span>Concluídos (no período)</span>
                        <span class="legend-value">{{ getTotalResolved() }}</span>
                        <span v-if="resolvedTrendPercentage !== 0" class="legend-trend">
                          {{ resolvedTrendPercentage >= 0 ? '↑' : '↓' }}
                          {{ Math.abs(resolvedTrendPercentage) }}%
                        </span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color created"></span>
                        <span>Criados (no período)</span>
                        <span class="legend-value">{{ getTotalCreated() }}</span>
                        <span v-if="createdTrendPercentage !== 0" class="legend-trend">
                          {{ createdTrendPercentage >= 0 ? '↑' : '↓' }}
                          {{ Math.abs(createdTrendPercentage) }}%
                        </span>
                      </div>
                    </div>

                    <div class="chart-container">
                      <Line
                        v-if="trendData && trendData.length > 0 && trendChartData"
                    :data="trendChartData"
                    :options="chartOptions"
                  />
                  <div v-else class="loading-state">
                    <font-awesome-icon icon="spinner" spin class="loading-icon" />
                    <p class="loading-text">Carregando dados...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nova seção de Cycle Time -->
              <div class="cycle-time-trend">
                <div class="cycle-time-trend-header">
                  <h2>TEMPO DE RESOLUÇÃO POR SEMANA/MÊS/TRIMESTRE (Mocked)</h2>
                  <div class="header-actions">
                    <button class="btn btn-outline secondary">
                      Por Semana
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="cycle-time-info">
                  <p>
                    O tempo de resolução da sua empresa foi de <strong>1d 03h</strong> na semana
                    anterior (isso é <span class="percentage-up">89.4% mais</span> que a semana
                    anterior)
                  </p>
                  <p class="average-info">14 semanas de média semanal: <strong>3h 06m</strong></p>
                </div>

                <div class="cycle-time-chart">
                  <div class="time-axis">
                    <span>2d 00h</span>
                    <span>1d 12h</span>
                    <span>1d 00h</span>
                    <span>12h</span>
                    <span>6h</span>
                    <span>0h</span>
                  </div>
                  <div class="chart-area">
                    <div class="bar-container">
                      <div class="bar" style="height: 85%">
                        <span class="bar-label">1d 18h</span>
                      </div>
                      <span class="week-label">Semana 11</span>
                    </div>
                    <div class="bar-container">
                      <div class="bar" style="height: 65%">
                        <span class="bar-label">1d 03h</span>
                      </div>
                      <span class="week-label">Semana 12</span>
                    </div>
                    <div class="bar-container">
                      <div class="bar" style="height: 45%">
                        <span class="bar-label">16h 30m</span>
                      </div>
                      <span class="week-label">Semana 13</span>
                    </div>
                    <div class="bar-container">
                      <div class="bar" style="height: 75%">
                        <span class="bar-label">1d 12h</span>
                      </div>
                      <span class="week-label">Semana 14</span>
                    </div>
                    <div class="bar-container">
                      <div class="bar" style="height: 35%">
                        <span class="bar-label">14h 22m</span>
                      </div>
                      <span class="week-label">Semana 15</span>
                    </div>
                    <div class="bar-container">
                      <div class="bar" style="height: 25%">
                        <span class="bar-label">11h 48m</span>
                      </div>
                      <span class="week-label">Semana 16</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nova seção de Tempo de Ciclo por Estado do Workflow -->
              <div class="cycle-time-workflow">
                <div class="cycle-time-workflow-header">
                  <h2>TEMPO DE DURAÇÃO POR STATUS</h2>
                </div>

                <div class="workflow-analysis">
                  <div class="workflow-description">
                    <p>
                      Quanto tempo as tarefas permanecem em cada status? Os status em que as tarefas
                      permaneceram mais tempo foram:
                    </p>
                    <div v-if="sortedStatusDurations.length" class="workflow-state-list">
                      <div
                        v-for="(duration, index) in sortedStatusDurations.slice(0, 2)"
                        :key="index"
                        class="state-item"
                      >
                        <span class="state-name">{{
                          formatSnakeToNaturalCase(duration.status)
                        }}</span>
                        <span class="state-time">{{
                          formatTimeInSeconds(duration.averageDurationSeconds)
                        }}</span>
                      </div>
                    </div>
                    <div v-else class="workflow-state-list">
                      <div class="state-item">
                        <span class="state-name">Carregando dados...</span>
                      </div>
                    </div>
                    <p class="workflow-note">
                      Estas são médias para as tarefas concluídas nos últimos 3 meses.
                    </p>
                  </div>

                  <div class="cycle-time-chart">
                    <div class="chart-bars">
                      <template v-if="sortedDepartmentsByResolutionTime.length">
                        <div
                          v-for="(duration, index) in sortedStatusDurations"
                          :key="index"
                          class="chart-item"
                        >
                          <span class="chart-label">{{
                            formatSnakeToNaturalCase(duration.status)
                          }}</span>
                          <div
                            v-if="duration.averageDurationSeconds > 0"
                            class="chart-bar"
                            :style="{
                              width: `${(duration.averageDurationSeconds / sortedStatusDurations[0].averageDurationSeconds) * 100}%`,
                            }"
                          >
                            {{ formatTimeInSeconds(duration.averageDurationSeconds) }}
                      </div>
                      </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Seção de Ciclo de Tempo Em Andamento -->
              <div class="cycle-time-progress">
                <div class="cycle-time-progress-header">
                  <h2>TEMPO GASTO NO STATUS "EM ANDAMENTO" (Mocked)</h2>
                </div>

                <div class="progress-analysis">
                  <div class="progress-info">
                    <p>
                      O tempo médio foi de
                      <strong>18h 29m</strong> para os
                      <span class="highlight">50 tasks</span> completados durante os últimos
                      <span class="highlight">3 meses</span>.
                    </p>
                    <p class="trend-info">
                      Isso é <span class="percentage-up">100% mais</span> que em 16 de Janeiro, 2025
                      (aumento é considerado ruim).
                    </p>
                  </div>

                  <div class="progress-chart">
                    <div class="time-axis">
                      <span>21h</span>
                      <span>19h</span>
                      <span>17h</span>
                      <span>15h</span>
                      <span>13h</span>
                      <span>11h</span>
                      <span>9h</span>
                      <span>7h</span>
                      <span>5h</span>
                      <span>3h</span>
                      <span>1h</span>
                    </div>
                    <div class="chart-area">
                      <div class="trend-line">
                        <svg class="line-chart" viewBox="0 0 800 200" preserveAspectRatio="none">
                          <path
                            d="M0,180 L100,175 L200,170 L300,165 L400,160 L500,140 L600,100 L700,50 L800,30"
                            class="trend-path"
                          />
                        </svg>
                      </div>
                      <div class="date-axis">
                        <span>Jan 16</span>
                        <span>Jan 28</span>
                        <span>Feb 5</span>
                        <span>Feb 15</span>
                        <span>Mar 2</span>
                        <span>Mar 17</span>
                        <span>Mar 27</span>
                        <span>Abr 11</span>
                        <span>Abr 16</span>
                      </div>
                    </div>
                  </div>

                  <div class="progress-stats" v-if="inProgressDuration">
                    <div class="stat-item">
                      <span class="stat-value">{{
                        formatTimeInSeconds(inProgressDuration.averageDurationSeconds)
                      }}</span>
                      <span class="stat-label">Média últimos 3 meses</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-value">{{ inProgressDuration.count }}</span>
                      <span class="stat-label">Número de tickets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Análise por Período -->
            <div v-if="currentTab === 'custom'" class="tab-panel">
              <div class="report-filters">
                <div class="filter-group">
                  <label class="filter-label">Data Inicial</label>
                  <DatePicker
                    v-model="dateRange.start"
                    :format="formatDate"
                    :placeholder="'Selecione uma data'"
                    :clearable="false"
                    :editable="false"
                    :disabled-date="disabledDate"
                    :max-date="new Date()"
                    :min-date="new Date(2023, 0, 1)"
                    :value-type="'format'"
                    :input-class="'date-picker'"
                    :placeholder-class="'placeholder-class'"
                    :clear-icon="false"
                    :confirm="false"
                  />
                </div>
                <div class="filter-group">
                  <label class="filter-label">Data Final</label>
                  <DatePicker
                    v-model="dateRange.end"
                    :format="formatDate"
                    :placeholder="'Selecione uma data'"
                    :clearable="false"
                    :editable="false"
                    :disabled-date="disabledDate"
                    :max-date="new Date()"
                    :min-date="new Date(2023, 0, 1)"
                    :value-type="'format'"
                    :input-class="'date-picker'"
                    :placeholder-class="'placeholder-class'"
                    :clear-icon="false"
                    :confirm="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'vue-chartjs';
import { formatDate, formatDateToPortuguese } from '@/utils/date';
import { reportService } from '@/services/reportService';
import { ticketService } from '@/services/ticketService';
import type {
  TenantStatistics,
  StatusDurationDto,
  StatusDurationResponseDto,
  DepartmentStats,
} from '@/services/reportService';
import { TicketActionType, TicketStatus, type TicketUpdate } from '@/models';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import {
  formatSnakeToNaturalCase,
  formatTimeCompact,
  formatTimeInSeconds,
} from '@/utils/generic-helper';
//import type { TicketStatus, TicketPriority } from '@/models';

// Define the StatsPeriod enum
enum StatsPeriod {
  ANNUAL = 'annual',
  SEMESTRAL = 'semestral',
  TRIMESTRAL = 'trimestral',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

// Default to 3 months period
const selectedStatsPeriod = ref<string>(StatsPeriod.TRIMESTRAL);

// Chart.js setup
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler,
);

// Local type definitions
type CustomTicketStatus = 'Em andamento' | 'Finalizado' | 'Atrasado' | 'Outro';
type TicketPriority = 'Alta' | 'Média' | 'Baixa';

interface ChartData {
  labels: string[];
  data: number[];
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context: { raw: unknown }): string => {
          const value = context.raw;
          if (typeof value === 'number') {
            return ` ${value} tickets`;
          }
          return String(value);
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        font: {
          size: 12,
        },
        stepSize: 1,
      },
    },
  },
};

const statistics = ref<TenantStatistics>();

const loading = ref(true);
const error = ref<string | null>(null);

const ticketsByStatus = ref<ChartData>({
  labels: [],
  data: [],
});

const ticketsByPriority = ref<ChartData>({
  labels: [],
  data: [],
});

const recentTickets = ref<
  { customId: string; name: string; status: string; priority: string; createdAt: string }[]
>([]);

const statusClassMap: Record<CustomTicketStatus, string> = {
  'Em andamento': 'bg-yellow-100 text-yellow-800',
  Finalizado: 'bg-green-100 text-green-800',
  Atrasado: 'bg-red-100 text-red-800',
  Outro: 'bg-gray-100 text-gray-800',
};

const getStatusClass = (status: string): string => {
  return statusClassMap[status as CustomTicketStatus] || 'bg-gray-100 text-gray-800';
};

const priorityClassMap: Record<TicketPriority, string> = {
  Alta: 'bg-red-100 text-red-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Baixa: 'bg-blue-100 text-blue-800',
};

const getPriorityClass = (priority: string): string => {
  return priorityClassMap[priority as TicketPriority] || 'bg-blue-100 text-blue-800';
};

// Add ref for status durations
const statusDurations = ref<StatusDurationDto[]>([]);
const departmentData = ref<DepartmentStats[]>([]);

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const [
      statsData,
      trends,
      statusResult,
      priorityResult,
      recentTicketsResult,
      statusDurationsResult,
      departmentStatsResult,
    ] = await Promise.all([
      reportService.getTenantStatistics(),
      reportService.getTicketTrends(selectedTrendPeriod.value),
      reportService.getTicketsByStatus(),
      reportService.getTicketsByPriority(),
      ticketService.getTenantRecentTickets(10),
      reportService.getStatusDurations(selectedStatsPeriod.value),
      reportService.getTenantDepartmentsStatistics(),
    ]);

    // Initialize trendData with the current period data
    trendData.value = trends[selectedTrendPeriod.value];

    // Store status durations
    statusDurations.value = (statusDurationsResult as StatusDurationResponseDto).statusDurations;

    // Store department data - directly from the API response
    departmentData.value = departmentStatsResult;

    // Transform status data from API into ChartData format
    ticketsByStatus.value = {
      labels: statusResult.statusCounts.map((item: { status: string; count: number }) => {
        // Map enum values to readable text
        const statusLabels: Record<string, string> = {
          pendente: 'Pendente',
          em_andamento: 'Em andamento',
          finalizado: 'Finalizado',
          cancelado: 'Cancelado',
          devolvido: 'Devolvido',
          aguardando_verificação: 'Aguardando Verificação',
          em_verificação: 'Em Verificação',
          reprovado: 'Reprovado',
        };
        return statusLabels[item.status] || item.status;
      }),
      data: statusResult.statusCounts.map((item: { status: string; count: number }) => item.count),
    };

    // Transform priority data from API into ChartData format
    ticketsByPriority.value = {
      labels: priorityResult.priorityCounts.map((item: { priority: string; count: number }) => {
        // Map enum values to readable text
        const priorityLabels: Record<string, string> = {
          baixa: 'Baixa',
          média: 'Média',
          alta: 'Alta',
        };
        return priorityLabels[item.priority] || item.priority;
      }),
      data: priorityResult.priorityCounts.map(
        (item: { priority: string; count: number }) => item.count,
      ),
    };

    // Mock recent tickets

    // Assign the mock tickets to the ref
    recentTickets.value = recentTicketsResult.data.items;

    statistics.value = statsData;
    if (statistics.value) {
      statistics.value.ticketTrends = trends;
    }
  } catch (err: unknown) {
    console.error('Erro ao carregar dados dos relatórios:', err);
    error.value = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();

  // If starting on the in-progress tab, load those tickets too
  if (currentTab.value === 'in-progress') {
    loadInProgressTasks();
  }
});

const tabs = [
  { id: 'overview', name: 'Visão Geral', icon: 'chart-pie' },
  { id: 'in-progress', name: 'Em Andamento', icon: 'clock' },
  { id: 'department', name: 'Setores', icon: 'building' },
  { id: 'trends', name: 'Tendências', icon: 'chart-line' },
  { id: 'custom', name: 'Análise por Período', icon: 'calendar' },
];

const currentTab = ref('overview');
const pollingInterval = ref<number | null>(null);

// Function to start polling
const startPolling = () => {
  // Clear any existing interval first
  stopPolling();

  // Set up new polling interval - refresh every 60 seconds
  pollingInterval.value = window.setInterval(() => {
    if (currentTab.value === 'in-progress') {
      loadInProgressTasks();
    }
  }, 60000); // 60 seconds
};

// Function to stop polling
const stopPolling = () => {
  if (pollingInterval.value !== null) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

// Watch for tab changes to load tab-specific data
watch(currentTab, (newTab) => {
  if (newTab === 'in-progress') {
    loadInProgressTasks();
    startPolling();
  } else {
    stopPolling();
  }
});

// Clean up on component unmount
onUnmounted(() => {
  stopPolling();
});

// Computed Properties para os Gráficos
const statusChartData = computed(() => ({
  labels: ticketsByStatus.value.labels,
  datasets: [
    {
    data: ticketsByStatus.value.data,
      backgroundColor: [
        '#2563eb',
        '#eab308',
        '#09f1f9',
        '#9333ea',
        '#22c55e',
        '#f21010',
        '#631818',
        '#fc7405',
      ],
      borderWidth: 0,
    },
  ],
}));

const priorityChartData = computed(() => ({
  labels: ticketsByPriority.value.labels,
  datasets: [
    {
      label: 'Quantidade de Tickets',
    data: ticketsByPriority.value.data,
    backgroundColor: ['#ef4444', '#eab308', '#2563eb'],
      borderWidth: 0,
    },
  ],
}));

// Keep selectedTrendPeriod for chart trend data
const selectedTrendPeriod = ref<'daily' | 'weekly' | 'monthly'>('weekly');
const trendData = ref<{ date: string; total: number; resolved: number; created: number }[]>([]);

const trendChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) return null;

  return {
    labels: trendData.value.map((item) => formatDateToPortuguese(item.date)),
    datasets: [
      {
        label: 'Total de Chamados',
        data: trendData.value.map((item) => item.total),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Chamados Resolvidos',
        data: trendData.value.map((item) => item.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Novos Chamados',
        data: trendData.value.map((item) => item.created),
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

// Dados para o gráfico Created vs Completed
const createdVsCompletedChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) {
    // Return an empty but valid chart data structure when there's no data
    return {
      labels: [],
      datasets: [
        {
          label: 'Concluídos (no período)',
          data: [],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Criados (no período)',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  return {
    labels: trendData.value.map((item) => formatDateToPortuguese(item.date)),
    datasets: [
      {
        label: 'Concluídos (no período)',
        data: trendData.value.map((item) => item.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Criados (no período)',
        data: trendData.value.map((item) => item.created),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

// Funções Auxiliares
const formatPercentage = (value?: number) => {
  if (value === undefined) return '0.0%';
  return `${(value * 100).toFixed(1)}%`;
};

const disabledDate = (date: Date) => {
  return date > new Date() || date < new Date(2023, 0, 1);
};

const updateTrendPeriod = async (period: 'daily' | 'weekly' | 'monthly') => {
  selectedTrendPeriod.value = period;

  try {
    const data = await reportService.getTicketTrends(period);
    trendData.value = data[period];

    // Just update the UI by triggering reactivity
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 300);
  } catch (err: unknown) {
    console.error('Erro ao carregar tendências:', err);
    error.value = 'Erro ao carregar dados de tendências. Por favor, tente novamente.';
  }
};

const dateRange = ref({
  start: '',
  end: '',
});

// Computed Properties para Métricas
const departmentStats = computed(() => departmentData.value);

const sortedDepartmentsByResolutionTime = computed(() => {
  if (!departmentStats.value) return [];

  return [...departmentStats.value].sort(
    (a, b) => b.averageResolutionTimeSeconds - a.averageResolutionTimeSeconds,
  );
});

const departmentsWithLongestResolutionTime = computed(() =>
  sortedDepartmentsByResolutionTime.value.slice(0, 3),
);

const departmentsWithShortestResolutionTime = computed(() => {
  if (!sortedDepartmentsByResolutionTime.value.length) return [];
  return [...sortedDepartmentsByResolutionTime.value]
    .sort((a, b) => a.averageResolutionTimeSeconds - b.averageResolutionTimeSeconds)
    .slice(0, 3);
});

const inProgressTasks = ref<
  {
    id: number;
    customId: string;
    name: string;
    assignee: {
      name: string;
      initials: string;
    };
    status: string;
    timeInProgress: string;
    isOverdue: boolean;
    overdueReason?: string;
    timeInProgressSeconds: number;
  }[]
>([]);

// Function to load in-progress tickets
const loadInProgressTasks = async () => {
  try {
    const response = await ticketService.fetch({
      status: TicketStatus.InProgress, // Using type assertion for now
      limit: 10,
    });

    if (!response.data || !Array.isArray(response.data.items)) {
      console.error('Invalid response format for in-progress tickets');
    return;
  }

    const transformedTasks = [];

    for (const ticket of response.data.items) {
      try {
        // Find status updates in the ticket history
        const statusUpdates =
          ticket.updates?.filter(
            (update: TicketUpdate) =>
              update.action === TicketActionType.StatusUpdate &&
              update.toStatus === TicketStatus.InProgress,
          ) || [];

        const lastStatusUpdate =
          statusUpdates.length > 0
            ? statusUpdates.sort(
                (a: TicketUpdate, b: TicketUpdate) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )[0]
            : null;

        let timeInProgress = 'Desconhecido';
        let isOverdue = false;
        let overdueReason: string | undefined = undefined;
        let diffInSeconds = 0;

        if (lastStatusUpdate) {
          const startDate = new Date(lastStatusUpdate.createdAt);
          const now = new Date();
          diffInSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);

          timeInProgress = formatTimeCompact(diffInSeconds);

          if (ticket.dueAt) {
            const dueDate = new Date(ticket.dueAt);
            isOverdue = now > dueDate;
            if (isOverdue) {
              overdueReason = `Prazo de entrega expirado em ${formatDateToPortuguese(ticket.dueAt)}`;
            }
          } else {
            // If no dueAt is set, consider it overdue if in progress for more than 5 days
            // This is a fallback warning mechanism for tickets without explicit due dates
            const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;
            isOverdue = diffInSeconds > FIVE_DAYS_IN_SECONDS;
            if (isOverdue) {
              overdueReason = 'Em andamento por mais de 5 dias sem prazo definido';
            }
          }
        }

        // Get assignee info
        let assignee = {
          name: 'Não atribuído',
          initials: 'NA',
        };

        if (ticket.targetUser) {
          const name =
            `${ticket.targetUser.firstName} ${ticket.targetUser.lastName}` ||
            ticket.targetUser.email ||
            'Anônimo';
          const initials = name
            .split(' ')
            .map((n: string) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          assignee = {
            name,
            initials,
          };
        }

        transformedTasks.push({
          id: ticket.id,
          customId: ticket.customId || `TK-${ticket.id}`,
          name: ticket.name,
          assignee,
          status: formatSnakeToNaturalCase(ticket.status),
          timeInProgress,
          isOverdue,
          overdueReason,
          timeInProgressSeconds: diffInSeconds,
        });
  } catch (error) {
        console.error('Error processing in-progress ticket:', error);
      }
    }

    // Sort the tasks by time in progress (descending order)
    transformedTasks.sort((a, b) => b.timeInProgressSeconds - a.timeInProgressSeconds);

    inProgressTasks.value = transformedTasks;
  } catch (err) {
    console.error('Error loading in-progress tickets:', err);
  }
};

const departmentStatsSummary = computed(() => {
  if (!departmentStats.value?.length) return null;

  const totalTickets = departmentStats.value.reduce(
    (sum: number, dept: DepartmentStats) => sum + dept.totalTickets,
    0,
  );
  const totalResolved = departmentStats.value.reduce(
    (sum: number, dept: DepartmentStats) => sum + dept.resolvedTickets,
    0,
  );

  const totalResolutionTime = departmentStats.value.reduce(
    (sum: number, dept: DepartmentStats) =>
      sum + dept.averageResolutionTimeSeconds * dept.resolvedTickets,
    0,
  );
  const totalAcceptanceTime = departmentStats.value.reduce(
    (sum: number, dept: DepartmentStats) =>
      sum + dept.averageAcceptanceTimeSeconds * dept.resolvedTickets,
    0,
  );
  const totalTotalTime = departmentStats.value.reduce(
    (sum: number, dept: DepartmentStats) =>
      sum + dept.averageTotalTimeSeconds * dept.resolvedTickets,
    0,
  );

  return {
    totalTickets,
    totalResolved,
    averageResolutionTimeSeconds: totalResolved ? totalResolutionTime / totalResolved : 0,
    averageAcceptanceTimeSeconds: totalResolved ? totalAcceptanceTime / totalResolved : 0,
    averageTotalTimeSeconds: totalResolved ? totalTotalTime / totalResolved : 0,
  };
});

const sortedStatusDurations = computed(() => {
  return [...statusDurations.value].sort(
    (a, b) => b.averageDurationSeconds - a.averageDurationSeconds,
  );
});

const inProgressDuration = computed(() => {
  return (
    statusDurations.value.find((duration) => duration.status.toLowerCase() === 'em_andamento') ||
    null
  );
});

const handlePeriodChange = () => {
  loadData();
};

const getTotalResolved = () => {
  return trendData.value?.reduce((total, item) => total + item.resolved, 0) || 0;
};

const getTotalCreated = () => {
  return trendData.value?.reduce((total, item) => total + item.created, 0) || 0;
};

const createdTrendPercentage = computed(() => {
  if (!trendData.value || trendData.value.length < 2) return 0;

  const firstItem = trendData.value[0];
  const lastItem = trendData.value[trendData.value.length - 1];

  if (firstItem.created === 0) {
    return lastItem.created > 0 ? 100 : 0;
  }

  const percentage = ((lastItem.created - firstItem.created) / firstItem.created) * 100;
  return Math.round(percentage);
});

const resolvedTrendPercentage = computed(() => {
  if (!trendData.value || trendData.value.length < 2) return 0;

  const firstItem = trendData.value[0];
  const lastItem = trendData.value[trendData.value.length - 1];

  if (firstItem.resolved === 0) {
    return lastItem.resolved > 0 ? 100 : 0;
  }

  const percentage = ((lastItem.resolved - firstItem.resolved) / firstItem.resolved) * 100;
  return Math.round(percentage);
});

const firstDate = computed(() => {
  if (!trendData.value || trendData.value.length === 0) return '';
  return formatDateToPortuguese(trendData.value[0].date);
});
</script>

<style scoped>
.reports-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-modal {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.loading-icon {
  color: #2563eb;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.loading-text {
  color: #4b5563;
}

/* Error State */
.error-message {
  margin: 1.5rem;
}

.error-content {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 1rem;
  border-radius: 0.375rem;
}

.error-header {
  display: flex;
  align-items: center;
}

.error-icon {
  color: #ef4444;
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.error-title {
  color: #b91c1c;
  font-weight: 500;
}

.error-text {
  color: #dc2626;
  margin-top: 0.25rem;
}

.error-action {
  margin-left: auto;
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.error-action:hover {
  background-color: #fecaca;
}

/* Header */
.header {
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  font-size: 0.75rem;
}

.breadcrumb-active {
  color: #2563eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.header-subtitle {
  color: #4b5563;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-outline {
  border: 1px solid;
}

.btn-outline.primary {
  border-color: #2563eb;
  color: #2563eb;
}

.btn-outline.primary:hover {
  background-color: #eff6ff;
}

.btn-outline.secondary {
  border-color: #6b7280;
  color: #6b7280;
}

.btn-outline.secondary:hover {
  background-color: #f3f4f6;
}

/* Content */
.content {
  padding: 0 1.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.metric-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border-left-width: 4px;
}

.metric-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 0.25rem;
}

.metric-icon {
  padding: 0.75rem;
  border-radius: 9999px;
}

/* Border Colors */
.blue-border {
  border-left-color: #2563eb;
}

.yellow-border {
  border-left-color: #eab308;
}

.green-border {
  border-left-color: #22c55e;
}

.purple-border {
  border-left-color: #9333ea;
}

/* Icon Colors */
.metric-icon.blue {
  background-color: #eff6ff;
  color: #2563eb;
}

.metric-icon.yellow {
  background-color: #fefce8;
  color: #eab308;
}

.metric-icon.green {
  background-color: #f0fdf4;
  color: #22c55e;
}

.metric-icon.purple {
  background-color: #faf5ff;
  color: #9333ea;
}

/* Tabs */
.tabs-container {
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.tabs-header {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.tabs-nav {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.tab-button {
  position: relative;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.tab-button svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.tab-button:hover {
  color: #2563eb;
  background-color: #ffffff;
}

.tab-button:hover svg {
  transform: scale(1.1);
}

.tab-button.active {
  color: #2563eb;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-button.active svg {
  color: #2563eb;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #2563eb;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-button.active::after {
  transform: scaleX(1);
}

.tab-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0 0 0.75rem 0.75rem;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-icon {
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
}

.chart-container {
  height: 20rem;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-state .loading-icon {
  color: #9ca3af;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.loading-state .loading-text {
  color: #6b7280;
}

/* Table */
.table-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.table-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.table-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  background-color: #f9fafb;
}

.table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
}

.table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

/* Status and Priority Badges */
.status-badge,
.priority-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Departments */
.departments-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .departments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .departments-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.department-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.department-title {
  font-weight: 500;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.department-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
}

/* Period Selector */
.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  color: #4b5563;
  transition: all 0.2s;
}

.period-button:hover {
  background-color: #e5e7eb;
}

.period-button.active {
  background-color: #dbeafe;
  color: #2563eb;
}

/* Date Picker */
.date-picker-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-picker {
  width: 12rem;
}

/* Charts and Reports */
.chart-wrapper {
  position: relative;
  height: 100%;
  min-height: 300px;
  padding: 1rem;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
}

.chart-tooltip {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
}

.tooltip-header {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.tooltip-value {
  color: #4b5563;
}

/* Report Cards */
.report-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.report-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.report-content {
  margin-top: 1rem;
}

.report-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.trend-up {
  color: #22c55e;
}

.trend-down {
  color: #ef4444;
}

.trend-neutral {
  color: #6b7280;
}

/* Report Filters */
.report-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #1f2937;
  font-size: 0.875rem;
  min-width: 200px;
}

.filter-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* Report Table */
.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.report-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.report-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

.report-table tr:hover {
  background-color: #f9fafb;
}

/* Report Pagination */
.report-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button.active {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* Report Export */
.export-options {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.export-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.export-button:hover {
  background-color: #f3f4f6;
}

.export-icon {
  font-size: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .report-metrics {
    grid-template-columns: 1fr;
  }

  .report-filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .report-table {
    display: block;
    overflow-x: auto;
  }

  .report-pagination {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }
}

/* Work in Progress */
.work-in-progress {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.wip-header {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.wip-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.task-list {
  width: 100%;
}

.task-header {
  display: grid;
  grid-template-columns: 120px 1fr 150px 150px;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.task-row {
  display: grid;
  grid-template-columns: 120px 1fr 150px 150px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.task-row:hover {
  background-color: #f9fafb;
}

.task-column {
  display: flex;
  align-items: center;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.task-title {
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}

.task-title:hover {
  text-decoration: underline;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.time-badge {
  font-size: 0.875rem;
  color: #4b5563;
  margin-right: 0.5rem;
}

.overdue-icon {
  color: #ef4444;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .task-header,
  .task-row {
    grid-template-columns: 80px 1fr 120px;
  }

  .time-progress {
    display: none;
  }
}

/* Timings Section */
.timings-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.timings-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.timings-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.timings-actions {
  display: flex;
  gap: 0.75rem;
}

.timings-table-container {
  overflow-x: auto;
}

.timings-table {
  width: 100%;
  border-collapse: collapse;
}

.timings-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.timings-table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

.timings-table tr:hover:not(.summary-row) {
  background-color: #f9fafb;
}

.summary-row {
  background-color: #f9fafb;
  font-weight: 600;
}

.summary-row td {
  border-top: 2px solid #e5e7eb;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  justify-content: center;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button.active {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* Cycle Time Section */
.cycle-time-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  padding: 1.5rem;
}

.cycle-time-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cycle-time-title h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cycle-time-filters {
  display: flex;
  gap: 1rem;
}

.cycle-time-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.cycle-time-info {
  padding-right: 2rem;
  border-right: 1px solid #e5e7eb;
}

.info-title {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.info-item .label {
  color: #374151;
  font-weight: 500;
}

.info-item .time {
  color: #6b7280;
}

.mt-4 {
  margin-top: 1.5rem;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chart-label {
  min-width: 120px;
  font-size: 0.875rem;
  color: #374151;
}

.chart-bar {
  height: 24px;
  background-color: #10b981;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: width 0.3s ease;
}

/* Cycle Time Trend Styles */
.cycle-time-trend {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cycle-time-trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.cycle-time-trend-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.05em;
}

.cycle-time-info {
  margin-bottom: 2rem;
}

.cycle-time-info p {
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.cycle-time-info strong {
  color: #111827;
  font-weight: 600;
}

.percentage-up {
  color: #ef4444;
  font-weight: 500;
}

.average-info {
  color: #6b7280;
  margin-top: 0.5rem;
}

.cycle-time-chart {
  display: flex;
  height: 300px;
  margin-top: 1rem;
}

.time-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
  margin-right: 1.5rem;
  color: #6b7280;
  font-size: 0.75rem;
  border-right: 1px solid #e5e7eb;
  min-width: 60px;
}

.chart-area {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1rem 1rem;
  position: relative;
}

.chart-area::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    #f3f4f6 0%,
    #f3f4f6 1px,
    transparent 1px,
    transparent 20%
  );
  pointer-events: none;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  position: relative;
}

.bar {
  width: 40px;
  background-color: #60a5fa;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  min-height: 4px;
}

.bar:hover {
  background-color: #3b82f6;
  width: 48px;
}

.bar-label {
  position: absolute;
  top: -1.8rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
  background-color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.week-label {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Cycle Time Workflow Styles */
.cycle-time-workflow {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cycle-time-workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.cycle-time-workflow-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.workflow-analysis {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}

.workflow-description p {
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.5;
}

.workflow-state-list {
  margin: 16px 0;
}

.status-chart-item {
  background-color: blue;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.state-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.state-name {
  color: #1f2937;
  font-weight: 500;
}

.state-time {
  color: #6b7280;
}

.workflow-note {
  font-size: 0.875rem;
  color: #6b7280;
}

.workflow-chart {
  display: flex;
  gap: 16px;
}

.time-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.chart-bars {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-label {
  width: 150px;
  color: #1f2937;
  font-weight: 500;
}

.bar {
  height: 24px;
  background: #22c55e;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Cycle Time Progress Styles */
.cycle-time-progress {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: block; /* Garantir que a seção seja exibida como bloco */
}

.cycle-time-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.cycle-time-progress-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.05em;
}

.progress-analysis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-info {
  color: #374151;
  line-height: 1.5;
}

.progress-info p {
  margin-bottom: 0.75rem;
}

.progress-info strong {
  color: #111827;
  font-weight: 600;
}

.highlight {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
}

.trend-info {
  font-size: 0.925rem;
}

.percentage-up {
  color: #ef4444;
  font-weight: 500;
}

.note-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.progress-chart {
  height: 300px;
  margin: 1.5rem 0;
  display: flex;
  position: relative;
  border-left: 1px solid #e5e7eb;
}

.trend-line {
  flex: 1;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.line-chart {
  width: 100%;
  height: 100%;
  display: block;
}

.trend-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.date-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.time-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
  min-width: 60px;
  margin-right: 0.5rem;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Created vs Completed Styles */
.created-vs-completed {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.created-vs-completed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.created-vs-completed-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.05em;
}

.created-vs-completed-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.created-vs-completed-info {
  padding-right: 2rem;
  border-right: 1px solid #e5e7eb;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.info-text {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.info-trend {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1rem;
}

.highlight {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
}

.trend-value {
  color: #22c55e;
  font-weight: 500;
}

.trend-value-down {
  color: #ef4444;
  font-weight: 500;
}

.date-reference {
  color: #6b7280;
  font-style: italic;
}

.created-vs-completed-chart {
  flex: 1;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.completed {
  background-color: #22c55e;
}

.legend-color.created {
  background-color: #3b82f6;
}

.legend-value {
  font-weight: 600;
  color: #374151;
}

.legend-trend {
  color: #22c55e;
  font-weight: 500;
}

.chart-container {
  height: 300px;
  position: relative;
}

@media (max-width: 1024px) {
  .created-vs-completed-content {
    grid-template-columns: 1fr;
  }

  .created-vs-completed-info {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
  color: #6b7280;
  font-size: 0.875rem;
  background-color: rgba(249, 250, 251, 0.5);
}

/* Stats Period Selector Styles */
.stats-period-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stats-period-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-right: 0.5rem;
}

.stats-period-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #1f2937;
  font-size: 0.875rem;
  max-width: 150px;
}

.stats-period-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}
</style>
