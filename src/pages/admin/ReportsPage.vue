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
            <p class="header-subtitle">Acompanhe métricas e indicadores importantes dos chamados</p>
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
                <p class="metric-label">Total de Chamados</p>
                <h3 class="metric-value">{{ statistics.totalTickets }}</h3>
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
                <h3 class="metric-value">{{ formatPercentage(statistics.resolutionRate) }}</h3>
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
                <h3 class="metric-value">{{ statistics.averageResolutionTime }}</h3>
              </div>
              <div class="metric-icon green">
                <font-awesome-icon icon="clock" />
              </div>
            </div>
          </div>

          <div class="metric-card purple-border">
            <div class="metric-content">
              <div class="metric-info">
                <p class="metric-label">Taxa de Aceitação</p>
                <h3 class="metric-value">{{ formatPercentage(statistics.acceptanceRate) }}</h3>
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
                  <div class="period-selector">
                    <button class="btn btn-outline secondary">
                      3 meses
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="created-vs-completed-content">
                  <div class="created-vs-completed-info">
                    <p class="info-title">Novos chamados criados vs concluídos</p>
                    <p class="info-text">
                      Você concluiu <span class="highlight">50 chamados</span> no total durante
                      <span class="highlight">3 meses</span>
                    </p>
                    <p class="info-text">
                      Você criou <span class="highlight">75 chamados</span> no total durante
                      <span class="highlight">3 meses</span>
                    </p>
                    <p class="info-trend">
                      Isso é <span class="trend-value">100% mais criados</span> e
                      <span class="trend-value">100% mais concluídos</span> comparado a
                      <span class="date-reference">16 de Janeiro, 2025</span>
                    </p>
                  </div>

                  <div class="created-vs-completed-chart">
                    <div class="chart-legend">
                      <div class="legend-item">
                        <span class="legend-color completed"></span>
                        <span>Concluídos (no período)</span>
                        <span class="legend-value">50</span>
                        <span class="legend-trend">↑ 100%</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color created"></span>
                        <span>Criados (no período)</span>
                        <span class="legend-value">75</span>
                        <span class="legend-trend">↑ 100%</span>
                      </div>
                    </div>

                    <div class="chart-container">
                      <Line
                        v-if="createdVsCompletedData"
                        :data="createdVsCompletedChartData"
                        :options="chartOptions"
                      />
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
                    <div class="chart-legend">
                      <div
                        v-for="(label, index) in ticketsByStatus.labels"
                        :key="label"
                        class="legend-item"
                      >
                        <div
                          class="legend-color"
                          :style="{
                            backgroundColor: statusChartData.datasets[0].backgroundColor[index],
                          }"
                        ></div>
                        <span>{{ label }}</span>
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
                    <div class="chart-legend">
                      <div
                        v-for="(label, index) in ticketsByPriority.labels"
                        :key="label"
                        class="legend-item"
                      >
                        <div
                          class="legend-color"
                          :style="{
                            backgroundColor: priorityChartData.datasets[0].backgroundColor[index],
                          }"
                        ></div>
                        <span>{{ label }}</span>
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
                      <h2 class="table-title">Últimos Chamados</h2>
                      <p class="table-subtitle">Acompanhe os chamados mais recentes do sistema</p>
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
                      <tr v-for="ticket in recentTickets" :key="ticket.id">
                        <td>#{{ ticket.id }}</td>
                        <td>{{ ticket.name }}</td>
                        <td>
                          <span :class="['status-badge', getStatusClass(ticket.status)]">
                            {{ ticket.status }}
                          </span>
                        </td>
                        <td>
                          <span :class="['priority-badge', getPriorityClass(ticket.priority)]">
                            {{ ticket.priority }}
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
                    <h2>CYCLE TIME PER SEGMENT</h2>
                  </div>
                  <div class="cycle-time-filters">
                    <button class="btn btn-outline secondary">
                      By Label
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <button class="btn btn-outline secondary">
                      3 months
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="cycle-time-content">
                  <div class="cycle-time-info">
                    <p class="info-title">Tasks with the longest cycle times by label were:</p>
                    <div class="info-list">
                      <div class="info-item">
                        <span class="label">Financeiro</span>
                        <span class="time">1d 08h</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Média prioridade</span>
                        <span class="time">1d 07h</span>
                      </div>
                      <div class="info-item">
                        <span class="label">CS</span>
                        <span class="time">23h 50m</span>
                      </div>
                    </div>

                    <p class="info-title mt-4">
                      Tasks with the shortest cycle times by label were:
                    </p>
                    <div class="info-list">
                      <div class="info-item">
                        <span class="label">No label</span>
                        <span class="time">2m 58s</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Marketing</span>
                        <span class="time">5h 00m</span>
                      </div>
                      <div class="info-item">
                        <span class="label">CX</span>
                        <span class="time">11h 30m</span>
                      </div>
                    </div>
                  </div>

                  <div class="cycle-time-chart">
                    <div class="chart-bars">
                      <div class="chart-item">
                        <span class="chart-label">Financeiro</span>
                        <div class="chart-bar" style="width: 100%">1d 08h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Média prioridade</span>
                        <div class="chart-bar" style="width: 95%">1d 07h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">CS</span>
                        <div class="chart-bar" style="width: 85%">23h 50m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Normal prioridade</span>
                        <div class="chart-bar" style="width: 75%">16h 28m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Alta prioridade</span>
                        <div class="chart-bar" style="width: 70%">15h 03m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">CX</span>
                        <div class="chart-bar" style="width: 50%">11h 30m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Marketing</span>
                        <div class="chart-bar" style="width: 25%">5h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">No label</span>
                        <div class="chart-bar" style="width: 10%">2m 58s</div>
                      </div>
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
                      <span class="stat-value">{{ dept.averageResolutionTime }}</span>
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
                        <img
                          v-if="task.assignee?.avatar"
                          :src="task.assignee.avatar"
                          :alt="task.assignee.name"
                          class="avatar"
                        />
                        <div v-else class="avatar-placeholder">
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
                  <h2 class="timings-title">TEMPOS POR SEGMENTO</h2>
                  <div class="timings-actions">
                    <button class="btn btn-outline secondary">
                      Por Setor
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <button class="btn btn-outline secondary">
                      3 meses
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
                        <th>TEMPO DE REAÇÃO (TEMPO ANTES DO INÍCIO DO TRABALHO)</th>
                        <th>TEMPO DE CICLO (TEMPO REAL DE TRABALHO)</th>
                        <th>TEMPO TOTAL (DA CRIAÇÃO À CONCLUSÃO)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CX</td>
                        <td>25</td>
                        <td>14h 39m</td>
                        <td>11h 30m</td>
                        <td>1d 02h</td>
                      </tr>
                      <tr>
                        <td>CS</td>
                        <td>22</td>
                        <td>7h 00m</td>
                        <td>23h 50m</td>
                        <td>1d 06h</td>
                      </tr>
                      <tr>
                        <td>Diretoria</td>
                        <td>18</td>
                        <td>4h 20m</td>
                        <td>8h 45m</td>
                        <td>13h 05m</td>
                      </tr>
                      <tr>
                        <td>Marketing</td>
                        <td>16</td>
                        <td>6h 15m</td>
                        <td>12h 30m</td>
                        <td>18h 45m</td>
                      </tr>
                      <tr>
                        <td>Vendas</td>
                        <td>15</td>
                        <td>5h 45m</td>
                        <td>10h 20m</td>
                        <td>16h 05m</td>
                      </tr>
                      <tr class="summary-row">
                        <td>Resumo</td>
                        <td>96</td>
                        <td>7h 36m</td>
                        <td>13h 23m</td>
                        <td>19h 12m</td>
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
                    <h2>CYCLE TIME PER SEGMENT</h2>
                  </div>
                  <div class="cycle-time-filters">
                    <button class="btn btn-outline secondary">
                      By Label
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <button class="btn btn-outline secondary">
                      3 months
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="cycle-time-content">
                  <div class="cycle-time-info">
                    <p class="info-title">Tasks with the longest cycle times by label were:</p>
                    <div class="info-list">
                      <div class="info-item">
                        <span class="label">Financeiro</span>
                        <span class="time">1d 08h</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Média prioridade</span>
                        <span class="time">1d 07h</span>
                      </div>
                      <div class="info-item">
                        <span class="label">CS</span>
                        <span class="time">23h 50m</span>
                      </div>
                    </div>

                    <p class="info-title mt-4">
                      Tasks with the shortest cycle times by label were:
                    </p>
                    <div class="info-list">
                      <div class="info-item">
                        <span class="label">No label</span>
                        <span class="time">2m 58s</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Marketing</span>
                        <span class="time">5h 00m</span>
                      </div>
                      <div class="info-item">
                        <span class="label">CX</span>
                        <span class="time">11h 30m</span>
                      </div>
                    </div>
                  </div>

                  <div class="cycle-time-chart">
                    <div class="chart-bars">
                      <div class="chart-item">
                        <span class="chart-label">Financeiro</span>
                        <div class="chart-bar" style="width: 100%">1d 08h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Média prioridade</span>
                        <div class="chart-bar" style="width: 95%">1d 07h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">CS</span>
                        <div class="chart-bar" style="width: 85%">23h 50m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Normal prioridade</span>
                        <div class="chart-bar" style="width: 75%">16h 28m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Alta prioridade</span>
                        <div class="chart-bar" style="width: 70%">15h 03m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">CX</span>
                        <div class="chart-bar" style="width: 50%">11h 30m</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">Marketing</span>
                        <div class="chart-bar" style="width: 25%">5h</div>
                      </div>
                      <div class="chart-item">
                        <span class="chart-label">No label</span>
                        <div class="chart-bar" style="width: 10%">2m 58s</div>
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
                          <span class="stat-value">{{
                            formatPercentage(dept.resolutionRate)
                          }}</span>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">Tempo Médio</span>
                          <span class="stat-value">{{ dept.averageResolutionTime }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tendências -->
            <div v-if="currentTab === 'trends'" class="tab-panel">
              <!-- Nova seção Created vs Completed em Tendências -->
              <div class="created-vs-completed">
                <div class="created-vs-completed-header">
                  <h2>CRIADOS VS CONCLUÍDOS</h2>
                  <div class="period-selector">
                    <button class="btn btn-outline secondary">
                      3 meses
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="created-vs-completed-content">
                  <div class="created-vs-completed-info">
                    <p class="info-title">Novos chamados criados vs concluídos</p>
                    <p class="info-text">
                      Você concluiu <span class="highlight">50 chamados</span> no total durante
                      <span class="highlight">3 meses</span>
                    </p>
                    <p class="info-text">
                      Você criou <span class="highlight">75 chamados</span> no total durante
                      <span class="highlight">3 meses</span>
                    </p>
                    <p class="info-trend">
                      Isso é <span class="trend-value">100% mais criados</span> e
                      <span class="trend-value">100% mais concluídos</span> comparado a
                      <span class="date-reference">16 de Janeiro, 2025</span>
                    </p>
                  </div>

                  <div class="created-vs-completed-chart">
                    <div class="chart-legend">
                      <div class="legend-item">
                        <span class="legend-color completed"></span>
                        <span>Concluídos (no período)</span>
                        <span class="legend-value">50</span>
                        <span class="legend-trend">↑ 100%</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color created"></span>
                        <span>Criados (no período)</span>
                        <span class="legend-value">75</span>
                        <span class="legend-trend">↑ 100%</span>
                      </div>
                    </div>

                    <div class="chart-container">
                      <Line
                        v-if="createdVsCompletedData"
                        :data="createdVsCompletedChartData"
                        :options="chartOptions"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="period-selector">
                <button
                  v-for="period in ['daily', 'weekly', 'monthly']"
                  :key="period"
                  @click="updateTrendPeriod(period as 'daily' | 'weekly' | 'monthly')"
                  :class="['period-button', { active: selectedTrendPeriod === period }]"
                >
                  {{ period === 'daily' ? 'Diário' : period === 'weekly' ? 'Semanal' : 'Mensal' }}
                </button>
              </div>

              <div class="chart-card">
                <div class="chart-wrapper">
                  <Line
                    v-if="trendData && trendChartData"
                    :data="trendChartData"
                    :options="chartOptions"
                  />
                  <div v-else class="loading-state">
                    <font-awesome-icon icon="spinner" spin class="loading-icon" />
                    <p class="loading-text">Carregando dados...</p>
                  </div>
                </div>
              </div>

              <!-- Nova seção de Cycle Time -->
              <div class="cycle-time-trend">
                <div class="cycle-time-trend-header">
                  <h2>TEMPO DE CICLO POR SEMANA/MÊS/TRIMESTRE</h2>
                  <div class="header-actions">
                    <button class="btn btn-outline secondary">
                      Por Semana
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <button class="btn btn-outline secondary">
                      3 meses
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="cycle-time-info">
                  <p>
                    Seu tempo de ciclo foi <strong>1d 03h</strong> na semana anterior (isso é
                    <span class="percentage-up">89.4% mais</span> que a semana anterior)
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
                  <h2>TEMPO DE CICLO POR ESTADO DO WORKFLOW</h2>
                  <div class="header-actions">
                    <button class="btn btn-outline secondary">
                      3 meses
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="workflow-analysis">
                  <div class="workflow-description">
                    <p>
                      Quanto tempo as tarefas permanecem em cada estado do workflow? Os estados em
                      que as tarefas permaneceram mais tempo foram:
                    </p>
                    <div class="workflow-state-list">
                      <div class="state-item">
                        <span class="state-name">Em Desenvolvimento</span>
                        <span class="state-time">15h 45m</span>
                      </div>
                      <div class="state-item">
                        <span class="state-name">Em Análise</span>
                        <span class="state-time">12h 30m</span>
                      </div>
                    </div>
                    <p class="workflow-note">
                      Estas são médias para as tarefas concluídas nos últimos 3 meses. Os estados do
                      workflow são baseados no seu mapeamento de fluxo.
                    </p>
                  </div>

                  <div class="workflow-chart">
                    <div class="time-scale">
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
                    <div class="chart-bars">
                      <div class="chart-bar">
                        <div class="bar-label">Em Desenvolvimento</div>
                        <div class="bar" style="width: 85%">15h 45m</div>
                      </div>
                      <div class="chart-bar">
                        <div class="bar-label">Em Análise</div>
                        <div class="bar" style="width: 65%">12h 30m</div>
                      </div>
                      <div class="chart-bar">
                        <div class="bar-label">Em Teste</div>
                        <div class="bar" style="width: 45%">8h 15m</div>
                      </div>
                      <div class="chart-bar">
                        <div class="bar-label">Aguardando Aprovação</div>
                        <div class="bar" style="width: 35%">6h 45m</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Seção de Ciclo de Tempo Em Andamento -->
              <div class="cycle-time-progress">
                <div class="cycle-time-progress-header">
                  <h2>CICLO DE TEMPO GASTO NO STATUS "EM ANDAMENTO"</h2>
                  <div class="header-actions">
                    <button class="btn btn-outline secondary">
                      3 meses
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                  </div>
                </div>

                <div class="progress-analysis">
                  <div class="progress-info">
                    <p>
                      Seu tempo médio de <strong>cycle time</strong> foi de
                      <strong>18h 29m</strong> para os
                      <span class="highlight">50 tasks</span> completados durante os
                      <span class="highlight">3 months</span>.
                    </p>
                    <p class="trend-info">
                      Isso é <span class="percentage-up">100% mais</span> que em 16 de Janeiro, 2025
                      (aumento é considerado ruim).
                    </p>
                    <p class="note-info">
                      Cycle time é o tempo gasto no status "Em Andamento", conforme especificado no
                      mapeamento do workflow.
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

                  <div class="progress-stats">
                    <div class="stat-item">
                      <span class="stat-value">18h 29m</span>
                      <span class="stat-label">Média últimos 3 meses</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-value">100%</span>
                      <span class="stat-label">Aumento no período</span>
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
                    @change="fetchCustomDateStats"
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
                    @change="fetchCustomDateStats"
                  />
                </div>
              </div>

              <div class="report-metrics">
                <div class="metric-item">
                  <div class="metric-label">Taxa de Aceitação</div>
                  <div class="metric-value">
                    {{ formatPercentage(customStats?.acceptanceRate) }}
                  </div>
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
import { ref, onMounted, computed } from 'vue';
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
} from 'chart.js';
import { Bar, Pie, Line } from 'vue-chartjs';
import { formatDate } from '@/utils/date';
// Comment out reportService import since we're using mock data
// import { reportService } from '@/services/reportService';
import type { TicketStatistics, ChartData } from '@/services/reportService';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

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
);

