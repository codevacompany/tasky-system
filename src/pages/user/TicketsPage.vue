<template>
  <section id="ticketsSection" class="px-4 pt-3 pb-4 md:px-6 md:pb-0">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-txt-primary dark:text-white">Tarefas</h1>
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
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-soft-xs cursor-pointer hover:-translate-y-1 transition-transform duration-200"
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
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-soft-xs cursor-pointer hover:-translate-y-1 transition-transform duration-200"
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
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-soft-xs cursor-pointer hover:-translate-y-1 transition-transform duration-200"
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
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-soft-xs"
        >
          <!-- Integrated Tab Bar -->
          <div class="flex flex-col border-b-1 border-gray-200 dark:border-gray-700">
            <!-- Mobile-friendly tabs -->
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 px-4 sm:px-6 gap-3 lg:gap-0 relative"
            >
              <div
                class="flex items-center justify-start lg:absolute xl:left-1/2 xl:transform xl:-translate-x-1/2 w-full xl:w-auto"
              >
                <div
                  class="flex items-center justify-start lg:justify-center p-0.5 bg-[#f4f5f8] dark:bg-gray-700 rounded-full w-full lg:w-auto"
                  style="height: 36px"
                >
                  <div class="flex items-center gap-0 w-full lg:w-auto flex-shrink-0">
                    <button
                      :class="[
                        'relative flex-1 lg:flex-none px-2.5 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'recebidas'
                          ? 'bg-white dark:bg-gray-800 text-txt-primary dark:text-white shadow-soft-xs'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('recebidas')"
                    >
                      Recebidas
                      <span
                        v-if="ticketsStore.hasNewReceivedTickets && activeTab !== 'recebidas'"
                        class="absolute top-[13px] left-1 sm:left-2 w-[5px] h-[5px] bg-blue-500 rounded-full"
                      ></span>
                    </button>
                    <button
                      :class="[
                        'flex-1 lg:flex-none px-2.5 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'criadas'
                          ? 'bg-white dark:bg-gray-800 text-txt-primary dark:text-white shadow-soft-xs'
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
                        'flex-1 lg:flex-none px-2.5 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'setor'
                          ? 'bg-white dark:bg-gray-800 text-txt-primary dark:text-white shadow-soft-xs'
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
                        'flex-1 lg:flex-none px-2.5 sm:px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 rounded-full whitespace-nowrap',
                        activeTab === 'gerais'
                          ? 'bg-white dark:bg-gray-800 text-txt-primary dark:text-white shadow-soft-xs'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#fBfBfB] dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300',
                      ]"
                      style="font-size: 13px"
                      @click="switchTab('gerais')"
                    >
                      <span class="hidden sm:inline">Tarefas Gerais</span>
                      <span class="sm:hidden">Gerais</span>
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
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-light/80 dark:text-gray-500 w-3.5 h-3.5 pointer-events-none"
                  />
                  <Input
                    v-model="searchTerm"
                    type="text"
                    placeholder="Buscar tarefas"
                    padding="tight"
                    class="pl-9 pr-3 w-full text-sm transition-all duration-200"
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
              :isLoading="isLoading"
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
          <h3 class="text-lg font-semibold text-txt-primary dark:text-white">Filtros</h3>
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
            <Select v-model="modalStatusFilter" :options="statusOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Prioridade:</label
            >
            <Select v-model="modalPriorityFilter" :options="priorityOptions" />
          </div>
          <div v-if="activeTab !== 'setor' && activeTab !== 'recebidas'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Setor:</label
            >
            <Select v-model="modalDepartmentFilter" :options="departmentOptions" />
          </div>
          <div v-if="activeTab === 'setor' || activeTab === 'gerais'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Colaborador:</label
            >
            <Select
              v-model="modalUserFilter"
              :options="userOptions"
              dropdown-max-height="max-h-[25vh]"
            />
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
          <h3 class="text-lg font-semibold text-txt-primary dark:text-white m-0">
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
import { useFiltersStore } from '@/stores/filters';
import type { Ticket } from '@/models';
import { DefaultTicketStatus, TicketPriority } from '@/models';
import { useRoles } from '@/composables/useRoles';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketKanban from '@/components/tickets/TicketKanban.vue';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';
import Select from '@/components/common/Select.vue';
import Input from '@/components/common/Input.vue';
import { toast } from 'vue3-toastify';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { localStorageService } from '@/utils/localStorageService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user';
import type { Department, User } from '@/models';

