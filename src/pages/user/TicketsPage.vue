<template>
  <section id="ticketsSection" class="p-4 md:p-6">
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tickets</h1>
        <button
          class="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          @click="toggleView"
          :title="
            isKanbanView ? 'Mudar para visualização em tabela' : 'Mudar para visualização Kanban'
          "
        >
          <font-awesome-icon :icon="isKanbanView ? 'table' : 'columns'" class="w-3 h-3" />
          <span class="hidden sm:inline">{{
            isKanbanView ? 'Visualização em Tabela' : 'Visualização Kanban'
          }}</span>
          <span class="sm:hidden">{{ isKanbanView ? 'Tabela' : 'Kanban' }}</span>
        </button>
      </div>
    </div>

    <!-- Summary cards - moved to top, only visible in table view -->
    <div v-if="!isKanbanView" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        @click="setStatusFilter('')"
        :title="'Mostrar todos os tickets'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"
            >
              <font-awesome-icon icon="ticket" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
          </div>
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ totalTickets }}</span>
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        @click="setStatusFilter(TicketStatus.Pending)"
        :title="'Filtrar por tickets pendentes'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white"
            >
              <font-awesome-icon icon="clock" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pendentes</span>
          </div>
          <span class="text-xl font-bold text-orange-500 dark:text-orange-400">{{
            pendingTickets
          }}</span>
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        @click="setStatusFilter(TicketStatus.InProgress)"
        :title="'Filtrar por tickets em andamento'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white"
            >
              <font-awesome-icon icon="spinner" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Em Andamento</span>
          </div>
          <span class="text-xl font-bold text-blue-500 dark:text-blue-400">{{
            inProgressTickets
          }}</span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="min-h-[300px]">
        <!-- Table Container with integrated tabs and controls -->
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          <!-- Integrated Tab Bar -->
          <div class="flex flex-col border-b-1 border-gray-200 dark:border-gray-700">
            <!-- Mobile-friendly tabs -->
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 px-6 gap-3 lg:gap-0"
            >
              <!-- Tabs Row -->
              <div class="flex items-center justify-start">
                <div
                  class="flex items-center justify-center p-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-x-auto"
                  style="height: 36px; min-width: fit-content"
                >
                  <div class="flex items-center gap-0 flex-shrink-0">
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'recebidos'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('recebidos')"
                    >
                      Recebidos
                    </button>
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'criados'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('criados')"
                    >
                      <span class="hidden sm:inline">Criados por Mim</span>
                      <span class="sm:hidden">Criados</span>
                    </button>
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'setor'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('setor')"
                    >
                      <span class="hidden sm:inline">Tickets do Setor</span>
                      <span class="sm:hidden">Setor</span>
                    </button>
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'arquivados'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('arquivados')"
                    >
                      Arquivados
                    </button>
                  </div>
                </div>
              </div>

              <!-- Search and Filters Row -->
              <div class="flex items-center justify-start lg:justify-end gap-2 mt-4 lg:mt-0">
                <div class="relative w-full max-w-xs lg:w-56">
                  <font-awesome-icon
                    icon="search"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Buscar tickets..."
                    v-model="searchTerm"
                    class="pl-9 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
                  />
                </div>
                <button
                  class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                  @click="showFiltersModal = true"
                >
                  <font-awesome-icon icon="filter" class="w-3.5 h-3.5" />
                  Filtros
                </button>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="overflow-x-auto p-4">
            <TicketTable
              v-if="!isKanbanView"
              :tickets="tickets"
              :isLoading="isLoading"
              :tableType="activeTab"
              :currentPage="currentPage"
              :totalPages="totalPages"
              :pagination="true"
              @changePage="(page) => (currentPage = page)"
              @viewTicket="handleViewTicket"
              @editTicket="handleEditTicket"
              @cancelTicket="handleCancelTicket"
              @acceptTicket="handleAcceptTicket"
              @verifyTicket="handleVerifyTicket"
              @approveTicket="handleApproveTicket"
              @requestCorrection="handleRequestCorrection"
              @rejectTicket="handleRejectTicket"
              @refresh="fetchTicketsWithFilters"
            />
            <TicketKanban v-else :tickets="tickets" @viewTicket="handleViewTicket" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Filtros (Mobile) -->
    <div
      v-if="showFiltersModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="showFiltersModal = false"
          >
            <font-awesome-icon icon="times" class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Status:</label
            >
            <Select v-model="statusFilter" :options="statusOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Prioridade:</label
            >
            <Select v-model="priorityFilter" :options="priorityOptions" />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            @click="clearFilters"
          >
            Limpar
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            @click="applyFilters"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Correção -->
    <div
      v-if="showCorrectionModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg w-[90%] max-w-md shadow-xl">
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white m-0">
            Solicitar Correção
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="cancelCorrection"
          >
            <font-awesome-icon icon="times" class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Por favor, defina uma nova data de conclusão para o ticket:
          </p>
          <div class="mb-4">
            <label
              for="newCompletionDate"
              class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >Nova Data de Conclusão:</label
            >
            <input
              type="date"
              id="newCompletionDate"
              v-model="newCompletionDate"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
              :min="new Date().toISOString().split('T')[0]"
              required
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            @click="cancelCorrection"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="confirmCorrection"
            :disabled="!newCompletionDate"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ticketService } from '@/services/ticketService';
