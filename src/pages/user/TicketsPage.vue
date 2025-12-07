<template>
  <section id="ticketsSection" class="px-4 pt-4 pb-4 md:px-6 md:pt-4 md:pb-0">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
      <div class="flex items-center gap-2">
        <!-- View Toggle Button -->
        <button
          class="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          @click="toggleView"
          :title="isKanbanView ? 'Alternar para Tabela' : 'Alternar para Kanban'"
        >
          <font-awesome-icon :icon="isKanbanView ? 'table' : 'columns'" class="w-[13px] h-[13px]" />
          <span class="text-[13px] font-medium">{{ isKanbanView ? 'Tabela' : 'Kanban' }}</span>
        </button>

        <!-- Options Menu Button -->
        <div class="relative view-menu-container">
          <button
            class="flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
            @click.stop="showViewMenu = !showViewMenu"
            title="Opções"
          >
            <font-awesome-icon icon="ellipsis" class="w-4 h-4" />
          </button>

          <!-- View Menu Popup -->
          <div
            v-if="showViewMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            @click.stop
          >
            <div class="py-1">
              <!-- Tarefas arquivadas option -->
              <button
                @click="navigateToArchived"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <font-awesome-icon icon="archive" class="w-4 h-4" />
                <span>Tarefas arquivadas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary cards - moved to top, only visible in table view -->
    <div v-if="!isKanbanView" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        @click="setStatusFilter('')"
        :title="'Mostrar todas as tarefas'"
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
        @click="setStatusFilter(DefaultTicketStatus.Pending)"
        :title="'Filtrar por tarefas pendentes'"
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
        @click="setStatusFilter(DefaultTicketStatus.InProgress)"
        :title="'Filtrar por tarefas em andamento'"
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

    <div class="mt-5">
      <div class="min-h-[300px]">
        <!-- Table Container with integrated tabs and controls -->
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          <!-- Integrated Tab Bar -->
          <div class="flex flex-col border-b-1 border-gray-200 dark:border-gray-700">
            <!-- Mobile-friendly tabs -->
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 px-6 gap-3 lg:gap-0 relative"
            >
              <div
                class="flex items-center justify-start lg:absolute xl:left-1/2 xl:transform xl:-translate-x-1/2 w-full xl:w-auto"
              >
                <div
                  class="flex items-center justify-start lg:justify-center p-0.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-x-auto"
                  style="height: 36px; min-width: fit-content"
                >
                  <div class="flex items-center gap-0 flex-shrink-0">
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'recebidas'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('recebidas')"
                    >
                      Recebidas
                    </button>
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'criadas'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('criadas')"
                    >
                      <span class="hidden sm:inline">Criadas por Mim</span>
                      <span class="sm:hidden">Criadas</span>
                    </button>
                    <button
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'setor'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('setor')"
                    >
                      <span class="hidden sm:inline">Tarefas do Setor</span>
                      <span class="sm:hidden">Setor</span>
                    </button>
                    <button
                      v-if="isTenantAdmin"
                      :class="[
                        'px-3 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'gerais'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('gerais')"
                    >
                      Tarefas Gerais
                    </button>
                  </div>
                </div>
              </div>

              <!-- Search and Filters Row -->
              <div
                class="flex items-center justify-start gap-2 mt-4 lg:mt-0 lg:justify-end lg:ml-auto"
              >
                <div class="relative w-full max-w-xs lg:w-56">
                  <font-awesome-icon
                    icon="search"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5 pointer-events-none"
                  />
                  <Input
                    v-model="searchTerm"
                    type="text"
                    placeholder="Buscar tarefas"
                    padding="tight"
                    class="pl-9 pr-3 w-full text-sm transition-all duration-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  />
                </div>
                <button
                  class="relative flex items-center gap-2 px-4 py-2 border border-inputBorder dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                  @click="showFiltersModal = true"
                >
                  <font-awesome-icon icon="sliders" class="w-3.5 h-3.5" />
                  Filtros
                  <span
                    v-if="activeFiltersCount > 0"
                    class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-xs font-semibold rounded-full"
                  >
                    {{ activeFiltersCount }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="overflow-x-auto px-2 pt-1.5 pb-1.5">
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
            <TicketKanban
              v-else
              :tickets="tickets"
              :activeTab="activeTab"
              @viewTicket="handleViewTicket"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Details Modal -->
    <TicketDetailsModal
      v-if="selectedTicketCustomId"
      :ticketCustomId="selectedTicketCustomId"
      @close="closeTicketModal"
    />

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
            Por favor, defina uma nova data de conclusão para a tarefa:
          </p>
          <div class="mb-4">
            <label
              for="newCompletionDate"
              class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >Nova Data de Conclusão:</label
            >
            <Input
              id="newCompletionDate"
              v-model="newCompletionDate"
              type="date"
              padding="tight"
              class="w-full text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-500/10 dark:focus:ring-blue-400/10"
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ticketService } from '@/services/ticketService';
import { useTicketsStore } from '@/stores/tickets';
import { useUserStore } from '@/stores/user';
import type { Ticket } from '@/models';
import { DefaultTicketStatus, TicketPriority } from '@/models';
import { useRoles } from '@/composables/useRoles';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketKanban from '@/components/tickets/TicketKanban.vue';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';
import Select from '@/components/common/Select.vue';
import Input from '@/components/common/Input.vue';
import { toast } from 'vue3-toastify';
import { debounce, formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { localStorageService } from '@/utils/localStorageService';

const route = useRoute();
const router = useRouter();
const ticketsStore = useTicketsStore();
const { isTenantAdmin } = useRoles();

type TicketsTab = 'recebidas' | 'criadas' | 'setor' | 'gerais';

const BASE_TABS: TicketsTab[] = ['recebidas', 'criadas', 'setor'];

const getValidTabs = (includeGeneral: boolean) => {
  return includeGeneral ? [...BASE_TABS, 'gerais'] : [...BASE_TABS];
};

const getInitialTab = (): TicketsTab => {
  const tabFromUrl = route.query.tab as string;
  const validTabs = getValidTabs(isTenantAdmin.value);

  if (validTabs.includes(tabFromUrl as TicketsTab)) {
    return tabFromUrl as TicketsTab;
  }

  return 'recebidas';
};

const getInitialFilters = () => {
  return {
    status: (route.query.status as string) || '',
    priority: (route.query.priority as string) || '',
    search: (route.query.search as string) || '',
    page: parseInt(route.query.page as string) || 1,
  };
};

const activeTab = ref<TicketsTab>(getInitialTab());
const searchTerm = ref(getInitialFilters().search);
const statusFilter = ref<string>(getInitialFilters().status);
const priorityFilter = ref<string>(getInitialFilters().priority);
const currentPage = ref(getInitialFilters().page);

const availableTabs = computed<TicketsTab[]>(() =>
  isTenantAdmin.value ? [...BASE_TABS, 'gerais'] : [...BASE_TABS],
);

const showCorrectionModal = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const newCompletionDate = ref('');

const isKanbanView = ref(false);
const showViewMenu = ref(false);

const showFiltersModal = ref(false);
const isUpdatingUrl = ref(false);
const selectedTicketCustomId = ref<string | null>(null);

onMounted(async () => {
  const savedView = localStorageService.getTicketsViewPreference();
  isKanbanView.value = savedView === 'kanban';

  await fetchTicketsWithFilters();

  // Check if there's a ticket customId in the URL
  const ticketCustomId = route.query.ticket as string;
  if (ticketCustomId) {
    selectedTicketCustomId.value = ticketCustomId;
  }

  // Close view menu when clicking outside
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.view-menu-container')) {
    showViewMenu.value = false;
  }
};

const debouncedSearch = debounce(() => {
  fetchTicketsWithFilters();
  // Update URL after search completes
  updateUrlWithFilters();
}, 400);

const tickets = computed(() => {
  let ticketsData: Ticket[] = [];

  switch (activeTab.value) {
    case 'recebidas':
      ticketsData = ticketsStore.receivedTickets.data;
      break;
    case 'criadas':
      ticketsData = ticketsStore.myTickets.data;
      break;
    case 'setor':
      ticketsData = ticketsStore.departmentTickets.data;
      break;
    case 'gerais':
      ticketsData = ticketsStore.tenantTickets.data;
      break;
    default:
      return [];
  }

  // Filter out canceled and rejected tickets (we only reach here for non-archived tabs)
  return ticketsData.filter(
    (ticket) =>
      ticket.ticketStatus?.key !== DefaultTicketStatus.Canceled &&
      ticket.status !== DefaultTicketStatus.Canceled &&
      ticket.ticketStatus?.key !== DefaultTicketStatus.Rejected &&
      ticket.status !== DefaultTicketStatus.Rejected,
  );
});

// Get loading state from the store
const isLoading = computed(() => {
  switch (activeTab.value) {
    case 'recebidas':
      return ticketsStore.receivedTickets.isLoading;
    case 'criadas':
      return ticketsStore.myTickets.isLoading;
    case 'setor':
      return ticketsStore.departmentTickets.isLoading;
    case 'gerais':
      return ticketsStore.tenantTickets.isLoading;
    default:
      return false;
  }
});

// Get total pages from the store
const totalPages = computed(() => {
  switch (activeTab.value) {
    case 'recebidas':
      return Math.ceil(ticketsStore.receivedTickets.totalCount / 10);
    case 'criadas':
      return Math.ceil(ticketsStore.myTickets.totalCount / 10);
    case 'setor':
      return Math.ceil(ticketsStore.departmentTickets.totalCount / 10);
    case 'gerais':
      return Math.ceil(ticketsStore.tenantTickets.totalCount / 10);
    default:
      return 1;
  }
});

const statusOptions = computed(() => [
  { value: '', label: 'Todos' },
  {
    value: DefaultTicketStatus.Pending,
    label: formatSnakeToNaturalCase(DefaultTicketStatus.Pending),
  },
  {
    value: DefaultTicketStatus.InProgress,
    label: formatSnakeToNaturalCase(DefaultTicketStatus.InProgress),
  },
  {
    value: DefaultTicketStatus.Completed,
    label: formatSnakeToNaturalCase(DefaultTicketStatus.Completed),
  },
  {
    value: DefaultTicketStatus.AwaitingVerification,
    label: formatSnakeToNaturalCase(DefaultTicketStatus.AwaitingVerification),
  },
  {
    value: DefaultTicketStatus.UnderVerification,
    label: formatSnakeToNaturalCase(DefaultTicketStatus.UnderVerification),
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

const switchTab = (tab: TicketsTab) => {
  statusFilter.value = '';
  priorityFilter.value = '';
  searchTerm.value = '';

  activeTab.value = tab;
  currentPage.value = 1;

  updateUrlWithFilters();
};

const fetchTicketsWithFilters = async () => {
  const typeMap: Record<TicketsTab, 'received' | 'createdByMe' | 'department' | 'tenant'> = {
    recebidas: 'received',
    criadas: 'createdByMe',
    setor: 'department',
    gerais: 'tenant',
  };

  const storeType = typeMap[activeTab.value];

  if (!storeType) {
    return;
  }

  const filters: {
    priority?: TicketPriority | null;
    status?: DefaultTicketStatus | null;
    name?: string;
  } = {};

  if (priorityFilter.value && priorityFilter.value !== '') {
    filters.priority = priorityFilter.value as TicketPriority;
  }

  if (statusFilter.value && statusFilter.value !== '') {
    filters.status = statusFilter.value as DefaultTicketStatus;
  }

  if (searchTerm.value && searchTerm.value.trim()) {
    filters.name = searchTerm.value.trim();
  }

  await ticketsStore.setCurrentPage(storeType, currentPage.value, filters);
};

// Helper function to get ticket status
const getTicketStatus = (ticket: Ticket): string => {
  return ticket.ticketStatus?.key || ticket.status || '';
};

const totalTickets = computed(() => tickets.value.length);
const pendingTickets = computed(
  () =>
    tickets.value.filter((ticket) => getTicketStatus(ticket) === DefaultTicketStatus.Pending)
      .length,
);
const inProgressTickets = computed(() => {
  // Em Andamento includes all statuses except Pending, Completed, Canceled, Rejected
  const excludedStatuses = new Set([
    DefaultTicketStatus.Pending,
    DefaultTicketStatus.Completed,
    DefaultTicketStatus.Canceled,
    DefaultTicketStatus.Rejected,
  ]);

  return tickets.value.filter(
    (ticket) => !excludedStatuses.has(getTicketStatus(ticket) as DefaultTicketStatus),
  ).length;
});

const handleViewTicket = (ticket: Ticket) => {
  // Update URL with ticket customId
  const query = { ...route.query, ticket: ticket.customId };
  router.push({ query });
};

const closeTicketModal = () => {
  selectedTicketCustomId.value = null;
  // Remove ticket from URL query
  const query = { ...route.query };
  delete query.ticket;
  router.push({ query });
};

const handleEditTicket = (ticket: Ticket) => {
  console.log('Editing ticket:', ticket);
  // Implementar lógica de edição
};

const handleCancelTicket = async (ticket: Ticket) => {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    try {
      await ticketService.cancel(ticket.customId);
      toast.success('Tarefa excluída com sucesso!');
      fetchTicketsWithFilters();
    } catch {
      toast.error('Erro ao excluir tarefa. Tente novamente.');
    }
  }
};

const handleAcceptTicket = async (ticket: Ticket) => {
  try {
    await ticketService.accept(ticket.customId);
    toast.success('Tarefa aceita com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aceitar tarefa. Tente novamente.');
  }
};

const handleVerifyTicket = async (ticketId: string) => {
  try {
    await ticketService.updateStatus(ticketId, {
      status: DefaultTicketStatus.AwaitingVerification,
    });
    toast.success('Tarefa enviada para revisão');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao enviar a tarefa para revisão');
  }
};

const handleApproveTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.customId, { status: DefaultTicketStatus.Completed });
    toast.success('Tarefa aprovada com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aprovar tarefa. Tente novamente.');
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
      status: DefaultTicketStatus.InProgress,
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
    await ticketService.updateStatus(ticket.customId, { status: DefaultTicketStatus.Rejected });
    toast.success('Tarefa reprovada com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao reprovar tarefa. Tente novamente.');
  }
};

