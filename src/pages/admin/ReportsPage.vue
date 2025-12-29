<template>
  <div class="min-h-screen dark:bg-gray-900 p-3 sm:px-6 sm:py-4">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center z-40"
      style="top: var(--header-height)"
    >
      <div class="p-6 sm:p-8 flex flex-col items-center gap-4 mx-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-700 dark:text-gray-300 text-base sm:text-lg font-medium text-center">
          Carregando dados dos relatórios...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <font-awesome-icon
          icon="exclamation-circle"
          class="text-xl sm:text-2xl text-red-600 dark:text-red-400 mt-1"
        />
        <div class="flex-1">
          <p class="text-base sm:text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Erro ao carregar dados
          </p>
          <p class="text-sm sm:text-base text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
          <button
            @click="loadData"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors text-sm sm:text-base"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error" class="space-y-4 sm:space-y-6">
      <!-- Header -->
      <div class="space-y-3 sm:space-y-4">
        <div class="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1
              class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-0"
            >
              Relatórios do Sistema
            </h1>
          </div>
          <div class="flex gap-2 sm:gap-3">
            <button
              v-permission="PERMISSIONS.EXPORT_REPORTS && isAdmin"
              @click="openExportModal"
              class="flex items-center gap-2 px-3 sm:px-4 py-2 btn btn-primary text-xs sm:text-sm text-white rounded-md font-medium transition-colors"
            >
              <font-awesome-icon icon="file-export" />
              <span class="hidden sm:inline">Exportar Relatório</span>
              <span class="sm:hidden">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs + Global Stats Period Filter -->
      <div class="border-b border-[#d4d7db] dark:border-gray-700">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <nav class="flex overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="setReportsTab(tab.id)"
              :class="[
                'flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0',
                currentTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <font-awesome-icon :icon="tab.icon" class="text-xs sm:text-sm" />
              {{ tab.name }}
            </button>
          </nav>

          <!-- Global analysis period filter -->
          <div class="flex items-center gap-2 sm:gap-3 justify-end mb-1">
            <Select
              :options="[
                { value: 'weekly', label: 'Última semana' },
                { value: 'monthly', label: 'Último mês' },
                { value: 'trimestral', label: 'Últimos 3 meses' },
                { value: 'semestral', label: 'Últimos 6 meses' },
                { value: 'annual', label: 'Últimos 12 meses' },
              ]"
              v-model="selectedStatsPeriod"
              @update:modelValue="handlePeriodChange"
              class="w-36 sm:w-40"
            />
          </div>
        </div>
      </div>

      <!-- Metrics Grid - Only visible in Overview tab -->
      <div
        v-if="currentTab === 'overview'"
        class="bg-white dark:bg-gray-800 rounded-lg px-6 pt-4 pb-6 shadow"
      >
        <div class="mb-4">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Estatísticas gerais
          </h1>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Métricas e indicadores importantes do desempenho da sua empresa
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total de Tickets -->
          <div
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon icon="ticket" class="text-blue-500 dark:text-blue-400 text-2xl" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ statistics?.totalTickets || 0 }}
            </p>
            <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Total de Tarefas</h3>
          </div>

          <!-- Taxa de Resolução -->
          <div
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="chart-pie"
                class="text-purple-500 dark:text-purple-400 text-2xl"
              />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ formatPercentage(statistics?.resolutionRate) }}
            </p>
            <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Taxa de Resolução</h3>
          </div>

          <!-- Tempo Médio de Resolução -->
          <div
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="calendar-check"
                class="text-indigo-500 dark:text-indigo-400 text-2xl"
              />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ formatTimeInSecondsCompact(statistics?.averageResolutionTimeSeconds || 0) }}
            </p>
            <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Tempo Médio de Resolução
            </h3>
          </div>

          <!-- Tempo médio de Aceite -->
          <div
            class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30"
          >
            <div class="mb-3">
              <font-awesome-icon
                icon="hourglass-half"
                class="text-teal-600 dark:text-teal-400 text-2xl"
              />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ formatTimeInSecondsCompact(statistics?.averageAcceptanceTimeSeconds || 0) }}
            </p>
            <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Tempo médio de Aceite
            </h3>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="">
        <div>
          <!-- Overview Tab -->
          <div v-if="currentTab === 'overview'" class="space-y-6">
            <!-- Created vs Completed Section -->
            <BaseStatsWidget
              v-permission="PERMISSIONS.VIEW_BASIC_ANALYTICS"
              info-message="Esta visualização mostra a comparação entre tarefas criadas e concluídas ao longo do tempo. Use os filtros de período (Diário, Semanal, Mensal) para analisar diferentes intervalos."
            >
              <template #title>Criados vs Concluídos</template>
              <template #header-actions>
                <TabSelector
                  v-model="selectedTrendPeriod"
                  :options="[
                    { value: 'daily', label: 'Diário' },
                    { value: 'weekly', label: 'Semanal' },
                    { value: 'monthly', label: 'Mensal' },
                  ]"
                  @update:modelValue="updateTrendPeriod"
                />
              </template>

              <div class="flex flex-col lg:flex-row">
                <div class="px-6 py-3 w-full">
                  <div class="h-80 relative">
                    <Bar
                      v-if="trendData && trendData.length > 0 && !trendChartLoading"
                      :data="createdVsCompletedChartData"
                      :options="createdVsCompletedChartOptions"
                    />
                    <div
                      v-if="trendChartLoading || !trendData || trendData.length === 0"
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-2xl mb-3" />
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                </div>
              </div>
            </BaseStatsWidget>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Status Chart -->
              <BaseStatsWidget
                info-message="Esta visualização mostra a distribuição percentual de tarefas por status no período selecionado. O gráfico de rosca exibe a proporção de cada status em relação ao total de tarefas."
              >
                <template #title>Distribuição por Status</template>

                <div class="flex flex-col md:flex-row">
                  <div class="w-full md:w-2/3 h-64">
                    <Doughnut
                      v-if="ticketsByStatus.labels.length && hasStatusData"
                      :data="statusChartData"
                      :options="chartOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="circle-info" class="text-xl mb-2" />
                      <p class="text-sm font-medium">Sem dados para exibir</p>
                      <p class="text-xs mt-1">
                        Ajuste filtros ou período para visualizar resultados
                      </p>
                    </div>
                  </div>

                  <div class="w-full md:w-1/3 mt-4 md:mt-0 md:ml-6">
                    <div class="space-y-3">
                      <div
                        v-for="(label, idx) in statusChartData.labels"
                        :key="label"
                        class="flex items-center gap-3"
                      >
                        <span
                          class="w-3 h-3 rounded-full"
                          :style="{
                            backgroundColor: statusChartData.datasets[0].backgroundColor[idx],
                          }"
                        ></span>
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>

              <!-- Priority Chart -->
              <BaseStatsWidget
                info-message="Esta visualização mostra a distribuição percentual de tarefas por prioridade no período selecionado. O gráfico de rosca exibe a proporção de cada nível de prioridade em relação ao total de tarefas."
              >
                <template #title>Distribuição por Prioridade</template>

                <div class="flex flex-col md:flex-row">
                  <div class="w-full md:w-2/3 h-64">
                    <Doughnut
                      v-if="ticketsByPriority.labels.length && hasPriorityData"
                      :data="priorityChartData"
                      :options="chartOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="circle-info" class="text-xl mb-2" />
                      <p class="text-sm font-medium">Sem dados para exibir</p>
                      <p class="text-xs mt-1">
                        Ajuste filtros ou período para visualizar resultados
                      </p>
                    </div>
                  </div>

                  <div class="w-full md:w-1/3 mt-4 md:mt-0 md:ml-6">
                    <div class="space-y-3">
                      <div
                        v-for="(label, idx) in priorityChartData.labels"
                        :key="label"
                        class="flex items-center gap-3"
                      >
                        <span
                          class="w-3 h-3 rounded-full"
                          :style="{
                            backgroundColor: priorityChartData.datasets[0].backgroundColor[idx],
                          }"
                        ></span>
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Top Contributors -->
              <BaseStatsWidget
                v-permission="PERMISSIONS.VIEW_USERS_ANALYTICS"
                info-message="Ranking dos colaboradores com melhor desempenho no período selecionado. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%), utilizando o modelo Wilson para correção estatística. Nota: Para ter um score, o colaborador precisa ter pelo menos 10 tarefas atribuídas no período."
              >
                <template #title>Top Colaboradores</template>
                <template #subtitle>{{ currentPeriodLabel }}</template>
                <template #header-actions>
                  <Select
                    :options="[
                      { value: 'efficiency', label: 'Score' },
                      { value: 'resolution_time', label: 'Tempo de Resolução' },
                      { value: 'overdue_rate', label: 'Taxa de Atraso' },
                    ]"
                    v-model="topUsersSortBy"
                    @update:modelValue="handleTopUsersSortByChange"
                    class="w-48"
                  />
                </template>

                <div>
                  <!-- Table Headers -->
                  <div
                    class="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <div>Perfil</div>
                    <div class="text-center">Setor</div>
                    <div class="text-center">
                      {{
                        topUsersSortBy === 'efficiency'
                          ? 'Score'
                          : topUsersSortBy === 'resolution_time'
                            ? 'Tempo de Resolução'
                            : 'Taxa de Atraso'
                      }}
                    </div>
                  </div>

                  <!-- Table Content -->
                  <!-- Loading Skeleton -->
                  <div v-if="topUsersLoading" class="space-y-4 mt-4">
                    <div
                      v-for="i in 5"
                      :key="`skeleton-${i}`"
                      class="grid grid-cols-3 gap-4 items-center py-3"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-custom"
                        ></div>
                        <div class="hidden sm:block space-y-2 flex-1">
                          <div
                            class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse-custom"
                          ></div>
                        </div>
                      </div>
                      <div class="text-center">
                        <div
                          class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto animate-pulse-custom"
                        ></div>
                      </div>
                      <div class="text-center">
                        <div
                          class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mx-auto animate-pulse-custom"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="topFiveUsers && topFiveUsers.users.length > 0"
                    class="space-y-4 mt-4"
                  >
                    <div
                      v-for="user in topFiveUsers.users"
                      :key="user.userId"
                      class="grid grid-cols-3 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          :class="[
                            'w-12 h-12 rounded-full flex items-center justify-center text-base font-bold',
                            getAvatarColorClass(user.userId),
                          ]"
                        >
                          <div v-if="!user.avatarUrl">
                            {{ getInitials(user.firstName, user.lastName) }}
                          </div>
                          <img
                            v-else
                            :src="user.avatarUrl"
                            :alt="`${user.firstName} ${user.lastName}`"
                            class="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div class="min-w-0 hidden sm:block">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ user.firstName }} {{ user.lastName }}
                          </p>
                        </div>
                      </div>
                      <div class="text-center">
                        <span class="text-sm text-gray-900 dark:text-white">{{
                          user.departmentName
                        }}</span>
                      </div>
                      <div class="text-center">
                        <span
                          v-if="topUsersSortBy === 'efficiency'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          {{ formatPercentage(user.efficiencyScore) }}
                        </span>
                        <span
                          v-else-if="topUsersSortBy === 'resolution_time'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        >
                          {{ formatTimeInSecondsCompact(user.averageResolutionTimeSeconds || 0) }}
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        >
                          {{ formatPercentage(user.deliveryOverdueRate / 100) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="!topFiveUsers"
                    class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                    <p class="text-sm">Carregando colaboradores...</p>
                  </div>

                  <div
                    v-else
                    class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="info-circle" class="text-xl mb-2" />
                    <p class="text-sm text-center">
                      {{
                        topUsersSortBy === 'efficiency'
                          ? 'Nenhum colaborador com 10+ tarefas encontrado'
                          : 'Nenhum colaborador encontrado'
                      }}
                    </p>
                    <p
                      v-if="topUsersSortBy === 'efficiency'"
                      class="text-xs text-center mt-1 text-gray-400 dark:text-gray-500"
                    >
                      Score requer mínimo de 10 tarefas
                    </p>
                  </div>
                </div>
              </BaseStatsWidget>

              <!-- Top Setores -->
              <BaseStatsWidget
                v-permission="PERMISSIONS.VIEW_DEPARTMENT_ANALYTICS"
                info-message="Ranking dos setores com melhor desempenho no período selecionado. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%), utilizando o modelo Wilson para correção estatística."
              >
                <template #title>Top Setores</template>
                <template #subtitle>{{ currentPeriodLabel }}</template>
                <template #header-actions>
                  <Select
                    :options="[
                      { value: 'efficiency', label: 'Score' },
                      { value: 'resolution_time', label: 'Tempo de Resolução' },
                      { value: 'overdue_rate', label: 'Taxa de Atraso' },
                    ]"
                    v-model="topDepartmentsSortBy"
                    @update:modelValue="handleTopDepartmentsSortByChange"
                    class="w-48"
                  />
                </template>

                <div>
                  <!-- Table Headers -->
                  <div
                    class="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <div>Setor</div>
                    <div class="text-center">Tarefas totais</div>
                    <div class="text-center">
                      {{
                        topDepartmentsSortBy === 'efficiency'
                          ? 'Score'
                          : topDepartmentsSortBy === 'resolution_time'
                            ? 'Tempo de Resolução'
                            : 'Taxa de Atraso'
                      }}
                    </div>
                  </div>

                  <!-- Table Content -->
                  <!-- Loading Skeleton -->
                  <div v-if="topDepartmentsLoading" class="space-y-4 mt-4">
                    <div
                      v-for="i in 5"
                      :key="`skeleton-dept-${i}`"
                      class="grid grid-cols-3 gap-4 items-center py-3"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-custom"
                        ></div>
                        <div class="space-y-2 flex-1">
                          <div
                            class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse-custom"
                          ></div>
                        </div>
                      </div>
                      <div class="text-center">
                        <div
                          class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto animate-pulse-custom"
                        ></div>
                      </div>
                      <div class="text-center">
                        <div
                          class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mx-auto animate-pulse-custom"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="topFiveDepartments && topFiveDepartments.length > 0"
                    class="space-y-4 mt-4"
                  >
                    <div
                      v-for="dept in topFiveDepartments"
                      :key="dept.departmentId"
                      class="grid grid-cols-3 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          :class="[
                            'w-12 h-12 rounded-full flex items-center justify-center text-base font-bold',
                            getAvatarColorClass(dept.departmentId),
                          ]"
                        >
                          <font-awesome-icon icon="building" class="w-5 h-5" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ dept.departmentName }}
                          </p>
                        </div>
                      </div>
                      <div class="text-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
                          dept.totalTickets
                        }}</span>
                      </div>
                      <div class="text-center">
                        <template v-if="topDepartmentsSortBy === 'efficiency'">
                          <span
                            v-if="dept.efficiencyScore !== undefined"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          >
                            {{ formatPercentage(dept.efficiencyScore) }}
                          </span>
                          <span v-else class="text-gray-400 dark:text-gray-500"> - </span>
                        </template>
                        <span
                          v-else-if="topDepartmentsSortBy === 'resolution_time'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        >
                          {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds || 0) }}
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        >
                          {{ formatPercentage(dept.deliveryOverdueRate / 100) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="!departmentStats || departmentStats.length === 0"
                    class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                    <p class="text-sm">Carregando setores...</p>
                  </div>

                  <div
                    v-else
                    class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="info-circle" class="text-xl mb-2" />
                    <p class="text-sm text-center">
                      {{
                        topDepartmentsSortBy === 'efficiency'
                          ? 'Nenhum setor com 10+ tarefas encontrado'
                          : 'Nenhum setor encontrado'
                      }}
                    </p>
                    <p
                      v-if="topDepartmentsSortBy === 'efficiency'"
                      class="text-xs text-center mt-1 text-gray-400 dark:text-gray-500"
                    >
                      Score requer mínimo de 10 tarefas
                    </p>
                  </div>
                </div>
              </BaseStatsWidget>
            </div>

            <!-- Cycle Time Section -->
            <div
              v-permission="PERMISSIONS.VIEW_ADVANCED_ANALYTICS"
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <!-- Cycle Time per Department -->
              <BaseStatsWidget
                info-message="Esta análise mostra o tempo médio de resolução de tarefas por setor. Os dados são apresentados com setores com maior e menor tempo de resolução, além de uma visualização gráfica com barras proporcionais ao tempo de cada setor."
              >
                <template #title>Tempo de Resolução Por Setor</template>

                <div class="px-6 py-1">
                  <div class="space-y-3">
                    <template v-if="sortedDepartmentsByResolutionTime.length">
                      <div
                        v-for="dept in sortedDepartmentsByResolutionTime"
                        :key="dept.departmentId"
                        class="space-y-1"
                      >
                        <div class="flex justify-between items-center text-[13px]">
                          <span class="text-gray-700 dark:text-gray-300">{{
                            dept.departmentName
                          }}</span>
                          <span class="font-medium text-gray-900 dark:text-white">
                            {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds) }}
                          </span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            class="h-2 rounded-full relative"
                            :class="{
                              'min-w-[2px]': dept.averageResolutionTimeSeconds === 0,
                            }"
                            :style="{
                              width:
                                dept.averageResolutionTimeSeconds === 0
                                  ? '2px'
                                  : getBarWidth(dept.averageResolutionTimeSeconds),
                              backgroundColor: getBarColor(dept.averageResolutionTimeSeconds),
                            }"
                          ></div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="h-40 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                      >
                        <font-awesome-icon icon="circle-info" class="text-xl mb-2" />
                        <p class="text-sm font-medium">Sem dados para exibir</p>
                        <p class="text-xs mt-1">
                          Ainda não há durações registradas no período selecionado
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </BaseStatsWidget>

              <!-- Status Duration Chart -->
              <BaseStatsWidget
                info-message="Esta análise mostra quanto tempo em média as tarefas permanecem em cada status. Tempos altos em determinados status podem indicar gargalos no processo. Os dados são apresentados com barras proporcionais ao tempo médio de cada status."
              >
                <template #title>Tempo Médio Por Status</template>

                <div class="flex flex-col lg:flex-row">
                  <div class="px-6 py-1 w-full">
                    <div class="space-y-3">
                      <template v-if="sortedStatusDurations.length">
                        <div
                          v-for="(duration, index) in sortedStatusDurations"
                          :key="index"
                          class="space-y-1"
                        >
                          <div class="flex justify-between items-center text-[13px]">
                            <span class="text-gray-700 dark:text-gray-300">{{
                              formatSnakeToNaturalCase(
                                (duration.status as any)?.key ??
                                  (duration.status as unknown as string),
                              )
                            }}</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ formatTimeInSecondsCompact(duration.averageDurationSeconds) }}
                            </span>
                          </div>
                          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              :class="{
                                'min-w-[2px]': duration.averageDurationSeconds === 0,
                              }"
                              :style="{
                                width: getStatusBarWidth(duration.averageDurationSeconds),
                              }"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>
            </div>
          </div>

          <!-- Custom Period Analysis Tab -->
          <div v-if="currentTab === 'custom'" class="space-y-6">
            <div class="flex gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Data Inicial</label
                >
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
                  :input-class="'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'"
                  :placeholder-class="'text-gray-500 dark:text-gray-400'"
                  :clear-icon="false"
                  :confirm="false"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Data Final</label
                >
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
                  :input-class="'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'"
                  :placeholder-class="'text-gray-500 dark:text-gray-400'"
                  :clear-icon="false"
                  :confirm="false"
                />
              </div>
            </div>
          </div>

          <!-- Em Andamento Tab -->
          <div v-if="currentTab === 'in-progress'" class="space-y-6">
            <!-- In Progress Overview Card -->
            <InProgressTasksTable :tasks="inProgressTasks" :is-loading="loadingInProgressTasks" />

            <!-- In Progress Time Analysis -->
            <BaseStatsWidget
              v-permission="PERMISSIONS.VIEW_BASIC_ANALYTICS"
              info-message="Esta análise mostra a distribuição de tarefas em andamento por tempo de processamento, apresentada em porcentagem. Os dados incluem distribuição por faixas de tempo (menos de 1 dia, 1-3 dias, 3-7 dias, mais de 1 semana)."
            >
              <template #title>Análise de Tempo em Andamento</template>

              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Distribuição por Tempo
                </h3>
                <div class="flex flex-wrap gap-5 justify-between">
                  <!-- Menos de 1 semana (< 7 dias = 604800 segundos) -->
                  <div
                    class="rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] w-[18%] min-w-[100px]"
                    :style="
                      getCardBackgroundStyle(
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter((t) => t.timeInProgressSeconds < 604800)
                                .length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0,
                      )
                    "
                  >
                    <div
                      class="text-xl font-bold mb-1"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter((t) => t.timeInProgressSeconds < 604800)
                                  .length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#1f2937',
                      }"
                    >
                      {{
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter((t) => t.timeInProgressSeconds < 604800)
                                .length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0
                      }}%
                    </div>
                    <div
                      class="text-xs text-center leading-tight"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter((t) => t.timeInProgressSeconds < 604800)
                                  .length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#6b7280',
                      }"
                    >
                      Menos de 1 semana
                    </div>
                  </div>
                  <!-- 1-2 semanas (7-14 dias = 604800 - 1209600 segundos) -->
                  <div
                    class="rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] w-[18%] min-w-[100px]"
                    :style="
                      getCardBackgroundStyle(
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 604800 &&
                                  t.timeInProgressSeconds < 1209600,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0,
                      )
                    "
                  >
                    <div
                      class="text-xl font-bold mb-1"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 604800 &&
                                    t.timeInProgressSeconds < 1209600,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#1f2937',
                      }"
                    >
                      {{
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 604800 &&
                                  t.timeInProgressSeconds < 1209600,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0
                      }}%
                    </div>
                    <div
                      class="text-xs text-center leading-tight"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 604800 &&
                                    t.timeInProgressSeconds < 1209600,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#6b7280',
                      }"
                    >
                      1-2 semanas
                    </div>
                  </div>
                  <!-- 2-3 semanas (14-21 dias = 1209600 - 1814400 segundos) -->
                  <div
                    class="rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] w-[18%] min-w-[100px]"
                    :style="
                      getCardBackgroundStyle(
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 1209600 &&
                                  t.timeInProgressSeconds < 1814400,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0,
                      )
                    "
                  >
                    <div
                      class="text-xl font-bold mb-1"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 1209600 &&
                                    t.timeInProgressSeconds < 1814400,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#1f2937',
                      }"
                    >
                      {{
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 1209600 &&
                                  t.timeInProgressSeconds < 1814400,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0
                      }}%
                    </div>
                    <div
                      class="text-xs text-center leading-tight"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 1209600 &&
                                    t.timeInProgressSeconds < 1814400,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#6b7280',
                      }"
                    >
                      2-3 semanas
                    </div>
                  </div>
                  <!-- 3-4 semanas (21-28 dias = 1814400 - 2419200 segundos) -->
                  <div
                    class="rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] w-[18%] min-w-[100px]"
                    :style="
                      getCardBackgroundStyle(
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 1814400 &&
                                  t.timeInProgressSeconds < 2419200,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0,
                      )
                    "
                  >
                    <div
                      class="text-xl font-bold mb-1"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 1814400 &&
                                    t.timeInProgressSeconds < 2419200,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#1f2937',
                      }"
                    >
                      {{
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter(
                                (t) =>
                                  t.timeInProgressSeconds >= 1814400 &&
                                  t.timeInProgressSeconds < 2419200,
                              ).length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0
                      }}%
                    </div>
                    <div
                      class="text-xs text-center leading-tight"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter(
                                  (t) =>
                                    t.timeInProgressSeconds >= 1814400 &&
                                    t.timeInProgressSeconds < 2419200,
                                ).length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#6b7280',
                      }"
                    >
                      3-4 semanas
                    </div>
                  </div>
                  <!-- Acima de 1 mês (>= 28 dias = 2419200 segundos) -->
                  <div
                    class="rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] w-[18%] min-w-[100px]"
                    :style="
                      getCardBackgroundStyle(
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter((t) => t.timeInProgressSeconds >= 2419200)
                                .length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0,
                      )
                    "
                  >
                    <div
                      class="text-xl font-bold mb-1"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter((t) => t.timeInProgressSeconds >= 2419200)
                                  .length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#1f2937',
                      }"
                    >
                      {{
                        inProgressTasks.length > 0
                          ? Math.round(
                              (inProgressTasks.filter((t) => t.timeInProgressSeconds >= 2419200)
                                .length /
                                inProgressTasks.length) *
                                100,
                            )
                          : 0
                      }}%
                    </div>
                    <div
                      class="text-xs text-center leading-tight"
                      :style="{
                        color:
                          (inProgressTasks.length > 0
                            ? Math.round(
                                (inProgressTasks.filter((t) => t.timeInProgressSeconds >= 2419200)
                                  .length /
                                  inProgressTasks.length) *
                                  100,
                              )
                            : 0) >= 50
                            ? '#ffffff'
                            : '#6b7280',
                      }"
                    >
                      Acima de 1 mês
                    </div>
                  </div>
                </div>
              </div>
            </BaseStatsWidget>
          </div>

          <!-- Setores Tab -->
          <div v-if="currentTab === 'department'" class="space-y-6">
            <!-- Content visible if user has permission -->
            <template v-if="hasPermission(PERMISSIONS.VIEW_DEPARTMENT_ANALYTICS)">
              <!-- Department Summary Card -->
              <DepartmentStatsTable
                :stats="departmentStatsData?.items || []"
                :total-items="departmentStatsData?.total || 0"
                :current-page="departmentStatsPage"
                :items-per-page="departmentStatsLimit"
                :summary="departmentStatsSummary"
                :is-loading="departmentStatsLoading"
                @page-change="handleDepartmentStatsPageChange"
                @sort-change="handleDepartmentStatsSortChange"
                @search-change="handleDepartmentStatsSearchChange"
              />

              <!-- Top Performing vs Underperforming Departments -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Performing -->
                <BaseStatsWidget
                  info-message="Esta seção mostra os setores com melhor Score. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%)."
                >
                  <template #title>Maiores Scores</template>
                  <template #subtitle>Setores com maior Score</template>

                  <div>
                    <template v-if="topPerformingDepartments.length > 0">
                      <div class="space-y-4">
                        <div
                          v-for="dept in topPerformingDepartments"
                          :key="dept.departmentId"
                          class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <div>
                            <div class="font-medium text-gray-900 dark:text-white">
                              {{ dept.departmentName }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                              {{ dept.resolvedTickets }}/{{ dept.totalTickets }} tarefas
                            </div>
                          </div>
                          <div class="text-lg font-bold text-green-600 dark:text-green-400">
                            {{ formatPercentage(dept.efficiencyScore) }}
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
                      >
                        <font-awesome-icon
                          icon="building"
                          class="text-2xl text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Não há setores com bom desempenho
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Os setores aparecerão aqui quando atingirem um bom Score de Desempenho
                      </p>
                    </div>
                  </div>
                </BaseStatsWidget>

                <!-- Needs Improvement -->
                <BaseStatsWidget
                  info-message="Esta seção mostra os setores com menor Score. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%)."
                >
                  <template #title>Menores Scores</template>
                  <template #subtitle>Setores com menor Score</template>

                  <div>
                    <template v-if="worstPerformingDepartments.length > 0">
                      <div class="space-y-4">
                        <div
                          v-for="dept in worstPerformingDepartments"
                          :key="dept.departmentId"
                          class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <div>
                            <div class="font-medium text-gray-900 dark:text-white">
                              {{ dept.departmentName }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                              {{ dept.resolvedTickets }}/{{ dept.totalTickets }} tarefas
                            </div>
                          </div>
                          <div class="text-lg font-bold text-red-600 dark:text-red-400">
                            {{ formatPercentage(dept.efficiencyScore) }}
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
                      >
                        <font-awesome-icon
                          icon="building"
                          class="text-2xl text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Não há setores com baixo desempenho
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Todos os setores estão com um bom score de Desempenho
                      </p>
                    </div>
                  </div>
                </BaseStatsWidget>
              </div>
            </template>

            <!-- Upgrade prompt if user doesn't have permission -->
            <div
              v-else
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700"
            >
              <div class="p-12 text-center">
                <div
                  class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <font-awesome-icon
                    icon="lock"
                    class="text-2xl text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics de Setor Necessários
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Acesse estatísticas detalhadas por setor, performance de setores e análises
                  comparativas de produtividade.
                </p>
                <router-link
                  to="/assinaturas"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  <font-awesome-icon icon="arrow-up" />
                  Fazer Upgrade do Plano
                </router-link>
              </div>
            </div>
          </div>

          <div v-if="currentTab === 'users'" class="space-y-6">
            <template v-if="hasPermission(PERMISSIONS.VIEW_USERS_ANALYTICS)">
              <!-- Users Summary Card -->
              <UserStatsTable
                :users="userStatsData?.items || []"
                :total-items="userStatsData?.total || 0"
                :current-page="userStatsPage"
                :items-per-page="userStatsLimit"
                :average-resolution-time-seconds="statistics?.averageResolutionTimeSeconds"
                :average-acceptance-time-seconds="statistics?.averageAcceptanceTimeSeconds"
                :is-loading="userStatsLoading"
                @page-change="handleUserStatsPageChange"
                @sort-change="handleUserStatsSortChange"
                @search-change="handleUserStatsSearchChange"
              />

              <!-- Top vs Underperforming Users -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BaseStatsWidget
                  info-message="Esta seção mostra os colaboradores com melhor Score. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%)."
                >
                  <template #title>Maiores Scores</template>
                  <template #subtitle>Colaboradores com maior Score</template>

                  <div>
                    <template v-if="topPerformers.length > 0">
                      <div class="space-y-4">
                        <div
                          v-for="user in topPerformers"
                          :key="`best-${user.userId}`"
                          class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <div>
                            <div class="font-medium text-gray-900 dark:text-white">
                              {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                              {{ user.resolvedTickets }}/{{ user.totalTickets }} tarefas
                            </div>
                          </div>
                          <div class="text-lg font-bold text-green-600 dark:text-green-400">
                            {{ formatPercentage(user.efficiencyScore) }}
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
                      >
                        <font-awesome-icon
                          icon="user-check"
                          class="text-2xl text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Não há colaboradores com bom desempenho
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Os colaboradores aparecerão aqui quando atingirem um bom Score de Desempenho
                      </p>
                    </div>
                  </div>
                </BaseStatsWidget>

                <BaseStatsWidget
                  info-message="Esta seção mostra os colaboradores com menor Score. O Score é um índice abrangente (0-100%) que pondera: Conclusão no prazo (35%), Verificação no prazo (30%), Taxa de Reprovação (25%) e Taxa de Devolução (10%)."
                >
                  <template #title>Menores Scores</template>
                  <template #subtitle>Colaboradores com menor Score</template>

                  <div>
                    <template v-if="worstPerformers.length > 0">
                      <div class="space-y-4">
                        <div
                          v-for="user in worstPerformers"
                          :key="`worst-${user.userId}`"
                          class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <div>
                            <div class="font-medium text-gray-900 dark:text-white">
                              {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                              {{ user.resolvedTickets }}/{{ user.totalTickets }} tarefas
                            </div>
                          </div>
                          <div class="text-lg font-bold text-red-600 dark:text-red-400">
                            {{ formatPercentage(user.efficiencyScore) }}
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-else
                      class="flex flex-col items-center justify-center min-h-[300px] text-center"
                    >
                      <div
                        class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
                      >
                        <font-awesome-icon
                          icon="user-times"
                          class="text-2xl text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Não há colaboradores com baixo desempenho
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Todos os colaboradores estão com um bom score de Desempenho
                      </p>
                    </div>
                  </div>
                </BaseStatsWidget>
              </div>
            </template>

            <div
              v-else
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700"
            >
              <div class="p-12 text-center">
                <div
                  class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <font-awesome-icon
                    icon="lock"
                    class="text-2xl text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics de Colaboradores Necessários
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Acesse estatísticas detalhadas por colaborador e rankings de produtividade.
                </p>
                <router-link
                  to="/assinaturas"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  <font-awesome-icon icon="arrow-up" />
                  Fazer Upgrade do Plano
                </router-link>
              </div>
            </div>
          </div>

          <!-- Tendências Tab -->
          <div v-if="currentTab === 'trends'" class="space-y-6">
            <!-- Content visible if user has permission -->
            <template v-if="hasPermission(PERMISSIONS.VIEW_ADVANCED_ANALYTICS)">
              <!-- Period Analysis Header -->
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Análise de Tendências
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400">
                    Acompanhe as tendências das tarefas ao longo do tempo
                  </p>
                </div>
              </div>

              <!-- Trends Overview -->
              <BaseStatsWidget
                info-message="Esta visualização mostra a comparação entre tarefas criadas e concluídas ao longo do tempo. Use os filtros de período (Diário, Semanal, Mensal) para analisar diferentes intervalos."
              >
                <template #title>Criados vs Concluídos</template>
                <template #subtitle>Novas tarefas criadas vs tarefas concluídas</template>
                <template #header-actions>
                  <TabSelector
                    v-model="selectedTrendPeriod"
                    :options="[
                      { value: 'daily', label: 'Diário' },
                      { value: 'weekly', label: 'Semanal' },
                      { value: 'monthly', label: 'Mensal' },
                    ]"
                    @update:modelValue="updateTrendPeriod"
                  />
                </template>

                <div>
                  <div class="h-80 relative">
                    <Bar
                      v-if="trendChartData && !trendChartLoading"
                      :data="trendChartData"
                      :options="trendChartOptions"
                    />
                    <div
                      v-if="trendChartLoading || !trendChartData"
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-2xl mb-3" />
                      <p>Carregando dados de tendências...</p>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>

              <!-- Cycle Time Analysis -->
              <BaseStatsWidget
                info-message="Esta análise mostra a evolução do tempo de resolução de tarefas ao longo do tempo. O gráfico exibe uma linha temporal com o tempo médio de resolução, permitindo identificar tendências e variações. Use o seletor de período para analisar diferentes intervalos (Semanal, Mensal, Trimestral)."
              >
                <template #title>Tempo de Resolução - Análise Temporal</template>
                <template #header-actions>
                  <Select
                    :options="[
                      { value: 'week', label: 'Semanal' },
                      { value: 'month', label: 'Mensal' },
                      { value: 'quarter', label: 'Trimestral' },
                    ]"
                    v-model="selectedCycleTimePeriod"
                    @update:modelValue="handleCycleTimePeriodChange"
                  />
                </template>

                <div class="flex flex-col lg:flex-row">
                  <div class="p-6 lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
                    <div class="space-y-4">
                      <div class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span
                          class="block text-lg font-semibold text-gray-900 dark:text-white mb-1"
                        >
                          {{ formatTimeInSecondsCompact(getLatestResolutionTime() * 3600) }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          Média {{ periodTextMap[selectedCycleTimePeriod] }}
                          <span v-if="getPeriodName()"> ({{ getPeriodName() }})</span>
                        </span>
                      </div>

                      <div
                        v-if="hasPreviousPeriodData()"
                        class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div class="flex items-center justify-center gap-2 mb-1">
                          <font-awesome-icon
                            :icon="getResolutionTimeTrend() > 0 ? 'arrow-up' : 'arrow-down'"
                            :class="
                              getResolutionTimeTrend() > 0
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            "
                          />
                          <span
                            :class="
                              getResolutionTimeTrend() > 0
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-green-600 dark:text-green-400'
                            "
                            class="font-semibold text-lg"
                          >
                            {{ Math.abs(getResolutionTimeTrend()) }}%
                          </span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          vs {{ getPreviousPeriodLabel() }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 lg:w-2/3">
                    <div :key="chartRenderKey" class="h-80">
                      <div
                        v-if="cycleTimeChartLoading"
                        class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                      >
                        <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                        <p class="text-sm">Atualizando gráfico...</p>
                      </div>
                      <Line
                        v-else-if="cycleTimeBarData && cycleTimeBarData.labels.length"
                        :data="cycleTimeBarData"
                        :options="cycleTimeBarOptions"
                      />
                      <div
                        v-else
                        class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                      >
                        <font-awesome-icon icon="chart-line" class="text-2xl mb-2" />
                        <p class="text-sm">Nenhum dado disponível para o período selecionado</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>

              <!-- In Progress Time Analysis -->
              <BaseStatsWidget
                info-message="Esta análise mostra o tempo gasto pelas tarefas no status 'Em Andamento' ao longo do tempo. O gráfico exibe uma linha temporal com o tempo médio, permitindo identificar tendências. Tempos altos podem indicar gargalos no processamento de tarefas. Use o seletor de período para analisar diferentes intervalos (Semanal, Mensal, Trimestral)."
              >
                <template #title>Tempo Gasto no Status "Em Andamento"</template>
                <template #header-actions>
                  <Select
                    :options="[
                      { value: 'week', label: 'Semanal' },
                      { value: 'month', label: 'Mensal' },
                      { value: 'quarter', label: 'Trimestral' },
                    ]"
                    v-model="selectedInProgressPeriod"
                    @update:modelValue="handleInProgressPeriodChange"
                  />
                </template>

                <div class="flex flex-col lg:flex-row">
                  <div class="p-6 lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
                    <div class="space-y-4 text-sm">
                      <p
                        v-if="inProgressTimeSeries?.data?.length"
                        class="text-gray-700 dark:text-gray-300"
                      >
                        O tempo médio foi de
                        <strong class="text-gray-900 dark:text-white">{{
                          formatTimeInSecondsCompact(inProgressTimeSeries.averageDuration)
                        }}</strong>
                        para
                        <span class="font-semibold text-blue-600 dark:text-blue-400"
                          >{{ getTotalInProgressCount() }} tarefas</span
                        >
                        nos últimos
                        <span class="font-semibold text-blue-600 dark:text-blue-400">{{
                          inProgressPeriodLabelMap[selectedInProgressPeriod]
                        }}</span
                        >.
                      </p>
                      <p v-if="getInProgressTrend() !== 0" class="text-sm">
                        Isso é
                        <span
                          :class="
                            getInProgressTrend() > 0
                              ? 'text-red-600 dark:text-red-400 font-medium'
                              : 'text-green-600 dark:text-green-400 font-medium'
                          "
                        >
                          {{ Math.abs(getInProgressTrend()) }}%
                          {{ getInProgressTrend() > 0 ? 'mais' : 'menos' }}
                        </span>
                        que no mês anterior
                        <span class="text-gray-600 dark:text-gray-400">
                          {{
                            getInProgressTrend() > 0
                              ? '(aumento é considerado ruim)'
                              : '(diminuição é positiva)'
                          }} </span
                        >.
                      </p>
                      <div v-if="inProgressTimeSeries" class="grid grid-cols-1 gap-4 mt-6">
                        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span class="block text-lg font-semibold text-gray-900 dark:text-white">{{
                            formatTimeInSecondsCompact(inProgressTimeSeries.averageDuration)
                          }}</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400"
                            >Média últimos
                            {{ inProgressPeriodLabelMap[selectedInProgressPeriod] }}</span
                          >
                        </div>
                        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span class="block text-lg font-semibold text-gray-900 dark:text-white">{{
                            getTotalInProgressCount()
                          }}</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400"
                            >Número de tarefas</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 lg:w-2/3">
                    <div class="h-80">
                      <Line
                        v-if="inProgressTimeChartData && !inProgressChartLoading"
                        :data="inProgressTimeChartData"
                        :options="inProgressTimeChartOptions"
                      />
                      <div
                        v-else
                        class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                      >
                        <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                        <p class="text-sm">Carregando dados...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseStatsWidget>
            </template>

            <!-- Upgrade prompt if user doesn't have permission -->
            <div
              v-else
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700"
            >
              <div class="p-12 text-center">
                <div
                  class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <font-awesome-icon
                    icon="lock"
                    class="text-2xl text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics Avançados Necessários
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Visualize análises de tendências temporais, tracking de performance e insights
                  avançados sobre o comportamento dos tickets.
                </p>
                <router-link
                  to="/assinaturas"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                  <font-awesome-icon icon="arrow-up" />
                  Fazer Upgrade do Plano
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal
    v-if="showExportModal"
    title="Exportar Relatório"
    @close="closeExportModal"
    @cancel="closeExportModal"
    :showFooter="false"
  >
    <div class="text-center">
      <p class="mb-6 text-gray-600 dark:text-gray-300">
        Escolha o formato para exportar o relatório:
      </p>

      <div class="flex flex-col gap-4 max-w-xs mx-auto">
        <button
          @click="exportToCSV"
          class="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <font-awesome-icon icon="file-csv" />
          <div class="text-left">
            <div class="font-semibold">CSV</div>
          </div>
        </button>

        <button
          @click="exportToExcel"
          class="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <font-awesome-icon icon="file-excel" />
          <div class="text-left">
            <div class="font-semibold">Excel (XLSX)</div>
          </div>
        </button>
      </div>
    </div>
  </BaseModal>
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
import { PERMISSIONS, usePermissions } from '@/utils/permissions';
import { useRoute, useRouter } from 'vue-router';
import { useRoles } from '@/composables';
import type {
  TenantStatistics,
  StatusDurationDto,
  DepartmentStats,
  ResolutionTimeDataDto,
  ResolutionTimeAverageDto,
  StatusDurationTimeSeriesResponseDto,
  StatusDurationTimePointDto,
  UserRankingResponseDto,
  PaginatedResponse,
  UserRankingItemDto,
} from '@/services/reportService';
import { TicketActionType, DefaultTicketStatus, type TicketUpdate } from '@/models';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import DepartmentStatsTable from '@/components/reports/DepartmentStatsTable.vue';
import UserStatsTable from '@/components/reports/UserStatsTable.vue';
import InProgressTasksTable from '@/components/reports/InProgressTasksTable.vue';
import {
  formatSnakeToNaturalCase,
  formatTimeCompact,
  formatTimeInSeconds,
  formatTimeInSecondsCompact,
} from '@/utils/generic-helper';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TabSelector from '@/components/common/TabSelector.vue';
import Select from '@/components/common/Select.vue';
import BaseStatsWidget from '@/components/common/BaseStatsWidget.vue';
import { toast } from 'vue3-toastify';
import * as XLSX from 'xlsx';
import BaseModal from '@/components/common/BaseModal.vue';
import JSZip from 'jszip';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useStatsFiltersStore } from '@/stores/statsFiltersStore';
ChartJS.register(ChartDataLabels);

enum StatsPeriod {
  ANNUAL = 'annual',
  SEMESTRAL = 'semestral',
  TRIMESTRAL = 'trimestral',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

const statsFiltersStore = useStatsFiltersStore();

const selectedStatsPeriod = computed<string>({
  get: () => statsFiltersStore.analysisPeriod,
  set: (value) => statsFiltersStore.setAnalysisPeriod(value as any),
});

const periodLabelMap: Record<string, string> = {
  weekly: 'Última semana',
  monthly: 'Último mês',
  trimestral: 'Últimos 3 meses',
  semestral: 'Últimos 6 meses',
  annual: 'Últimos 12 meses',
};

const currentPeriodLabel = computed(
  () => periodLabelMap[selectedStatsPeriod.value] || 'Últimos 3 meses',
);
const showExportModal = ref(false);

const route = useRoute();
const router = useRouter();
const userPreferencesStore = useUserPreferencesStore();

const { isSupervisor, isAdmin } = useRoles();

const tabUrlSlugMap: Record<string, string> = {
  overview: 'visao-geral',
  'in-progress': 'em-andamento',
  department: 'setores',
  users: 'colaboradores',
  trends: 'tendencias',
};
const slugToTabId: Record<string, string> = {
  'visao-geral': 'overview',
  'em-andamento': 'in-progress',
  setores: 'department',
  colaboradores: 'users',
  tendencias: 'trends',
};

const getInitialReportsTab = (): string => {
  const tabFromUrl = (route.query.tab as string) || '';
  if (tabFromUrl && slugToTabId[tabFromUrl]) return slugToTabId[tabFromUrl];
  const validTabs = ['overview', 'in-progress', 'department', 'users', 'trends'];
  if (validTabs.includes(tabFromUrl)) return tabFromUrl; // fallback if already english

  // If Supervisor, default to 'in-progress', otherwise 'overview'
  return isSupervisor.value ? 'in-progress' : 'overview';
};

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

const statusOrder = [
  { key: 'pendente', label: 'Pendente', color: '#eab308' },
  { key: 'em_andamento', label: 'Em andamento', color: '#2563eb' },
  { key: 'aguardando_verificacao', label: 'Aguardando verificação', color: '#d8b4fe' },
  { key: 'em_verificacao', label: 'Em verificação', color: '#9333ea' },
  { key: 'finalizado', label: 'Finalizado', color: '#2ecc71' },
  { key: 'cancelado', label: 'Cancelado', color: '#f87171' },
  { key: 'reprovado', label: 'Reprovado', color: '#c62828' },
];

const priorityOrder = [
  { key: 'baixa', label: 'Baixa', color: '#22c55e' },
  { key: 'média', label: 'Média', color: '#eab308' },
  { key: 'alta', label: 'Alta', color: '#ef4444' },
];

// Chart options
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

const trendChartOptions = computed<ChartOptions>(() => {
  const isDark = userPreferencesStore.isDarkMode;
  const textColor = isDark ? '#9ca3af' : '#374151'; // gray-400 for dark, gray-700 for light
  const gridColor = isDark ? '#374151' : '#f3f4f6'; // gray-700 for dark (more visible), gray-100 for light (very light)

  return {
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
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`,
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
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
          display: false,
        },
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1.0,
        barPercentage: 1.5,
        maxBarThickness: barThickness.value,
      },
    },
  };
});

const createdVsCompletedChartOptions = computed<ChartOptions>(() => {
  const isDark = userPreferencesStore.isDarkMode;
  const textColor = isDark ? '#9ca3af' : '#374151'; // gray-400 for dark, gray-700 for light
  const gridColor = isDark ? '#374151' : '#f3f4f6'; // gray-700 for dark (more visible), gray-100 for light (very light)

  return {
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
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        titleColor: '#fff',
        bodyColor: '#fff',
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
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
          display: false,
        },
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1.0,
        barPercentage: 1.5,
        maxBarThickness: barThickness.value,
      },
    },
  };
});

const statistics = ref<TenantStatistics | null>(null);
const departmentTenantStats = ref<TenantStatistics | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const topUsers = ref<UserRankingResponseDto | null>(null);
const topFiveUsers = ref<UserRankingResponseDto | null>(null);
const worstFiveUsers = ref<UserRankingResponseDto | null>(null);

// User Stats Table State
const userStatsPage = ref(1);
const userStatsLimit = ref(10);
const userStatsSortBy = ref('efficiencyScore');
const userStatsSortDirection = ref<'asc' | 'desc'>('desc');
const userStatsSearch = ref('');
const userStatsData = ref<PaginatedResponse<UserRankingItemDto> | null>(null);
const userStatsLoading = ref(false);

const fetchUserStatsTable = async () => {
  userStatsLoading.value = true;
  try {
    userStatsData.value = await reportService.getUserStatsList(
      userStatsPage.value,
      userStatsLimit.value,
      userStatsSearch.value,
      selectedStatsPeriod.value,
      userStatsSortBy.value as any,
      userStatsSortDirection.value,
    );
  } catch (err) {
    console.error('Error fetching user stats:', err);
  } finally {
    userStatsLoading.value = false;
  }
};

const handleUserStatsPageChange = (newPage: number) => {
  userStatsPage.value = newPage;
  fetchUserStatsTable();
};

const handleUserStatsSortChange = (field: string, direction: 'asc' | 'desc') => {
  userStatsSortBy.value = field;
  userStatsSortDirection.value = direction;
  fetchUserStatsTable();
};

const handleUserStatsSearchChange = (query: string) => {
  userStatsSearch.value = query;
  userStatsPage.value = 1; // Reset to first page on search
  fetchUserStatsTable();
};

watch(selectedStatsPeriod, () => {
  // refresh user and department stats if needed
  if (userStatsData.value) {
    fetchUserStatsTable();
  }
  if (departmentStatsData.value) {
    fetchDepartmentStatsTable();
  }
});
// Department Stats Table State
const departmentStatsPage = ref(1);
const departmentStatsLimit = ref(10);
const departmentStatsSortBy = ref('efficiencyScore');
const departmentStatsSortDirection = ref<'asc' | 'desc'>('desc');
const departmentStatsSearch = ref('');
const departmentStatsData = ref<PaginatedResponse<DepartmentStats> | null>(null);
const departmentStatsLoading = ref(false);

const fetchDepartmentStatsTable = async () => {
  departmentStatsLoading.value = true;
  try {
    departmentStatsData.value = await reportService.getDepartmentStatsList(
      departmentStatsPage.value,
      departmentStatsLimit.value,
      departmentStatsSearch.value,
      selectedStatsPeriod.value,
      departmentStatsSortBy.value,
      departmentStatsSortDirection.value,
    );
  } catch (err) {
    console.error('Error fetching department stats:', err);
  } finally {
    departmentStatsLoading.value = false;
  }
};

const handleDepartmentStatsPageChange = (newPage: number) => {
  departmentStatsPage.value = newPage;
  fetchDepartmentStatsTable();
};

const handleDepartmentStatsSortChange = (field: string, direction: 'asc' | 'desc') => {
  departmentStatsSortBy.value = field;
  departmentStatsSortDirection.value = direction;
  fetchDepartmentStatsTable();
};

const handleDepartmentStatsSearchChange = (query: string) => {
  departmentStatsSearch.value = query;
  departmentStatsPage.value = 1; // Reset to first page on search
  fetchDepartmentStatsTable();
};

const topUsersSortBy = ref<'efficiency' | 'resolution_time' | 'overdue_rate'>('efficiency');
const topDepartmentsSortBy = ref<'efficiency' | 'resolution_time' | 'overdue_rate'>('efficiency');
const topUsersLoading = ref(false);
const topDepartmentsLoading = ref(false);
const topPerformers = computed(() => {
  if (!topUsers.value?.users) return [];
  return [...topUsers.value.users]
    .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
    .slice(0, 3);
});

const worstPerformers = computed(() => {
  if (!worstFiveUsers.value?.users) return [];
  return [...worstFiveUsers.value.users]
    .filter((user) => user.efficiencyScore > 0)
    .sort((a, b) => a.efficiencyScore - b.efficiencyScore)
    .slice(0, 3);
});

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

const priorityClassMap: Record<string, string> = {
  baixa: 'bg-green-100 text-green-800',
  média: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800',
};

const statusDurations = ref<StatusDurationDto[]>([]);
const departmentData = ref<DepartmentStats[]>([]);

const loadData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const [
      statsData,
      deptTenantStatsData,
      trends,
      statusResult,
      priorityResult,
      recentTicketsResult,
      statusDurationsResult,
      departmentStatsResult,
      resolutionTimeResult,
      inProgressTimeSeriesResult,
      topFiveUsersResult,
      worstFiveUsersResult,
      topEfficiencyUsersResult,
    ] = await Promise.all([
      reportService.getTenantStatistics({
        period: selectedStatsPeriod.value as StatsPeriod,
        excludeCanceled: true,
      }),
      reportService.getTenantStatistics({
        period: selectedStatsPeriod.value as StatsPeriod,
        excludeCanceled: true,
      }), // same period filter, used for department total without duplicates
      reportService.getTicketTrends(selectedTrendPeriod.value),
      reportService.getTicketsByStatus(selectedStatsPeriod.value as StatsPeriod),
      reportService.getTicketsByPriority(selectedStatsPeriod.value as StatsPeriod),
      ticketService.getTenantRecentTickets(10),
      reportService.getStatusDurations(selectedStatsPeriod.value as StatsPeriod), // Tempo Médio Por Status - uses global period filter
      reportService.getTenantDepartmentsStatistics(
        selectedStatsPeriod.value as StatsPeriod,
        topDepartmentsSortBy.value,
      ), // Tempo de Resolução por Setor - uses global period filter
      reportService.getResolutionTimeData(),
      reportService.getStatusDurationTimeSeries(
        DefaultTicketStatus.InProgress,
        selectedInProgressPeriod.value,
      ),
      reportService.getTopUsers(
        5,
        false,
        'top',
        selectedStatsPeriod.value as StatsPeriod,
        topUsersSortBy.value,
      ), // Top Colaboradores in Visão Geral - uses global period filter
      reportService.getTopUsers(5, false, 'bottom', selectedStatsPeriod.value as StatsPeriod), // Pior Desempenho - uses global period filter
      reportService.getTopUsers(
        5,
        false,
        'top',
        selectedStatsPeriod.value as StatsPeriod,
        'efficiency',
      ), // Melhor Desempenho - always sorted by efficiency
    ]);

    // Fetch initial department stats table data
    fetchDepartmentStatsTable();

    // Initialize trendData with the current period data
    trendData.value = trends[selectedTrendPeriod.value];

    // Store status durations
    statusDurations.value = statusDurationsResult.statusDurations.map((duration) => ({
      ...duration,
      averageDuration: duration.averageDurationSeconds / 3600, // Converter segundos para horas
    }));

    if (!statusDurations.value.length) {
      statusDurations.value = statusOrder
        .filter((s) => !['finalizado', 'cancelado', 'reprovado'].includes(s.key))
        .map((s) => ({
          status: s.key as DefaultTicketStatus,
          averageDurationSeconds: 0,
          averageDuration: 0,
          totalDurationSeconds: 0,
          count: 0,
        }));
    }

    // Store department data - directly from the API response
    departmentData.value = departmentStatsResult.map((dept) => ({
      ...dept,
      departmentId: dept.departmentId,
      totalTickets: dept.totalTickets || 0,
      resolvedTickets: dept.resolvedTickets || 0,
      resolutionRate: dept.resolutionRate || 0,
      averageAcceptanceTimeSeconds: dept.averageAcceptanceTimeSeconds || 0,
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
    departmentTenantStats.value = deptTenantStatsData;
    if (statistics.value) {
      statistics.value.ticketTrends = trends;
    }

    cycleTimeData.value = resolutionTimeResult.data;
    cycleTimeAverage.value = resolutionTimeResult.average;

    inProgressTimeSeries.value = inProgressTimeSeriesResult;

    topFiveUsers.value = topFiveUsersResult; // Top 5 for Visão Geral

    // Fetch initial user stats table data
    fetchUserStatsTable();
    worstFiveUsers.value = worstFiveUsersResult; // Worst 5 for Pior Desempenho section
    topUsers.value = topEfficiencyUsersResult; // Top efficiency for Melhor Desempenho section
  } catch (err: unknown) {
    console.error('Erro ao carregar dados dos relatórios:', err);
    error.value = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();

  // If Supervisor is on a restricted tab, redirect to em-andamento
  if (isSupervisor.value && currentTab.value !== 'in-progress' && currentTab.value !== 'users') {
    setReportsTab('in-progress');
    return;
  }

  // If starting on the in-progress tab, load those tickets too and start polling
  if (currentTab.value === 'in-progress') {
    loadInProgressTasks();
    startPolling();
  }
});

const setReportsTab = (tabId: string) => {
  currentTab.value = tabId;
  const slug = tabUrlSlugMap[tabId] || tabId;
  const query: any = { ...route.query, tab: slug };
  router.push({ query });
};

const allTabs = [
  { id: 'overview', name: 'Visão Geral', shortName: 'Visão Geral', icon: 'chart-pie' },
  { id: 'in-progress', name: 'Em Andamento', shortName: 'Andamento', icon: 'clock' },
  { id: 'department', name: 'Setores', shortName: 'Setores', icon: 'building' },
  { id: 'users', name: 'Colaboradores', shortName: 'Colab.', icon: 'users' },
  { id: 'trends', name: 'Tendências', shortName: 'Tendências', icon: 'chart-line' },
  //lets not use this yet { id: 'custom', name: 'Análise por Período', icon: 'calendar' },
];

const tabs = computed(() => {
  if (isSupervisor.value) {
    return allTabs.filter((tab) => tab.id === 'in-progress' || tab.id === 'users');
  }
  return allTabs;
});

const currentTab = ref<string>(getInitialReportsTab());
const pollingInterval = ref<number | null>(null);

const { hasPermission } = usePermissions();

const startPolling = () => {
  stopPolling();

  pollingInterval.value = window.setInterval(() => {
    if (currentTab.value === 'in-progress') {
      loadInProgressTasks();
    }
  }, 60000);
};

const stopPolling = () => {
  if (pollingInterval.value !== null) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

// Watch for tab changes to load tab-specific data
watch(currentTab, (newTab) => {
  // If Supervisor tries to access a restricted tab, redirect to 'in-progress'
  if (isSupervisor.value && newTab !== 'in-progress' && newTab !== 'users') {
    setReportsTab('in-progress');
    return;
  }

  if (newTab === 'in-progress') {
    loadInProgressTasks();
    startPolling();
  } else {
    stopPolling();
  }
});

// Sync tab with URL changes (back/forward navigation)
watch(
  () => route.query.tab,
  (newTab) => {
    if (!newTab) {
      if (isSupervisor.value) {
        setReportsTab('in-progress');
      }
      return;
    }
    const slug = newTab as string;
    let tabId: string;

    if (slugToTabId[slug]) {
      tabId = slugToTabId[slug];
    } else {
      const validTabs = ['overview', 'in-progress', 'department', 'users', 'trends'];
      if (validTabs.includes(slug)) {
        tabId = slug;
      } else {
        return;
      }
    }

    if (isSupervisor.value && tabId !== 'in-progress' && tabId !== 'users') {
      setReportsTab('in-progress');
      return;
    }

    currentTab.value = tabId;
  },
);

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
const hasStatusData = computed(() =>
  (statusChartData.value.datasets?.[0]?.data || []).some((n: number) => Number(n) > 0),
);

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
const hasPriorityData = computed(() =>
  (priorityChartData.value.datasets?.[0]?.data || []).some((n: number) => Number(n) > 0),
);

// Keep selectedTrendPeriod for chart trend data
const selectedTrendPeriod = ref<'daily' | 'weekly' | 'monthly'>('weekly');
const selectedCycleTimeFilter = ref<'department' | 'priority'>('department');
const trendData = ref<{ date: string; total: number; resolved: number; created: number }[]>([]);
const trendChartLoading = ref(false);

const barThickness = computed(() => {
  return selectedTrendPeriod.value === 'daily' ? 12 : 20;
});

const trendChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) return null;

  const formatLabel = (dateStr: string) => {
    if (selectedTrendPeriod.value === 'weekly') {
      return formatWeeklyDateRange(dateStr);
    }
    return formatDateDDMM(dateStr);
  };

  return {
    labels: trendData.value.map((item) => formatLabel(item.date)),
    datasets: [
      {
        label: 'Criados',
        data: trendData.value.map((item) => item.created),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        maxBarThickness: barThickness.value,
        barThickness: barThickness.value,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
      {
        label: 'Concluídos',
        data: trendData.value.map((item) => item.resolved),
        backgroundColor: '#4ade80',
        borderColor: '#22c55e',
        borderWidth: 1,
        maxBarThickness: barThickness.value,
        barThickness: barThickness.value,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };
});

// Dados para o gráfico Created vs Completed
const createdVsCompletedChartData = computed(() => {
  if (!trendData.value || trendData.value.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Use weekly range format for weekly period, otherwise use DD/MM format
  const formatLabel = (dateStr: string) => {
    if (selectedTrendPeriod.value === 'weekly') {
      return formatWeeklyDateRange(dateStr);
    }
    return formatDateDDMM(dateStr);
  };

  return {
    labels: trendData.value.map((item) => formatLabel(item.date)),
    datasets: [
      {
        label: 'Criados',
        data: trendData.value.map((item) => item.created),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
        maxBarThickness: barThickness.value,
        barThickness: barThickness.value,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
      {
        label: 'Concluídos',
        data: trendData.value.map((item) => item.resolved),
        backgroundColor: '#4ade80',
        borderColor: '#22c55e',
        borderWidth: 1,
        maxBarThickness: barThickness.value,
        barThickness: barThickness.value,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };
});

// Funções Auxiliares
const formatPercentage = (value?: number) => {
  if (value === undefined) return '0%';
  return `${Math.round(value * 100)}%`;
};

// Calculate background color based on percentage
// Lower percentages = lighter blue, higher percentages = darker blue
const getCardBackgroundStyle = (percentage: number) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Calculate blue intensity: 0% = very light (239, 246, 255), 100% = dark (30, 64, 175)
  // Using linear interpolation
  const r = Math.round(239 - (239 - 30) * (clampedPercentage / 100));
  const g = Math.round(246 - (246 - 64) * (clampedPercentage / 100));
  const b = Math.round(255 - (255 - 175) * (clampedPercentage / 100));

  // Determine text color: use white for darker backgrounds (percentage > 50%)
  const textColor = clampedPercentage > 50 ? '#ffffff' : '#1f2937';

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: textColor,
  };
};

const getResolutionRateBadgeClass = (rate?: number) => {
  if (rate === undefined) return 'bg-gray-100 text-gray-800';

  const percentage = rate * 100;

  if (percentage >= 70) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  } else if (percentage >= 40) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

const disabledDate = (date: Date) => {
  return date > new Date() || date < new Date(2023, 0, 1);
};

const updateTrendPeriod = async (period: string) => {
  selectedTrendPeriod.value = period as 'daily' | 'weekly' | 'monthly';
  trendChartLoading.value = true;

  try {
    const data = await reportService.getTicketTrends(selectedTrendPeriod.value);
    trendData.value = data[selectedTrendPeriod.value];
  } catch (err: unknown) {
    console.error('Erro ao carregar tendências:', err);
    error.value = 'Erro ao carregar dados de tendências. Por favor, tente novamente.';
  } finally {
    trendChartLoading.value = false;
  }
};

const handleInProgressPeriodChange = async (period: string) => {
  selectedInProgressPeriod.value = period as 'week' | 'month' | 'quarter';
  inProgressChartLoading.value = true;
  try {
    const data = await reportService.getStatusDurationTimeSeries(
      DefaultTicketStatus.InProgress,
      selectedInProgressPeriod.value,
    );
    inProgressTimeSeries.value = data;
  } catch (error) {
    console.error('Error updating in progress period:', error);
  } finally {
    inProgressChartLoading.value = false;
  }
};

const dateRange = ref({
  start: '',
  end: '',
});

// Computed Properties para Métricas
const departmentStats = computed(() => departmentData.value);

const topFiveDepartments = computed(() => {
  if (!departmentStats.value) return [];

  const copy = [...departmentStats.value];

  if (topDepartmentsSortBy.value === 'resolution_time') {
    return copy
      .sort((a, b) => (a.averageResolutionTimeSeconds || 0) - (b.averageResolutionTimeSeconds || 0))
      .slice(0, 5);
  } else if (topDepartmentsSortBy.value === 'overdue_rate') {
    return copy
      .sort((a, b) => (a.deliveryOverdueRate || 0) - (b.deliveryOverdueRate || 0))
      .slice(0, 5);
  } else {
    // When sorting by efficiency, only show departments with valid scores (10+ tickets)
    return copy
      .filter((dept) => dept.efficiencyScore !== undefined)
      .sort((a, b) => (b.efficiencyScore || 0) - (a.efficiencyScore || 0))
      .slice(0, 5);
  }
});

const topPerformingDepartments = computed(() => {
  if (!departmentStats.value) return [];
  return [...departmentStats.value]
    .filter((dept) => dept.efficiencyScore !== undefined)
    .sort((a, b) => (b.efficiencyScore || 0) - (a.efficiencyScore || 0))
    .slice(0, 3);
});

const worstPerformingDepartments = computed(() => {
  if (!departmentStats.value) return [];
  return [...departmentStats.value]
    .filter((dept) => dept.efficiencyScore !== undefined)
    .sort((a, b) => (a.efficiencyScore || 0) - (b.efficiencyScore || 0))
    .slice(0, 3);
});

const sortedDepartmentsByResolutionTime = computed(() => {
  if (!departmentStats.value) return [];

  // Filter out departments with 0 resolution time and sort from lowest to highest
  return [...departmentStats.value]
    .filter((dept) => dept.averageResolutionTimeSeconds > 0)
    .sort((a, b) => a.averageResolutionTimeSeconds - b.averageResolutionTimeSeconds);
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
      status: DefaultTicketStatus.InProgress, // Using type assertion for now
      limit: 10,
    });

    if (!response.data || !Array.isArray(response.data.items)) {
      console.error('Invalid response format for in-progress tickets');
      return;
    }

    const transformedTasks = [];

    for (const ticket of response.data.items) {
      try {
        let timeInProgress = 'Desconhecido';
        let isOverdue = false;
        let overdueReason: string | undefined = undefined;
        let diffInSeconds = 0;

        // Determine the start date for time calculation
        // Always use the date when the ticket was moved to "em andamento" status
        let startDate: Date | null = null;

        // Find the most recent status update where the ticket was moved to "em andamento"
        const statusUpdates =
          ticket.updates?.filter(
            (update: TicketUpdate) =>
              update.action === TicketActionType.StatusUpdate &&
              update.toStatus === DefaultTicketStatus.InProgress,
          ) || [];

        const lastStatusUpdate =
          statusUpdates.length > 0
            ? statusUpdates.sort(
                (a: TicketUpdate, b: TicketUpdate) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )[0]
            : null;

        if (lastStatusUpdate) {
          startDate = new Date(lastStatusUpdate.createdAt);
        } else {
          if (ticket.acceptedAt) {
            startDate = new Date(ticket.acceptedAt);
          } else {
            startDate = ticket.createdAt ? new Date(ticket.createdAt) : null;
          }
        }

        if (startDate) {
          const now = new Date();
          const diffInMs = now.getTime() - startDate.getTime();
          diffInSeconds = Math.floor(diffInMs / 1000);

          if (diffInSeconds < 0) {
            console.warn('Negative time difference detected. This may indicate a timezone issue.', {
              startDate: startDate.toISOString(),
              now: now.toISOString(),
              startDateLocal: startDate.toString(),
              nowLocal: now.toString(),
              diffInSeconds,
            });
            diffInSeconds = Math.abs(diffInSeconds);
          }

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

        if (ticket.currentTargetUser) {
          const name =
            `${ticket.currentTargetUser.firstName} ${ticket.currentTargetUser.lastName}` ||
            ticket.currentTargetUser.email ||
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
          status: formatSnakeToNaturalCase(ticket.ticketStatus?.key || ticket.status || ''),
          timeInProgress,
          isOverdue,
          overdueReason,
          timeInProgressSeconds: diffInSeconds,
        });
      } catch (error) {
        console.error('Error processing in-progress ticket:', error);
      }
    }

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

  return {
    totalTickets: departmentTenantStats.value?.totalTickets ?? totalTickets,
    totalResolved,
    averageResolutionTimeSeconds: totalResolved ? totalResolutionTime / totalResolved : 0,
    averageAcceptanceTimeSeconds: totalResolved ? totalAcceptanceTime / totalResolved : 0,
  };
});

const sortedStatusDurations = computed(() => {
  const excluded = new Set(['finalizado', 'cancelado', 'reprovado']);

  const statusOrder = [
    DefaultTicketStatus.Pending,
    DefaultTicketStatus.InProgress,
    DefaultTicketStatus.AwaitingVerification,
    DefaultTicketStatus.UnderVerification,
    DefaultTicketStatus.Returned,
  ];

  const filtered = [...statusDurations.value].filter((d) => {
    const key = (d as any)?.status?.key ?? (d.status as unknown as string);
    return !excluded.has(key);
  });

  return filtered.sort((a, b) => {
    const aKey = (a as any)?.status?.key ?? (a.status as unknown as string);
    const bKey = (b as any)?.status?.key ?? (b.status as unknown as string);

    const aIndex = statusOrder.indexOf(aKey as DefaultTicketStatus);
    const bIndex = statusOrder.indexOf(bKey as DefaultTicketStatus);

    // If status not in order list, put at the end
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
});

const handlePeriodChange = () => {
  loadData();
};

const handleTopUsersSortByChange = async () => {
  // Reload only the topFiveUsers data when sortBy changes
  topUsersLoading.value = true;
  try {
    const topFiveUsersResult = await reportService.getTopUsers(
      5,
      false,
      'top',
      selectedStatsPeriod.value as StatsPeriod,
      topUsersSortBy.value,
    );
    topFiveUsers.value = topFiveUsersResult;
  } catch (err: unknown) {
    console.error('Erro ao carregar top colaboradores:', err);
  } finally {
    topUsersLoading.value = false;
  }
};

const handleTopDepartmentsSortByChange = async () => {
  // Reload department stats when sortBy changes
  topDepartmentsLoading.value = true;
  try {
    const departmentStatsResult = await reportService.getTenantDepartmentsStatistics(
      selectedStatsPeriod.value as StatsPeriod,
      topDepartmentsSortBy.value,
    );
    departmentData.value = departmentStatsResult.map((dept) => ({
      ...dept,
      departmentId: dept.departmentId,
      totalTickets: dept.totalTickets || 0,
      resolvedTickets: dept.resolvedTickets || 0,
      resolutionRate: dept.resolutionRate || 0,
      averageAcceptanceTimeSeconds: dept.averageAcceptanceTimeSeconds || 0,
    }));
  } catch (err: unknown) {
    console.error('Erro ao carregar estatísticas de setores:', err);
  } finally {
    topDepartmentsLoading.value = false;
  }
};

const getTotalResolved = () => {
  if (!trendData.value || trendData.value.length === 0) return 0;
  return trendData.value.reduce((sum, item) => sum + item.resolved, 0);
};

const getTotalCreated = () => {
  if (!trendData.value || trendData.value.length === 0) return 0;
  return trendData.value.reduce((sum, item) => sum + item.created, 0);
};

// Trend percentages are calculated from the chart data (trendData) for visual comparison
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

// Função para formatar intervalo semanal (primeiro dia - último dia da semana)
function formatWeeklyDateRange(dateStr: string): string {
  const date = new Date(dateStr);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Calculate start of week (Monday)
  // If Sunday (0), go back 6 days, otherwise go back (dayOfWeek - 1) days
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - daysToMonday);

  // Calculate end of week (Sunday)
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + daysToSunday);

  // Format both dates as DD/MM
  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}

// Add new reactive state for cycle time period selection
const selectedCycleTimePeriod = ref<'week' | 'month' | 'quarter'>('week');

// Add new reactive state for in progress time period selection
const selectedInProgressPeriod = ref<'week' | 'month' | 'quarter'>('month');

// Period text mapping for UI
const periodTextMap: Record<'week' | 'month' | 'quarter', string> = {
  week: 'na semana',
  month: 'no mês',
  quarter: 'no trimestre',
};

// Period label mapping for in progress time series
const inProgressPeriodLabelMap: Record<'week' | 'month' | 'quarter', string> = {
  week: '6 semanas',
  month: '6 meses',
  quarter: '4 trimestres',
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

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  const change = ((current - previous) / previous) * 100;
  return Math.round(change);
};

// Get bar width percentage based on resolution time
const getBarWidth = (resolutionTimeSeconds: number) => {
  if (!sortedDepartmentsByResolutionTime.value.length) return '0%';

  const maxTime = Math.max(
    ...sortedDepartmentsByResolutionTime.value.map((d) => d.averageResolutionTimeSeconds),
  );

  if (maxTime === 0) return '0%';

  return `${(resolutionTimeSeconds / maxTime) * 100}%`;
};

// Get bar color based on resolution time (green for low, red for high)
const getBarColor = (resolutionTimeSeconds: number) => {
  if (!sortedDepartmentsByResolutionTime.value.length) return '#9ca3af'; // gray

  const maxTime = Math.max(
    ...sortedDepartmentsByResolutionTime.value.map((d) => d.averageResolutionTimeSeconds),
  );

  if (maxTime === 0) return '#9ca3af'; // gray

  // Calculate percentage (0 = lowest time, 100 = highest time)
  const percentage = (resolutionTimeSeconds / maxTime) * 100;

  // Interpolate from green (low) to red (high)
  // Green: rgb(34, 197, 94) = #22c55e
  // Red: rgb(239, 68, 68) = #ef4444
  const r = Math.round(34 + (239 - 34) * (percentage / 100));
  const g = Math.round(197 - (197 - 68) * (percentage / 100));
  const b = Math.round(94 - (94 - 68) * (percentage / 100));

  return `rgb(${r}, ${g}, ${b})`;
};

// Get status bar width percentage based on duration time
const getStatusBarWidth = (durationSeconds: number) => {
  if (!sortedStatusDurations.value.length) return '0%';

  // Find the maximum duration time from all statuses
  const maxTime = Math.max(...sortedStatusDurations.value.map((d) => d.averageDurationSeconds));

  if (maxTime === 0) return '0%';
  if (durationSeconds === 0) return '2px';

  return `${(durationSeconds / maxTime) * 100}%`;
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
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#2563eb',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };
});

const cycleTimeBarOptions = computed<ChartOptions>(() => {
  const isDark = userPreferencesStore.isDarkMode;
  const textColor = isDark ? '#9ca3af' : '#374151'; // gray-400 for dark, gray-700 for light
  const gridColor = isDark ? '#374151' : '#f3f4f6'; // gray-700 for dark (more visible), gray-100 for light (very light)

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        titleColor: '#fff',
        bodyColor: '#fff',
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
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tempo (horas)',
          color: textColor,
        },
        ticks: {
          precision: 0,
          color: textColor,
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
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };
});

// Add a reactive state for chart rendering
const chartRenderKey = ref(0);
const cycleTimeChartLoading = ref(false);
const inProgressChartLoading = ref(false);

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

  return data && data.length >= 2;
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

const inProgressTimeChartOptions = computed<ChartOptions>(() => {
  const isDark = userPreferencesStore.isDarkMode;
  const textColor = isDark ? '#9ca3af' : '#374151'; // gray-400 for dark, gray-700 for light
  const gridColor = isDark ? '#374151' : '#f3f4f6'; // gray-700 for dark (more visible), gray-100 for light (very light)

  return {
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
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return formatTimeInSeconds(value);
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tempo',
          color: textColor,
          font: {
            size: 12,
          },
        },
        ticks: {
          precision: 0,
          color: textColor,
          callback: function (value: any) {
            return formatTimeInSecondsCompact(value);
          },
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          display: false,
          color: gridColor,
        },
      },
    },
  };
});

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

// Format hours: show in minutes if < 1 hour, or in hours if >= 1 hour
const formatAverageTime = (hours: number): string => {
  if (!hours || hours === 0) return '0m';

  // If less than 1 hour, show in minutes
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }

  // If 1 hour or more, show in hours (with minutes if needed)
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
      DefaultTicketStatus.InProgress,
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
  return 'avatar-blue';
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

const openExportModal = () => {
  if (!hasPermission(PERMISSIONS.EXPORT_REPORTS)) {
    toast.error('Você não tem permissão para exportar relatórios');
    return;
  }

  showExportModal.value = true;
};

const closeExportModal = () => {
  showExportModal.value = false;
};

const fetchAllTickets = async () => {
  try {
    const response = await ticketService.fetch({ limit: 10000 });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    toast.error('Erro ao buscar tarefas para exportação');
    return [];
  }
};

const exportToExcel = async () => {
  try {
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

    toast.info('Preparando exportação Excel...');

    const allTickets = await fetchAllTickets();
    const workbook = XLSX.utils.book_new();

    // General Metrics Sheet with Status and Priority distributions and Summary
    const generalData = [
      ['=== RELATÓRIO GERAL DO SISTEMA ==='],
      ['Data de Geração', timestamp],
      ['Período', formatStatsPeriod(selectedStatsPeriod.value)],
      [],
      ['=== MÉTRICAS GERAIS ==='],
      ['Métrica', 'Valor'],
      ['Total de Tarefas', statistics.value?.totalTickets || 0],
      ['Taxa de Resolução', formatPercentage(statistics.value?.resolutionRate)],
      [
        'Tempo Médio de Resolução',
        formatTimeInSeconds(statistics.value?.averageResolutionTimeSeconds),
      ],
      [
        'Tempo Médio de Aceite',
        formatTimeInSeconds(statistics.value?.averageAcceptanceTimeSeconds),
      ],
      [],
      ['=== DISTRIBUIÇÃO POR STATUS ==='],
      ['Status', 'Quantidade', 'Percentual'],
    ];

    // Add status distribution data
    if (ticketsByStatus.value && ticketsByStatus.value.labels.length > 0) {
      const totalStatusTickets = ticketsByStatus.value.datasets[0].data.reduce(
        (sum, count) => sum + count,
        0,
      );
      ticketsByStatus.value.labels.forEach((label, index) => {
        const count = ticketsByStatus.value.datasets[0].data[index];
        const percentage =
          totalStatusTickets > 0 ? ((count / totalStatusTickets) * 100).toFixed(1) : '0.0';
        generalData.push([label, count, `${percentage}%`]);
      });
    }

    // Add priority distribution
    generalData.push([]);
    generalData.push(['=== DISTRIBUIÇÃO POR PRIORIDADE ===']);
    generalData.push(['Prioridade', 'Quantidade', 'Percentual']);

    if (ticketsByPriority.value && ticketsByPriority.value.labels.length > 0) {
      const totalPriorityTickets = ticketsByPriority.value.datasets[0].data.reduce(
        (sum, count) => sum + count,
        0,
      );
      ticketsByPriority.value.labels.forEach((label, index) => {
        const count = ticketsByPriority.value.datasets[0].data[index];
        const percentage =
          totalPriorityTickets > 0 ? ((count / totalPriorityTickets) * 100).toFixed(1) : '0.0';
        generalData.push([label, count, `${percentage}%`]);
      });
    }

    // Add summary data
    generalData.push([]);
    generalData.push(['=== RESUMO FINAL ===']);
    generalData.push(['Métrica', 'Valor']);
    generalData.push(['Total de Tarefas Criadas', getTotalCreated()]);
    generalData.push(['Total de Tarefas Concluídas', getTotalResolved()]);
    generalData.push(['Tarefas em Andamento', inProgressTasks.value?.length || 0]);
    generalData.push(['Setores Ativos', departmentStats.value?.length || 0]);

    const generalSheet = XLSX.utils.aoa_to_sheet(generalData);
    XLSX.utils.book_append_sheet(workbook, generalSheet, 'Métricas Gerais');

    // All Tickets Sheet
    if (allTickets.length > 0) {
      const ticketsData = [
        [
          'ID',
          'Assunto',
          'Status',
          'Prioridade',
          'Solicitante',
          'Responsável',
          'Setor',
          'Data Criação',
          'Data Atualização',
        ],
        ...allTickets.map((ticket) => [
          ticket.customId,
          ticket.name,
          ticket.status,
          ticket.priority,
          `${ticket.requester.firstName} ${ticket.requester.lastName}`,
          ticket.currentTargetUser
            ? `${ticket.currentTargetUser.firstName} ${ticket.currentTargetUser.lastName}`
            : 'Não atribuído',
          ticket.currentTargetUser?.department?.name ||
            ticket.targetUsers?.[0]?.user?.department?.name ||
            '-',
          new Date(ticket.createdAt).toLocaleDateString('pt-BR'),
          new Date(ticket.updatedAt).toLocaleDateString('pt-BR'),
        ]),
      ];
      const allTicketsSheet = XLSX.utils.aoa_to_sheet(ticketsData);
      XLSX.utils.book_append_sheet(workbook, allTicketsSheet, 'Tarefas');
    }

    // Department Statistics Sheet
    if (departmentStats.value && departmentStats.value.length > 0) {
      const deptData = [
        ['=== ESTATÍSTICAS POR SETOR ==='],
        [
          'Setor',
          'Total Tarefas',
          'Resolvidos',
          'Taxa Resolução',
          'Tempo Aceite',
          'Tempo Resolução',
        ],
        ...departmentStats.value.map((dept) => [
          dept.departmentName,
          dept.totalTickets,
          dept.resolvedTickets,
          formatPercentage(dept.resolutionRate),
          formatTimeInSeconds(dept.averageAcceptanceTimeSeconds),
          formatTimeInSeconds(dept.averageResolutionTimeSeconds),
        ]),
      ];
      const deptSheet = XLSX.utils.aoa_to_sheet(deptData);
      XLSX.utils.book_append_sheet(workbook, deptSheet, 'Setores');
    }

    // Top Contributors Sheet
    if (topUsers.value && topUsers.value.users && topUsers.value.users.length > 0) {
      const usersData = [
        ['=== TOP COLABORADORES ==='],
        ['Nome', 'Setor', 'Tarefas Resolvidas', 'Taxa Resolução', 'Total Tarefas'],
        ...topUsers.value.users.map((user) => [
          `${user.firstName} ${user.lastName}`,
          user.departmentName,
          user.resolvedTickets,
          formatPercentage(user.resolutionRate),
          user.totalTickets,
        ]),
      ];
      const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, usersSheet, 'Top Colaboradores');
    }

    // Trend Data Sheet
    if (trendData.value && trendData.value.length > 0) {
      const trendDataSheet = [
        ['=== TENDÊNCIAS (CRIADOS VS CONCLUÍDOS) ==='],
        ['Data', 'Tarefas Criadas', 'Tarefas Concluídas', 'Total'],
        ...trendData.value.map((item) => [
          new Date(item.date).toLocaleDateString('pt-BR'),
          item.created,
          item.resolved,
          item.total,
        ]),
      ];
      const trendSheet = XLSX.utils.aoa_to_sheet(trendDataSheet);
      XLSX.utils.book_append_sheet(workbook, trendSheet, 'Tendências');
    }

    // In-Progress Tasks Sheet
    if (inProgressTasks.value && inProgressTasks.value.length > 0) {
      const tasksData = [
        ['=== TAREFAS EM ANDAMENTO ==='],
        ['ID', 'Assunto', 'Responsável', 'Tempo em Andamento', 'Status Prazo'],
        ...inProgressTasks.value.map((task) => [
          task.customId,
          task.name,
          task.assignee.name,
          task.timeInProgress,
          task.isOverdue ? 'Em atraso' : 'No prazo',
        ]),
      ];
      const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData);
      XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tarefas em Andamento');
    }

    // Write file
    XLSX.writeFile(workbook, `relatorio-sistema-${now.toISOString().split('T')[0]}.xlsx`);

    closeExportModal();
    toast.success('Relatório Excel exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar relatório Excel:', error);
    toast.error('Erro ao exportar relatório Excel. Tente novamente.');
  }
};

const exportToCSV = async () => {
  try {
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

    toast.info('Preparando exportação CSV...');

    const allTickets = await fetchAllTickets();

    let csvContent = '';

    // Header
    csvContent += '=== RELATÓRIO GERAL DO SISTEMA ===\n';
    csvContent += `Data de Geração,${timestamp}\n`;
    csvContent += `Período,${formatStatsPeriod(selectedStatsPeriod.value)}\n`;
    csvContent += '\n';

    // General Metrics
    csvContent += '=== MÉTRICAS GERAIS ===\n';
    csvContent += 'Métrica,Valor\n';
    csvContent += `Total de Tarefas,${statistics.value?.totalTickets || 0}\n`;
    csvContent += `Taxa de Resolução,${formatPercentage(statistics.value?.resolutionRate)}\n`;
    csvContent += `Tempo Médio de Resolução,${formatTimeInSeconds(statistics.value?.averageResolutionTimeSeconds)}\n`;
    csvContent += `Tempo Médio de Aceite,${formatTimeInSeconds(statistics.value?.averageAcceptanceTimeSeconds)}\n`;
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
      csvContent += '=== ESTATÍSTICAS POR SETOR ===\n';
      csvContent += 'Setor,Total Tarefas,Resolvidas,Taxa Resolução,Tempo Aceite,Tempo Resolução\n';
      departmentStats.value.forEach((dept) => {
        csvContent += `${dept.departmentName},${dept.totalTickets},${dept.resolvedTickets},${formatPercentage(dept.resolutionRate)},${formatTimeInSeconds(dept.averageAcceptanceTimeSeconds)},${formatTimeInSeconds(dept.averageResolutionTimeSeconds)}\n`;
      });
      csvContent += '\n';
    }

    // Top Contributors
    if (topUsers.value && topUsers.value.users && topUsers.value.users.length > 0) {
      csvContent += '=== TOP COLABORADORES ===\n';
      csvContent += 'Nome,Setor,Tarefas Resolvidas,Taxa Resolução,Total Tarefas\n';
      topUsers.value.users.forEach((user) => {
        csvContent += `${user.firstName} ${user.lastName},${user.departmentName},${user.resolvedTickets},${formatPercentage(user.resolutionRate)},${user.totalTickets}\n`;
      });
      csvContent += '\n';
    }

    // Recent Tickets
    if (recentTickets.value && recentTickets.value.length > 0) {
      csvContent += '=== TAREFAS RECENTES ===\n';
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
      csvContent += 'Data,Tarefas Criadas,Tarefas Concluídas,Total\n';
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
    csvContent += `Total de Tarefas Criadas,${getTotalCreated()}\n`;
    csvContent += `Total de Tarefas Concluídas,${getTotalResolved()}\n`;
    csvContent += `Tarefas em Andamento,${inProgressTasks.value?.length || 0}\n`;
    csvContent += `Setores Ativos,${departmentStats.value?.length || 0}\n`;

    // Create tickets CSV content
    let ticketsCsvContent = '';
    ticketsCsvContent +=
      'ID,Assunto,Status,Prioridade,Solicitante,Responsável,Setor,Data Criação,Data Atualização\n';

    allTickets.forEach((ticket) => {
      const requesterName = `${ticket.requester.firstName} ${ticket.requester.lastName}`;
      const targetUserName = ticket.currentTargetUser
        ? `${ticket.currentTargetUser.firstName} ${ticket.currentTargetUser.lastName}`
        : 'Não atribuído';
      const createdDate = new Date(ticket.createdAt).toLocaleDateString('pt-BR');
      const updatedDate = new Date(ticket.updatedAt).toLocaleDateString('pt-BR');

      const departmentName =
        ticket.currentTargetUser?.department?.name ||
        ticket.targetUsers?.[0]?.user?.department?.name ||
        '-';
      ticketsCsvContent += `${ticket.customId},"${ticket.name.replace(/"/g, '""')}",${ticket.status},${ticket.priority},"${requesterName}","${targetUserName}","${departmentName}",${createdDate},${updatedDate}\n`;
    });

    const zip = new JSZip();
    zip.file(`relatorio-sistema-${now.toISOString().split('T')[0]}.csv`, csvContent);
    zip.file(`tickets-${now.toISOString().split('T')[0]}.csv`, ticketsCsvContent);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-completo-${now.toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    closeExportModal();
    toast.success('Relatório CSV exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar relatório CSV:', error);
    toast.error('Erro ao exportar relatório CSV. Tente novamente.');
  }
};
</script>

<style scoped>
/* Avatar color classes - light backgrounds with colored text */
.avatar-blue {
  @apply bg-blue-600 text-white;
}

.avatar-green {
  @apply bg-emerald-100 text-emerald-600;
}

.avatar-purple {
  @apply bg-violet-100 text-violet-600;
}

.avatar-orange {
  @apply bg-orange-100 text-orange-600;
}

.avatar-pink {
  @apply bg-rose-100 text-rose-600;
}

.avatar-indigo {
  @apply bg-indigo-100 text-indigo-600;
}

.avatar-red {
  @apply bg-red-100 text-red-600;
}

.avatar-yellow {
  @apply bg-yellow-100 text-yellow-600;
}

.avatar-teal {
  @apply bg-teal-100 text-teal-600;
}

.avatar-cyan {
  @apply bg-cyan-100 text-cyan-600;
}
</style>