import { useTicketsStore } from '@/stores/tickets';
import { useUserStore } from '@/stores/user';
import type { Ticket } from '@/models';
import { TicketStatus, TicketPriority } from '@/models';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketKanban from '@/components/tickets/TicketKanban.vue';
import Select from '@/components/common/Select.vue';
import { toast } from 'vue3-toastify';
import { debounce, formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { localStorageService } from '@/utils/localStorageService';

const route = useRoute();
const router = useRouter();
const ticketsStore = useTicketsStore();

const getInitialTab = (): 'recebidos' | 'criados' | 'setor' | 'arquivados' => {
  const tabFromUrl = route.query.tab as string;
  const validTabs = ['recebidos', 'criados', 'setor', 'arquivados'];

  if (validTabs.includes(tabFromUrl)) {
    return tabFromUrl as 'recebidos' | 'criados' | 'setor' | 'arquivados';
  }

  return 'recebidos';
};

const getInitialFilters = () => {
  return {
    status: (route.query.status as string) || '',
    priority: (route.query.priority as string) || '',
    search: (route.query.search as string) || '',
    page: parseInt(route.query.page as string) || 1,
  };
};

const activeTab = ref<'recebidos' | 'criados' | 'setor' | 'arquivados'>(getInitialTab());
const searchTerm = ref(getInitialFilters().search);
const statusFilter = ref<string>(getInitialFilters().status);
const priorityFilter = ref<string>(getInitialFilters().priority);
const currentPage = ref(getInitialFilters().page);

const showCorrectionModal = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const newCompletionDate = ref('');

const isKanbanView = ref(false);

const showFiltersModal = ref(false);

onMounted(async () => {
  const savedView = localStorageService.getTicketsViewPreference();
  isKanbanView.value = savedView === 'kanban';

  await fetchTicketsWithFilters();
});

const debouncedSearch = debounce(() => {
  fetchTicketsWithFilters();
}, 400);

const tickets = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return ticketsStore.receivedTickets.data;
    case 'criados':
      return ticketsStore.myTickets.data;
    case 'setor':
      return ticketsStore.departmentTickets.data;
    case 'arquivados':
      return ticketsStore.archivedTickets.data;
    default:
      return [];
  }
});

// Get loading state from the store
const isLoading = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return ticketsStore.receivedTickets.isLoading;
    case 'criados':
      return ticketsStore.myTickets.isLoading;
    case 'setor':
      return ticketsStore.departmentTickets.isLoading;
    case 'arquivados':
      return ticketsStore.archivedTickets.isLoading;
    default:
      return false;
  }
});