const route = useRoute();
const router = useRouter();
const ticketsStore = useTicketsStore();
const filtersStore = useFiltersStore();
const userStore = useUserStore();
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

const activeTab = ref<TicketsTab>(getInitialTab());

const searchTerm = computed({
  get: () => filtersStore.currentSearch || '',
  set: (value: string) => {
    filtersStore.setSearch(value);
  },
});

const modalStatusFilter = ref<string>('');
const modalPriorityFilter = ref<string>('');
const modalDepartmentFilter = ref<string>('');
const modalUserFilter = ref<string>('');

const statusFilter = computed({
  get: () => (filtersStore.currentFilters.status as string) || '',
  set: (value: string) => {
    filtersStore.setFilter('status', value || undefined);
  },
});

const priorityFilter = computed({
  get: () => (filtersStore.currentFilters.priority as string) || '',
  set: (value: string) => {
    filtersStore.setFilter('priority', value || undefined);
  },
});

const currentPage = computed({
  get: () => filtersStore.currentPage,
  set: (value: number) => {
    filtersStore.setPage(value);
  },
});

const availableTabs = computed<TicketsTab[]>(() =>
  isTenantAdmin.value ? [...BASE_TABS, 'gerais'] : [...BASE_TABS],
);

const showCorrectionModal = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const newCompletionDate = ref('');

const isKanbanView = ref(false);
const showViewMenu = ref(false);

const showFiltersModal = ref(false);
const selectedTicketCustomId = ref<string | null>(null);
const isUpdatingUrl = ref(false);

