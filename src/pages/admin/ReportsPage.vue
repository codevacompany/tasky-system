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
            <button @click="exportToCSV" class="btn btn-primary">
              <font-awesome-icon icon="file-export" />
              Exportar Relatório
            </button>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- Cards de Métricas -->
        <div class="metrics-grid">
          <div class="reports-card blue-border">
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

          <div class="reports-card yellow-border">
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

          <div class="reports-card green-border">
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

          <div class="reports-card purple-border">
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
              <div class="reports-card created-vs-completed">
                <div class="created-vs-completed-header">
                  <h2>CRIADOS VS CONCLUÍDOS</h2>
                  <TabSelector
                    v-model="selectedTrendPeriod"
                    :options="[
                      { value: 'daily', label: 'Diário' },
                      { value: 'weekly', label: 'Semanal' },
                      { value: 'monthly', label: 'Mensal' },
                    ]"
                    @update:modelValue="updateTrendPeriod"
                  />
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
                    <div class="chart-container">
                      <Line
                        v-if="trendData && trendData.length > 0"
                        :data="createdVsCompletedChartData"
                        :options="createdVsCompletedChartOptions"
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
                <div class="reports-card status-chart-flex">
                  <div class="chart-header">
                    <h2 class="chart-title">Distribuição por Status</h2>
                    <div class="chart-icon">
                      <font-awesome-icon icon="chart-pie" />
                    </div>
                  </div>
                  <div class="status-chart-row">
                    <div class="chart-container">
                      <div class="chart-wrapper">
                        <Doughnut
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
                    <div class="status-custom-legend">
                      <div
                        v-for="(label, idx) in statusChartData.labels"
                        :key="label"
                        class="legend-item"
                      >
                        <span
                          class="legend-color"
                          :style="{
                            backgroundColor: statusChartData.datasets[0].backgroundColor[idx],
                          }"
                        ></span>
                        <span class="legend-label">{{ label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gráfico de Prioridade -->
                <div class="reports-card status-chart-flex">
                  <div class="chart-header">
                    <h2 class="chart-title">Distribuição por Prioridade</h2>
                    <div class="chart-icon">
                      <font-awesome-icon icon="chart-bar" />
                    </div>
                  </div>
                  <div class="status-chart-row">
                    <div class="chart-container">
                      <div class="chart-wrapper">
                        <Doughnut
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
                    <div class="status-custom-legend">
                      <div
                        v-for="(label, idx) in priorityChartData.labels"
                        :key="label"
                        class="legend-item"
                      >
                        <span
                          class="legend-color"
                          :style="{
                            backgroundColor: priorityChartData.datasets[0].backgroundColor[idx],
                          }"
                        ></span>
                        <span class="legend-label">{{ label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabela -->
              <div class="reports-card reports-table-container">
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

              <div class="charts-grid cycle-time-section">
                <!-- Cycle Time per Segment -->
                <div class="reports-card">
                  <div class="cycle-time-header">
                    <div class="cycle-time-title">
                      <h3>Tempo de Resolução Por Segmento:</h3>
                      <p>
                        {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }} (média)
                      </p>
                    </div>
                    <div>
                      <Select
                        :options="[
                          { value: 'department', label: 'Por Setor' },
                          { value: 'priority', label: 'Por Prioridade' },
                        ]"
                        v-model="selectedCycleTimeFilter"
                      />
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
                              class="chart-bar"
                              :class="{
                                'short-bar':
                                  dept.averageResolutionTimeSeconds /
                                    sortedDepartmentsByResolutionTime[0]
                                      .averageResolutionTimeSeconds <
                                  0.05,
                                'zero-bar': dept.averageResolutionTimeSeconds === 0,
                              }"
                              :style="{
                                width:
                                  dept.averageResolutionTimeSeconds === 0
                                    ? '3px'
                                    : `${(dept.averageResolutionTimeSeconds / sortedDepartmentsByResolutionTime[0].averageResolutionTimeSeconds) * 100}%`,
                              }"
                              :data-duration="
                                formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds)
                              "
                            >
                              {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds) }}
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Top Colaboradores -->
                <div class="reports-card top-contributors-card">
                  <div class="top-contributors-header">
                    <h2 class="top-contributors-title">Top Colaboradores</h2>
                    <p class="top-contributors-subtitle">Últimos 3 meses</p>
                  </div>

                  <div class="top-contributors-table">
                    <!-- Table Headers -->
                    <div class="contributors-table-header">
                      <div class="header-profile">Perfil</div>
                      <div class="header-tickets">Tickets resolvidos</div>
                      <div class="header-rate">Taxa de resolução</div>
                      <div class="header-total">Tickets totais</div>
                    </div>

                    <!-- Table Content -->
                    <div
                      v-if="topUsers && topUsers.users.length > 0"
                      class="contributors-table-body"
                    >
                      <div
                        v-for="user in topUsers.users"
                        :key="user.userId"
                        class="contributor-row"
                      >
                        <div class="contributor-profile">
                          <div class="contributor-avatar" :class="getAvatarColorClass(user.userId)">
                            <div v-if="!user.avatarUrl" class="avatar-placeholder">
                              {{ getInitials(user.firstName, user.lastName) }}
                            </div>
                            <img
                              v-else
                              :src="user.avatarUrl"
                              :alt="user.firstName"
                              class="avatar-image"
                            />
                          </div>
                          <div class="contributor-info">
                            <h4 class="contributor-name">
                              {{ user.firstName }} {{ user.lastName }}
                            </h4>
                            <p class="contributor-role">{{ user.departmentName }}</p>
                          </div>
                        </div>

                        <div class="contributor-tickets">
                          <span class="ticket-count">{{ user.resolvedTickets }}</span>
                        </div>

                        <div class="contributor-rate">
                          <span
                            :class="[
                              'status-indicator',
                              getResolutionRateClass(user.resolutionRate),
                            ]"
                          >
                            {{ formatPercentage(user.resolutionRate) }}
                          </span>
                        </div>

                        <div class="contributor-total">
                          <span class="total-count">{{ user.totalTickets }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="loading" class="loading-contributors">
                      <font-awesome-icon icon="spinner" spin class="loading-icon" />
                      <p>Carregando colaboradores...</p>
                    </div>

                    <div v-else class="no-contributors">
                      <p>Nenhum colaborador encontrado nos últimos 3 meses.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Existing department cards -->
              <div class="departments-grid">
                <div
                  v-for="dept in departmentStats"
                  :key="dept.departmentId"
                  class="reports-card department-card-modern"
                >
                  <div class="department-card-header">
                    <div
                      class="department-icon"
                      :style="{ background: '#2563eb20', color: '#2563eb' }"
                    >
                      <font-awesome-icon icon="building" />
                    </div>
                    <h4 class="department-title">{{ dept.departmentName }}</h4>
                  </div>
                  <div class="department-stats">
                    <div class="stat-row">
                      <span class="stat-label">Total de Tickets</span>
                      <span class="stat-value">{{ dept.totalTickets }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Resolvidos</span>
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
                    <div class="stat-row progress-row">
                      <span class="stat-label">Progresso</span>
                      <div class="progress-bar-bg">
                        <div
                          class="progress-bar-fill"
                          :style="{
                            width: dept.resolutionRate * 100 + '%',
                            background:
                              dept.resolutionRate > 0.7
                                ? '#22c55e'
                                : dept.resolutionRate > 0.4
                                  ? '#eab308'
                                  : '#ef4444',
                          }"
                        ></div>
                      </div>
                      <span class="progress-value">{{
                        formatPercentage(dept.resolutionRate)
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

                  <div v-if="loadingInProgressTasks" class="loading-tasks">
                    <font-awesome-icon icon="spinner" spin class="loading-icon" />
                    <p class="loading-text">Carregando tickets em andamento...</p>
                  </div>

                  <div v-else-if="inProgressTasks.length === 0" class="no-tasks-message">
                    <font-awesome-icon icon="info-circle" class="info-icon" />
                    <p>Não há tickets em andamento no momento.</p>
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
              <div class="reports-card cycle-time-section">
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
                            class="chart-bar"
                            :class="{
                              'short-bar':
                                dept.averageResolutionTimeSeconds /
                                  sortedDepartmentsByResolutionTime[0]
                                    .averageResolutionTimeSeconds <
                                0.05,
                              'zero-bar': dept.averageResolutionTimeSeconds === 0,
                            }"
                            :style="{
                              width:
                                dept.averageResolutionTimeSeconds === 0
                                  ? '3px'
                                  : `${(dept.averageResolutionTimeSeconds / sortedDepartmentsByResolutionTime[0].averageResolutionTimeSeconds) * 100}%`,
                            }"
                            :data-duration="
                              formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds)
                            "
                          >
                            {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds) }}
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
                  class="reports-card department-card-modern"
                >
                  <div class="department-card-header">
                    <div
                      class="department-icon"
                      :style="{ background: '#2563eb20', color: '#2563eb' }"
                    >
                      <font-awesome-icon icon="building" />
                    </div>
                    <h4 class="department-title">{{ dept.departmentName }}</h4>
                  </div>
                  <div class="department-stats">
                    <div class="stat-row">
                      <span class="stat-label">Total de Tickets</span>
                      <span class="stat-value">{{ dept.totalTickets }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Resolvidos</span>
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
                    <div class="stat-row progress-row">
                      <span class="stat-label">Progresso</span>
                      <div class="progress-bar-bg">
                        <div
                          class="progress-bar-fill"
                          :style="{
                            width: dept.resolutionRate * 100 + '%',
                            background:
                              dept.resolutionRate > 0.7
                                ? '#22c55e'
                                : dept.resolutionRate > 0.4
                                  ? '#eab308'
                                  : '#ef4444',
                          }"
                        ></div>
                      </div>
                      <span class="progress-value">{{
                        formatPercentage(dept.resolutionRate)
                      }}</span>
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
                <div>
                  <Select
                    v-model="selectedStatsPeriod"
                    :options="[
                      { value: 'annual', label: '12 meses' },
                      { value: 'semestral', label: '6 meses' },
                      { value: 'trimestral', label: '3 meses' },
                      { value: 'monthly', label: 'Último mês' },
                      { value: 'weekly', label: 'Última semana' },
                    ]"
                    @update:modelValue="handlePeriodChange"
                  />
                </div>
              </div>

              <!-- Nova seção Created vs Completed em Tendências -->
              <div class="reports-card created-vs-completed">
                <div class="created-vs-completed-header">
                  <h2>CRIADOS VS CONCLUÍDOS</h2>
                  <TabSelector
                    v-model="selectedTrendPeriod"
                    :options="[
                      { value: 'daily', label: 'Diário' },
                      { value: 'weekly', label: 'Semanal' },
                      { value: 'monthly', label: 'Mensal' },
                    ]"
                    @update:modelValue="updateTrendPeriod"
                  />
                </div>

                <div class="created-vs-completed-content">
                  <div class="created-vs-completed-info">
                    <p class="info-title">Novos tickets criados vs concluídos</p>
                    <p class="info-text" v-if="trendData && trendData.length > 0">
                      <span class="highlight">{{ getTotalResolved() }} tickets</span> concluídos no
                      período selecionado
                    </p>
                    <p class="info-text">
                      <span class="highlight">{{ getTotalCreated() }} tickets</span> criados no
                      período selecionado
                    </p>
                    <p
                      class="info-trend"
                      v-if="
                        trendData &&
                        trendData.length > 0 &&
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
                    <div class="chart-container">
                      <Line
                        v-if="trendData && trendData.length > 0 && trendChartData"
                        :data="trendChartData"
                        :options="trendChartOptions"
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
              <div class="charts-grid">
                <!-- Cycle Time Trend Chart -->
                <div class="reports-card cycle-time-trend">
                  <div class="cycle-time-trend-header">
                    <h2>TEMPO DE RESOLUÇÃO POR PERÍODO</h2>
                    <div class="header-actions">
                      <Select
                        v-model="selectedCycleTimePeriod"
                        :options="[
                          { value: 'week', label: 'Por Semana' },
                          { value: 'month', label: 'Por Mês' },
                          { value: 'quarter', label: 'Por Trimestre' },
                        ]"
                        @update:modelValue="handleCycleTimePeriodChange"
                        class="w-40"
                      />
                    </div>
                  </div>

                  <div class="cycle-time-info">
                    <p v-if="getLatestResolutionTime() > 0">
                      O tempo médio de resolução da sua empresa foi de
                      <strong>{{ formatTimeInSeconds(getLatestResolutionTime() * 3600) }}</strong>
                      {{ periodTextMap[selectedCycleTimePeriod] }} {{ getPeriodName() }}.
                    </p>
                    <p
                      v-if="getLatestResolutionTime() > 0 && hasPreviousPeriodData()"
                      class="comparison-text"
                    >
                      Isso é
                      <span
                        :class="getResolutionTimeTrend() > 0 ? 'percentage-up' : 'percentage-down'"
                      >
                        {{ getResolutionTimeTrend() > 0 ? '+' : '' }}{{ getResolutionTimeTrend() }}%
                        {{ getResolutionTimeTrend() > 0 ? 'mais' : 'menos' }}
                      </span>
                      que {{ getPreviousPeriodLabel() }}
                    </p>
                    <p v-else-if="getLatestResolutionTime() === 0" class="no-data-message">
                      Não houveram tickets resolvidos
                      <span v-if="selectedCycleTimePeriod === 'week'">na última semana</span>
                      <span v-else-if="selectedCycleTimePeriod === 'month'">no último mês</span>
                      <span v-else>no último trimestre</span>
                    </p>
                    <p class="average-info" v-if="getAverageResolutionTime() > 0">
                      Média:
                      <strong>{{ formatTimeInSeconds(getAverageResolutionTime() * 3600) }}</strong>
                    </p>
                  </div>

                  <div class="cycle-time-chart">
                    <div v-if="cycleTimeChartLoading" class="chart-loading-state">
                      <font-awesome-icon icon="spinner" spin class="loading-icon" />
                      <p class="loading-text">Atualizando gráfico...</p>
                    </div>
                    <Bar
                      v-else
                      :data="cycleTimeBarData"
                      :options="cycleTimeBarOptions"
                      height="300"
                      :key="`cycle-time-chart-${chartRenderKey}`"
                    />
                  </div>
                </div>

                <!-- Nova seção de Tempo de Ciclo por Estado do Workflow -->
                <div class="reports-card cycle-time-workflow">
                  <div class="cycle-time-workflow-header">
                    <h2>TEMPO DE DURAÇÃO POR STATUS</h2>
                  </div>

                  <div class="workflow-analysis">
                    <div class="workflow-description">
                      <p>
                        Quanto tempo as tarefas permanecem em cada status? Os status em que as
                        tarefas permaneceram mais tempo foram:
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
                            formatTimeInSecondsCompact(duration.averageDurationSeconds)
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
                              class="chart-bar"
                              :class="{
                                'short-bar':
                                  duration.averageDurationSeconds /
                                    sortedStatusDurations[0].averageDurationSeconds <
                                  0.15,
                                'zero-bar': duration.averageDurationSeconds === 0,
                              }"
                              :style="{
                                width:
                                  duration.averageDurationSeconds === 0
                                    ? '3px'
                                    : `${(duration.averageDurationSeconds / sortedStatusDurations[0].averageDurationSeconds) * 100}%`,
                              }"
                              :data-duration="
                                formatTimeInSecondsCompact(duration.averageDurationSeconds)
                              "
                            >
                              {{ formatTimeInSecondsCompact(duration.averageDurationSeconds) }}
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Seção de Ciclo de Tempo Em Andamento -->
              <div class="reports-card cycle-time-progress">
                <div class="cycle-time-progress-header">
                  <h2>TEMPO GASTO NO STATUS "EM ANDAMENTO"</h2>
                </div>

                <div class="progress-analysis">
                  <div class="progress-info">
                    <p v-if="inProgressTimeSeries?.data?.length">
                      O tempo médio foi de
                      <strong>{{
                        formatTimeInSecondsCompact(inProgressTimeSeries.averageDuration)
                      }}</strong>
                      para
                      <span class="highlight">{{ getTotalInProgressCount() }} tickets</span> nos
                      últimos <span class="highlight">6 meses</span>.
                    </p>
                    <p class="trend-info" v-if="getInProgressTrend() !== 0">
                      Isso é
                      <span :class="getInProgressTrend() > 0 ? 'percentage-up' : 'percentage-down'">
                        {{ Math.abs(getInProgressTrend()) }}%
                        {{ getInProgressTrend() > 0 ? 'mais' : 'menos' }}
                      </span>
                      que no mês anterior
                      {{
                        getInProgressTrend() > 0
                          ? '(aumento é considerado ruim)'
                          : '(diminuição é positiva)'
                      }}.
                    </p>
                  </div>

                  <div class="chart-stats-container">
                    <div class="chart-container mt-4">
                      <Line
                        v-if="inProgressTimeChartData"
                        :data="inProgressTimeChartData"
                        :options="inProgressTimeChartOptions"
                      />
                      <div v-else class="loading-state">
                        <font-awesome-icon icon="spinner" spin class="loading-icon" />
                        <p class="loading-text">Carregando dados...</p>
                      </div>
                    </div>

                    <div class="progress-stats" v-if="inProgressTimeSeries">
                      <div class="stat-item">
                        <span class="stat-value">{{
                          formatTimeInSecondsCompact(inProgressTimeSeries.averageDuration)
                        }}</span>
                        <span class="stat-label">Média últimos 6 meses</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-value">{{ getTotalInProgressCount() }}</span>
                        <span class="stat-label">Número de tickets</span>
                      </div>
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
import { Line, Doughnut, Bar } from 'vue-chartjs';
import { formatDate, formatDateToPortuguese } from '@/utils/date';
import { reportService } from '@/services/reportService';
import { ticketService } from '@/services/ticketService';
import type {
  TenantStatistics,
  StatusDurationDto,
  DepartmentStats,
  ResolutionTimeResponseDto,
  ResolutionTimeDataDto,
  ResolutionTimeAverageDto,
  StatusDurationTimeSeriesResponseDto,
  StatusDurationTimePointDto,
  UserRankingResponseDto,
} from '@/services/reportService';
import { TicketActionType, TicketStatus, type TicketUpdate } from '@/models';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import {
  formatSnakeToNaturalCase,
  formatTimeCompact,
  formatTimeInSeconds,
  formatTimeInSecondsCompact,
} from '@/utils/generic-helper';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TabSelector from '@/components/common/TabSelector.vue';
import Select from '@/components/common/Select.vue';
import { toast } from 'vue3-toastify';
import { downloadFile } from '@/utils/file-helper';
ChartJS.register(ChartDataLabels);

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
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string | string[];
    backgroundColor?: string | string[];
    fill?: boolean;
    borderWidth?: number;
  }[];
}