// Get total pages from the store
const totalPages = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return Math.ceil(ticketsStore.receivedTickets.totalCount / 10);
    case 'criados':
      return Math.ceil(ticketsStore.myTickets.totalCount / 10);
    case 'setor':
      return Math.ceil(ticketsStore.departmentTickets.totalCount / 10);
    case 'arquivados':
      return Math.ceil(ticketsStore.archivedTickets.totalCount / 10);
    default:
      return 1;
  }
});

const statusOptions = computed(() => [
  { value: '', label: 'Todos' },
  { value: TicketStatus.Pending, label: formatSnakeToNaturalCase(TicketStatus.Pending) },
  { value: TicketStatus.InProgress, label: formatSnakeToNaturalCase(TicketStatus.InProgress) },
  { value: TicketStatus.Completed, label: formatSnakeToNaturalCase(TicketStatus.Completed) },
  {
    value: TicketStatus.AwaitingVerification,
    label: formatSnakeToNaturalCase(TicketStatus.AwaitingVerification),
  },
  {
    value: TicketStatus.UnderVerification,
    label: formatSnakeToNaturalCase(TicketStatus.UnderVerification),
  },
]);

const priorityOptions = computed(() => [
  { value: '', label: 'Todas' },
  { value: TicketPriority.Low, label: formatSnakeToNaturalCase(TicketPriority.Low) },
  { value: TicketPriority.Medium, label: formatSnakeToNaturalCase(TicketPriority.Medium) },
  { value: TicketPriority.High, label: formatSnakeToNaturalCase(TicketPriority.High) },
]);

const activeFiltersCount = computed(() => {
  let count = 0;
  if (statusFilter.value && statusFilter.value !== '') count++;
  if (priorityFilter.value && priorityFilter.value !== '') count++;
  if (searchTerm.value) count++;
  return count;
});

const switchTab = (tab: 'recebidos' | 'criados' | 'setor' | 'arquivados') => {
  statusFilter.value = '';
  priorityFilter.value = '';
  searchTerm.value = '';

  activeTab.value = tab;
  currentPage.value = 1;

  updateUrlWithFilters();
};

const fetchTicketsWithFilters = async () => {
  const typeMap: Record<string, 'received' | 'createdByMe' | 'department' | 'archived'> = {
    recebidos: 'received',
    criados: 'createdByMe',
    setor: 'department',
    arquivo: 'archived',
  };

  const storeType = typeMap[activeTab.value];

  const filters: {
    priority?: TicketPriority | null;
    status?: TicketStatus | null;
    name?: string;
  } = {};

  if (priorityFilter.value && priorityFilter.value !== '') {
    filters.priority = priorityFilter.value as TicketPriority;
  }

  if (statusFilter.value && statusFilter.value !== '') {
    filters.status = statusFilter.value as TicketStatus;
  }

  if (searchTerm.value) {
    filters.name = searchTerm.value;
  }

  await ticketsStore.setCurrentPage(storeType, currentPage.value, filters);
};

const totalTickets = computed(() => tickets.value.length);
const pendingTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.Pending).length,
);
const inProgressTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.InProgress).length,
);

const handleViewTicket = (ticket: Ticket) => {
  console.log('Viewing ticket:', ticket);
};

const handleEditTicket = (ticket: Ticket) => {
  console.log('Editing ticket:', ticket);
  // Implementar lógica de edição
};

const handleCancelTicket = async (ticket: Ticket) => {
  if (confirm('Tem certeza que deseja excluir este ticket?')) {
    try {
      await ticketService.cancel(ticket.customId);
      toast.success('Ticket excluído com sucesso!');
      fetchTicketsWithFilters();
    } catch {
      toast.error('Erro ao excluir ticket. Tente novamente.');
    }
  }
};

