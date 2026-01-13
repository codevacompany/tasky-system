<template>
  <div class="p-6 max-w-[1600px] mx-auto">
    <!-- Breadcrumbs -->
    <nav
      class="flex mb-6 text-sm font-medium text-gray-500 dark:text-gray-400"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link
            to="/admin/clientes"
            class="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400"
          >
            <font-awesome-icon icon="building" class="mr-2" />
            Gestão de Clientes
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <font-awesome-icon icon="chevron-right" class="text-gray-400 text-xs mx-2" />
            <span class="text-gray-400">Detalhes da Empresa</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="space-y-6">
      <div
        class="h-32 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 skeleton-shimmer"
      ></div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 skeleton-shimmer"
        ></div>
      </div>
      <div
        class="h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 skeleton-shimmer"
      ></div>
    </div>

    <div v-else-if="tenant" class="space-y-6">
      <!-- Header Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft-sm border border-gray-100 dark:border-gray-700"
      >
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold"
            >
              {{ tenant.name.substring(0, 1).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-txt-primary dark:text-white m-0">
                {{ tenant.name }}
              </h1>
              <div class="flex flex-wrap items-center gap-3 mt-2">
                <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <font-awesome-icon icon="hashtag" class="text-xs" />
                  ID: {{ tenant.id }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <font-awesome-icon icon="key" class="text-xs" />
                  Chave: {{ tenant.customKey }}
                </span>
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    tenant.subscription?.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : tenant.subscription?.status === 'trial'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                  ]"
                >
                  {{ formatStatus(tenant.subscription?.status) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="isEditModalOpen = true"
              class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <font-awesome-icon icon="edit" class="mr-2" />
              Editar Empresa
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Gerenciar Assinatura
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft-sm border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >Usuários Ativos</span
            >
            <div
              class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"
            >
              <font-awesome-icon icon="users" />
            </div>
          </div>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-txt-primary dark:text-white">{{
              tenant.activeUsers
            }}</span>
            <span class="text-sm text-gray-400 mb-1"
              >/ {{ tenant.subscription?.maxUsers || '∞' }} limite</span
            >
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft-sm border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Tarefas no Mês</span>
            <div
              class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center"
            >
              <font-awesome-icon icon="tasks" />
            </div>
          </div>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-txt-primary dark:text-white">{{
              tenant.ticketsThisMonth
            }}</span>
            <span class="text-sm text-gray-400 mb-1">este mês</span>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft-sm border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Plano Atual</span>
            <div
              class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center"
            >
              <font-awesome-icon icon="layer-group" />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-txt-primary dark:text-white">{{
              tenant.subscription?.planName || 'Sem Plano'
            }}</span>
            <span class="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold"
              >Mensal</span
            >
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft-sm border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Tempo de Vida</span>
            <div
              class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center"
            >
              <font-awesome-icon icon="calendar-check" />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-txt-primary dark:text-white">{{
              formatDate(tenant.createdAt)
            }}</span>
            <span class="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold"
              >Data da Criação</span
            >
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info Content -->
        <div class="lg:col-span-2 space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div
              class="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center"
            >
              <h3
                class="text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2 m-0"
              >
                <font-awesome-icon icon="id-card" class="text-blue-500" />
                Informações da Empresa
              </h3>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >Razão Social</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ tenant.name }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >CNPJ</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCNPJ(tenant.cnpj) }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >E-mail Principal</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ tenant.email }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >Telefone</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ tenant.phoneNumber || 'Não informado' }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >E-mail de Faturamento</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ tenant.billingEmail || tenant.email }}
                </p>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >Endereço</span
                >
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ formatAddress(tenant) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Users List -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div
              class="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center"
            >
              <h3
                class="text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2 m-0"
              >
                <font-awesome-icon icon="users" class="text-blue-500" />
                Usuários ({{ tenant.users.length }})
              </h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Usuário
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Setor / Perfil
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Último Acesso
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr
                    v-for="user in paginatedUsers"
                    :key="user.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm"
                        >
                          {{ getUserInitials(user) }}
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white m-0">
                            {{ user.firstName }} {{ user.lastName }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                            {{ user.email }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col gap-0.5">
                        <span class="text-sm text-gray-900 dark:text-gray-100">{{
                          user.departmentName
                        }}</span>
                        <span class="text-xs text-gray-400">{{ user.role }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          user.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        ]"
                      >
                        {{ user.isActive ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                        {{ user.lastLogin ? formatDate(user.lastLogin) : 'Nunca' }}
                      </p>
                      <p class="text-[10px] text-gray-400 m-0" v-if="user.loginCount">
                        {{ user.loginCount }} acessos
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- User Pagination Controls -->
            <div
              v-if="tenant.users.length > userPerPage"
              class="p-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/30"
            >
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Mostrando {{ (userCurrentPage - 1) * userPerPage + 1 }} a
                {{ Math.min(userCurrentPage * userPerPage, tenant.users.length) }} de
                {{ tenant.users.length }} usuários
              </div>
              <div class="flex gap-2">
                <button
                  @click="userCurrentPage--"
                  :disabled="userCurrentPage === 1"
                  class="p-2 w-8 h-8 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                  <font-awesome-icon icon="chevron-left" class="text-[10px]" />
                </button>
                <div class="flex gap-1">
                  <button
                    v-for="p in totalUserPages"
                    :key="p"
                    @click="userCurrentPage = p"
                    :class="[
                      'w-8 h-8 rounded text-xs font-bold transition-all',
                      userCurrentPage === p
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    {{ p }}
                  </button>
                </div>
                <button
                  @click="userCurrentPage++"
                  :disabled="userCurrentPage === totalUserPages"
                  class="p-2 w-8 h-8 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                  <font-awesome-icon icon="chevron-right" class="text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          <!-- Historico de Pagamentos -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div
              class="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center"
            >
              <h3
                class="text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2 m-0"
              >
                <font-awesome-icon icon="credit-card" class="text-blue-500" />
                Histórico de Faturamento
              </h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Descrição
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Vencimento
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Valor
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Último Envio
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr v-if="isLoadingPayments" v-for="i in 3" :key="i">
                    <td colspan="6" class="px-6 py-4">
                      <div
                        class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full skeleton-shimmer"
                      ></div>
                    </td>
                  </tr>
                  <tr v-else-if="payments.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center text-gray-400 text-sm">
                      Nenhum registro de pagamento encontrado.
                    </td>
                  </tr>
                  <tr
                    v-for="payment in payments"
                    :key="payment.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white m-0">
                        {{ payment.description || 'Assinatura Mensal' }}
                      </p>
                      <p class="text-[10px] text-gray-400 m-0 uppercase">
                        {{ payment.tenantSubscription?.subscriptionPlan?.name || 'Plano' }}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{
                        formatDate(payment.dueDate)
                      }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{
                        formatCurrency(payment.amount)
                      }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        ]"
                      >
                        {{ formatPaymentStatus(payment.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div v-if="payment.invoiceSentAt" class="flex flex-col items-center">
                        <span class="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                          {{ formatDateTime(payment.invoiceSentAt).split(' ')[0] }}
                        </span>
                        <span class="text-[9px] text-gray-400">
                          às {{ formatDateTime(payment.invoiceSentAt).split(' ')[1] }}
                        </span>
                      </div>
                      <span v-else class="text-[10px] text-gray-400 italic">Nunca enviado</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          v-if="payment.invoiceUrl"
                          :href="payment.invoiceUrl"
                          target="_blank"
                          class="w-8 h-8 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                          title="Ver Fatura"
                        >
                          <font-awesome-icon icon="file-invoice-dollar" />
                        </a>
                        <button
                          @click="openInvoiceModal(payment)"
                          class="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                          title="Enviar por E-mail"
                        >
                          <font-awesome-icon icon="envelope" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Subscription Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div class="p-6 border-b border-gray-50 dark:border-gray-700">
              <h3
                class="text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2 m-0"
              >
                <font-awesome-icon icon="credit-card" class="text-blue-500" />
                Assinatura
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div
                class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50"
              >
                <span class="text-sm text-gray-500 dark:text-gray-400">Plano</span>
                <span class="text-sm font-bold text-txt-primary dark:text-white">{{
                  tenant.subscription?.planName || 'Sem Plano'
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50"
              >
                <span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <span
                  class="text-sm font-bold"
                  :class="
                    tenant.subscription?.status === 'active' ? 'text-green-600' : 'text-blue-600'
                  "
                >
                  {{ formatStatus(tenant.subscription?.status) }}
                </span>
              </div>
              <div
                v-if="tenant.subscription?.trialEndDate"
                class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50"
              >
                <span class="text-sm text-gray-500 dark:text-gray-400">Fim do Trial</span>
                <span class="text-sm font-bold text-txt-primary dark:text-white">{{
                  formatDate(tenant.subscription.trialEndDate)
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Limite Usuários</span>
                <span class="text-sm font-bold text-txt-primary dark:text-white">{{
                  tenant.subscription?.maxUsers || 'Ilimitado'
                }}</span>
              </div>
            </div>
          </div>

          <!-- History / System Information -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div class="p-6 border-b border-gray-50 dark:border-gray-700">
              <h3
                class="text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2 m-0"
              >
                <font-awesome-icon icon="info-circle" class="text-blue-500" />
                Sistema
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >Criado em</span
                >
                <span class="text-sm text-gray-900 dark:text-gray-100">{{
                  formatDateTime(tenant.createdAt)
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >Última Atualização</span
                >
                <span class="text-sm text-gray-900 dark:text-gray-100">{{
                  formatDateTime(tenant.updatedAt)
                }}</span>
              </div>
              <div class="flex flex-col gap-1 pt-2">
                <div class="flex items-center gap-2">
                  <font-awesome-icon
                    :icon="tenant.termsAccepted ? 'check-circle' : 'times-circle'"
                    :class="tenant.termsAccepted ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Termos Aceitos</span>
                </div>
                <p v-if="tenant.termsAccepted" class="text-[10px] text-gray-400 ml-6 m-0">
                  Versão {{ tenant.termsVersion }} em {{ formatDate(tenant.termsAcceptedAt) }}
                </p>
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <font-awesome-icon
                    :icon="tenant.privacyPolicyAccepted ? 'check-circle' : 'times-circle'"
                    :class="tenant.privacyPolicyAccepted ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >Política de Privacidade</span
                  >
                </div>
                <p v-if="tenant.privacyPolicyAccepted" class="text-[10px] text-gray-400 ml-6 m-0">
                  Versão {{ tenant.privacyPolicyVersion }} em
                  {{ formatDate(tenant.privacyPolicyAcceptedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Tenant Modal -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200"
      >
        <div
          class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center"
        >
          <h2 class="text-xl font-bold text-txt-primary dark:text-white m-0">
            Editar Informações da Empresa
          </h2>
          <button
            @click="isEditModalOpen = false"
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="updateTenant" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >Razão Social</label
              >
              <Input v-model="editForm.name" class="w-full" required />
            </div>
            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >CNPJ</label
              >
              <Input v-model="editForm.cnpj" v-maska="'##.###.###/####-##'" class="w-full" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >Chave do Sistema (Slug)</label
              >
              <Input v-model="editForm.customKey" class="w-full" required />
            </div>
            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >E-mail Principal</label
              >
              <Input v-model="editForm.email" type="email" class="w-full" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >Telefone</label
              >
              <Input v-model="editForm.phoneNumber" v-maska="'(##) #####-####'" class="w-full" />
            </div>
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >E-mail de Faturamento</label
              >
              <Input v-model="editForm.billingEmail" type="email" class="w-full" />
            </div>
          </form>
        </div>
        <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="isEditModalOpen = false"
            class="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="updateTenant"
            :disabled="isSaving"
            class="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <font-awesome-icon v-if="isSaving" icon="spinner" spin class="mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>

    <!-- Enviar Nota Fiscal por E-mail Modal -->
    <div
      v-if="isInvoiceModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200"
      >
        <div
          class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50"
        >
          <h2
            class="text-xl font-bold text-txt-primary dark:text-white m-0 flex items-center gap-2"
          >
            <font-awesome-icon icon="envelope" class="text-blue-500" />
            Enviar Nota Fiscal
          </h2>
          <button
            @click="isInvoiceModalOpen = false"
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div
            v-if="selectedPaymentForInvoice"
            class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800"
          >
            <p
              class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider m-0"
            >
              Pagamento Selecionado
            </p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1 mb-0">
              {{ selectedPaymentForInvoice.description || 'Assinatura Mensal' }} -
              {{ formatCurrency(selectedPaymentForInvoice.amount) }}
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >E-mail do Destinatário</label
              >
              <Input
                v-model="invoiceForm.email"
                type="email"
                placeholder="exemplo@email.com"
                class="w-full"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >Link da Nota Fiscal (Opcional)</label
              >
              <Input
                v-model="invoiceForm.invoiceLink"
                type="url"
                placeholder="https://..."
                class="w-full"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300"
                >Anexar Arquivo (PDF/Nota Fiscal)</label
              >
              <div
                class="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group"
              >
                <input
                  type="file"
                  @change="handleInvoiceFileUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors"
                  >
                    <font-awesome-icon :icon="invoiceForm.file ? 'file-pdf' : 'cloud-upload-alt'" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate m-0">
                      {{
                        invoiceForm.file ? invoiceForm.file.name : 'Clique para selecionar arquivo'
                      }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                      {{
                        invoiceForm.file
                          ? (invoiceForm.file.size / 1024 / 1024).toFixed(2) + ' MB'
                          : 'PDF, JPG ou PNG até 5MB'
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="isInvoiceModalOpen = false"
            class="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="sendInvoice"
            :disabled="isSendingEmail"
            class="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <font-awesome-icon v-if="isSendingEmail" icon="spinner" spin />
            <font-awesome-icon v-else icon="paper-plane" />
            {{ isSendingEmail ? 'Enviando...' : 'Enviar Agora' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { tenantService } from '@/services/tenantService';
import { subscriptionService } from '@/services/subscriptionService';
import type { TenantWithStats, UserWithStats } from '@/services/tenantService';
import type { Payment } from '@/services/subscriptionService';
import { toast } from 'vue3-toastify';
import Input from '@/components/common/Input.vue';
import { format as formatDateFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const route = useRoute();
const tenantId = parseInt(route.params.id as string);

const tenant = ref<TenantWithStats | null>(null);
const payments = ref<Payment[]>([]);
const isLoading = ref(true);
const isLoadingPayments = ref(false);
const isSaving = ref(false);
const isEditModalOpen = ref(false);

// Invoice Email Modal
const isInvoiceModalOpen = ref(false);
const isSendingEmail = ref(false);
const selectedPaymentForInvoice = ref<Payment | null>(null);
const invoiceForm = ref<{
  email: string;
  invoiceLink: string;
  file: File | null;
}>({
  email: '',
  invoiceLink: '',
  file: null,
});

// Pagination for users
const userCurrentPage = ref(1);
const userPerPage = ref(10);

const paginatedUsers = computed(() => {
  if (!tenant.value) return [];
  const start = (userCurrentPage.value - 1) * userPerPage.value;
  const end = start + userPerPage.value;
  return tenant.value.users.slice(start, end);
});

const totalUserPages = computed(() => {
  if (!tenant.value) return 0;
  return Math.ceil(tenant.value.users.length / userPerPage.value);
});

const editForm = ref({
  name: '',
  cnpj: '',
  email: '',
  billingEmail: '',
  phoneNumber: '',
  customKey: '',
});

const fetchTenant = async () => {
  try {
    isLoading.value = true;
    const response = await tenantService.getById(tenantId);
    tenant.value = response.data;

    // Fill edit form
    editForm.value = {
      name: response.data.name || '',
      cnpj: response.data.cnpj || '',
      email: response.data.email || '',
      billingEmail: response.data.billingEmail || '',
      phoneNumber: response.data.phoneNumber || '',
      customKey: response.data.customKey || '',
    };

    fetchPayments();
  } catch (error) {
    console.error('Erro ao buscar detalhes da empresa:', error);
    toast.error('Erro ao carregar detalhes da empresa.');
  } finally {
    isLoading.value = false;
  }
};

const fetchPayments = async () => {
  try {
    isLoadingPayments.value = true;
    const data = await subscriptionService.getTenantPayments(tenantId);
    payments.value = data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
  } finally {
    isLoadingPayments.value = false;
  }
};

const openInvoiceModal = (payment: Payment) => {
  selectedPaymentForInvoice.value = payment;
  invoiceForm.value = {
    email: tenant.value?.billingEmail || tenant.value?.email || '',
    invoiceLink: payment.invoiceUrl || '',
    file: null,
  };
  isInvoiceModalOpen.value = true;
};

const handleInvoiceFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    invoiceForm.value.file = target.files[0];
  }
};

const sendInvoice = async () => {
  if (!selectedPaymentForInvoice.value) return;
  if (!invoiceForm.value.email) {
    toast.error('O e-mail é obrigatório.');
    return;
  }

  try {
    isSendingEmail.value = true;
    const updatedPayment = await subscriptionService.sendInvoiceEmail(
      selectedPaymentForInvoice.value.id,
      {
        email: invoiceForm.value.email,
        invoiceLink: invoiceForm.value.invoiceLink,
        file: invoiceForm.value.file as File,
      },
    );

    // Update local payments list
    const index = payments.value.findIndex((p) => p.id === updatedPayment.id);
    if (index !== -1) {
      payments.value[index] = updatedPayment;
    }

    toast.success('Nota fiscal enviada com sucesso!');
    isInvoiceModalOpen.value = false;
  } catch (error) {
    console.error('Erro ao enviar nota fiscal:', error);
    toast.error('Erro ao enviar nota fiscal por e-mail.');
  } finally {
    isSendingEmail.value = false;
  }
};

const updateTenant = async () => {
  try {
    isSaving.value = true;
    const updateData: any = {};

    // Clean data before sending
    Object.keys(editForm.value).forEach((key) => {
      const val = (editForm.value as any)[key];
      if (val !== undefined && val !== '') {
        updateData[key] = val;
      }
    });

    await tenantService.updateById(tenantId, updateData);

    toast.success('Empresa atualizada com sucesso!');
    isEditModalOpen.value = false;
    fetchTenant(); // Refresh data
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    toast.error('Erro ao salvar alterações.');
  } finally {
    isSaving.value = false;
  }
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  try {
    return formatDateFns(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return String(date);
  }
};

const formatDateTime = (date: string | Date | undefined) => {
  if (!date) return '-';
  try {
    return formatDateFns(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch {
    return String(date);
  }
};

const formatStatus = (status: string | undefined) => {
  if (!status) return 'Inativo';
  switch (status.toLowerCase()) {
    case 'active':
      return 'Ativo';
    case 'trial':
      return 'Trial';
    case 'suspended':
      return 'Suspenso';
    case 'cancelled':
      return 'Cancelado';
    case 'no_subscription':
      return 'Sem Assinatura';
    default:
      return status;
  }
};

const formatCNPJ = (cnpj: string | undefined) => {
  if (!cnpj) return '-';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatAddress = (t: TenantWithStats) => {
  if (!t.street) return 'Não informado';
  let addr = t.street;
  if (t.number) addr += `, ${t.number}`;
  if (t.neighborhood) addr += ` - ${t.neighborhood}`;
  if (t.city) addr += `, ${t.city}`;
  if (t.state) addr += ` - ${t.state}`;
  if (t.cep) addr += ` (CEP: ${t.cep})`;
  return addr;
};

const formatCurrency = (value: number | string | undefined) => {
  if (value === undefined) return 'R$ 0,00';
  const val = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
};

const formatPaymentStatus = (status: string | undefined) => {
  if (!status) return 'Pendente';
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    case 'cancelled':
      return 'Cancelado';
    case 'refunded':
      return 'Reembolsado';
    case 'processing':
      return 'Processando';
    default:
      return status;
  }
};

const getUserInitials = (user: UserWithStats) => {
  return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
};

onMounted(() => {
  fetchTenant();
});
</script>

<style scoped>
.shadow-soft-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