type CustomTicketStatus =
  | 'pendente'
  | 'em_andamento'
  | 'aguardando_verificação'
  | 'em_verificação'
  | 'finalizado'
  | 'cancelado'
  | 'reprovado';

interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'bottom' | 'top' | 'left' | 'right';
      labels: {
        usePointStyle: boolean;
        padding: number;
        font: {
          size: number;
        };
      };
    };
    tooltip: {
      backgroundColor: string;
      padding: number;
      titleFont: {
        size: number;
      };
      bodyFont: {
        size: number;
      };
      callbacks?: {
        label?: (context: any) => string;
      };
    };
    datalabels: {
      display: boolean;
      formatter?: (value: number, context: any) => string;
      color?: string;
      font?: {
        weight: 'bold' | 'normal' | 'bolder' | 'lighter' | number;
        size: number;
      };
    };
  };
  scales?: {
    y: {
      beginAtZero: boolean;
      ticks: {
        precision: number;
      };
    };
  };
}

// Ordem e cores fixas para status
const statusOrder = [
  { key: 'pendente', label: 'Pendente', color: '#eab308' },
  { key: 'em_andamento', label: 'Em andamento', color: '#2563eb' },
  { key: 'aguardando_verificacao', label: 'Aguardando verificação', color: '#d8b4fe' },
  { key: 'em_verificacao', label: 'Em verificação', color: '#9333ea' },
  { key: 'finalizado', label: 'Finalizado', color: '#2ecc71' },
  { key: 'cancelado', label: 'Cancelado', color: '#f87171' },
  { key: 'reprovado', label: 'Reprovado', color: '#c62828' },
];

