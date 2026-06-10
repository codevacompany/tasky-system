<template>
  <section
    id="ticketsSection"
    class="px-4 pt-4 md:px-6 md:pt-5"
    :class="isKanbanView ? 'pb-2 flex flex-col h-[calc(100vh-var(--header-height)-1.25rem)]' : 'pb-4 md:pb-4'"
  >
    <div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
      <h1 class="text-2xl font-bold text-txt-primary dark:text-white shrink-0">Tarefas</h1>

      <div class="flex items-center gap-2 shrink-0">
        <button
          class="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          @click="toggleView"
          :title="isKanbanView ? 'Alternar para Tabela' : 'Alternar para Kanban'"
        >
          <font-awesome-icon :icon="isKanbanView ? 'table' : 'columns'" class="w-[13px] h-[13px]" />
          <span class="text-[13px] font-medium">{{ isKanbanView ? 'Tabela' : 'Kanban' }}</span>
        </button>

        <div class="relative view-menu-container">
          <button
            class="flex items-center justify-center w-[34px] h-[34px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
            @click.stop="showViewMenu = !showViewMenu"
            title="Opções"
          >
            <font-awesome-icon icon="ellipsis" class="w-4 h-4" />
          </button>

          <div
            v-if="showViewMenu"
            class="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            @click.stop
          >
            <div class="py-1">
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

      <div class="flex-1 flex justify-center min-w-0 overflow-x-auto">
        <div
          class="inline-flex items-center gap-0.5 py-[3.25px] px-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-soft-sm"
        >
          <button
            v-for="tab in tabItems"
            :key="tab.id"
            type="button"
            :class="[
              'relative flex items-center gap-2 px-2.5 sm:px-3 py-[5px] text-[13px] font-semibold rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0',
              activeTab === tab.id
                ? 'bg-gray-50 dark:bg-gray-900/20 text-primary dark:text-primary-light'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200',
            ]"
            @click="switchTab(tab.id)"
          >
            <div
              class="w-6 h-6 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
              :class="
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900/30'
                  : 'bg-gray-50 dark:bg-gray-700/30'
              "
            >
              <component
                :is="tab.icon"
                class="w-3.5 h-3.5 transition-colors"
                :class="
                  activeTab === tab.id
                    ? 'text-primary dark:text-primary-light'
                    : 'text-gray-400 dark:text-gray-500'
                "
                aria-hidden="true"
              />
            </div>
            <span class="hidden sm:inline">{{ tab.label }}</span>
            <span class="sm:hidden">{{ tab.shortLabel }}</span>
            <span
              v-if="tab.id === 'recebidas' && ticketsStore.hasNewReceivedTickets && activeTab !== 'recebidas'"
              class="absolute top-1.5 left-1.5 w-[5px] h-[5px] bg-primary rounded-full"
            />
            <span
              v-if="tab.id === 'criadas' && ticketsStore.hasNewAwaitingVerificationTickets && activeTab !== 'criadas'"
              class="absolute top-1.5 left-1.5 w-[5px] h-[5px] bg-primary rounded-full"
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        class="relative shrink-0 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
        @click="showFiltersModal = true"
      >
        <font-awesome-icon icon="sliders" class="w-3.5 h-3.5" />
        <span class="text-[13px] font-medium">Filtros</span>
        <span
          v-if="activeFiltersCount > 0"
          class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary text-white text-xs font-semibold rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>

    <div class="mt-5" :class="isKanbanView ? 'flex flex-1 flex-col min-h-0' : ''">
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-soft-xs"
        :class="isKanbanView ? 'flex flex-1 flex-col min-h-0' : 'min-h-[300px]'"
      >
        <div
          v-if="!isKanbanView"
          class="flex flex-wrap items-center gap-2 px-3 pt-3 pb-2.5 border-b border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            class="inline-flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border transition-colors cursor-pointer"
            :class="
              isStatChipActive('')
                ? 'border-gray-500 dark:border-gray-500 bg-white dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            "
            @click="setStatusFilter('')"
            title="Mostrar todas as tarefas"
          >
            <font-awesome-icon
              icon="ticket"
              class="w-3.5 h-3.5 shrink-0"
              :class="isStatChipActive('') ? 'text-txt-primary dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'"
            />
            <span
              class="text-[13px] font-semibold whitespace-nowrap"
              :class="isStatChipActive('') ? 'text-txt-primary dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'"
            >
              Total
            </span>
            <span
              class="inline-flex items-center justify-center min-w-[1.375rem] h-[1.375rem] px-1.5 rounded-[8px] text-[12px] font-semibold leading-none bg-gray-100 dark:bg-gray-700/50 text-txt-primary dark:text-gray-100"
            >
              {{ totalTickets }}
            </span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border transition-colors cursor-pointer"
            :class="
              isStatChipActive(DefaultTicketStatus.Pending)
                ? 'border-orange-400 dark:border-orange-500/70 bg-white dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            "
            @click="setStatusFilter(DefaultTicketStatus.Pending)"
            title="Filtrar por tarefas pendentes"
          >
            <font-awesome-icon
              icon="clock"
              class="w-3.5 h-3.5 shrink-0"
              :class="isStatChipActive(DefaultTicketStatus.Pending) ? 'text-orange-500 dark:text-orange-400' : 'text-orange-500/80'"
            />
            <span
              class="text-[13px] font-semibold whitespace-nowrap"
              :class="
                isStatChipActive(DefaultTicketStatus.Pending)
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-300'
              "
            >
              Pendentes
            </span>
            <span
              class="inline-flex items-center justify-center min-w-[1.375rem] h-[1.375rem] px-1.5 rounded-[8px] text-[12px] font-semibold leading-none bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
            >
              {{ pendingTickets }}
            </span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border transition-colors cursor-pointer"
            :class="
              isStatChipActive(DefaultTicketStatus.InProgress)
                ? 'border-blue-500 dark:border-blue-400/80 bg-white dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            "
            @click="setStatusFilter(DefaultTicketStatus.InProgress)"
            title="Filtrar por tarefas em andamento"
          >
            <font-awesome-icon
              icon="spinner"
              class="w-3.5 h-3.5 shrink-0"
              :class="
                isStatChipActive(DefaultTicketStatus.InProgress)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-blue-600/80 dark:text-blue-400/80'
              "
            />
            <span
              class="text-[13px] font-semibold whitespace-nowrap"
              :class="
                isStatChipActive(DefaultTicketStatus.InProgress)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              "
            >
              Em Andamento
            </span>
            <span
              class="inline-flex items-center justify-center min-w-[1.375rem] h-[1.375rem] px-1.5 rounded-[8px] text-[12px] font-semibold leading-none bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {{ inProgressTickets }}
            </span>
          </button>
        </div>
        <div
          :class="isKanbanView ? 'flex flex-1 flex-col min-h-0 overflow-hidden px-2 pt-1.5 pb-1' : 'overflow-x-auto'"
        >
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

    <div
      v-if="isResolvingTicketQuery"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/40"
      aria-busy="true"
    >
      <LoadingSpinner :size="40" />
    </div>

    <ReturnedCorrectionStartModal
      :is-open="showReturnedCorrectionGate"
      :is-starting-correction="returnedCorrectionGateLoading"
      @cancel="cancelReturnedCorrectionFromPage"
      @confirm="confirmReturnedCorrectionFromPage"
    />

    <AcceptanceConfirmationModal
      :is-open="showPendingAcceptanceGate"
      :is-accepting="pendingAcceptanceLoading"
      @cancel="cancelPendingAcceptanceFromPage"
      @confirm="confirmPendingAcceptanceFromPage"
    />

    <DueDateModal
      :is-open="showPendingDueDateModal"
      :due-date-value="pendingAcceptDueDateValue"
      :disabled-weekend-date="disabledWeekendDateForPendingAccept"
      :is-due-date-modal-loading="pendingAcceptDueDateLoading"
      @cancel="cancelPendingDueDateFromPage"
      @confirm="confirmPendingDueDateFromPage"
      @date-change="onPendingAcceptDateChange"
    />

    <VerificationConfirmationModal
      :is-open="showAwaitingVerificationGate"
      :is-verifying="awaitingVerificationGateLoading"
      @cancel="cancelAwaitingVerificationFromPage"
      @confirm="confirmAwaitingVerificationFromPage"
    />

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
      <div data-app-modal class="bg-white dark:bg-gray-800 w-full max-w-md shadow-xl">
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
              >Responsável:</label
            >
            <Select
              v-model="modalUserFilter"
              :options="userOptions"
              dropdown-max-height="max-h-[25vh]"
            />
          </div>
          <div v-if="activeTab === 'setor' || activeTab === 'gerais'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Revisor:</label
            >
            <Select
              v-model="modalReviewerFilter"
              :options="userOptions"
              dropdown-max-height="max-h-[25vh]"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <Button variant="outlined" type="button" class="rounded-md px-4 py-2 text-sm" @click="clearFilters">
            Limpar
          </Button>
          <Button
            variant="secondary"
            type="button"
            class="rounded-md px-4 py-2 text-sm font-medium"
            @click="applyFilters"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>

    <!-- Modal de Correção -->
    <div
      v-if="showCorrectionModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div data-app-modal class="bg-white dark:bg-gray-800 w-[90%] max-w-md shadow-xl">
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
          <Button variant="outlined" type="button" class="rounded-md px-4 py-2 text-sm" @click="cancelCorrection">
            Cancelar
          </Button>
          <Button
            variant="secondary"
            type="button"
            class="rounded-md px-4 py-2 text-sm font-medium"
            @click="confirmCorrection"
            :disabled="!newCompletionDate"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Component } from 'vue';
