<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[1001] flex items-start justify-center pt-[10vh] pb-8 px-4 bg-black/50"
      @click.self="$emit('close')"
    >
      <div
        class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-searchSlideIn"
        @click.stop
      >
        <!-- Search Header -->
        <div
          class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="relative flex-1">
            <font-awesome-icon
              icon="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
            />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              autofocus
              placeholder="Buscar tarefas"
              class="w-full pl-10 pr-4 py-2 px-3 border border-inputBorder dark:border-gray-700 rounded-[5px] text-sm text-gray-800 bg-white dark:bg-gray-800 dark:text-white placeholder:text-txt-light focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              @input="onSearchInput"
              @keydown.down.prevent="navigateResults(1)"
              @keydown.up.prevent="navigateResults(-1)"
              @keydown.enter.prevent="selectHighlighted"
            />
          </div>
          <button
            class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 dark:hover:text-gray-200 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            <font-awesome-icon icon="times" class="w-5 h-5" />
          </button>
        </div>

        <!-- Filters Row -->
        <div
          class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex md:grid md:grid-cols-3 gap-3"
        >
          <!-- Mobile: Filtros button with dropdown -->
          <div class="md:hidden relative" ref="filtersButtonRef">
            <button
              type="button"
              :class="[
                'flex items-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                showFiltersDropdown
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-inputBorder dark:border-gray-600 text-txt-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="showFiltersDropdown = !showFiltersDropdown"
            >
              <font-awesome-icon icon="sliders" class="w-3.5 h-3.5" />
              Filtros
              <span v-if="activeFiltersCount" class="ml-1 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {{ activeFiltersCount }}
              </span>
            </button>
            <!-- Dropdown panel -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="showFiltersDropdown"
                class="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-[1002] py-3 px-4 space-y-3"
              >
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
                  <Select v-model="statusFilter" :options="statusOptions" compact />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Setor</span>
                  <Select v-model="departmentFilter" :options="departmentOptions" compact />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Responsável</span>
                  <Select
                    v-model="assigneeFilter"
                    :options="userOptions"
                    compact
                    dropdown-max-height="max-h-[25vh]"
                  />
                </div>
              </div>
            </Transition>
          </div>

          <!-- Desktop: inline filters -->
          <div class="hidden md:flex flex-col gap-1 min-w-0">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
            <Select v-model="statusFilter" :options="statusOptions" compact />
          </div>
          <div class="hidden md:flex flex-col gap-1 min-w-0">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Setor</span>
            <Select v-model="departmentFilter" :options="departmentOptions" compact />
          </div>
          <div class="hidden md:flex flex-col gap-1 min-w-0">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Responsável</span>
            <Select
              v-model="assigneeFilter"
              :options="userOptions"
              compact
              dropdown-max-height="max-h-[25vh]"
            />
          </div>
        </div>

        <!-- Results -->
        <div
          ref="resultsScrollRef"
          class="flex-1 overflow-y-auto min-h-0"
          @scroll="onResultsScroll"
        >
          <div v-if="(isLoading || isSearching) && searchQuery.trim()" class="py-2">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="n in 5" :key="`skeleton-${n}`" class="flex items-center gap-3 px-4 py-3">
                <div
                  class="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer flex-shrink-0"
                />
                <div class="flex-1 min-w-0 space-y-2">
                  <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
                  <div class="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
                </div>
                <div
                  class="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer flex-shrink-0"
                />
              </li>
            </ul>
          </div>

          <div
            v-else-if="!searchQuery.trim()"
            class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
          >
            <font-awesome-icon icon="search" class="w-12 h-12 mb-3 opacity-50" />
            <p class="text-sm">Digite para buscar tarefas</p>
          </div>

          <div
            v-else-if="results.length === 0 && !isLoading && !isSearching"
            class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
          >
            <font-awesome-icon icon="inbox" class="w-12 h-12 mb-3 opacity-50" />
            <p class="text-sm">Nenhuma tarefa encontrada</p>
          </div>

          <div v-else class="py-2">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li
                v-for="(ticket, index) in results"
                :key="ticket.customId"
                :class="[
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                  highlightedIndex === index
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                ]"
                @click="selectTicket(ticket)"
                @mouseenter="highlightedIndex = index"
              >
                <div class="flex-shrink-0 flex items-center">
                  <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {{ ticket.customId }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-txt-primary dark:text-gray-100 line-clamp-2"
                    v-html="highlightMatch(ticket.name, searchQuery)"
                  />
                  <div class="mt-[3px] text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTicketMeta(ticket) }}
                  </div>
                </div>
                <div class="flex-shrink-0 flex items-center gap-1">
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    {{ formatRelativeTime(ticket.updatedAt) }}
                  </span>
                  <font-awesome-icon
                    icon="chevron-right"
                    class="w-4 h-4 text-gray-400 dark:text-gray-500"
                  />
                </div>
              </li>
            </ul>
            <div
              v-if="isLoadingMore && hasMore"
              class="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <div
                  class="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer flex-shrink-0"
                />
                <div class="flex-1 min-w-0 space-y-2">
                  <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
                  <div class="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
                </div>
                <div
                  class="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer hint -->
        <div
          class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400"
        >
          <span class="hidden sm:inline">Pressione</span>
          <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-[11px] font-mono mx-1"
            >Ctrl+K</kbd
          >
          para abrir a busca em qualquer lugar
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Select from '@/components/common/Select.vue';
import { ticketService } from '@/services/ticketService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { formatRelativeTime } from '@/utils/date';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import type { Ticket } from '@/models';
import { DefaultTicketStatus } from '@/models';
import type { Department, User } from '@/models';
import { debounce } from '@/utils/generic-helper';

const emit = defineEmits<{
  close: [];
  selectTicket: [ticket: Ticket];
}>();

const router = useRouter();

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const statusFilter = ref('');
const departmentFilter = ref('');
const assigneeFilter = ref('');

const showFiltersDropdown = ref(false);
const filtersButtonRef = ref<HTMLDivElement | null>(null);
const results = ref<Ticket[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const isSearching = ref(false);
const highlightedIndex = ref(0);
const resultsScrollRef = ref<HTMLDivElement | null>(null);

const hasMore = computed(() => results.value.length < totalCount.value);

const activeFiltersCount = computed(() => {
  let count = 0;
  if (statusFilter.value) count++;
  if (departmentFilter.value) count++;
  if (assigneeFilter.value) count++;
  return count;
});

const departments = ref<Department[]>([]);
const users = ref<User[]>([]);

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

const departmentOptions = computed(() => {
  const options = [{ value: '', label: 'Todos' }];
  departments.value.forEach((d) => options.push({ value: d.uuid, label: d.name }));
  return options;
});

const userOptions = computed(() => {
  const options = [{ value: '', label: 'Todos' }];
  const sorted = [...users.value].sort((a, b) => {
    const na = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nb = `${b.firstName} ${b.lastName}`.toLowerCase();
    return na.localeCompare(nb);
  });
  sorted.forEach((u) => options.push({ value: u.uuid, label: `${u.firstName} ${u.lastName}` }));
  return options;
});

function highlightMatch(text: string, query: string): string {
  if (!text || !query || !query.trim()) return escapeHtml(text);

  const q = query.trim().toLowerCase();
  const normalized = text.toLowerCase();
  const idx = normalized.indexOf(q);

  if (idx === -1) return escapeHtml(text);

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    escapeHtml(before) +
    '<mark class="bg-yellow-200 dark:bg-yellow-800/60 text-inherit rounded px-[1px]">' +
    escapeHtml(match) +
    '</mark>' +
    escapeHtml(after)
  );
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function formatTicketMeta(ticket: Ticket): string {
  const parts: string[] = [];

  if (ticket.category?.name) parts.push(ticket.category.name);
  if (ticket.ticketStatus?.name) parts.push(ticket.ticketStatus.name);
  if (ticket.currentTargetUser) {
    parts.push(`${ticket.currentTargetUser.firstName} ${ticket.currentTargetUser.lastName}`);
  }

  return parts.join(' • ');
}

const performSearch = debounce(async () => {
  const q = searchQuery.value.trim();
  if (!q) {
    results.value = [];
    totalCount.value = 0;
    currentPage.value = 1;
    isSearching.value = false;
    return;
  }

  currentPage.value = 1;
  isLoading.value = true;
  try {
    const params: Parameters<typeof ticketService.search>[0] = {
      name: q,
      page: 1,
      limit: 10,
    };
    if (statusFilter.value) params.status = statusFilter.value as DefaultTicketStatus;
    if (departmentFilter.value) params.departmentUuid = departmentFilter.value;
    if (assigneeFilter.value) params.targetUserUuid = assigneeFilter.value;

    const res = await ticketService.search(params);
    results.value = res.data.items;
    totalCount.value = res.data.total;
    highlightedIndex.value = 0;
  } catch (err) {
    console.error('Search failed:', err);
    results.value = [];
    totalCount.value = 0;
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
}, 300);

async function loadMore() {
  const q = searchQuery.value.trim();
  if (!q || isLoadingMore.value || !hasMore.value) return;

  isLoadingMore.value = true;
  try {
    const nextPage = currentPage.value + 1;
    const params: Parameters<typeof ticketService.search>[0] = {
      name: q,
      page: nextPage,
      limit: 10,
    };
    if (statusFilter.value) params.status = statusFilter.value as DefaultTicketStatus;
    if (departmentFilter.value) params.departmentUuid = departmentFilter.value;
    if (assigneeFilter.value) params.targetUserUuid = assigneeFilter.value;

    const res = await ticketService.search(params);
    results.value = [...results.value, ...res.data.items];
    currentPage.value = nextPage;
  } catch (err) {
    console.error('Load more failed:', err);
  } finally {
    isLoadingMore.value = false;
  }
}

function onResultsScroll() {
  const el = resultsScrollRef.value;
  if (!el || !hasMore.value || isLoadingMore.value) return;

  const { scrollTop, scrollHeight, clientHeight } = el;
  const threshold = 80;
  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    loadMore();
  }
}

function onSearchInput() {
  isSearching.value = !!searchQuery.value.trim();
  performSearch();
}

watch([statusFilter, departmentFilter, assigneeFilter], () => {
  if (searchQuery.value.trim()) {
    performSearch();
  }
});

function navigateResults(delta: number) {
  const max = results.value.length - 1;
  if (max < 0) return;
  highlightedIndex.value = Math.max(0, Math.min(max, highlightedIndex.value + delta));
}

function selectHighlighted() {
  const ticket = results.value[highlightedIndex.value];
  if (ticket) selectTicket(ticket);
}

function selectTicket(ticket: Ticket) {
  emit('close');
  router.push({ path: '/minhas-tarefas', query: { ticket: ticket.customId } });
  emit('selectTicket', ticket);
}

async function loadFilters() {
  try {
    const [deptRes, userRes] = await Promise.all([
      departmentService.fetch({ limit: 100 }),
      userService.fetch({ limit: 100 }),
    ]);
    departments.value = deptRes.data.items;
    users.value = userRes.data.items;
  } catch (err) {
    console.error('Failed to load filter options:', err);
  }
}

function handleFiltersClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (filtersButtonRef.value && !filtersButtonRef.value.contains(target)) {
    showFiltersDropdown.value = false;
  }
}

onMounted(() => {
  loadFilters();
  document.addEventListener('click', handleFiltersClickOutside, false);

  nextTick(() => {
    requestAnimationFrame(() => {
      setTimeout(() => searchInputRef.value?.focus(), 150);
    });
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleFiltersClickOutside, false);
});
</script>

<style scoped>
@keyframes searchSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-searchSlideIn {
  animation: searchSlideIn 0.2s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