// Ordem e cores fixas para prioridade
const priorityOrder = [
  { key: 'baixa', label: 'Baixa', color: '#22c55e' },
  { key: 'media', label: 'Média', color: '#eab308' },
  { key: 'alta', label: 'Alta', color: '#ef4444' },
];

// Chart options - garantir percentuais
const chartOptions = ref<ChartOptions>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
    },
    datalabels: {
      display: true,
      formatter: (value: number, context: any) => {
        const data = context.dataset.data;
        const total = data.reduce((a: number, b: number) => a + b, 0);
        const percent = Math.round((value / total) * 100);
        return percent > 0 ? `${percent}%` : '';
      },
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
      },
    },
  },
});

const trendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
};

const createdVsCompletedChartOptions = ref<ChartOptions>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
});

const statistics = ref<TenantStatistics | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const topUsers = ref<UserRankingResponseDto | null>(null);

const ticketsByStatus = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Status',
      data: [],
      backgroundColor: [
        '#eab308', // Pendente (amarelo)
        '#2563eb', // Em andamento (azul)
        '#d8b4fe', // Aguardando Verificação (roxo claro)
        '#9333ea', // Em Verificação (roxo escuro)
        '#2ecc71', // Finalizado (verde)
        '#f87171', // Cancelado (vermelho claro)
        '#c62828', // Reprovado (vermelho escuro)
      ] as string[],
    },
  ],
});