import {
  InboxIcon,
  UserGroupIcon,
  UserPlusIcon,
  ViewColumnsIcon,
} from '@heroicons/vue/24/solid';
import { useRoute, useRouter } from 'vue-router';
import { ticketService } from '@/services/ticketService';
import { useTicketsStore } from '@/stores/tickets';
import { useFiltersStore } from '@/stores/filters';
import type { Ticket } from '@/models';
import { DefaultTicketStatus, TicketPriority } from '@/models';
import { useRoles } from '@/composables/useRoles';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketKanban from '@/components/tickets/TicketKanban.vue';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal/TicketDetailsModal.vue';
import ReturnedCorrectionStartModal from '@/components/tickets/TicketDetailsModal/ReturnedCorrectionStartModal.vue';
import AcceptanceConfirmationModal from '@/components/tickets/TicketDetailsModal/AcceptanceConfirmationModal.vue';
import DueDateModal from '@/components/tickets/TicketDetailsModal/DueDateModal.vue';
import VerificationConfirmationModal from '@/components/tickets/TicketDetailsModal/VerificationConfirmationModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Select from '@/components/common/Select.vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import { toast } from 'vue-sonner';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { localStorageService } from '@/utils/localStorageService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user';
import type { Department, User } from '@/models';
import { useTicketModalGates } from '@/composables/useTicketModalGates';

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