onMounted(async () => {
  const savedView = localStorageService.getTicketsViewPreference();
  isKanbanView.value = savedView === 'kanban';

  filtersStore.initialize('tickets', {}, true);

  const urlTab = route.query.tab as string;
  const tabToUse =
    urlTab && availableTabs.value.includes(urlTab as TicketsTab)
      ? (urlTab as TicketsTab)
      : activeTab.value;

  if (tabToUse !== activeTab.value) {
    activeTab.value = tabToUse;
  }

  filtersStore.setContext(tabToUse);

  const urlFilters: Record<string, string | number> = {};
  if (route.query.status) urlFilters.status = route.query.status as string;
  if (route.query.prioridade) urlFilters.priority = route.query.prioridade as string;
  if (route.query.search) urlFilters.name = route.query.search as string;
  if (route.query.setor) {
    urlFilters.departmentUuid = route.query.setor as string;
  }
  if (route.query.colaborador) {
    urlFilters.targetUserUuid = route.query.colaborador as string;
  }
  if (route.query.page) {
    urlFilters.page = parseInt(route.query.page as string, 10);
  } else {
    urlFilters.page = 1;
  }

  filtersStore.initializeContext(tabToUse, urlFilters, true, false);

  try {
    const deptResponse = await departmentService.fetch({ limit: 100 });
    departments.value = deptResponse.data.items;
  } catch (error) {
    console.error('Error fetching departments:', error);
  }

  // Fetch users for filters
  // For "Tarefas do Setor" tab: only users from current user's department
  // For "Tarefas Gerais" tab: all users
  if (tabToUse === 'setor' && userStore.user?.departmentId) {
    try {
      const usersResponse = await userService.getByDepartment(userStore.user.departmentId, {
        limit: 100,
      });
      users.value = usersResponse.data.items;
    } catch (error) {
      console.error('Error fetching users from department:', error);
    }
  } else if (tabToUse === 'gerais') {
    try {
      const usersResponse = await userService.fetch({ limit: 100 });
      users.value = usersResponse.data.items;
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  }

  await fetchTicketsWithFilters();

  const ticketCustomId = route.query.ticket as string;
  if (ticketCustomId) {
    selectedTicketCustomId.value = ticketCustomId;
  }

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

const departments = ref<Department[]>([]);
const departmentOptions = computed(() => {
  const options = [{ value: '', label: 'Todos' }];
  departments.value.forEach((dept) => {
    options.push({ value: dept.uuid, label: dept.name });
  });
  return options;
});

const users = ref<User[]>([]);
const userOptions = computed(() => {
  const options = [{ value: '', label: 'Todos' }];
  const sortedUsers = [...users.value].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  sortedUsers.forEach((user) => {
    options.push({
      value: user.uuid,
      label: `${user.firstName} ${user.lastName}`,
    });
  });
  return options;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (statusFilter.value && statusFilter.value !== '') count++;
  if (priorityFilter.value && priorityFilter.value !== '') count++;
  if (activeTab.value !== 'setor' && activeTab.value !== 'recebidas') {
    const departmentFilter = filtersStore.currentFilters.departmentUuid;
    if (departmentFilter && departmentFilter !== '' && departmentFilter !== null) count++;
  }
  if (activeTab.value === 'setor' || activeTab.value === 'gerais') {
    const userFilter = filtersStore.currentFilters.targetUserUuid;
    if (userFilter && userFilter !== '' && userFilter !== null) count++;
  }
  return count;
});

const syncUrlWithFilters = () => {
  isUpdatingUrl.value = true;
  const currentFilters = filtersStore.currentFilters;
  const query: Record<string, string> = {
    tab: activeTab.value,
  };

  if (currentFilters.status) {
    query.status = String(currentFilters.status);
  }
  if (currentFilters.priority) {
    query.prioridade = String(currentFilters.priority);
  }
  if (currentFilters.name) {
    query.search = String(currentFilters.name);
  }
  if (
    activeTab.value !== 'setor' &&
    activeTab.value !== 'recebidas' &&
    currentFilters.departmentUuid
  ) {
    query.setor = String(currentFilters.departmentUuid);
  }
  if (
    (activeTab.value === 'setor' || activeTab.value === 'gerais') &&
    currentFilters.targetUserUuid
  ) {
    query.colaborador = String(currentFilters.targetUserUuid);
  }
  const pageNum =
    typeof currentFilters.page === 'number'
      ? currentFilters.page
      : parseInt(String(currentFilters.page || '1'), 10);
  if (pageNum > 1) {
    query.page = String(pageNum);
  }

  if (route.query.ticket) {
    query.ticket = String(route.query.ticket);
  }

  router.replace({ query }).finally(() => {
    setTimeout(() => {
      isUpdatingUrl.value = false;
    }, 100);
  });
};

const switchTab = async (tab: TicketsTab, skipUrlSync = false) => {
  filtersStore.setContext(tab);

  const existingFilters = filtersStore.getContextFilters(tab);
  const hasFilters =
    existingFilters &&
    Object.keys(existingFilters).length > 0 &&
    Object.values(existingFilters).some(
      (v) => v !== undefined && v !== null && String(v).trim() !== '',
    );

  if (!hasFilters) {
    filtersStore.initializeContext(
      tab,
      {
        page: 1,
      },
      false,
      true,
    );
  }

  const previousTab = activeTab.value;
  activeTab.value = tab;

  // Reset new received tickets flag when switching to 'recebidas' tab
  if (tab === 'recebidas') {
    ticketsStore.resetNewReceivedTicketsFlag();
  }

  if (tab === 'setor' || tab === 'recebidas') {
    filtersStore.clearFilter('departmentUuid');
  }

  if (tab === 'setor' && userStore.user?.departmentId) {
    try {
      const usersResponse = await userService.getByDepartment(userStore.user.departmentId, {
        limit: 100,
      });
      users.value = usersResponse.data.items;
    } catch (error) {
      console.error('Error fetching users from department:', error);
    }
  } else if (tab === 'gerais') {
    try {
      const usersResponse = await userService.fetch({ limit: 100 });
      users.value = usersResponse.data.items;
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  }

  if (!skipUrlSync && !isUpdatingUrl.value) {
    syncUrlWithFilters();
  }

  if (previousTab !== tab) {
    const hasDataForTab = (() => {
      switch (tab) {
        case 'recebidas':
          return (
            ticketsStore.receivedTickets.data.length > 0 && ticketsStore.receivedTickets.lastFetched
          );
        case 'criadas':
          return ticketsStore.myTickets.data.length > 0 && ticketsStore.myTickets.lastFetched;
        case 'setor':
          return (
            ticketsStore.departmentTickets.data.length > 0 &&
            ticketsStore.departmentTickets.lastFetched
          );
        case 'gerais':
          return (
            ticketsStore.tenantTickets.data.length > 0 && ticketsStore.tenantTickets.lastFetched
          );
        default:
          return false;
      }
    })();

    if (!hasDataForTab) {
      fetchTicketsWithFilters();
    }
  }
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

  const currentFilters = filtersStore.currentFilters;

  const filters: {
    priority?: TicketPriority | null;
    status?: DefaultTicketStatus | null;
    name?: string;
    departmentUuid?: string | null;
    targetUserUuid?: string | null;
  } = {};

  if (currentFilters.priority && String(currentFilters.priority).trim() !== '') {
    filters.priority = currentFilters.priority as TicketPriority;
  }

  if (currentFilters.status && String(currentFilters.status).trim() !== '') {
    filters.status = currentFilters.status as DefaultTicketStatus;
  }

  if (currentFilters.name && String(currentFilters.name).trim()) {
    filters.name = String(currentFilters.name).trim();
  }

  if (
    storeType !== 'department' &&
    storeType !== 'received' &&
    currentFilters.departmentUuid &&
    currentFilters.departmentUuid !== null
  ) {
    filters.departmentUuid = String(currentFilters.departmentUuid);
  }

  if ((storeType === 'department' || storeType === 'tenant') && currentFilters.targetUserUuid) {
    filters.targetUserUuid = String(currentFilters.targetUserUuid);
  }

  await ticketsStore.setCurrentPage(storeType, currentPage.value, filters);
};

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
  modalStatusFilter.value = '';
  modalPriorityFilter.value = '';
  modalDepartmentFilter.value = '';
  modalUserFilter.value = '';
  filtersStore.clearAllFilters();
  fetchTicketsWithFilters();
  showFiltersModal.value = false;
};

const applyFilters = () => {
  const filtersToApply: Record<string, any> = {
    status: modalStatusFilter.value || undefined,
    priority: modalPriorityFilter.value || undefined,
  };
  if (activeTab.value !== 'setor' && activeTab.value !== 'recebidas') {
    filtersToApply.departmentUuid = modalDepartmentFilter.value || undefined;
  }
  if (activeTab.value === 'setor' || activeTab.value === 'gerais') {
    filtersToApply.targetUserUuid = modalUserFilter.value || undefined;
  }
  filtersStore.applyFilters(filtersToApply);
  syncUrlWithFilters();
  fetchTicketsWithFilters();
  showFiltersModal.value = false;
};

watch(showFiltersModal, async (isOpen) => {
  if (isOpen) {
    modalStatusFilter.value = (filtersStore.currentFilters.status as string) || '';
    modalPriorityFilter.value = (filtersStore.currentFilters.priority as string) || '';
    if (activeTab.value !== 'setor' && activeTab.value !== 'recebidas') {
      modalDepartmentFilter.value = (filtersStore.currentFilters.departmentUuid as string) || '';
      if (activeTab.value === 'gerais') {
        modalUserFilter.value = (filtersStore.currentFilters.targetUserUuid as string) || '';
      } else {
        modalUserFilter.value = '';
      }
    } else {
      modalDepartmentFilter.value = '';
      if (activeTab.value === 'setor') {
        modalUserFilter.value = (filtersStore.currentFilters.targetUserUuid as string) || '';
      } else {
        modalUserFilter.value = '';
      }
    }

    // Load users when opening modal for tabs that need it
    if (activeTab.value === 'setor' && userStore.user?.departmentId) {
      if (users.value.length === 0) {
        try {
          const usersResponse = await userService.getByDepartment(userStore.user.departmentId, {
            limit: 100,
          });
          users.value = usersResponse.data.items;
        } catch (error) {
          console.error('Error fetching users from department:', error);
        }
      }
    } else if (activeTab.value === 'gerais') {
      // Always load all tenant users for 'gerais' tab
      try {
        const usersResponse = await userService.fetch({ limit: 100 });
        users.value = usersResponse.data.items;
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    }
  }
});

const setStatusFilter = (status: DefaultTicketStatus | '') => {
  filtersStore.applyFilters(
    {
      status: status || undefined,
      page: 1,
    },
    false,
  );
};

watch(
  () => route.query.tab,
  (newTab) => {
    if (isUpdatingUrl.value) {
      return;
    }

    if (newTab && availableTabs.value.includes(newTab as TicketsTab)) {
      const newTabValue = newTab as TicketsTab;
      if (activeTab.value !== newTabValue) {
        switchTab(newTabValue, true);
      }
    }
  },
);

watch(isTenantAdmin, (isAdmin) => {
  if (!isAdmin && activeTab.value === 'gerais') {
    switchTab('recebidas');
    router.push({ query: { ...route.query, tab: 'recebidas' } });
    return;
  }

  if (isAdmin && route.query.tab === 'gerais') {
    switchTab('gerais');
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

let filterWatchTimeout: ReturnType<typeof setTimeout> | null = null;
let previousContext: string | null = filtersStore.currentContext;
let previousFilters: {
  status: string | number | undefined;
  priority: string | number | undefined;
  name: string | number | undefined;
  departmentUuid: string | number | undefined;
  page: number;
} = {
  status: filtersStore.currentFilters.status,
  priority: filtersStore.currentFilters.priority,
  name: filtersStore.currentFilters.name,
  departmentUuid: filtersStore.currentFilters.departmentUuid,
  page: filtersStore.currentPage,
};

// Watch context changes to update previousFilters when switching tabs
watch(
  () => filtersStore.currentContext,
  (newContext) => {
    if (newContext !== previousContext) {
      previousContext = newContext;
      previousFilters = {
        status: filtersStore.currentFilters.status,
        priority: filtersStore.currentFilters.priority,
        name: filtersStore.currentFilters.name,
        departmentUuid: filtersStore.currentFilters.departmentUuid,
        page: filtersStore.currentPage,
      };
    }
  },
);

watch(
  () => [
    filtersStore.currentFilters.status,
    filtersStore.currentFilters.priority,
    filtersStore.currentFilters.name,
    filtersStore.currentFilters.departmentUuid,
    filtersStore.currentPage,
  ],
  ([status, priority, name, departmentUuid, page]) => {
    if (filtersStore.currentContext !== previousContext) {
      previousContext = filtersStore.currentContext;
      previousFilters = {
        status,
        priority,
        name,
        departmentUuid,
        page: typeof page === 'number' ? page : parseInt(String(page ?? 1), 10),
      };
      return;
    }

    const filtersChanged =
      status !== previousFilters.status ||
      priority !== previousFilters.priority ||
      name !== previousFilters.name ||
      departmentUuid !== previousFilters.departmentUuid ||
      (page ?? 1) !== previousFilters.page;

    previousFilters = {
      status,
      priority,
      name,
      departmentUuid,
      page: typeof page === 'number' ? page : parseInt(String(page ?? 1), 10),
    };

    if (!filtersChanged) {
      return;
    }

    if (filterWatchTimeout) {
      clearTimeout(filterWatchTimeout);
    }

    filterWatchTimeout = setTimeout(() => {
      if (!isUpdatingUrl.value) {
        syncUrlWithFilters();
      }
      fetchTicketsWithFilters();
      filterWatchTimeout = null;
    }, 50);
  },
  { deep: true },
);

watch(searchTerm, () => {
  filtersStore.setPage(1);
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