const ticketsByPriority = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: 'Quantidade de Tickets',
      data: [],
      backgroundColor: [
        '#22c55e', // Baixa (verde)
        '#eab308', // Média (amarelo)
        '#ef4444', // Alta (vermelho)
      ] as string[],
    },
  ],
});

const recentTickets = ref<
  { customId: string; name: string; status: string; priority: string; createdAt: string }[]
>([]);

const statusClassMap: Record<CustomTicketStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  em_andamento: 'bg-blue-100 text-blue-800',
  aguardando_verificação: 'bg-purple-100 text-purple-800',
  em_verificação: 'bg-indigo-100 text-indigo-800',
  finalizado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  reprovado: 'bg-red-100 text-red-800',
};

const getStatusClass = (status: string): string => {
  return statusClassMap[status as CustomTicketStatus] || 'bg-gray-100 text-gray-800';
};

const priorityClassMap: Record<string, string> = {
  baixa: 'bg-green-100 text-green-800',
  média: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800',
};

const getPriorityClass = (priority: string): string => {
  return priorityClassMap[priority] || 'bg-blue-100 text-blue-800';
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
      resolutionTimeResult,
      inProgressTimeSeriesResult,
      topUsersResult, // Add this new result
    ] = await Promise.all([
      reportService.getTenantStatistics(),
      reportService.getTicketTrends(selectedTrendPeriod.value),
      reportService.getTicketsByStatus(),
      reportService.getTicketsByPriority(),
      ticketService.getTenantRecentTickets(10),
      reportService.getStatusDurations(selectedStatsPeriod.value),
      reportService.getTenantDepartmentsStatistics(),
      reportService.getResolutionTimeData(),
      reportService.getStatusDurationTimeSeries(TicketStatus.InProgress),
      reportService.getTopUsers(5), // Add this new API call
    ]);

    // Initialize trendData with the current period data
    trendData.value = trends[selectedTrendPeriod.value];

    // Store status durations
    statusDurations.value = statusDurationsResult.statusDurations.map((duration) => ({
      ...duration,
      averageDuration: duration.averageDurationSeconds / 3600, // Converter segundos para horas
    }));

    // Store department data - directly from the API response
    departmentData.value = departmentStatsResult.map((dept) => ({
      ...dept,
      departmentId: dept.departmentId, // manter como number
      totalTickets: dept.totalTickets || 0,
      resolvedTickets: dept.resolvedTickets || 0,
      resolutionRate: dept.resolutionRate || 0,
      averageAcceptanceTimeSeconds: dept.averageAcceptanceTimeSeconds || 0,
      averageTotalTimeSeconds: dept.averageTotalTimeSeconds || 0,
    }));

    // Distribuição por Status
    const statusCounts = statusOrder.map((status) => {
      const found = statusResult.statusCounts.find((item: any) => item.status === status.key);
      return found ? found.count : 0;
    });
    ticketsByStatus.value = {
      labels: statusOrder.map((s) => s.label),
      datasets: [
        {
          label: 'Status',
          data: statusCounts,
          backgroundColor: statusOrder.map((s) => s.color),
        },
      ],
    };

    // Distribuição por Prioridade
    const priorityCounts = priorityOrder.map((priority) => {
      const found = priorityResult.priorityCounts.find(
        (item: any) => item.priority === priority.key,
      );
      return found ? found.count : 0;
    });
    ticketsByPriority.value = {
      labels: priorityOrder.map((p) => p.label),
      datasets: [
        {
          label: 'Quantidade de Tickets',
          data: priorityCounts,
          backgroundColor: priorityOrder.map((p) => p.color),
        },
      ],
    };

    recentTickets.value = recentTicketsResult.data.items;

    statistics.value = statsData;
    if (statistics.value) {
      statistics.value.ticketTrends = trends;
    }

    cycleTimeData.value = resolutionTimeResult.data;
    cycleTimeAverage.value = resolutionTimeResult.average;

    // Store the result in the reactive property
    inProgressTimeSeries.value = inProgressTimeSeriesResult;

    // Store the top users
    topUsers.value = topUsersResult;
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
      data: ticketsByStatus.value.datasets[0].data,
      backgroundColor: [
        '#eab308', // Pendente (amarelo)
        '#2563eb', // Em andamento (azul)
        '#d8b4fe', // Aguardando Verificação (roxo claro)
        '#9333ea', // Em Verificação (roxo escuro)
        '#2ecc71', // Finalizado (verde)
        '#f87171', // Cancelado (vermelho claro)
        '#c62828', // Reprovado (vermelho escuro)
      ] as string[],
    },
  ],
}));