type TabItem = {
  id: TicketsTab;
  label: string;
  shortLabel: string;
  icon: Component;
};

const tabItems = computed<TabItem[]>(() => {
  const items: TabItem[] = [
    { id: 'recebidas', label: 'Recebidas', shortLabel: 'Recebidas', icon: InboxIcon },
    { id: 'criadas', label: 'Criadas por Mim', shortLabel: 'Criadas', icon: UserPlusIcon },
    { id: 'setor', label: 'Tarefas do Setor', shortLabel: 'Setor', icon: UserGroupIcon },
  ];

  if (isTenantAdmin.value) {
    items.push({
      id: 'gerais',
      label: 'Tarefas Gerais',
      shortLabel: 'Gerais',
      icon: ViewColumnsIcon,
    });
  }

  return items;
});

const modalStatusFilter = ref<string>('');
const modalPriorityFilter = ref<string>('');
const modalDepartmentFilter = ref<string>('');
const modalUserFilter = ref<string>('');
const modalReviewerFilter = ref<string>('');

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
  if (route.query.responsavel) {
    urlFilters.targetUserUuid = route.query.responsavel as string;
  } else if (route.query.colaborador) {
    urlFilters.targetUserUuid = route.query.colaborador as string;
  }
  if (route.query.revisor) {
    urlFilters.reviewerUuid = route.query.revisor as string;
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
  await syncTicketModalFromRoute();

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
    const reviewerFilter = filtersStore.currentFilters.reviewerUuid;
    if (reviewerFilter && reviewerFilter !== '' && reviewerFilter !== null) count++;
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
    query.responsavel = String(currentFilters.targetUserUuid);
  }
  if (
    (activeTab.value === 'setor' || activeTab.value === 'gerais') &&
    currentFilters.reviewerUuid
  ) {
    query.revisor = String(currentFilters.reviewerUuid);
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

  // Reset indicators when switching to relevant tabs
  if (tab === 'recebidas') {
    ticketsStore.resetNewReceivedTicketsFlag();
  } else if (tab === 'criadas') {
    ticketsStore.resetNewAwaitingVerificationFlag();
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
    statChipTickets.value = [];

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
      await fetchTicketsWithFilters();
    } else if (!isKanbanView.value) {
      await fetchStatChipTickets();
    }
  }
};

