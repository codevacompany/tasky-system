<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-6">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4 shadow-lg"
      >
        <font-awesome-icon icon="spinner" spin class="text-3xl text-blue-600 dark:text-blue-400" />
        <p class="text-gray-700 dark:text-gray-300 text-lg font-medium">
          Carregando dados dos relatórios...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6"
    >
      <div class="flex items-start gap-4">
        <font-awesome-icon
          icon="exclamation-circle"
          class="text-2xl text-red-600 dark:text-red-400 mt-1"
        />
        <div class="flex-1">
          <p class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Erro ao carregar dados
          </p>
          <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
          <button
            @click="loadData"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error" class="space-y-6">
      <!-- Header -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Dashboard</span>
          <font-awesome-icon icon="chevron-right" class="text-xs" />
          <span class="text-blue-600 dark:text-blue-400 font-medium">Relatórios</span>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Relatórios do Sistema
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Acompanhe métricas e indicadores importantes dos tickets
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="openExportModal"
              class="flex items-center gap-2 px-4 py-2 btn btn-primary text-sm text-white rounded-md font-medium transition-colors"
            >
              <font-awesome-icon icon="file-export" />
              Exportar Relatório
            </button>
          </div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total de Tickets
              </p>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ statistics?.totalTickets }}
              </h3>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon icon="ticket" class="text-xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 dark:bg-gray-800 border-l-4 border-yellow-500 rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Taxa de Resolução
              </p>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatPercentage(statistics?.resolutionRate) }}
              </h3>
            </div>
            <div
              class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon
                icon="chart-line"
                class="text-xl text-yellow-600 dark:text-yellow-400"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500 rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tempo Médio de Resolução
              </p>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }}
              </h3>
            </div>
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon icon="clock" class="text-xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500 rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tempo médio de Aceitação
              </p>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatTimeInSeconds(statistics?.averageAcceptanceTimeSeconds) }}
              </h3>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon
                icon="thumbs-up"
                class="text-xl text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                currentTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <font-awesome-icon :icon="tab.icon" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="currentTab === 'overview'" class="space-y-6">
            <!-- Created vs Completed Section -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div
                class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-200 dark:border-gray-700"
              >
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
                  CRIADOS VS CONCLUÍDOS
                </h2>
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

              <div class="flex flex-col lg:flex-row">
                <div class="p-6 lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
                  <p class="text-base font-medium text-gray-900 dark:text-white mb-4">
                    Novos tickets criados vs concluídos
                  </p>
                  <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p v-if="trendData && trendData.length > 0">
                      <span class="font-semibold text-blue-600 dark:text-blue-400"
                        >{{ getTotalResolved() }} tickets</span
                      >
                      concluídos no período selecionado
                    </p>
                    <p v-if="trendData && trendData.length > 0">
                      <span class="font-semibold text-green-600 dark:text-green-400"
                        >{{ getTotalCreated() }} tickets</span
                      >
                      criados no período selecionado
                    </p>
                    <p
                      v-if="
                        trendData &&
                        trendData.length > 1 &&
                        (createdTrendPercentage !== 0 || resolvedTrendPercentage !== 0)
                      "
                      class="text-sm"
                    >
                      Isso é
                      <span
                        v-if="createdTrendPercentage > 0"
                        :class="
                          createdTrendPercentage >= 0
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : 'text-red-600 dark:text-red-400 font-medium'
                        "
                      >
                        {{ createdTrendPercentage }}%
                        {{ createdTrendPercentage >= 0 ? 'mais' : 'menos' }} criados
                      </span>
                      <span v-if="createdTrendPercentage > 0 && resolvedTrendPercentage > 0">
                        e
                      </span>
                      <span
                        v-if="resolvedTrendPercentage > 0"
                        :class="
                          resolvedTrendPercentage >= 0
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : 'text-red-600 dark:text-red-400 font-medium'
                        "
                      >
                        {{ resolvedTrendPercentage }}%
                        {{ resolvedTrendPercentage >= 0 ? 'mais' : 'menos' }} concluídos
                      </span>
                      comparado a
                      <span class="font-medium text-gray-900 dark:text-white">{{ firstDate }}</span>
                    </p>
                  </div>
                </div>

                <div class="p-6 lg:w-2/3">
                  <div class="h-80">
                    <Line
                      v-if="trendData && trendData.length > 0"
                      :data="createdVsCompletedChartData"
                      :options="createdVsCompletedChartOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-2xl mb-3" />
                      <p>Carregando dados...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Status Chart -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div
                  class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
                >
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Distribuição por Status
                  </h2>
                  <div class="text-blue-600 dark:text-blue-400">
                    <font-awesome-icon icon="chart-pie" class="text-xl" />
                  </div>
                </div>

                <div class="flex flex-col md:flex-row p-6">
                  <div class="w-full md:w-2/3 h-64">
                    <Doughnut
                      v-if="ticketsByStatus.labels.length"
                      :data="statusChartData"
                      :options="chartOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                      <p class="text-sm">Carregando dados...</p>
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
              </div>

              <!-- Priority Chart -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div
                  class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
                >
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Distribuição por Prioridade
                  </h2>
                  <div class="text-blue-600 dark:text-blue-400">
                    <font-awesome-icon icon="chart-bar" class="text-xl" />
                  </div>
                </div>

                <div class="flex flex-col md:flex-row p-6">
                  <div class="w-full md:w-2/3 h-64">
                    <Doughnut
                      v-if="ticketsByPriority.labels.length"
                      :data="priorityChartData"
                      :options="chartOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                      <p class="text-sm">Carregando dados...</p>
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
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Recent Tickets Table -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Últimos Tickets
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Acompanhe os tickets mais recentes do sistema
                    </p>
                  </div>
                  <button
                    class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-4 sm:mt-0"
                  >
                    <font-awesome-icon icon="download" />
                    Exportar
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Assunto
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Prioridade
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <tr
                        v-for="ticket in recentTickets"
                        :key="ticket.customId"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ ticket.customId }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {{ ticket.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            :class="[
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getStatusClass(ticket.status),
                            ]"
                          >
                            {{ formatSnakeToNaturalCase(ticket.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            :class="[
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getPriorityClass(ticket.priority),
                            ]"
                          >
                            {{ formatSnakeToNaturalCase(ticket.priority) }}
                          </span>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{ formatDate(ticket.createdAt) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Top Contributors -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Top Colaboradores
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Últimos 3 meses</p>
                </div>

                <div class="p-6">
                  <!-- Table Headers -->
                  <div
                    class="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <div>Perfil</div>
                    <div class="text-center">Tickets resolvidos</div>
                    <div class="text-center">Taxa de resolução</div>
                    <div class="text-center">Tickets totais</div>
                  </div>

                  <!-- Table Content -->
                  <div v-if="topUsers && topUsers.users.length > 0" class="space-y-4 mt-4">
                    <div
                      v-for="user in topUsers.users"
                      :key="user.userId"
                      class="grid grid-cols-4 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 -mx-2 transition-colors"
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
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ user.firstName }} {{ user.lastName }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {{ user.departmentName }}
                          </p>
                        </div>
                      </div>
                      <div class="text-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
                          user.resolvedTickets
                        }}</span>
                      </div>
                      <div class="text-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
                          formatPercentage(user.resolutionRate)
                        }}</span>
                      </div>
                      <div class="text-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{
                          user.totalTickets
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="!topUsers"
                    class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                    <p class="text-sm">Carregando colaboradores...</p>
                  </div>

                  <div
                    v-else
                    class="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="info-circle" class="mr-2" />
                    <p class="text-sm">Nenhum colaborador encontrado</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cycle Time Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Cycle Time per Department -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Tempo de Resolução Por Segmento:
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ formatTimeInSeconds(statistics?.averageResolutionTimeSeconds) }} (média)
                    </p>
                  </div>
                  <div class="mt-4 sm:mt-0">
                    <Select
                      :options="[
                        { value: 'department', label: 'Por Setor' },
                        { value: 'priority', label: 'Por Prioridade' },
                      ]"
                      v-model="selectedCycleTimeFilter"
                    />
                  </div>
                </div>

                <div class="flex flex-col lg:flex-row">
                  <div class="p-6 lg:w-1/2 border-r border-gray-200 dark:border-gray-700">
                    <div class="space-y-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Setores com maior tempo de resolução:
                        </p>
                        <div class="space-y-2">
                          <div
                            v-for="dept in departmentsWithLongestResolutionTime"
                            :key="dept.departmentId"
                            class="flex justify-between items-center text-sm"
                          >
                            <span class="text-gray-700 dark:text-gray-300">{{
                              dept.departmentName
                            }}</span>
                            <span class="font-medium text-red-600 dark:text-red-400">{{
                              formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                            }}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Setores com menor tempo de resolução:
                        </p>
                        <div class="space-y-2">
                          <div
                            v-for="dept in departmentsWithShortestResolutionTime"
                            :key="dept.departmentId"
                            class="flex justify-between items-center text-sm"
                          >
                            <span class="text-gray-700 dark:text-gray-300">{{
                              dept.departmentName
                            }}</span>
                            <span class="font-medium text-green-600 dark:text-green-400">{{
                              formatTimeInSeconds(dept.averageResolutionTimeSeconds)
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 lg:w-1/2">
                    <div class="space-y-3">
                      <template v-if="sortedDepartmentsByResolutionTime.length">
                        <div
                          v-for="dept in sortedDepartmentsByResolutionTime"
                          :key="dept.departmentId"
                          class="space-y-1"
                        >
                          <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-700 dark:text-gray-300 truncate max-w-24">{{
                              dept.departmentName
                            }}</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds) }}
                            </span>
                          </div>
                          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              class="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full relative"
                              :class="{
                                'min-w-[2px]': dept.averageResolutionTimeSeconds === 0,
                              }"
                              :style="{
                                width:
                                  dept.averageResolutionTimeSeconds === 0
                                    ? '2px'
                                    : `${(dept.averageResolutionTimeSeconds / sortedDepartmentsByResolutionTime[0].averageResolutionTimeSeconds) * 100}%`,
                              }"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Duration Chart -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Tempo Médio Por Status
                  </h2>
                </div>

                <div class="flex flex-col lg:flex-row">
                  <div class="p-6 lg:w-1/2 border-r border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                      Análise de tempo por status:
                    </p>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Esta análise mostra quanto tempo em média os tickets permanecem em cada
                        status.
                      </p>
                      <p>Tempos altos em determinados status podem indicar gargalos no processo.</p>
                    </div>
                  </div>

                  <div class="p-6 lg:w-1/2">
                    <div class="space-y-3">
                      <template v-if="sortedStatusDurations.length">
                        <div
                          v-for="(duration, index) in sortedStatusDurations"
                          :key="index"
                          class="space-y-1"
                        >
                          <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-700 dark:text-gray-300">{{
                              formatSnakeToNaturalCase(duration.status)
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
                                width:
                                  duration.averageDurationSeconds === 0
                                    ? '2px'
                                    : `${(duration.averageDurationSeconds / sortedStatusDurations[0].averageDurationSeconds) * 100}%`,
                              }"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- In Progress Time Analysis -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  TEMPO GASTO NO STATUS "EM ANDAMENTO"
                </h2>
              </div>

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
                        >{{ getTotalInProgressCount() }} tickets</span
                      >
                      nos últimos
                      <span class="font-semibold text-blue-600 dark:text-blue-400">6 meses</span>.
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
                  </div>
                </div>

                <div class="p-6 lg:w-2/3">
                  <div class="space-y-4">
                    <div class="h-64">
                      <Line
                        v-if="inProgressTimeChartData"
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

                    <div v-if="inProgressTimeSeries" class="grid grid-cols-2 gap-4">
                      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="block text-lg font-semibold text-gray-900 dark:text-white">{{
                          formatTimeInSecondsCompact(inProgressTimeSeries.averageDuration)
                        }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400"
                          >Média últimos 6 meses</span
                        >
                      </div>
                      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="block text-lg font-semibold text-gray-900 dark:text-white">{{
                          getTotalInProgressCount()
                        }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400"
                          >Número de tickets</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Tickets em Andamento
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Acompanhe o progresso dos tickets atualmente sendo processados
                    </p>
                  </div>
                  <div class="mt-4 sm:mt-0 flex items-center gap-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ inProgressTasks.length }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                        {{ inProgressTasks.filter((task) => task.isOverdue).length }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Em atraso</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="loadingInProgressTasks" class="p-6">
                <div
                  class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                >
                  <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                  <p class="text-sm">Carregando tickets em andamento...</p>
                </div>
              </div>

              <div v-else-if="inProgressTasks.length === 0" class="p-6">
                <div
                  class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400"
                >
                  <font-awesome-icon icon="check-circle" class="text-3xl mb-3 text-green-500" />
                  <p class="text-lg font-medium">Nenhum ticket em andamento</p>
                  <p class="text-sm">Todos os tickets foram processados!</p>
                </div>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Responsável
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Título do Chamado
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Tempo em Andamento
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr
                      v-for="task in inProgressTasks"
                      :key="task.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400"
                          >
                            {{ task.assignee.initials }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {{ task.customId }}
                          </span>
                          <span class="text-sm text-gray-900 dark:text-white">
                            {{ task.name }}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          {{ task.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="flex items-center justify-center gap-1">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ task.timeInProgress }}
                          </span>
                          <span
                            v-if="task.isOverdue"
                            class="text-red-600 dark:text-red-400 ml-1"
                            :title="task.overdueReason"
                          >
                            <font-awesome-icon icon="exclamation-triangle" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- In Progress Time Analysis -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Análise de Tempo em Andamento
                </h2>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      Distribuição por Tempo
                    </h3>
                    <div class="space-y-3">
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Menos de 1 dia</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{
                            inProgressTasks.filter((t) => t.timeInProgressSeconds < 86400).length
                          }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600 dark:text-gray-400">1-3 dias</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{
                            inProgressTasks.filter(
                              (t) =>
                                t.timeInProgressSeconds >= 86400 &&
                                t.timeInProgressSeconds < 259200,
                            ).length
                          }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600 dark:text-gray-400">3-7 dias</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{
                            inProgressTasks.filter(
                              (t) =>
                                t.timeInProgressSeconds >= 259200 &&
                                t.timeInProgressSeconds < 604800,
                            ).length
                          }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Mais de 1 semana</span>
                        <span class="font-medium text-red-600 dark:text-red-400">
                          {{
                            inProgressTasks.filter((t) => t.timeInProgressSeconds >= 604800).length
                          }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Estatísticas</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="text-lg font-semibold text-gray-900 dark:text-white">
                          {{
                            inProgressTasks.length > 0
                              ? Math.round(
                                  inProgressTasks.reduce(
                                    (sum, task) => sum + task.timeInProgressSeconds,
                                    0,
                                  ) /
                                    inProgressTasks.length /
                                    3600,
                                )
                              : 0
                          }}h
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Tempo médio</div>
                      </div>
                      <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="text-lg font-semibold text-gray-900 dark:text-white">
                          {{
                            inProgressTasks.length > 0
                              ? Math.round(
                                  Math.max(...inProgressTasks.map((t) => t.timeInProgressSeconds)) /
                                    3600,
                                )
                              : 0
                          }}h
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Tempo máximo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Setores Tab -->
          <div v-if="currentTab === 'department'" class="space-y-6">
            <!-- Department Summary Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Estatísticas por Setor
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Análise detalhada do desempenho de cada departamento
                </p>
              </div>

              <div
                v-if="departmentStatsSummary"
                class="p-6 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {{ departmentStatsSummary.totalTickets }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Total de Tickets</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                      {{ departmentStatsSummary.totalResolved }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Tickets Resolvidos</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {{
                        formatTimeInSecondsCompact(
                          departmentStatsSummary.averageResolutionTimeSeconds,
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Tempo Médio de Resolução
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {{ departmentStats.length }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Setores Ativos</div>
                  </div>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Setor
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Resolvidos
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Taxa de Resolução
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Tempo de Aceitação
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Tempo de Resolução
                      </th>
                      <th
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr
                      v-for="dept in departmentStats"
                      :key="dept.departmentId"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ dept.departmentName }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ dept.totalTickets }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ dept.resolvedTickets }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          :class="[
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            dept.resolutionRate >= 0.8
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : dept.resolutionRate >= 0.5
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                          ]"
                        >
                          {{ formatPercentage(dept.resolutionRate) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ formatTimeInSecondsCompact(dept.averageAcceptanceTimeSeconds) }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ formatTimeInSecondsCompact(dept.averageResolutionTimeSeconds) }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="flex items-center justify-center">
                          <div
                            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[60px]"
                          >
                            <div
                              class="h-2 rounded-full"
                              :class="
                                dept.resolutionRate >= 0.8
                                  ? 'bg-green-500'
                                  : dept.resolutionRate >= 0.5
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              "
                              :style="{ width: `${dept.resolutionRate * 100}%` }"
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Top Performing vs Underperforming Departments -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Top Performing -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Melhor Desempenho
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Setores com maior taxa de resolução
                  </p>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <div
                      v-for="dept in departmentStats
                        .slice()
                        .sort((a, b) => b.resolutionRate - a.resolutionRate)
                        .slice(0, 3)"
                      :key="dept.departmentId"
                      class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">
                          {{ dept.departmentName }}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          {{ dept.resolvedTickets }}/{{ dept.totalTickets }} tickets
                        </div>
                      </div>
                      <div class="text-lg font-bold text-green-600 dark:text-green-400">
                        {{ formatPercentage(dept.resolutionRate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Needs Improvement -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Necessita Melhoria
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Setores com menor taxa de resolução
                  </p>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <div
                      v-for="dept in departmentStats
                        .slice()
                        .sort((a, b) => a.resolutionRate - b.resolutionRate)
                        .slice(0, 3)"
                      :key="dept.departmentId"
                      class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">
                          {{ dept.departmentName }}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          {{ dept.resolvedTickets }}/{{ dept.totalTickets }} tickets
                        </div>
                      </div>
                      <div class="text-lg font-bold text-red-600 dark:text-red-400">
                        {{ formatPercentage(dept.resolutionRate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tendências Tab -->
          <div v-if="currentTab === 'trends'" class="space-y-6">
            <!-- Trends Overview -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Análise de Tendências
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Acompanhe a evolução dos tickets ao longo do tempo
                    </p>
                  </div>
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
              </div>

              <div class="p-6">
                <div class="h-80">
                  <Line v-if="trendChartData" :data="trendChartData" :options="trendChartOptions" />
                  <div
                    v-else
                    class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                  >
                    <font-awesome-icon icon="spinner" spin class="text-2xl mb-3" />
                    <p>Carregando dados de tendências...</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cycle Time Analysis -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Tempo de Resolução - Análise Temporal
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ formatTimeInSecondsCompact(getAverageResolutionTime()) }} (média
                      {{ periodTextMap[selectedCycleTimePeriod] }})
                    </p>
                  </div>
                  <div class="mt-4 sm:mt-0">
                    <Select
                      :options="[
                        { value: 'week', label: 'Semanal' },
                        { value: 'month', label: 'Mensal' },
                        { value: 'quarter', label: 'Trimestral' },
                      ]"
                      v-model="selectedCycleTimePeriod"
                      @update:modelValue="handleCycleTimePeriodChange"
                    />
                  </div>
                </div>
              </div>

              <div class="flex flex-col lg:flex-row">
                <div class="p-6 lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Tempo {{ periodTextMap[selectedCycleTimePeriod] }}:
                      </p>
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ formatTimeInSecondsCompact(getLatestResolutionTime()) }}
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ getPeriodName() }}
                      </p>
                    </div>

                    <div v-if="hasPreviousPeriodData()">
                      <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Comparação:
                      </p>
                      <div class="flex items-center gap-2">
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
                          class="font-medium"
                        >
                          {{ Math.abs(getResolutionTimeTrend()) }}%
                        </span>
                        <span class="text-gray-600 dark:text-gray-400 text-sm">
                          vs {{ getPreviousPeriodLabel() }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{
                          getResolutionTimeTrend() > 0
                            ? 'Aumento no tempo de resolução (preocupante)'
                            : 'Diminuição no tempo de resolução (positivo)'
                        }}
                      </p>
                    </div>

                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Média histórica:
                      </p>
                      <div class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {{ formatTimeInSecondsCompact(getAverageResolutionTime()) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-6 lg:w-2/3">
                  <div :key="chartRenderKey" class="h-64">
                    <div
                      v-if="cycleTimeChartLoading"
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="spinner" spin class="text-xl mb-2" />
                      <p class="text-sm">Atualizando gráfico...</p>
                    </div>
                    <Bar
                      v-else-if="cycleTimeBarData && cycleTimeBarData.labels.length"
                      :data="cycleTimeBarData"
                      :options="cycleTimeBarOptions"
                    />
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      <font-awesome-icon icon="chart-bar" class="text-2xl mb-2" />
                      <p class="text-sm">Nenhum dado disponível para o período selecionado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trend Insights -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Performance Trends -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Tendências de Performance
                  </h3>
                </div>
                <div class="p-6 space-y-4">
                  <div
                    class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">Tickets Criados</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ getTotalCreated() }} no período
                      </div>
                    </div>
                    <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      <font-awesome-icon
                        :icon="createdTrendPercentage >= 0 ? 'arrow-up' : 'arrow-down'"
                        class="mr-1"
                      />
                      {{ Math.abs(createdTrendPercentage) }}%
                    </div>
                  </div>

                  <div
                    class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">
                        Tickets Resolvidos
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ getTotalResolved() }} no período
                      </div>
                    </div>
                    <div class="text-lg font-bold text-green-600 dark:text-green-400">
                      <font-awesome-icon
                        :icon="resolvedTrendPercentage >= 0 ? 'arrow-up' : 'arrow-down'"
                        class="mr-1"
                      />
                      {{ Math.abs(resolvedTrendPercentage) }}%
                    </div>
                  </div>

                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="font-medium text-gray-900 dark:text-white mb-1">
                      Taxa de Resolução
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{
                        getTotalCreated() > 0
                          ? formatPercentage(getTotalResolved() / getTotalCreated())
                          : '0%'
                      }}
                      dos tickets criados foram resolvidos
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Distribution Trends -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Tempo Médio Por Status
                  </h2>
                </div>

                <div class="flex flex-col lg:flex-row">
                  <div class="p-6 lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                      Análise de tempo por status:
                    </p>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Esta análise mostra quanto tempo em média os tickets permanecem em cada
                        status.
                      </p>
                      <p>Tempos altos em determinados status podem indicar gargalos no processo.</p>
                    </div>
                  </div>

                  <div class="p-6 lg:w-2/3">
                    <div class="space-y-3">
                      <template v-if="sortedStatusDurations.length">
                        <div
                          v-for="(duration, index) in sortedStatusDurations"
                          :key="index"
                          class="space-y-1"
                        >
                          <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-700 dark:text-gray-300">{{
                              formatSnakeToNaturalCase(duration.status)
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
                                width:
                                  duration.averageDurationSeconds === 0
                                    ? '2px'
                                    : `${(duration.averageDurationSeconds / sortedStatusDurations[0].averageDurationSeconds) * 100}%`,
                              }"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal
    :isOpen="showExportModal"
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
import * as XLSX from 'xlsx';
import BaseModal from '@/components/common/BaseModal.vue';
import JSZip from 'jszip';
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
const showExportModal = ref(false);

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
  const colors = [
    'avatar-pink',
    'avatar-orange',
    'avatar-blue',
    'avatar-green',
    'avatar-purple',
    'avatar-teal',
    'avatar-indigo',
    'avatar-red',
  ];
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