const priorityChartData = computed(() => ({
  labels: ticketsByPriority.value.labels,
  datasets: [
    {
      label: 'Quantidade de Tickets',
      data: ticketsByPriority.value.datasets[0].data,
      backgroundColor: [
        '#22c55e', // Baixa (verde)
        '#eab308', // Média (amarelo)
        '#ef4444', // Alta (vermelho)
      ] as string[],
    },
  ],
}));

// Keep selectedTrendPeriod for chart trend data
const selectedTrendPeriod = ref<'daily' | 'weekly' | 'monthly'>('weekly');
const selectedCycleTimeFilter = ref<'department' | 'priority'>('department');
const trendData = ref<{ date: string; total: number; resolved: number; created: number }[]>([]);

const trendChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) return null;
  return {
    labels: trendData.value.map((item) => formatDateDDMM(item.date)),
    datasets: [
      {
        label: 'Concluídos',
        data: trendData.value.map((item) => item.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Criados',
        data: trendData.value.map((item) => item.created),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };
});

// Dados para o gráfico Created vs Completed
const createdVsCompletedChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: trendData.value.map((item) => formatDateDDMM(item.date)),
    datasets: [
      {
        label: 'Criados',
        data: trendData.value.map((item) => item.created),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Concluídos',
        data: trendData.value.map((item) => item.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
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

const updateTrendPeriod = async (period: string) => {
  selectedTrendPeriod.value = period as 'daily' | 'weekly' | 'monthly';

  try {
    const data = await reportService.getTicketTrends(selectedTrendPeriod.value);
    trendData.value = data[selectedTrendPeriod.value];

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
const loadingInProgressTasks = ref(false);

// Function to load in-progress tickets
const loadInProgressTasks = async () => {
  loadingInProgressTasks.value = true;
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
  } finally {
    loadingInProgressTasks.value = false;
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
  return trendData.value?.reduce((total, item) => total + (item.resolved || 0), 0) || 0;
};

const getTotalCreated = () => {
  return trendData.value?.reduce((total, item) => total + (item.created || 0), 0) || 0;
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

// Função utilitária para formatar data como DD/MM
function formatDateDDMM(dateStr: string) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// Add new reactive state for cycle time period selection
const selectedCycleTimePeriod = ref<'week' | 'month' | 'quarter'>('week');

// Period text mapping for UI
const periodTextMap: Record<'week' | 'month' | 'quarter', string> = {
  week: 'na semana',
  month: 'no mês',
  quarter: 'no trimestre',
};

const cycleTimeData = ref<ResolutionTimeDataDto | null>(null);
const cycleTimeAverage = ref<ResolutionTimeAverageDto | null>(null);
const inProgressTimeSeries = ref<StatusDurationTimeSeriesResponseDto | null>(null);

const getLatestResolutionTime = () => {
  if (!cycleTimeData.value) return 0;

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  if (!data || data.length === 0) return 0;
  return data[data.length - 1].value;
};

const getAverageResolutionTime = () => {
  if (!cycleTimeAverage.value) return 0;

  const period = selectedCycleTimePeriod.value;
  return cycleTimeAverage.value[period];
};

const getResolutionTimeTrend = () => {
  if (!cycleTimeData.value) return 0;

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  if (!data || data.length < 2) return 0;

  const current = data[data.length - 1].value;
  const previous = data[data.length - 2].value;

  if (previous === 0) return 0;

  const change = ((current - previous) / previous) * 100;
  return Math.round(change);
};

const getPeriodName = () => {
  if (!cycleTimeData.value) return '';

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  if (!data || data.length === 0) return '';
  return data[data.length - 1].label;
};

const getPreviousPeriodName = () => {
  if (!cycleTimeData.value) return '';

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  if (!data || data.length < 2) return '';
  return data[data.length - 2].label;
};

const cycleTimeBarData = computed(() => {
  if (!cycleTimeData.value) return { labels: [], datasets: [{ label: '', data: [] }] };

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  return {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Tempo de Resolução',
        data: data.map((item) => item.value),
        backgroundColor: '#60a5fa',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };
});

const cycleTimeBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          // Converter horas para formato dias/horas
          const hours = tooltipItem.raw as number;
          const days = Math.floor(hours / 24);
          const remainingHours = Math.floor(hours % 24);

          if (days > 0) {
            return `${days}d ${remainingHours}h`;
          } else {
            return `${remainingHours}h ${Math.floor((hours - remainingHours) * 60)}m`;
          }
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tempo (horas)',
      },
      ticks: {
        callback: function (value: any) {
          const numValue = value as number;
          if (numValue >= 24) {
            const days = Math.floor(numValue / 24);
            const hours = numValue % 24;
            return `${days}d ${hours}h`;
          }
          return `${numValue}h`;
        },
      },
    },
  },
};

// Add a reactive state for chart rendering
const chartRenderKey = ref(0);
const cycleTimeChartLoading = ref(false);

// Function to handle period change with forced re-render
const handleCycleTimePeriodChange = () => {
  // Show loading state
  cycleTimeChartLoading.value = true;

  // Force re-render after a short delay
  setTimeout(() => {
    chartRenderKey.value++;
    cycleTimeChartLoading.value = false;
  }, 300);
};

// Add function to check if previous period data exists
const hasPreviousPeriodData = () => {
  if (!cycleTimeData.value) return false;

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  return data && data.length >= 2 && getPreviousPeriodValue() > 0;
};

// Add function to get previous period value
const getPreviousPeriodValue = () => {
  if (!cycleTimeData.value) return 0;

  const period = selectedCycleTimePeriod.value;
  const data = cycleTimeData.value[period];

  if (!data || data.length < 2) return 0;
  return data[data.length - 2].value;
};

// Get formatted previous period label
const getPreviousPeriodLabel = () => {
  if (!cycleTimeData.value) return '';

  const period = selectedCycleTimePeriod.value;
  const label = period === 'week' ? 'a semana' : period === 'month' ? 'o mês' : 'o trimestre';

  return `${label} anterior (${getPreviousPeriodName()})`;
};

// Replace the inProgressTimeChartData computed property with properly typed version
const inProgressTimeChartData = computed(() => {
  if (!inProgressTimeSeries.value?.data) {
    return null;
  }

  const data = inProgressTimeSeries.value.data;

  return {
    labels: data.map((point: StatusDurationTimePointDto) => point.month),
    datasets: [
      {
        label: 'Tempo em Andamento (segundos)',
        data: data.map((point: StatusDurationTimePointDto) => point.value),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };
});

const inProgressTimeChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: any) => {
          const value = context.parsed.y;
          return formatTimeInSeconds(value);
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tempo',
        font: {
          size: 12,
        },
      },
      ticks: {
        callback: function (value: any) {
          return formatTimeInSecondsCompact(value);
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}));

// Format hours with decimal places
const formatTimeInHours = (hours: number): string => {
  if (!hours) return '0h';

  const wholeHours = Math.floor(hours);
  const minutes = Math.floor((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
};

// Get total count of tickets in "in progress" status
const getTotalInProgressCount = (): number => {
  if (!inProgressTimeSeries.value?.data) return 0;

  return inProgressTimeSeries.value.data.reduce(
    (sum: number, point: StatusDurationTimePointDto) => sum + point.count,
    0,
  );
};

// Calculate trend between last two months
const getInProgressTrend = (): number => {
  if (!inProgressTimeSeries.value?.data || inProgressTimeSeries.value.data.length < 2) {
    return 0;
  }

  const data = inProgressTimeSeries.value.data;
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  if (previousMonth.value === 0 || currentMonth.count === 0 || previousMonth.count === 0) {
    return 0;
  }

  const percentChange = ((currentMonth.value - previousMonth.value) / previousMonth.value) * 100;
  return Math.round(percentChange);
};

// Add this to your loadData function
const loadInProgressDuration = async () => {
  try {
    inProgressTimeSeries.value = await reportService.getStatusDurationTimeSeries(
      TicketStatus.InProgress,
    );
  } catch (err) {
    console.error('Error loading in-progress duration data:', err);
  }
};

// Add this to the loadData function Promise.all

// Add the utility functions after the loadData function
const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName ? firstName.charAt(0) : '';
  const lastInitial = lastName ? lastName.charAt(0) : '';
  return (firstInitial + lastInitial).toUpperCase();
};

const getAvatarColorClass = (userId: number): string => {
  const colors = ['avatar-blue', 'avatar-green', 'avatar-purple', 'avatar-orange', 'avatar-pink'];
  return colors[userId % colors.length];
};

const getResolutionRateClass = (resolutionRate: number): string => {
  if (resolutionRate >= 0.8) return 'status-available';
  if (resolutionRate >= 0.5) return 'status-in-class';
  return 'status-absent';
};

const formatStatsPeriod = (period: string): string => {
  switch (period) {
    case 'annual':
      return 'últimos 12 meses';
    case 'semestral':
      return 'últimos 6 meses';
    case 'trimestral':
      return 'últimos 3 meses';
    case 'monthly':
      return 'último mês';
    case 'weekly':
      return 'última semana';
    default:
      return period;
  }
};

const exportToCSV = () => {
  try {
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

    let csvContent = '';

    // Header
    csvContent += '=== RELATÓRIO GERAL DO SISTEMA ===\n';
    csvContent += `Data de Geração,${timestamp}\n`;
    csvContent += `Período,${formatStatsPeriod(selectedStatsPeriod.value)}\n`;
    csvContent += '\n';

    // General Metrics
    csvContent += '=== MÉTRICAS GERAIS ===\n';
    csvContent += 'Métrica,Valor\n';
    csvContent += `Total de Tickets,${statistics.value?.totalTickets || 0}\n`;
    csvContent += `Taxa de Resolução,${formatPercentage(statistics.value?.resolutionRate)}\n`;
    csvContent += `Tempo Médio de Resolução,${formatTimeInSeconds(statistics.value?.averageResolutionTimeSeconds)}\n`;
    csvContent += `Tempo Médio de Aceitação,${formatTimeInSeconds(statistics.value?.averageAcceptanceTimeSeconds)}\n`;
    csvContent += '\n';

    // Distribution by Status
    csvContent += '=== DISTRIBUIÇÃO POR STATUS ===\n';
    csvContent += 'Status,Quantidade,Percentual\n';
    const totalStatusTickets = ticketsByStatus.value.datasets[0].data.reduce(
      (sum, count) => sum + count,
      0,
    );
    ticketsByStatus.value.labels.forEach((label, index) => {
      const count = ticketsByStatus.value.datasets[0].data[index];
      const percentage =
        totalStatusTickets > 0 ? ((count / totalStatusTickets) * 100).toFixed(1) : '0.0';
      csvContent += `${label},${count},${percentage}%\n`;
    });
    csvContent += '\n';

    // Distribution by Priority
    csvContent += '=== DISTRIBUIÇÃO POR PRIORIDADE ===\n';
    csvContent += 'Prioridade,Quantidade,Percentual\n';
    const totalPriorityTickets = ticketsByPriority.value.datasets[0].data.reduce(
      (sum, count) => sum + count,
      0,
    );
    ticketsByPriority.value.labels.forEach((label, index) => {
      const count = ticketsByPriority.value.datasets[0].data[index];
      const percentage =
        totalPriorityTickets > 0 ? ((count / totalPriorityTickets) * 100).toFixed(1) : '0.0';
      csvContent += `${label},${count},${percentage}%\n`;
    });
    csvContent += '\n';

    // Department Statistics
    if (departmentStats.value && departmentStats.value.length > 0) {
      csvContent += '=== ESTATÍSTICAS POR DEPARTAMENTO ===\n';
      csvContent +=
        'Departamento,Total Tickets,Resolvidos,Taxa Resolução,Tempo Aceitação,Tempo Resolução,Tempo Total\n';
      departmentStats.value.forEach((dept) => {
        csvContent += `${dept.departmentName},${dept.totalTickets},${dept.resolvedTickets},${formatPercentage(dept.resolutionRate)},${formatTimeInSeconds(dept.averageAcceptanceTimeSeconds)},${formatTimeInSeconds(dept.averageResolutionTimeSeconds)},${formatTimeInSeconds(dept.averageTotalTimeSeconds)}\n`;
      });
      csvContent += '\n';
    }

    // Top Contributors
    if (topUsers.value && topUsers.value.users && topUsers.value.users.length > 0) {
      csvContent += '=== TOP COLABORADORES ===\n';
      csvContent += 'Nome,Departamento,Tickets Resolvidos,Taxa Resolução,Total Tickets\n';
      topUsers.value.users.forEach((user) => {
        csvContent += `${user.firstName} ${user.lastName},${user.departmentName},${user.resolvedTickets},${formatPercentage(user.resolutionRate)},${user.totalTickets}\n`;
      });
      csvContent += '\n';
    }

    // Recent Tickets
    if (recentTickets.value && recentTickets.value.length > 0) {
      csvContent += '=== TICKETS RECENTES ===\n';
      csvContent += 'ID,Assunto,Status,Prioridade,Data Criação\n';
      recentTickets.value.forEach((ticket) => {
        const createdDate = new Date(ticket.createdAt).toLocaleDateString('pt-BR');
        csvContent += `${ticket.customId},"${ticket.name.replace(/"/g, '""')}",${ticket.status},${ticket.priority},${createdDate}\n`;
      });
      csvContent += '\n';
    }

    // Trend Data (Created vs Completed)
    if (trendData.value && trendData.value.length > 0) {
      csvContent += '=== TENDÊNCIAS (CRIADOS VS CONCLUÍDOS) ===\n';
      csvContent += 'Data,Tickets Criados,Tickets Concluídos,Total\n';
      trendData.value.forEach((item) => {
        const date = new Date(item.date).toLocaleDateString('pt-BR');
        csvContent += `${date},${item.created},${item.resolved},${item.total}\n`;
      });
      csvContent += '\n';
    }

    // In-Progress Tasks
    if (inProgressTasks.value && inProgressTasks.value.length > 0) {
      csvContent += '=== TAREFAS EM ANDAMENTO ===\n';
      csvContent += 'ID,Assunto,Responsável,Tempo em Andamento,Status Prazo\n';
      inProgressTasks.value.forEach((task) => {
        const overdueStatus = task.isOverdue ? 'Em atraso' : 'No prazo';
        csvContent += `${task.customId},"${task.name.replace(/"/g, '""')}",${task.assignee.name},${task.timeInProgress},${overdueStatus}\n`;
      });
      csvContent += '\n';
    }

    // Summary footer
    csvContent += '=== RESUMO FINAL ===\n';
    csvContent += `Total de Tickets Criados,${getTotalCreated()}\n`;
    csvContent += `Total de Tickets Concluídos,${getTotalResolved()}\n`;
    csvContent += `Tickets em Andamento,${inProgressTasks.value?.length || 0}\n`;
    csvContent += `Departamentos Ativos,${departmentStats.value?.length || 0}\n`;

    downloadFile(`relatorio-sistema-${now.toISOString().split('T')[0]}.csv`, csvContent, 'text/csv;charset=utf-8;');

    toast.success('Relatório exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    toast.error('Erro ao exportar relatório. Tente novamente.');
  }
};
</script>

<style scoped>
.reports-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
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
.tabs-header {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
  background-color: white;
  border-radius: 0.5rem;
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
  background-color: #f9fafb;
  margin-top: 0.5rem;
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

.reports-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
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
.reports-table-container {
  margin-top: 1.5rem;
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
  margin-top: 1rem;
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
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
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
  background-color: white;
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
  margin-bottom: 1.5rem;
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
  margin-top: 1rem;
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
  gap: 1.2rem;
}

.cycle-time-info {
  padding-right: 1.2rem;
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
  max-width: 120px;
  font-size: 0.875rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  position: relative;
  overflow: visible;
  white-space: nowrap;
}

.chart-bar.short-bar {
  color: transparent;
  justify-content: flex-start;
  overflow: visible;
  min-width: 3px;
  padding: 0;
}

.chart-bar.short-bar::after {
  content: attr(data-duration);
  position: absolute;
  left: 100%;
  margin-left: 6px;
  color: #1f2937;
  white-space: nowrap;
}

.chart-bar.zero-bar {
  color: transparent;
  justify-content: flex-start;
  overflow: visible;
  min-width: 3px;
  padding: 0;
  background-color: #d1d5db;
}

.chart-bar.zero-bar::after {
  content: attr(data-duration);
  position: absolute;
  left: 100%;
  margin-left: 6px;
  color: #6b7280;
  white-space: nowrap;
}

/* Cycle Time Trend Styles */
.cycle-time-trend {
  margin-top: 1.5rem;
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
  margin-top: 1.5rem;
}

.cycle-time-workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.cycle-time-workflow-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.05em;
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
  margin-top: 1.5rem;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 2rem;
  min-width: 220px;
  margin-top: 2rem;
}

.chart-stats-container {
  display: flex;
  align-items: flex-start;
  margin-top: 1rem;
}

.chart-stats-container .chart-container {
  flex: 1;
  min-height: 300px;
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
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
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
  grid-template-columns: 400px 1fr;
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
  margin-right: 0.75rem;
}

.stats-period-custom-select {
  max-width: 180px;
}

.cycle-time-custom-select {
  width: 160px;
}

.status-chart-flex {
  display: flex;
  flex-direction: column;
}
.status-chart-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Centraliza horizontalmente o conteúdo (gráfico + legenda) */
}
.status-custom-legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2rem;
  min-width: 140px;
}
.status-custom-legend .legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95em;
}
.status-custom-legend .legend-color {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  margin-right: 0.5rem;
  border: 1px solid #e5e7eb;
}
.status-custom-legend .legend-label {
  color: #374151;
  font-weight: 500;
}

.department-card-modern {
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  padding-top: 1.25rem;
}
.department-card-modern:hover {
  box-shadow: 0 4px 16px 0 rgba(37, 99, 235, 0.13);
}
.department-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.department-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: #2563eb20;
  color: #2563eb;
}
.progress-row {
  align-items: center;
  gap: 0.5rem;
}
.progress-bar-bg {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  margin: 0 0.5rem;
  overflow: hidden;
  min-width: 60px;
  max-width: 120px;
  display: inline-block;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s;
}
.progress-value {
  font-size: 0.85em;
  color: #374151;
  min-width: 40px;
  text-align: right;
}

.chart-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
}