const statChipTickets = ref<Ticket[]>([]);

const getActiveStoreType = ():
  | 'received'
  | 'createdByMe'
  | 'department'
  | 'tenant'
  | null => {
  const typeMap: Record<TicketsTab, 'received' | 'createdByMe' | 'department' | 'tenant'> = {
    recebidas: 'received',
    criadas: 'createdByMe',
    setor: 'department',
    gerais: 'tenant',
  };
  return typeMap[activeTab.value] ?? null;
};

const buildTicketListFilters = (options?: { includeStatus?: boolean }) => {
  const includeStatus = options?.includeStatus ?? true;
  const storeType = getActiveStoreType();
  const currentFilters = filtersStore.currentFilters;

  const filters: {
    priority?: TicketPriority | null;
    status?: DefaultTicketStatus | null;
    name?: string;
    departmentUuid?: string | null;
    targetUserUuid?: string | null;
    reviewerUuid?: string | null;
  } = {};

  if (currentFilters.priority && String(currentFilters.priority).trim() !== '') {
    filters.priority = currentFilters.priority as TicketPriority;
  }

  if (
    includeStatus &&
    currentFilters.status &&
    String(currentFilters.status).trim() !== ''
  ) {
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

  if ((storeType === 'department' || storeType === 'tenant') && currentFilters.reviewerUuid) {
    filters.reviewerUuid = String(currentFilters.reviewerUuid);
  }

  return filters;
};

const toTicketServiceParams = (
  filters: ReturnType<typeof buildTicketListFilters>,
  extra?: { page?: number; limit?: number; paginated?: boolean },
) => {
  const params: {
    priority?: TicketPriority;
    status?: DefaultTicketStatus;
    name?: string;
    departmentUuid?: string;
    targetUserUuid?: string;
    reviewerUuid?: string;
    page?: number;
    limit?: number;
    paginated?: boolean;
  } = { ...extra };

  if (filters.priority) {
    params.priority = filters.priority;
  }
  if (filters.status) {
    params.status = filters.status;
  }
  if (filters.name) {
    params.name = filters.name;
  }
  if (filters.departmentUuid) {
    params.departmentUuid = filters.departmentUuid;
  }
  if (filters.targetUserUuid) {
    params.targetUserUuid = filters.targetUserUuid;
  }
  if (filters.reviewerUuid) {
    params.reviewerUuid = filters.reviewerUuid;
  }

  return params;
};

const fetchStatChipTickets = async () => {
  if (isKanbanView.value || !userStore.user) {
    return;
  }

  const storeType = getActiveStoreType();
  if (!storeType) {
    statChipTickets.value = [];
    return;
  }

  const filters = buildTicketListFilters({ includeStatus: false });
  const params = toTicketServiceParams(filters, {
    page: 1,
    limit: 10,
    paginated: false,
  });

  try {
    let items: Ticket[] = [];

    switch (storeType) {
      case 'received':
        items = (await ticketService.getReceivedTickets(userStore.user.id, params)).data.items;
        break;
      case 'createdByMe':
        items = (await ticketService.getByRequester(userStore.user.id, params)).data.items;
        break;
      case 'department':
        if (!userStore.user.departmentId) {
          statChipTickets.value = [];
          return;
        }
        items = (await ticketService.getByDepartment(userStore.user.departmentId, params)).data
          .items;
        break;
      case 'tenant':
        items = (await ticketService.fetch(params)).data.items;
        break;
    }

    statChipTickets.value = items;
  } catch (error) {
    console.error('Error fetching stat chip tickets:', error);
  }
};

const fetchTicketsWithFilters = async () => {
  const storeType = getActiveStoreType();

  if (!storeType) {
    return;
  }

  const filters = buildTicketListFilters({ includeStatus: true });

  await Promise.all([
    ticketsStore.setCurrentPage(storeType, currentPage.value, filters),
    fetchStatChipTickets(),
  ]);
};

const getTicketStatus = (ticket: Ticket): string => {
  return ticket.ticketStatus?.key || ticket.status || '';
};

const excludeCanceledAndRejected = (ticketList: Ticket[]) =>
  ticketList.filter(
    (ticket) =>
      ticket.ticketStatus?.key !== DefaultTicketStatus.Canceled &&
      ticket.status !== DefaultTicketStatus.Canceled &&
      ticket.ticketStatus?.key !== DefaultTicketStatus.Rejected &&
      ticket.status !== DefaultTicketStatus.Rejected,
  );

const statChipTicketList = computed(() => excludeCanceledAndRejected(statChipTickets.value));

const totalTickets = computed(() => statChipTicketList.value.length);
const pendingTickets = computed(
  () =>
    statChipTicketList.value.filter((ticket) => getTicketStatus(ticket) === DefaultTicketStatus.Pending)
      .length,
);
const inProgressTickets = computed(
  () =>
    statChipTicketList.value.filter(
      (ticket) => getTicketStatus(ticket) === DefaultTicketStatus.InProgress,
    ).length,
);

const handleViewTicket = (ticket: Ticket) => {
  const query = { ...route.query, ticket: ticket.customId };
  router.push({ query });
};

const {
  selectedTicketCustomId,
  isResolvingTicketQuery,
  showReturnedCorrectionGate,
  returnedCorrectionGateLoading,
  showPendingAcceptanceGate,
  pendingAcceptanceLoading,
  showPendingDueDateModal,
  pendingAcceptDueDateValue,
  pendingAcceptDueDateLoading,
  showAwaitingVerificationGate,
  awaitingVerificationGateLoading,
  syncTicketModalFromRoute,
  closeTicketModal,
  confirmReturnedCorrectionFromPage,
  cancelReturnedCorrectionFromPage,
  confirmAwaitingVerificationFromPage,
  cancelAwaitingVerificationFromPage,
  disabledWeekendDateForPendingAccept,
  onPendingAcceptDateChange,
  cancelPendingAcceptanceFromPage,
  confirmPendingAcceptanceFromPage,
  cancelPendingDueDateFromPage,
  confirmPendingDueDateFromPage,
} = useTicketModalGates({
  route,
  router,
  activeTab,
  userId: computed(() => userStore.user?.id),
  ticketStoreApi: {
    getTicketById: (id) => ticketsStore.getTicketById(id),
    fetchTicketDetails: (id) => ticketsStore.fetchTicketDetails(id),
  },
  fetchTicketsWithFilters,
});

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

const toggleView = async () => {
  const newView = !isKanbanView.value;
  isKanbanView.value = newView;
  localStorageService.setTicketsViewPreference(newView ? 'kanban' : 'table');

  // Clear all cached tickets and reset pages for all tabs when switching views
  ticketsStore.clearCache();
  filtersStore.resetAllPages();

  // Reset to first page and refresh tickets for the current tab
  currentPage.value = 1;
  await fetchTicketsWithFilters();
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
  modalReviewerFilter.value = '';
  filtersStore.clearAllFilters('current');
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
    filtersToApply.reviewerUuid = modalReviewerFilter.value || undefined;
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
        modalReviewerFilter.value = (filtersStore.currentFilters.reviewerUuid as string) || '';
      } else {
        modalUserFilter.value = '';
        modalReviewerFilter.value = '';
      }
    } else {
      modalDepartmentFilter.value = '';
      if (activeTab.value === 'setor') {
        modalUserFilter.value = (filtersStore.currentFilters.targetUserUuid as string) || '';
        modalReviewerFilter.value = (filtersStore.currentFilters.reviewerUuid as string) || '';
      } else {
        modalUserFilter.value = '';
        modalReviewerFilter.value = '';
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

const isStatChipActive = (status: DefaultTicketStatus | '') => {
  if (status === '') {
    return !statusFilter.value;
  }
  return statusFilter.value === status;
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
  () => [route.query.ticket, activeTab.value, userStore.user?.id] as const,
  () => {
    void syncTicketModalFromRoute();
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
