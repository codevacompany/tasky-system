<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Gestão de Clientes</h1>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative min-w-[300px] max-w-[400px]">
            <font-awesome-icon
              icon="search"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <Input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, CNPJ ou plano"
              padding="tight"
              class="w-full pr-4 pl-10 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
            />
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            @click="showNewClientModal = true"
          >
            <font-awesome-icon icon="plus" /> Novo Cliente
          </button>
        </div>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl"
          >
            <font-awesome-icon icon="building" />
          </div>
          <div class="flex-1">
            <span class="block text-sm text-gray-600 dark:text-gray-400">Clientes Ativos</span>
            <span class="block text-xl font-semibold text-gray-900 dark:text-white my-1">{{
              stats.activeClients
            }}</span>
            <span class="block text-sm text-green-600 dark:text-green-400">
              <font-awesome-icon icon="arrow-up" /> 12% este mês
            </span>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl"
          >
            <font-awesome-icon icon="users" />
          </div>
          <div class="flex-1">
            <span class="block text-sm text-gray-600 dark:text-gray-400">Total de Usuários</span>
            <span class="block text-xl font-semibold text-gray-900 dark:text-white my-1">{{
              stats.totalUsers
            }}</span>
            <span class="block text-sm text-green-600 dark:text-green-400">
              <font-awesome-icon icon="arrow-up" /> 8% este mês
            </span>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl"
          >
            <font-awesome-icon icon="inbox" />
          </div>
          <div class="flex-1">
            <span class="block text-sm text-gray-600 dark:text-gray-400">Tarefas no Mês</span>
            <span class="block text-xl font-semibold text-gray-900 dark:text-white my-1">{{
              stats.monthlyTickets
            }}</span>
            <span class="block text-sm text-red-600 dark:text-red-400">
              <font-awesome-icon icon="arrow-down" /> 5% este mês
            </span>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl"
          >
            <font-awesome-icon icon="chart-line" />
          </div>
          <div class="flex-1">
            <span class="block text-sm text-gray-600 dark:text-gray-400">Faturamento Mensal</span>
            <span class="block text-xl font-semibold text-gray-900 dark:text-white my-1">{{
              formatCurrency(stats.monthlyRevenue)
            }}</span>
            <span class="block text-sm text-green-600 dark:text-green-400">
              <font-awesome-icon icon="arrow-up" /> 15% este mês
            </span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 items-center mb-4 w-[50%]">
        <select
          v-model="statusFilter"
          class="flex-1 min-w-[140px] py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Todos os Status</option>
          <option value="trial">Trial</option>
          <option value="active">Ativo</option>
          <option value="suspended">Suspenso</option>
          <option value="cancelled">Cancelado</option>
          <option value="NO_SUBSCRIPTION">Sem Assinatura</option>
        </select>

        <select
          v-model="planFilter"
          class="flex-1 min-w-[140px] py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Todos os Planos</option>
          <option value="Básico">Básico</option>
          <option value="Essencial">Essencial</option>
          <option value="Avançado">Avançado</option>
          <option value="Sem Plano">Sem Plano</option>
        </select>

        <!-- TODO: Adicionar filtro de status de pagamento -->
        <!-- <select
          v-model="paymentFilter"
          class="flex-1 min-w-[140px] py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Status Pagamento</option>
          <option value="EM_DIA">Em dia</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="PENDENTE">Pendente</option>
        </select> -->

        <!-- <div class="flex items-center gap-2 flex-[2] min-w-[200px]">
          <input
            type="date"
            v-model="dateFilter.start"
            class="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Data inicial"
          />
          <span class="text-sm text-gray-500 dark:text-gray-400">até</span>
          <input
            type="date"
            v-model="dateFilter.end"
            class="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Data final"
          />
        </div> -->
      </div>

      <!-- Ações em Massa -->
      <div
        v-if="selectedClients.length > 0"
        class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
      >
        <span class="font-medium text-gray-900 dark:text-white"
          >{{ selectedClients.length }} clientes selecionados</span
        >
        <div class="flex flex-wrap gap-2">
          <button
            class="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            @click="toggleSelectedStatus"
          >
            <font-awesome-icon icon="toggle-on" /> Alterar Status
          </button>
          <button
            class="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            @click="showChangePlanModal"
          >
            <font-awesome-icon icon="layer-group" /> Alterar Plano
          </button>
          <button
            class="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            @click="exportSelected"
          >
            <font-awesome-icon icon="file-export" /> Exportar
          </button>
        </div>
      </div>
    </header>

    <!-- Lista de Clientes -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
      >
        <div
          class="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p>Carregando dados dos clientes...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleAllSelection"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                @click="sortBy('name')"
                class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Cliente
                <font-awesome-icon
                  :icon="getSortIcon('name')"
                  v-if="sortField === 'name'"
                  class="ml-1"
                />
              </th>
              <th
                @click="sortBy('cnpj')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                CNPJ
                <font-awesome-icon
                  :icon="getSortIcon('cnpj')"
                  v-if="sortField === 'cnpj'"
                  class="ml-1"
                />
              </th>
              <th
                @click="sortBy('plan')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Plano
                <font-awesome-icon
                  :icon="getSortIcon('plan')"
                  v-if="sortField === 'plan'"
                  class="ml-1"
                />
              </th>
              <th
                @click="sortBy('status')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Status
                <font-awesome-icon
                  :icon="getSortIcon('status')"
                  v-if="sortField === 'status'"
                  class="ml-1"
                />
              </th>
              <th
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Trial até
              </th>
              <th
                @click="sortBy('activeUsers')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Usuários
                <font-awesome-icon
                  :icon="getSortIcon('activeUsers')"
                  v-if="sortField === 'activeUsers'"
                  class="ml-1"
                />
              </th>
              <th
                @click="sortBy('ticketsThisMonth')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Tickets/Mês
                <font-awesome-icon
                  :icon="getSortIcon('ticketsThisMonth')"
                  v-if="sortField === 'ticketsThisMonth'"
                  class="ml-1"
                />
              </th>

              <!-- TODO: Adicionar função de próxima fatura -->
              <!-- <th
                @click="sortBy('nextInvoice')"
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
              >
                Próx. Fatura
                <font-awesome-icon
                  :icon="getSortIcon('nextInvoice')"
                  v-if="sortField === 'nextInvoice'"
                  class="ml-1"
                />
              </th> -->
              <th
                class="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="client in sortedClients" :key="client.id">
              <!-- Linha principal do cliente -->
              <tr
                :class="[
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                  { 'bg-blue-50 dark:bg-blue-900/20': expandedClient === client.id },
                ]"
                @click="toggleClientExpansion(client.id)"
              >
                <td class="px-4 py-4 text-center" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isSelected(client)"
                    @change="toggleSelection(client)"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-4">
                  <div>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      client.companyName
                    }}</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-center text-gray-900 dark:text-gray-100">
                  {{ formatCNPJ(client.cnpj) }}
                </td>
                <td class="px-4 py-4 text-center">
                  <span
                    :class="[
                      'inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium',
                      {
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                          client.plan.toLowerCase() === 'básico' ||
                          client.plan.toLowerCase() === 'basico',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                          client.plan.toLowerCase() === 'essencial',
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                          client.plan.toLowerCase() === 'avançado' ||
                          client.plan.toLowerCase() === 'avancado',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200':
                          client.plan.toLowerCase() === 'sem plano',
                      },
                    ]"
                  >
                    {{ client.plan }}
                  </span>
                </td>
                <td class="px-4 py-4 text-center">
                  <span
                    :class="[
                      'inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium',
                      {
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                          client.status === 'trial',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                          client.status === 'active',
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                          client.status === 'suspended',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                          client.status === 'cancelled',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200':
                          client.status === 'NO_SUBSCRIPTION',
                      },
                    ]"
                  >
                    {{ client.statusLabel }}
                  </span>
                </td>
                <td class="px-4 py-4 text-center text-gray-900 dark:text-gray-100">
                  {{ client.trialEndDate ? formatDate(client.trialEndDate) : '-' }}
                </td>
                <td class="px-4 py-4 text-center">
                  <div
                    class="text-sm text-gray-900 dark:text-gray-100 flex flex-col items-center gap-1"
                  >
                    {{ client.activeUsers }}/{{ client.userLimit }}
                    <div class="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="{
                          'bg-blue-600': client.activeUsers / client.userLimit <= 0.8,
                          'bg-orange-500': client.activeUsers / client.userLimit > 0.8,
                        }"
                        :style="{
                          width: `${(client.activeUsers / client.userLimit) * 100}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                  <div
                    class="text-sm text-gray-900 dark:text-gray-100 flex flex-col items-center gap-1"
                  >
                    {{ client.monthlyTickets }}
                    <span class="text-xs text-gray-500 dark:text-gray-400">tarefas neste mês</span>
                  </div>
                </td>

                <!-- TODO: Adicionar função de próxima fatura -->
                <!-- <td class="px-4 py-4 text-center">
                  <div
                    class="text-sm text-gray-900 dark:text-gray-100 flex flex-col items-center gap-1"
                  >
                    <span>{{ formatDate(client.nextInvoice) }}</span>
                  </div>
                </td> -->
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-1 relative">
                    <button
                      class="w-8 h-8 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Usuários"
                      @click.stop="toggleClientExpansion(client.id)"
                    >
                      <font-awesome-icon icon="users" />
                    </button>
                    <button
                      class="w-8 h-8 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Mais opções"
                      @click.stop="toggleDropdown(client.id, $event)"
                    >
                      <font-awesome-icon icon="ellipsis-v" />
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                      v-if="openDropdown === client.id"
                      class="absolute right-12 top-5 mt-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                      @click.stop
                    >
                      <div class="py-1">
                        <button
                          v-if="
                            isGlobalAdmin &&
                            (client.status === 'trial' || client.status === 'suspended')
                          "
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="renewTrial(client)"
                        >
                          <font-awesome-icon icon="redo" />
                          Renovar Trial
                        </button>

                        <!-- TODO: Adicionar função de editar cliente -->
                        <!-- <button
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="editClient(client)"
                        >
                          <font-awesome-icon icon="edit" />
                          Editar Cliente
                        </button>
                        <button
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          @click="manageUsers(client)"
                        >
                          <font-awesome-icon icon="users" />
                          Gerenciar Usuários
                        </button> -->
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Linha expandida com detalhes dos usuários -->
              <tr v-if="expandedClient === client.id" class="bg-gray-50 dark:bg-gray-800">
                <td colspan="9" class="px-4 py-4">
                  <div class="overflow-x-auto">
                    <table class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                      <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Nome
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Email
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                          setor
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Perfil
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Status
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Logins
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Último Login
                          </th>
                          <th
                            class="px-3 py-2 text-center text-xs font-medium text-gray-900 dark:text-gray-100"
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr
                          v-for="user in client.users"
                          :key="user.id"
                          class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td class="px-3 py-2">
                            <div class="flex items-center gap-3">
                              <div
                                class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium"
                              >
                                {{ getUserInitials(user) }}
                              </div>
                              <span class="text-sm text-gray-900 dark:text-white"
                                >{{ user.firstName }} {{ user.lastName }}</span
                              >
                            </div>
                          </td>
                          <td
                            class="px-3 py-2 text-center text-sm text-gray-900 dark:text-gray-100"
                          >
                            {{ user.email }}
                          </td>
                          <td
                            class="px-3 py-2 text-center text-sm text-gray-900 dark:text-gray-100"
                          >
                            {{ user.department }}
                          </td>
                          <td class="px-3 py-2 text-center">
                            <span
                              :class="[
                                'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                                {
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                                    user.profile.toLowerCase() === 'admin',
                                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                                    user.profile.toLowerCase() === 'normal',
                                },
                              ]"
                            >
                              {{ user.profile }}
                            </span>
                          </td>
                          <td class="px-3 py-2 text-center">
                            <span
                              :class="[
                                'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                                {
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                                    user.status.toLowerCase() === 'ativo',
                                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                                    user.status.toLowerCase() === 'suspenso',
                                },
                              ]"
                            >
                              {{ user.status }}
                            </span>
                          </td>
                          <td
                            class="px-3 py-2 text-center text-sm text-gray-900 dark:text-gray-100"
                          >
                            {{ user.loginCount || 0 }}
                          </td>
                          <td
                            class="px-3 py-2 text-center text-sm text-gray-900 dark:text-gray-100"
                          >
                            {{
                              user.lastLogin ? formatDateTime(user.lastLogin.toString()) : 'Nunca'
                            }}
                          </td>
                          <td class="px-3 py-2">
                            <div class="flex items-center justify-center gap-1">
                              <button
                                class="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                title="Editar"
                                @click="editUser(user)"
                              >
                                <font-awesome-icon icon="edit" />
                              </button>
                              <button
                                class="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                title="Alterar Status"
                                @click="toggleUserStatus(user)"
                              >
                                <font-awesome-icon
                                  :icon="user.status === 'ATIVO' ? 'ban' : 'check'"
                                />
                              </button>
                              <button
                                class="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                title="Resetar Senha"
                                @click="resetPassword(user)"
                              >
                                <font-awesome-icon icon="key" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex items-center justify-center gap-4 mt-6">
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-400"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <!-- Modal Novo Cliente -->
    <div
      v-if="showNewClientModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Novo Cliente</h2>
          <button
            class="w-8 h-8 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            @click="showNewClientModal = false"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="createNewClient" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Razão Social</label
              >
              <Input
                v-model="newClient.name"
                type="text"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >CNPJ</label
              >
              <Input
                v-model="newClient.cnpj"
                type="text"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Chave Personalizada</label
              >
              <Input
                v-model="newClient.customKey"
                type="text"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >E-mail</label
              >
              <Input
                v-model="newClient.email"
                type="email"
                required
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </form>
        </div>
        <div class="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            @click="showNewClientModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            @click="createNewClient"
          >
            Criar Cliente
          </button>
        </div>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div
      v-if="showPasswordResetModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"
          >
            <font-awesome-icon icon="key" class="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Redefinir Senha</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Confirmar redefinição de senha</p>
          </div>
        </div>

        <div v-if="!resetPasswordResult" class="mb-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Uma nova senha será gerada automaticamente e enviada por email para o usuário
            <strong>{{ userToReset?.firstName }} {{ userToReset?.lastName }}</strong>
            ({{ userToReset?.email }}).
          </p>

          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4"
          >
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <font-awesome-icon icon="info-circle" class="mr-2" />
              A senha será gerada automaticamente pelo sistema e enviada por email para o usuário.
            </p>
          </div>
        </div>

        <div v-else class="mb-6">
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <font-awesome-icon icon="check-circle" class="text-green-600 dark:text-green-400" />
              <span class="text-sm font-medium text-green-800 dark:text-green-200"
                >Senha redefinida com sucesso!</span
              >
            </div>
            <p class="text-sm text-green-700 dark:text-green-300 mb-3">
              A nova senha foi enviada por email para {{ userToReset?.email }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            v-if="!resetPasswordResult"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            @click="closePasswordResetModal"
            :disabled="isResettingPassword"
          >
            Cancelar
          </button>
          <button
            v-if="!resetPasswordResult"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="confirmPasswordReset"
            :disabled="isResettingPassword"
          >
            <span v-if="isResettingPassword">
              <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
              Redefinindo...
            </span>
            <span v-else>Confirmar Redefinição</span>
          </button>
          <button
            v-if="resetPasswordResult"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            @click="closePasswordResetModal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getUserInitials, formatSnakeToNaturalCase } from '@/utils/generic-helper';
import Input from '@/components/common/Input.vue';
import {
  tenantService,
  type TenantWithStats,
  type TenantStatsResponse,
  type UserWithStats,
} from '@/services/tenantService';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import { useRoles } from '@/composables/useRoles';
import apiClient from '@/utils/axiosInstance';

const { isGlobalAdmin } = useRoles();

type SortableClientField =
  | 'name'
  | 'cnpj'
  | 'plan'
  | 'status'
  | 'customKey'
  | 'activeUsers'
  | 'totalUsers'
  | 'ticketsThisMonth'
  | 'totalTickets'
  | 'nextInvoice'
  | 'paymentStatus';

// Estados
const searchTerm = ref('');
const statusFilter = ref('');
const planFilter = ref('');
const currentPage = ref(1);
const showNewClientModal = ref(false);
const expandedClient = ref<number | null>(null);
const selectedClients = ref<number[]>([]);
const sortField = ref<SortableClientField>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const paymentFilter = ref('');
const dateFilter = ref({
  start: '',
  end: '',
});

// Add state for dropdown menu
const openDropdown = ref<number | null>(null);

// Add method to toggle dropdown
const toggleDropdown = (clientId: number, event: Event) => {
  event.stopPropagation();
  openDropdown.value = openDropdown.value === clientId ? null : clientId;
};

// Add method to close dropdown when clicking outside
const closeDropdown = () => {
  openDropdown.value = null;
};

// Loading state
const isLoading = ref(true);
const isLoadingStats = ref(true);

// Data from API
const tenants = ref<TenantWithStats[]>([]);
const totalTenants = ref(0);
const totalPages = ref(1);
const globalStats = ref({
  totalActiveClients: 0,
  totalUsers: 0,
  totalMonthlyTickets: 0,
});

// Novo cliente
const newClient = ref({
  name: '',
  cnpj: '',
  customKey: '',
  email: '',
});

// Password reset modal
const showPasswordResetModal = ref(false);
const userToReset = ref<any>(null);
const isResettingPassword = ref(false);
const resetPasswordResult = ref<{ message: string } | null>(null);

const stats = computed(() => {
  return {
    activeClients: globalStats.value.totalActiveClients,
    totalUsers: globalStats.value.totalUsers,
    monthlyTickets: globalStats.value.totalMonthlyTickets,
    monthlyRevenue: 89500.0, // This remains mocked as per user requirement
  };
});

const clients = computed(() => {
  return tenants.value.map((tenant) => ({
    id: tenant.id,
    companyName: tenant.name,
    cnpj: tenant.cnpj || '',
    plan: tenant.subscription?.planSlug
      ? formatSnakeToNaturalCase(tenant.subscription.planSlug)
      : 'Sem Plano',
    status: tenant.subscription?.status || 'NO_SUBSCRIPTION',
    statusLabel: getStatusLabel(tenant.subscription?.status),
    trialEndDate: tenant.subscription?.trialEndDate,
    activeUsers: tenant.activeUsers,
    userLimit: tenant.subscription?.maxUsers || tenant.totalUsers + 10,
    monthlyTickets: tenant.ticketsThisMonth,
    nextInvoice: '2024-04-15',
    users: tenant.users.map((user: UserWithStats) => ({
      id: user.id,
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.departmentName,
      profile: user.role,
      status: user.isActive ? 'ATIVO' : 'SUSPENSO',
      lastAccess: user.lastAccess,
      loginCount: user.loginCount || 0,
      lastLogin: user.lastLogin,
    })),
  }));
});

const loadTenants = async () => {
  try {
    isLoading.value = true;
    const response = await tenantService.getTenantsWithStats({
      page: currentPage.value,
      limit: 10,
      name: searchTerm.value || undefined,
    });

    tenants.value = response.data.items;
    totalTenants.value = response.data.total;
    totalPages.value = response.data.totalPages;
    globalStats.value = response.data.globalStats;
  } catch (error) {
    console.error('Error loading tenants:', error);
    toast.error('Erro ao carregar dados dos clientes');
  } finally {
    isLoading.value = false;
  }
};

const createNewClient = async () => {
  try {
    await tenantService.createTenant({
      name: newClient.value.name,
      customKey: newClient.value.customKey,
      email: newClient.value.email,
      cnpj: newClient.value.cnpj,
    });

    toast.success('Cliente criado com sucesso!');
    showNewClientModal.value = false;

    newClient.value = {
      name: '',
      cnpj: '',
      customKey: '',
      email: '',
    };

    await loadTenants();
  } catch (error) {
    console.error('Error creating tenant:', error);
    toast.error('Erro ao criar cliente');
  }
};

onMounted(async () => {
  await loadTenants();

  // Add click outside handler for dropdown
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  // Remove click outside handler
  document.removeEventListener('click', closeDropdown);
});

const filteredClients = computed(() => {
  return clients.value.filter((client) => {
    const matchSearch =
      !searchTerm.value ||
      client.companyName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.cnpj.includes(searchTerm.value) ||
      client.plan.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.statusLabel.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchStatus = !statusFilter.value || client.status === statusFilter.value;
    const matchPlan = !planFilter.value || client.plan === planFilter.value;

    return matchSearch && matchStatus && matchPlan;
  });
});

const isAllSelected = computed(() => {
  return (
    filteredClients.value.length > 0 &&
    selectedClients.value.length === filteredClients.value.length
  );
});

const sortedClients = computed(() => {
  const sorted = [...filteredClients.value].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField.value) {
      case 'name':
        aValue = a.companyName;
        bValue = b.companyName;
        break;
      case 'activeUsers':
        aValue = a.activeUsers;
        bValue = b.activeUsers;
        break;
      case 'ticketsThisMonth':
        aValue = a.monthlyTickets;
        bValue = b.monthlyTickets;
        break;
      case 'cnpj':
        aValue = a.cnpj;
        bValue = b.cnpj;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.companyName;
        bValue = b.companyName;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return sorted;
});

const toggleClientExpansion = (clientId: number) => {
  expandedClient.value = expandedClient.value === clientId ? null : clientId;
};

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('pt-BR');
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'trial':
      return 'Trial';
    case 'active':
      return 'Ativo';
    case 'suspended':
      return 'Suspenso';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Sem Assinatura';
  }
};

const editClient = (client: any) => {
  console.log('Editar cliente:', client);
};

const manageUsers = (client: any) => {
  // Implementar gestão de usuários
  console.log('Gerenciar usuários:', client);
};

const manageSettings = (client: any) => {
  // Implementar configurações
  console.log('Configurações:', client);
};

const showOptions = (client: any) => {
  // Implementar menu de opções
  console.log('Opções:', client);
};

const editUser = (user: any) => {
  // Implementar edição de usuário
  console.log('Editar usuário:', user);
};

const toggleUserStatus = (user: any) => {
  // Implementar alteração de status
  console.log('Alternar status do usuário:', user);
};

const resetPassword = (user: any) => {
  userToReset.value = user;
  showPasswordResetModal.value = true;
};

const confirmPasswordReset = async () => {
  if (!userToReset.value) return;

  try {
    isResettingPassword.value = true;
    const response = await userService.resetPasswordWithRandomPassword(userToReset.value.uuid);
    resetPasswordResult.value = response.data;
    toast.success('Senha redefinida com sucesso!');
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Erro ao redefinir senha');
  } finally {
    isResettingPassword.value = false;
  }
};

const closePasswordResetModal = () => {
  showPasswordResetModal.value = false;
  userToReset.value = null;
  resetPasswordResult.value = null;
};

const renewTrial = async (client: any) => {
  try {
    await apiClient.patch(`/tenant-subscriptions/tenant/${client.id}/renew-trial`);
    toast.success('Trial renovado por mais 14 dias!');
    await loadTenants();
    closeDropdown();
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Erro ao renovar trial');
  }
};

const toggleSelection = (client: any) => {
  const index = selectedClients.value.indexOf(client.id);
  if (index === -1) {
    selectedClients.value.push(client.id);
  } else {
    selectedClients.value.splice(index, 1);
  }
};

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedClients.value = [];
  } else {
    selectedClients.value = filteredClients.value.map((client) => client.id);
  }
};

const isSelected = (client: any) => {
  return selectedClients.value.includes(client.id);
};

const sortBy = (field: SortableClientField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field: string) => {
  return sortOrder.value === 'asc' ? 'sort-up' : 'sort-down';
};

const toggleSelectedStatus = () => {
  // Implementar alteração de status em massa
  console.log('Alterando status dos clientes:', selectedClients.value);
};

const showChangePlanModal = () => {
  // Implementar modal de alteração de plano em massa
  console.log('Abrindo modal de alteração de plano para:', selectedClients.value);
};

const exportSelected = () => {
  // Implementar exportação dos dados
  console.log('Exportando dados dos clientes:', selectedClients.value);
};
</script>
