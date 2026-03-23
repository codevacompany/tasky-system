<template>
  <div class="p-5 sm:px-6 sm:pt-4 sm:pb-10">
    <!-- Back link -->
    <div class="mb-4">
      <router-link
        :to="{ name: 'AdminReports', query: { tab: 'colaboradores' } }"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-txt-secondary dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
      >
        <font-awesome-icon icon="arrow-left" />
        Voltar
      </router-link>
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="space-y-8">
      <div
        class="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-soft-xs"
      >
        <div class="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer mb-2" />
        <div class="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer mb-2" />
        <div class="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="n in 4"
          :key="`sk-row1-${n}`"
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs"
        >
          <div class="flex justify-between items-start gap-2 mb-3">
            <div class="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
            <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 skeleton-shimmer shrink-0" />
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
    </div>

    <div v-else-if="!stats" class="text-center py-16">
      <p class="text-gray-600 dark:text-gray-400 mb-4">Não foi possível carregar as estatísticas deste colaborador.</p>
      <router-link
        :to="{ name: 'AdminReports', query: { tab: 'colaboradores' } }"
        class="text-primary-600 dark:text-blue-400 hover:underline"
      >
        Voltar para relatórios
      </router-link>
    </div>

    <template v-else>
      <div
        class="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-soft-xs"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold text-txt-primary dark:text-white">
              {{ displayName }}
            </h1>
            <span
              v-if="departmentLine"
              class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
            >
              {{ departmentLine }}
            </span>
          </div>
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
            :class="departmentLine ? 'mt-2' : 'mt-0.5'"
          >
            Período: {{ periodLabel }}
          </p>
        </div>
      </div>

      <!-- First row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white">Total de tarefas</span>
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            >
              <font-awesome-icon icon="tasks" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ stats.totalTickets }}
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
            {{ stats.resolvedTickets }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ resolvedPercentage }}% do total</div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white">Tempo médio de aceite</span>
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-amber-600 dark:text-amber-400"
            >
              <font-awesome-icon :icon="['far', 'clock']" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ formatTime(stats.averageAcceptanceTimeSeconds) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Desde a criação</div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-xs relative"
        >
          <div class="flex justify-between items-start gap-2 mb-1">
            <span class="text-sm font-medium text-txt-primary dark:text-white">Tempo médio de resolução</span>
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400"
            >
              <font-awesome-icon :icon="['far', 'hourglass']" />
            </div>
          </div>
          <div class="text-3xl font-bold text-txt-primary dark:text-white">
            {{ formatTime(stats.averageResolutionTimeSeconds) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Após o aceite</div>
        </div>
      </div>

      <!-- Second row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-soft-xs"
        >
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="chart-line" class="text-blue-500 dark:text-blue-400" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Score de desempenho
              </span>
            </div>
            <button
              type="button"
              class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              @click="showScoreDetailsModal = true"
            >
              Ver detalhes
            </button>
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
                  stats.efficiencyScore !== undefined
                    ? formatScore(stats.efficiencyScore)
                    : '—'
                }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Baseado em {{ stats.totalTickets }} tarefa{{
                stats.totalTickets !== 1 ? 's' : ''
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
              :class="overdueBarIconClass(stats.sentToVerificationOverdueRate)"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Atraso no envio para verificação
            </span>
          </div>
          <div class="text-2xl font-bold">
            {{ formatOverdueRate(stats.sentToVerificationOverdueRate) }}
          </div>
          <div class="mt-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="overdueBarFillClass(stats.sentToVerificationOverdueRate)"
              :style="{
                width:
                  Math.min(100, Math.round(stats.sentToVerificationOverdueRate ?? 0)) + '%',
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
              :class="overdueBarIconClass(stats.completionOverdueRate)"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Atraso na entrega
            </span>
          </div>
          <div class="text-2xl font-bold">
            {{ formatOverdueRate(stats.completionOverdueRate) }}
          </div>
          <div class="mt-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="overdueBarFillClass(stats.completionOverdueRate)"
              :style="{
                width: Math.min(100, Math.round(stats.completionOverdueRate ?? 0)) + '%',
              }"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            % de tarefas concluídas após o prazo
          </p>
        </div>
      </div>

      <!-- Score details modal (admin view) -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showScoreDetailsModal"
            class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            @click.self="showScoreDetailsModal = false"
          >
            <div
              class="fixed inset-0 bg-black/50 dark:bg-black/70"
              @click="showScoreDetailsModal = false"
            ></div>
            <div
              class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div
                class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700"
              >
                <h2 class="text-lg sm:text-xl font-bold text-txt-primary dark:text-white">
                  Detalhes do Score - {{ displayName }}
                </h2>
                <button
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  @click="showScoreDetailsModal = false"
                >
                  <font-awesome-icon icon="times" class="text-xl" />
                </button>
              </div>

              <div class="overflow-y-auto p-4 sm:p-6 space-y-5">
                <div class="rounded-lg bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-5">
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Score Final</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Período: {{ periodLabel }}
                      </p>
                    </div>
                    <div class="text-right shrink-0">
                      <p class="text-xl font-bold text-txt-primary dark:text-white">
                        {{ stats?.efficiencyScore !== undefined ? formatScore(stats?.efficiencyScore) : '—' }}
                      </p>
                      <span
                        v-if="stats?.efficiencyScore !== undefined"
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                          scoreCategory.bg,
                          scoreCategory.text,
                        ]"
                      >
                        {{ scoreCategory.label }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
                      Entrega no prazo
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ stats?.detailedMetrics?.sentToVerificationOnTime ?? 0 }} de
                      {{ stats?.detailedMetrics?.completionIndexTicketsTotal ?? 0 }} no prazo
                    </p>
                    <p class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">
                      {{ formatIndexPercent(stats?.detailedMetrics?.completionIndex) }}
                    </p>
                  </div>

                  <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
                      Verificação no prazo
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ stats?.detailedMetrics?.onTimeVerified ?? 0 }} de
                      {{ stats?.detailedMetrics?.totalVerified ?? 0 }} verificações no prazo
                    </p>
                    <p class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">
                      {{ formatIndexPercent(stats?.detailedMetrics?.verificationIndex) }}
                    </p>
                  </div>

                  <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
                      Aprovação do trabalho
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{
                        Math.max(
                          0,
                          (stats?.detailedMetrics?.totalCompleted ?? 0) -
                            (stats?.detailedMetrics?.rejectedCount ?? 0),
                        )
                      }}
                      de {{ stats?.detailedMetrics?.totalCompleted ?? 0 }} aprovadas
                    </p>
                    <p class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">
                      {{ formatIndexPercent(stats?.detailedMetrics?.rejectionIndex) }}
                    </p>
                  </div>

                  <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
                      Qualidade da entrega
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{
                        Math.max(
                          0,
                          (stats?.detailedMetrics?.totalCompleted ?? 0) -
                            (stats?.detailedMetrics?.returnedCount ?? 0),
                        )
                      }}
                      de {{ stats?.detailedMetrics?.totalCompleted ?? 0 }} sem ajustes
                    </p>
                    <p class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2">
                      {{ formatIndexPercent(stats?.detailedMetrics?.returnIndex) }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="flex justify-end p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  class="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  @click="showScoreDetailsModal = false"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Teleport } from 'vue';