const toggleView = () => {
  isKanbanView.value = !isKanbanView.value;
  localStorageService.setTicketsViewPreference(isKanbanView.value ? 'kanban' : 'table');
};

const navigateToArchived = () => {
  showViewMenu.value = false;
  router.push('/minhas-tarefas/arquivadas');
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

const setStatusFilter = (status: DefaultTicketStatus | '') => {
  statusFilter.value = status;
  currentPage.value = 1; // Reset to first page when changing filters
  fetchTicketsWithFilters();
  updateUrlWithFilters();
};

const updateUrlWithFilters = () => {
  isUpdatingUrl.value = true;
  const query: any = { tab: activeTab.value };

  if (statusFilter.value) query.status = statusFilter.value;
  if (priorityFilter.value) query.priority = priorityFilter.value;
  if (searchTerm.value) query.search = searchTerm.value;
  if (currentPage.value > 1) query.page = currentPage.value;

  router.push({ query }).finally(() => {
    // Reset flag after a short delay to allow route watch to process
    setTimeout(() => {
      isUpdatingUrl.value = false;
    }, 100);
  });
};

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && availableTabs.value.includes(newTab as TicketsTab)) {
      activeTab.value = newTab as TicketsTab;
    }
  },
);

watch(isTenantAdmin, (isAdmin) => {
  if (!isAdmin && activeTab.value === 'gerais') {
    activeTab.value = 'recebidas';
    updateUrlWithFilters();
    return;
  }

  if (isAdmin && route.query.tab === 'gerais') {
    activeTab.value = 'gerais';
  }
});