.chart-loading-state .loading-icon {
  font-size: 2rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.chart-loading-state .loading-text {
  color: #4b5563;
  font-size: 0.875rem;
}

.percentage-down {
  color: #22c55e;
  font-weight: 500;
}

.no-data-message {
  color: #6b7280;
  font-style: italic;
}

.comparison-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.top-contributors-card {
  padding: 1.5rem;
}

.top-contributors-header {
  margin-bottom: 1.5rem;
}

.top-contributors-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.top-contributors-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.top-contributors-table {
  display: flex;
  flex-direction: column;
}

.contributors-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
}

.contributor-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}

.contributor-row:last-child {
  border-bottom: none;
}

.header-profile,
.header-tickets,
.header-rate,
.header-total {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: none;
}

.contributor-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contributor-tickets,
.contributor-rate,
.contributor-total {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contributor-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-blue {
  background-color: #dbeafe;
  color: #2563eb;
}

.avatar-green {
  background-color: #dcfce7;
  color: #16a34a;
}

.avatar-purple {
  background-color: #e9d5ff;
  color: #9333ea;
}

.avatar-orange {
  background-color: #fed7aa;
  color: #ea580c;
}

.avatar-pink {
  background-color: #fce7f3;
  color: #ec4899;
}

.avatar-placeholder {
  font-size: 0.875rem;
  font-weight: 600;
  color: inherit;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contributor-info {
  display: flex;
  flex-direction: column;
}

.contributor-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.contributor-role {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.ticket-count,
.total-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-available {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-in-class {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-absent {
  background-color: #fee2e2;
  color: #dc2626;
}

.loading-contributors,
.no-contributors {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-contributors .loading-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2563eb;
}

.no-tasks-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.975rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border: 1px dashed #e5e7eb;
}

.info-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  color: #3b82f6;
}

.loading-tasks {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.975rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border: 1px dashed #e5e7eb;
}

.loading-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #2563eb;
}

.loading-text {
  color: #4b5563;
}
</style>