const openExportModal = () => {
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
    toast.error('Erro ao buscar tickets para exportação');
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
      ['Total de Tickets', statistics.value?.totalTickets || 0],
      ['Taxa de Resolução', formatPercentage(statistics.value?.resolutionRate)],
      [
        'Tempo Médio de Resolução',
        formatTimeInSeconds(statistics.value?.averageResolutionTimeSeconds),
      ],
      [
        'Tempo Médio de Aceitação',
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
    generalData.push(['Total de Tickets Criados', getTotalCreated()]);
    generalData.push(['Total de Tickets Concluídos', getTotalResolved()]);
    generalData.push(['Tickets em Andamento', inProgressTasks.value?.length || 0]);
    generalData.push(['Departamentos Ativos', departmentStats.value?.length || 0]);

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
          'Departamento',
          'Data Criação',
          'Data Atualização',
        ],
        ...allTickets.map((ticket) => [
          ticket.customId,
          ticket.name,
          ticket.status,
          ticket.priority,
          `${ticket.requester.firstName} ${ticket.requester.lastName}`,
          ticket.targetUser
            ? `${ticket.targetUser.firstName} ${ticket.targetUser.lastName}`
            : 'Não atribuído',
          ticket.department.name,
          new Date(ticket.createdAt).toLocaleDateString('pt-BR'),
          new Date(ticket.updatedAt).toLocaleDateString('pt-BR'),
        ]),
      ];
      const allTicketsSheet = XLSX.utils.aoa_to_sheet(ticketsData);
      XLSX.utils.book_append_sheet(workbook, allTicketsSheet, 'Tickets');
    }

    // Department Statistics Sheet
    if (departmentStats.value && departmentStats.value.length > 0) {
      const deptData = [
        ['=== ESTATÍSTICAS POR DEPARTAMENTO ==='],
        [
          'Departamento',
          'Total Tickets',
          'Resolvidos',
          'Taxa Resolução',
          'Tempo Aceitação',
          'Tempo Resolução',
          'Tempo Total',
        ],
        ...departmentStats.value.map((dept) => [
          dept.departmentName,
          dept.totalTickets,
          dept.resolvedTickets,
          formatPercentage(dept.resolutionRate),
          formatTimeInSeconds(dept.averageAcceptanceTimeSeconds),
          formatTimeInSeconds(dept.averageResolutionTimeSeconds),
          formatTimeInSeconds(dept.averageTotalTimeSeconds),
        ]),
      ];
      const deptSheet = XLSX.utils.aoa_to_sheet(deptData);
      XLSX.utils.book_append_sheet(workbook, deptSheet, 'Departamentos');
    }

    // Top Contributors Sheet
    if (topUsers.value && topUsers.value.users && topUsers.value.users.length > 0) {
      const usersData = [
        ['=== TOP COLABORADORES ==='],
        ['Nome', 'Departamento', 'Tickets Resolvidos', 'Taxa Resolução', 'Total Tickets'],
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
        ['Data', 'Tickets Criados', 'Tickets Concluídos', 'Total'],
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

    // Create tickets CSV content
    let ticketsCsvContent = '';
    ticketsCsvContent +=
      'ID,Assunto,Status,Prioridade,Solicitante,Responsável,Departamento,Data Criação,Data Atualização\n';

    allTickets.forEach((ticket) => {
      const requesterName = `${ticket.requester.firstName} ${ticket.requester.lastName}`;
      const targetUserName = ticket.targetUser
        ? `${ticket.targetUser.firstName} ${ticket.targetUser.lastName}`
        : 'Não atribuído';
      const createdDate = new Date(ticket.createdAt).toLocaleDateString('pt-BR');
      const updatedDate = new Date(ticket.updatedAt).toLocaleDateString('pt-BR');

      ticketsCsvContent += `${ticket.customId},"${ticket.name.replace(/"/g, '""')}",${ticket.status},${ticket.priority},"${requesterName}","${targetUserName}","${ticket.department.name}",${createdDate},${updatedDate}\n`;
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
  @apply bg-sky-100 text-sky-600;
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