import { useRoute } from 'vue-router';
import { reportService, type UserStatistics } from '@/services/reportService';
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

const userId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : null;
});

const period = computed(() => {
  const q = route.query.period as string;
  return q || statsFiltersStore.analysisPeriod || 'trimestral';
});

const periodLabel = computed(() => periodLabelMap[period.value] || 'Últimos 3 meses');

const displayName = computed(() => {
  const statsFirstName = (stats.value?.userFirstName || '').trim();
  const statsLastName = (stats.value?.userLastName || '').trim();
  const statsCombined = `${statsFirstName} ${statsLastName}`.trim();
  if (statsCombined) return statsCombined;

  const fn = (route.query.firstName as string) || '';
  const ln = (route.query.lastName as string) || '';
  const combined = `${fn} ${ln}`.trim();
  if (combined) return combined;
  if (userId.value != null && !Number.isNaN(userId.value)) {
    return `Colaborador #${userId.value}`;
  }
  return 'Colaborador';
});

const departmentLine = computed(() => {
  const departmentFromStats = (stats.value?.userDepartmentName || '').trim();
  if (departmentFromStats) return `${departmentFromStats}`;

  const d = (route.query.departmentName as string) || '';
  return d ? `${d}` : '';
});

const loading = ref(true);
const stats = ref<UserStatistics | null>(null);
const showScoreDetailsModal = ref(false);

const resolvedPercentage = computed(() => {
  if (!stats.value?.totalTickets) return 0;
  return Math.round((stats.value.resolvedTickets / stats.value.totalTickets) * 100);
});

const scorePercent = computed(() => {
  const v = stats.value?.efficiencyScore;
  if (v === undefined || v === null) return 0;
  return Math.min(100, Math.round((v ?? 0) * 100));
});

const resolutionPercent = computed(() => {
  const v = stats.value?.resolutionRate;
  if (v === undefined || v === null) return 0;
  return Math.min(100, Math.round((v ?? 0) * 100));
});

const displayResolutionPercentValue = computed(() => resolutionPercent.value);

const displayResolutionPercent = computed(() => `${resolutionPercent.value}%`);

const resolutionRateSubtitle = computed(() => {
  const s = stats.value;
  if (!s) return '';
  const closed = s.closedTickets ?? 0;
  if (closed <= 0) return 'Nenhuma tarefa encerrada';
  const resolved = s.resolvedTickets ?? 0;
  return `${resolved} de ${closed} resolvida${closed !== 1 ? 's' : ''}`;
});

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

function formatIndexPercent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value * 100)}%`;
}

const scoreCategory = computed(() => {
  const scorePercent = (stats.value?.efficiencyScore ?? 0) * 100;
  if (scorePercent >= 85) {
    return {
      label: 'Excelente',
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
    };
  }
  if (scorePercent >= 75) {
    return {
      label: 'Muito bom',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
    };
  }
  if (scorePercent >= 60) {
    return {
      label: 'Bom',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
    };
  }
  return {
    label: 'Atenção',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
  };
});

function overdueBarFillClass(rate?: number) {
  if (rate === undefined || rate === null) return 'bg-gray-400 dark:bg-gray-500';
  if (rate <= 20) return 'bg-green-500 dark:bg-green-500';
  if (rate <= 50) return 'bg-amber-500 dark:bg-amber-500';
  return 'bg-red-500 dark:bg-red-500';
}

function overdueBarIconClass(rate?: number) {
  if (rate === undefined || rate === null) return 'text-gray-500 dark:text-gray-400';
  if (rate <= 20) return 'text-green-500 dark:text-green-400';
  if (rate <= 50) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

async function loadStats() {
  if (userId.value == null || Number.isNaN(userId.value)) {
    stats.value = null;
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    stats.value = await reportService.getUserStatistics({
      period: period.value,
      userId: userId.value,
    });
  } catch (err) {
    console.error('Error loading user stats:', err);
    stats.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
watch([() => route.params.id, period], loadStats);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white,
.modal-enter-active .bg-gray-800,
.modal-leave-active .bg-gray-800 {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white,
.modal-enter-from .bg-gray-800,
.modal-leave-to .bg-gray-800 {
  transform: scale(0.96);
  opacity: 0;
}
</style>