const handleAcceptTicket = async (ticket: Ticket) => {
  try {
    await ticketService.accept(ticket.customId);
    toast.success('Ticket aceito com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aceitar ticket. Tente novamente.');
  }
};

const handleVerifyTicket = async (ticketId: string) => {
  try {
    await ticketService.updateStatus(ticketId, { status: TicketStatus.AwaitingVerification });
    toast.success('Ticket enviado para revisão');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao enviar o ticket para revisão');
  }
};

const handleApproveTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Completed });
    toast.success('Ticket aprovado com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aprovar ticket. Tente novamente.');
  }
};

const handleRequestCorrection = async (ticket: Ticket) => {
  selectedTicket.value = ticket;
  showCorrectionModal.value = true;
};

const confirmCorrection = async () => {
  if (!selectedTicket.value || !newCompletionDate.value) return;

  try {
    await ticketService.updateStatus(selectedTicket.value.customId, {
      status: TicketStatus.InProgress,
    });

    await ticketService.update(selectedTicket.value.customId, { dueAt: newCompletionDate.value });
    toast.success('Correção solicitada com sucesso!');
    showCorrectionModal.value = false;
    selectedTicket.value = null;
    newCompletionDate.value = '';
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao solicitar correção. Tente novamente.');
  }
};

const cancelCorrection = () => {
  showCorrectionModal.value = false;
  selectedTicket.value = null;
  newCompletionDate.value = '';
};

const handleRejectTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Rejected });
    toast.success('Ticket reprovado com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao reprovar ticket. Tente novamente.');
  }
};

const toggleView = () => {
  isKanbanView.value = !isKanbanView.value;
  localStorageService.setTicketsViewPreference(isKanbanView.value ? 'kanban' : 'table');
};

const clearFilters = () => {
  statusFilter.value = '';
  priorityFilter.value = '';
  searchTerm.value = '';
  fetchTicketsWithFilters();
  updateUrlWithFilters();
};

const applyFilters = () => {
  fetchTicketsWithFilters();
  showFiltersModal.value = false;
  updateUrlWithFilters();
};

const setStatusFilter = (status: TicketStatus | '') => {
  statusFilter.value = status;
  currentPage.value = 1; // Reset to first page when changing filters
  fetchTicketsWithFilters();
  updateUrlWithFilters();
};

const updateUrlWithFilters = () => {
  const query: any = { tab: activeTab.value };

  if (statusFilter.value) query.status = statusFilter.value;
  if (priorityFilter.value) query.priority = priorityFilter.value;
  if (searchTerm.value) query.search = searchTerm.value;
  if (currentPage.value > 1) query.page = currentPage.value;

  router.push({ query });
};

watch(
  () => route.query.tab,
  (newTab) => {
    const validTabs = ['recebidos', 'criados', 'setor', 'arquivados'];
    if (newTab && validTabs.includes(newTab as string)) {
      activeTab.value = newTab as 'recebidos' | 'criados' | 'setor' | 'arquivados';
    }
  },
);

watch(
  () => route.query,
  (newQuery) => {
    // Update filters from URL
    if (newQuery.status !== undefined) {
      statusFilter.value = newQuery.status as string;
    }
    if (newQuery.priority !== undefined) {
      priorityFilter.value = newQuery.priority as string;
    }
    if (newQuery.search !== undefined) {
      searchTerm.value = newQuery.search as string;
    }
    if (newQuery.page !== undefined) {
      currentPage.value = parseInt(newQuery.page as string) || 1;
    }

    // Fetch tickets with new filters
    fetchTicketsWithFilters();
  },
  { deep: true },
);

watch(searchTerm, () => {
  debouncedSearch();
  updateUrlWithFilters();
});

watch(currentPage, () => {
  fetchTicketsWithFilters();
  updateUrlWithFilters();
});

watch(activeTab, () => {
  fetchTicketsWithFilters();
  updateUrlWithFilters();
});
</script>

<style scoped>
/* All styles have been converted to Tailwind classes */

/* Hide scrollbar for tabs */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
