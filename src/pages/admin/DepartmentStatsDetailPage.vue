<template>
  <div class="p-5 sm:px-6 sm:pt-4 sm:pb-10">
    <div class="mb-4">
      <router-link
        :to="{ name: 'AdminReports', query: { tab: 'setores' } }"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-txt-secondary dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
      >
        <font-awesome-icon icon="arrow-left" />
        Voltar
      </router-link>
    </div>

    <div v-if="loading" class="space-y-8">
      <div
        class="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-soft-xs"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div
              class="h-8 w-56 max-w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer mb-2"
            />
          </div>
          <div
            class="h-4 w-64 max-w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer sm:mt-1"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="n in 4"
          :key="`sk-row1-${n}`"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs"
        >
          <div class="flex justify-between items-start gap-2 mb-3">
            <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
            <div
              class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 skeleton-shimmer shrink-0"
            />
          </div>
          <div class="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer mb-2" />
          <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="n in 4"
          :key="`sk-row2-${n}`"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 skeleton-shimmer" />
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
          </div>
          <div class="flex flex-col items-center gap-3">
            <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 skeleton-shimmer" />
            <div class="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 skeleton-shimmer" />
            <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
          </div>
          <div class="flex items-center gap-3">
            <div class="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
            <div class="flex gap-2">
              <div
                v-for="a in 5"
                :key="`sk-av-${a}`"
                class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 skeleton-shimmer shrink-0"
              />
            </div>
          </div>
          <div
            class="h-3 w-full max-w-xs mt-3 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
          />
        </div>
      </div>
    </div>

    <div v-else-if="!department" class="text-center py-16">
      <p class="text-gray-600 dark:text-gray-400 mb-4">Setor não encontrado.</p>
      <router-link
        :to="{ name: 'AdminReports', query: { tab: 'setores' } }"
        class="text-primary-600 dark:text-blue-400 hover:underline"
      >
        Voltar para relatórios
      </router-link>
    </div>

    <template v-else>
      <div
        class="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-soft-xs"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-txt-primary dark:text-white">
              {{ department.departmentName }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 sm:mt-1 sm:text-right">
              Período: {{ periodLabel }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white"
              >Total de tarefas</span
            >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            >
              <font-awesome-icon icon="tasks" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ department.totalTickets }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ periodLabel }}</div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white">Resolvidas</span>
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400"
            >
              <font-awesome-icon :icon="['far', 'circle-check']" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ department.resolvedTickets }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ resolvedPercentage }}% do total
          </div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white"
              >Tempo médio de aceite</span
            >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-amber-600 dark:text-amber-400"
            >
              <font-awesome-icon :icon="['far', 'clock']" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ formatTime(department.averageAcceptanceTimeSeconds) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Desde a criação</div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white"
              >Tempo médio de resolução</span
            >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400"
            >
              <font-awesome-icon :icon="['far', 'hourglass']" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ formatTime(department.averageResolutionTimeSeconds) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Após o aceite</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-2">
            <font-awesome-icon icon="chart-line" class="text-blue-500 dark:text-blue-400" />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Score de desempenho
            </span>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-200 dark:text-gray-600"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
                <path
                  class="text-blue-500 dark:text-blue-400"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="97.4"
                  :stroke-dashoffset="97.4 - (scorePercent / 100) * 97.4"
                  stroke-linecap="round"
                  fill="none"
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
              </svg>
              <span class="absolute text-lg font-bold text-txt-primary dark:text-white">
                {{
                  department.efficiencyScore !== undefined
                    ? formatScore(department.efficiencyScore)
                    : '—'
                }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Baseado em {{ department.totalTickets }} tarefa{{
                department.totalTickets !== 1 ? 's' : ''
              }}
            </p>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-2">
            <font-awesome-icon icon="percent" class="text-green-500 dark:text-green-400" />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Taxa de resolução
            </span>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-gray-200 dark:text-gray-600"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
                <path
                  class="text-green-500 dark:text-green-400"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="97.4"
                  :stroke-dashoffset="97.4 - (displayResolutionPercentValue / 100) * 97.4"
                  stroke-linecap="round"
                  fill="none"
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                />
              </svg>
              <span class="absolute text-lg font-bold text-txt-primary dark:text-white">
                {{ displayResolutionPercent }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {{ resolutionRateSubtitle }}
            </p>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-2">
            <font-awesome-icon
              icon="exclamation-triangle"
              :class="overdueBarIconClass(department.sentToVerificationOverdueRate)"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Atraso no envio para verificação
            </span>
          </div>
          <div class="text-2xl font-bold">
            {{ formatOverdueRate(department.sentToVerificationOverdueRate) }}
          </div>
          <div class="mt-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="overdueBarFillClass(department.sentToVerificationOverdueRate)"
              :style="{
                width:
                  Math.min(100, Math.round(department.sentToVerificationOverdueRate ?? 0)) + '%',
              }"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            % de tarefas enviadas para verificação após o prazo
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-2">
            <font-awesome-icon
              icon="exclamation-triangle"
              :class="overdueBarIconClass(department.completionOverdueRate)"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Atraso na entrega
            </span>
          </div>
          <div class="text-2xl font-bold">
            {{ formatOverdueRate(department.completionOverdueRate) }}
          </div>
          <div class="mt-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="overdueBarFillClass(department.completionOverdueRate)"
              :style="{
                width: Math.min(100, Math.round(department.completionOverdueRate ?? 0)) + '%',
              }"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            % de tarefas concluídas após o prazo
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center gap-2 mb-3">
            <font-awesome-icon
              icon="users"
              class="text-blue-600 dark:text-blue-400 text-lg shrink-0"
            />
            <span class="text-sm font-medium text-txt-primary dark:text-white">
              Colaboradores
            </span>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-2xl font-bold text-txt-primary dark:text-white">
              {{ department.userCount }}
            </span>
            <div class="flex items-center gap-2">
              <div
                v-for="user in departmentUsers.slice(0, 5)"
                :key="user.id"
                class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shrink-0"
                :title="user.firstName + ' ' + user.lastName"
              >
                {{ getInitials(user) }}
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Atribuídos ao setor{{
              department.departmentName ? ` de ${department.departmentName.toLowerCase()}` : ''
            }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { reportService, type DepartmentStats } from '@/services/reportService';
import { userService } from '@/services/userService';
import type { User } from '@/models';
import { formatTimeInSecondsCompact } from '@/utils/generic-helper';
import { useStatsFiltersStore } from '@/stores/statsFiltersStore';

const route = useRoute();
const statsFiltersStore = useStatsFiltersStore();

const periodLabelMap: Record<string, string> = {
  weekly: 'Última semana',
  monthly: 'Último mês',
  trimestral: 'Últimos 3 meses',
  semestral: 'Últimos 6 meses',
  annual: 'Últimos 12 meses',
  all: 'Todo o período',
};

const departmentId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : null;
});

