<template>
  <section id="archivedTicketsSection" class="px-4 pt-4 pb-4 md:px-6 md:pt-4 md:pb-0">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tarefas Arquivadas</h1>
    </div>

    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <!-- Search and Filters Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 px-6 gap-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-start gap-2 w-full lg:w-auto">
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

      <!-- Content Area -->
      <div class="overflow-x-auto px-2 pt-1.5 pb-1.5">
        <TicketTable
          :tickets="archivedTickets"
          :isLoading="isLoading"
          tableType="arquivadas"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :pagination="true"
          @changePage="(page) => (currentPage = page)"
          @viewTicket="handleViewTicket"
        />
      </div>
    </div>

    <!-- Ticket Details Modal -->
    <TicketDetailsModal
      v-if="selectedTicketCustomId"
      :ticketCustomId="selectedTicketCustomId"
      @close="closeTicketModal"
    />

    <!-- Modal de Filtros -->
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
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTicketsStore } from '@/stores/tickets';
import type { Ticket } from '@/models';
import { TicketPriority } from '@/models';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';
import Select from '@/components/common/Select.vue';
import Input from '@/components/common/Input.vue';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { debounce } from '@/utils/generic-helper';

const route = useRoute();
const router = useRouter();
const ticketsStore = useTicketsStore();

const searchTerm = ref('');
const priorityFilter = ref<string>('');
const currentPage = ref(1);
const showFiltersModal = ref(false);
const selectedTicketCustomId = ref<string | null>(null);

const archivedTickets = computed(() => ticketsStore.archivedTickets.data);
const isLoading = computed(() => ticketsStore.archivedTickets.isLoading);
const totalPages = computed(() => Math.ceil(ticketsStore.archivedTickets.totalCount / 10));

const priorityOptions = computed(() => [
  { value: '', label: 'Todas' },
  { value: TicketPriority.Low, label: formatSnakeToNaturalCase(TicketPriority.Low) },
  { value: TicketPriority.Medium, label: formatSnakeToNaturalCase(TicketPriority.Medium) },
  { value: TicketPriority.High, label: formatSnakeToNaturalCase(TicketPriority.High) },
]);

const activeFiltersCount = computed(() => {
  let count = 0;
  if (priorityFilter.value && priorityFilter.value !== '') count++;
  if (searchTerm.value) count++;
  return count;
});

const fetchArchivedTickets = async () => {
  const filters: {
    priority?: TicketPriority | null;
    name?: string;
  } = {};

  if (priorityFilter.value && priorityFilter.value !== '') {
    filters.priority = priorityFilter.value as TicketPriority;
  }

  if (searchTerm.value && searchTerm.value.trim()) {
    filters.name = searchTerm.value.trim();
  }

  await ticketsStore.setCurrentPage('archived', currentPage.value, filters);
};

onMounted(async () => {
  await fetchArchivedTickets();

  const ticketCustomId = route.query.ticket as string;
  if (ticketCustomId) {
    selectedTicketCustomId.value = ticketCustomId;
  }
});

const debouncedSearch = debounce(() => {
  fetchArchivedTickets();
}, 400);

const handleViewTicket = (ticket: Ticket) => {
  const query = { ...route.query, ticket: ticket.customId };
  router.push({ query });
};

const closeTicketModal = () => {
  selectedTicketCustomId.value = null;
  const query = { ...route.query };
  delete query.ticket;
  router.push({ query });
};

const clearFilters = () => {
  priorityFilter.value = '';
  searchTerm.value = '';
  fetchArchivedTickets();
};

const applyFilters = () => {
  fetchArchivedTickets();
  showFiltersModal.value = false;
};

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

watch(searchTerm, () => {
  currentPage.value = 1;
  debouncedSearch();
});

watch(currentPage, () => {
  fetchArchivedTickets();
});
</script>

<style scoped>
/* All styles have been converted to Tailwind classes */
</style>