// Local type definitions
type TicketStatus = 'Em andamento' | 'Finalizado' | 'Atrasado' | 'Outro';
type TicketPriority = 'Alta' | 'Média' | 'Baixa';

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
            return ` ${value} chamados`;
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

const statistics = ref<TicketStatistics>({
  totalTickets: 0,
  openTickets: 0,
  closedTickets: 0,
  averageResolutionTime: '0 dias',
  averageAcceptanceTime: '0 dias',
  resolutionRate: 0,
  acceptanceRate: 0,
  ticketsByDepartment: [],
  ticketTrends: {
    daily: [],
    weekly: [],
    monthly: [],
  },
});

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
  { id: number; name: string; status: string; priority: string; createdAt: string }[]
>([]);

const statusClassMap: Record<TicketStatus, string> = {
  'Em andamento': 'bg-yellow-100 text-yellow-800',
  Finalizado: 'bg-green-100 text-green-800',
  Atrasado: 'bg-red-100 text-red-800',
  Outro: 'bg-gray-100 text-gray-800',
};

const getStatusClass = (status: string): string => {
  return statusClassMap[status as TicketStatus] || 'bg-gray-100 text-gray-800';
};

const priorityClassMap: Record<TicketPriority, string> = {
  Alta: 'bg-red-100 text-red-800',
  Média: 'bg-yellow-100 text-yellow-800',
  Baixa: 'bg-blue-100 text-blue-800',
};