const period = computed(() => {
  const q = route.query.period as string;
  return q || statsFiltersStore.analysisPeriod || 'trimestral';
});

const periodLabel = computed(() => periodLabelMap[period.value] || 'Últimos 3 meses');

const loading = ref(true);
const department = ref<DepartmentStats | null>(null);
const departmentUsers = ref<User[]>([]);

const resolvedPercentage = computed(() => {
  if (!department.value?.totalTickets) return 0;
  return Math.round((department.value.resolvedTickets / department.value.totalTickets) * 100);
});

const scorePercent = computed(() => {
  const v = department.value?.efficiencyScore;
  if (v === undefined || v === null) return 0;
  return Math.min(100, Math.round((v ?? 0) * 100));
});

const resolutionPercent = computed(() => {
  const v = department.value?.resolutionRate;
  if (v === undefined || v === null) return 0;
  return Math.min(100, Math.round((v ?? 0) * 100));
});

const displayResolutionPercentValue = computed(() => resolutionPercent.value);

const displayResolutionPercent = computed(() => `${resolutionPercent.value}%`);

const resolutionRateSubtitle = computed(() => {
  const d = department.value;
  if (!d) return '';
  const closed = d.closedTickets ?? 0;
  if (closed <= 0) return 'Nenhuma tarefa encerrada';
  const resolved = d.resolvedTickets ?? 0;
  return `${resolved} de ${closed} resolvida${closed !== 1 ? 's' : ''}`;
});

function getInitials(user: User): string {
  if (user.firstName && user.lastName) {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
  if (user.firstName) return user.firstName.substring(0, 2).toUpperCase();
  if (user.email) return user.email.substring(0, 2).toUpperCase();
  return '?';
}

function formatTime(seconds?: number) {
  if (seconds === undefined || seconds === null) return '—';
  return formatTimeInSecondsCompact(seconds);
}

function formatScore(value?: number) {
  if (value === undefined || value === null) return '—';
  return `${Math.round((value ?? 0) * 100)}%`;
}

function formatOverdueRate(value?: number) {
  if (value === undefined || value === null) return '0%';
  return `${Math.round(value)}%`;
}

function formatResolutionRate(value?: number) {
  if (value === undefined || value === null) return '—';
  return `${Math.round((value ?? 0) * 100)}%`;
}

function overdueRateClass(rate?: number) {
  if (rate === undefined || rate === null) return 'text-gray-600 dark:text-gray-400';
  if (rate <= 20) return 'text-green-600 dark:text-green-400';
  if (rate <= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

/** Bar fill color: green (low %) → orange → red (high %) */
function overdueBarFillClass(rate?: number) {
  if (rate === undefined || rate === null) return 'bg-gray-400 dark:bg-gray-500';
  if (rate <= 20) return 'bg-green-500 dark:bg-green-500';
  if (rate <= 50) return 'bg-amber-500 dark:bg-amber-500';
  return 'bg-red-500 dark:bg-red-500';
}

/** Icon for overdue card: check (good), triangle (warning), circle-exclamation (bad) */
function overdueBarIcon(rate?: number) {
  if (rate === undefined || rate === null) return 'circle-info';
  if (rate <= 20) return 'circle-check';
  if (rate <= 50) return 'triangle-exclamation';
  return 'circle-exclamation';
}

function overdueBarIconClass(rate?: number) {
  if (rate === undefined || rate === null) return 'text-gray-500 dark:text-gray-400';
  if (rate <= 20) return 'text-green-500 dark:text-green-400';
  if (rate <= 50) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

async function loadDepartment() {
  if (departmentId.value == null || Number.isNaN(departmentId.value)) {
    department.value = null;
    departmentUsers.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const [list, usersRes] = await Promise.all([
      reportService.getTenantDepartmentsStatistics(period.value, 'efficiency'),
      userService.getByDepartment(departmentId.value, { limit: 50 }),
    ]);
    const found = list.find((d) => d.departmentId === departmentId.value);
    department.value = found ?? null;
    departmentUsers.value = usersRes.data?.items ?? [];
  } catch (err) {
    console.error('Error loading department stats:', err);
    department.value = null;
    departmentUsers.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadDepartment);
watch([() => route.params.id, period], loadDepartment);
</script>