watch(
  () => route.query.ticket,
  (newTicketCustomId) => {
    if (newTicketCustomId && typeof newTicketCustomId === 'string') {
      selectedTicketCustomId.value = newTicketCustomId;
    } else if (!newTicketCustomId) {
      selectedTicketCustomId.value = null;
    }
  },
  { immediate: true },
);

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // Don't fetch if we're updating the URL ourselves
    if (isUpdatingUrl.value) {
      return;
    }

    // Only update filters if they actually changed
    let filtersChanged = false;

    if (newQuery.status !== oldQuery?.status) {
      statusFilter.value = (newQuery.status as string) || '';
      filtersChanged = true;
    }
    if (newQuery.priority !== oldQuery?.priority) {
      priorityFilter.value = (newQuery.priority as string) || '';
      filtersChanged = true;
    }
    if (newQuery.search !== oldQuery?.search) {
      searchTerm.value = (newQuery.search as string) || '';
      filtersChanged = true;
    }
    if (newQuery.page !== oldQuery?.page) {
      currentPage.value = parseInt(newQuery.page as string) || 1;
      filtersChanged = true;
    }

    // Only fetch if filters actually changed
    if (filtersChanged) {
      fetchTicketsWithFilters();
    }
  },
  { deep: true },
);

watch(searchTerm, () => {
  // Reset to first page when searching
  currentPage.value = 1;
  debouncedSearch();
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