const getPriorityClass = (priority: string): string => {
  return priorityClassMap[priority as TicketPriority] || 'bg-blue-100 text-blue-800';
};

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Mock data for now - replace with actual API calls when ready
    /*
    const [statsData, statusData, priorityData, ticketsData] = await Promise.all([
      reportService.getTicketStatistics(),
      reportService.getTicketsByStatus(),
      reportService.getTicketsByPriority(),
      reportService.getRecentTickets(10),
    ]);
    */

    // Mock statistics data
    const statsData: TicketStatistics = {
      totalTickets: 187,
      openTickets: 42,
      closedTickets: 145,
      averageResolutionTime: '3.2 dias',
      averageAcceptanceTime: '1.5 dias',
      resolutionRate: 0.78,
      acceptanceRate: 0.92,
      ticketsByDepartment: [
        {
          departmentId: 1,
          departmentName: 'TI',
          totalTickets: 65,
          resolvedTickets: 50,
          averageResolutionTime: '2.5 dias',
          resolutionRate: 0.77,
        },
        {
          departmentId: 2,
          departmentName: 'RH',
          totalTickets: 42,
          resolvedTickets: 35,
          averageResolutionTime: '3.7 dias',
          resolutionRate: 0.83,
        },
        {
          departmentId: 3,
          departmentName: 'Financeiro',
          totalTickets: 38,
          resolvedTickets: 28,
          averageResolutionTime: '4.1 dias',
          resolutionRate: 0.74,
        },
        {
          departmentId: 4,
          departmentName: 'Marketing',
          totalTickets: 21,
          resolvedTickets: 17,
          averageResolutionTime: '2.9 dias',
          resolutionRate: 0.81,
        },
        {
          departmentId: 5,
          departmentName: 'Operações',
          totalTickets: 21,
          resolvedTickets: 15,
          averageResolutionTime: '3.4 dias',
          resolutionRate: 0.71,
        },
      ],
      ticketTrends: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          total: Math.floor(Math.random() * 10) + 20,
          resolved: Math.floor(Math.random() * 8) + 15,
          created: Math.floor(Math.random() * 5) + 8,
        })),
        weekly: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          total: Math.floor(Math.random() * 20) + 40,
          resolved: Math.floor(Math.random() * 15) + 30,
          created: Math.floor(Math.random() * 10) + 20,
        })),
        monthly: Array.from({ length: 6 }, (_, i) => ({
          date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toISOString(),
          total: Math.floor(Math.random() * 40) + 80,
          resolved: Math.floor(Math.random() * 30) + 60,
          created: Math.floor(Math.random() * 20) + 40,
        })),
      },
    };

    // Mock status data
    const statusData: ChartData = {
      labels: ['Em andamento', 'Finalizado', 'Atrasado', 'Outro'],
      data: [42, 145, 15, 5],
    };

    // Mock priority data
    const priorityData: ChartData = {
      labels: ['Alta', 'Média', 'Baixa'],
      data: [27, 95, 65],
    };

    // Mock recent tickets
    const ticketsData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Ticket #${i + 100} - ${['Instalação de software', 'Problemas com impressora', 'Configuração de email', 'Conexão VPN', 'Atualização de sistema'][i % 5]}`,
      status: ['Em andamento', 'Finalizado', 'Atrasado'][i % 3] as string,
      priority: ['Alta', 'Média', 'Baixa'][i % 3] as string,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    }));

    statistics.value = statsData;
    ticketsByStatus.value = statusData;
    ticketsByPriority.value = priorityData;
    recentTickets.value = ticketsData;
  } catch (err: unknown) {
    console.error('Erro ao carregar dados dos relatórios:', err);
    error.value = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

const tabs = [
  { id: 'overview', name: 'Visão Geral', icon: 'chart-pie' },
  { id: 'in-progress', name: 'Em Andamento', icon: 'clock' },
  { id: 'department', name: 'Setores', icon: 'building' },
  { id: 'trends', name: 'Tendências', icon: 'chart-line' },
  { id: 'custom', name: 'Análise por Período', icon: 'calendar' },
];

const currentTab = ref('overview');
const customStats = ref<TicketStatistics | null>(null);

// Computed Properties para os Gráficos
const statusChartData = computed(() => ({
  labels: ticketsByStatus.value.labels,
  datasets: [
    {
      data: ticketsByStatus.value.data,
      backgroundColor: ['#2563eb', '#eab308', '#22c55e', '#9333ea'],
      borderWidth: 0,
    },
  ],
}));

const priorityChartData = computed(() => ({
  labels: ticketsByPriority.value.labels,
  datasets: [
    {
      data: ticketsByPriority.value.data,
      backgroundColor: ['#ef4444', '#eab308', '#2563eb'],
      borderWidth: 0,
    },
  ],
}));

const selectedTrendPeriod = ref<'daily' | 'weekly' | 'monthly'>('weekly');

const trendChartData = computed(() => {
  if (!statistics.value.ticketTrends[selectedTrendPeriod.value]) return null;

  const data = statistics.value.ticketTrends[selectedTrendPeriod.value];
  return {
    labels: data.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Total de Chamados',
        data: data.map((item) => item.total),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Chamados Resolvidos',
        data: data.map((item) => item.resolved),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Novos Chamados',
        data: data.map((item) => item.created),
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
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
    // Mock data for now - replace with actual API call when ready
    /*
    const data = await reportService.getTicketTrends(period);
    statistics.value.ticketTrends = data;
    */

    // We already have mock trend data in the statistics object, no need to fetch again
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

const fetchCustomDateStats = async () => {
  if (!dateRange.value.start || !dateRange.value.end) {
    error.value = 'Por favor, selecione um período válido.';
    return;
  }

  try {
    loading.value = true;

    // Mock data for now - replace with actual API call when ready
    /*
    customStats.value = await reportService.getCustomDateRangeStats(
      dateRange.value.start,
      dateRange.value.end,
    );
    */

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock custom date range statistics
    customStats.value = {
      totalTickets: Math.floor(Math.random() * 50) + 30,
      openTickets: Math.floor(Math.random() * 20) + 10,
      closedTickets: Math.floor(Math.random() * 30) + 20,
      averageResolutionTime: `${(Math.random() * 4 + 1).toFixed(1)} dias`,
      averageAcceptanceTime: `${(Math.random() * 2 + 0.5).toFixed(1)} dias`,
      resolutionRate: Math.random() * 0.3 + 0.6,
      acceptanceRate: Math.random() * 0.2 + 0.7,
      ticketsByDepartment: [
        {
          departmentId: 1,
          departmentName: 'TI',
          totalTickets: Math.floor(Math.random() * 20) + 10,
          resolvedTickets: Math.floor(Math.random() * 15) + 5,
          averageResolutionTime: `${(Math.random() * 3 + 1).toFixed(1)} dias`,
          resolutionRate: Math.random() * 0.3 + 0.6,
        },
        {
          departmentId: 2,
          departmentName: 'RH',
          totalTickets: Math.floor(Math.random() * 15) + 8,
          resolvedTickets: Math.floor(Math.random() * 10) + 5,
          averageResolutionTime: `${(Math.random() * 3 + 1).toFixed(1)} dias`,
          resolutionRate: Math.random() * 0.3 + 0.6,
        },
        {
          departmentId: 3,
          departmentName: 'Financeiro',
          totalTickets: Math.floor(Math.random() * 12) + 5,
          resolvedTickets: Math.floor(Math.random() * 8) + 3,
          averageResolutionTime: `${(Math.random() * 3 + 1).toFixed(1)} dias`,
          resolutionRate: Math.random() * 0.3 + 0.6,
        },
      ],
      ticketTrends: statistics.value.ticketTrends,
    };
  } catch (err: unknown) {
    console.error('Erro ao carregar estatísticas do período:', err);
    error.value =
      'Erro ao carregar estatísticas do período selecionado. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Computed Properties para Métricas
const departmentStats = computed(() => statistics.value.ticketsByDepartment);

const trendData = computed(() => statistics.value.ticketTrends[selectedTrendPeriod.value]);

const inProgressTasks = ref([
  {
    id: 1,
    name: 'Erro no sistema de impressão - Departamento Financeiro',
    assignee: {
      name: 'João Silva',
      initials: 'JS',
      avatar: null,
    },
    status: 'Em Andamento',
    timeInProgress: '6d 01h',
    isOverdue: true,
  },
  {
    id: 2,
    name: 'Configuração de novo servidor de e-mail',
    assignee: {
      name: 'Maria Santos',
      initials: 'MS',
      avatar: null,
    },
    status: 'Em Andamento',
    timeInProgress: '5d 20h',
    isOverdue: true,
  },
  {
    id: 3,
    name: 'Atualização do sistema operacional - Estações RH',
    assignee: {
      name: 'Pedro Costa',
      initials: 'PC',
      avatar: null,
    },
    status: 'Em Andamento',
    timeInProgress: '2d 01h',
    isOverdue: true,
  },
  {
    id: 4,
    name: 'Problema de acesso ao sistema CRM',
    assignee: {
      name: 'Bruno Santos',
      initials: 'BS',
      avatar: null,
    },
    status: 'Em Andamento',
    timeInProgress: '1d 18h',
    isOverdue: true,
  },
  {
    id: 5,
    name: 'Instalação de novo software de segurança',
    assignee: {
      name: 'Ana Lima',
      initials: 'AL',
      avatar: null,
    },
    status: 'Em Andamento',
    timeInProgress: '1d 16h',
    isOverdue: true,
  },
]);

// Dados para o gráfico Created vs Completed
const createdVsCompletedData = ref({
  labels: [
    'Jan 16',
    'Jan 27',
    'Jan 28',
    'Feb 5',
    'Feb 15',
    'Mar 2',
    'Mar 17',
    'Mar 27',
    'Apr 6',
    'Apr 11',
    'Apr 16',
  ],
  created: [10, 15, 20, 25, 30, 40, 45, 55, 65, 70, 75],
  completed: [5, 10, 15, 20, 25, 30, 35, 40, 45, 48, 50],
});

const createdVsCompletedChartData = computed(() => ({
  labels: createdVsCompletedData.value.labels,
  datasets: [
    {
      label: 'Concluídos (no período)',
      data: createdVsCompletedData.value.completed,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Criados (no período)',
      data: createdVsCompletedData.value.created,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}));
</script>

<style scoped>
.reports-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Loading State */
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
  flex: 1;
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
</style>
