<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Entenda seu Desempenho</h2>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <font-awesome-icon icon="times" class="text-xl" />
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto flex-1 p-6">
            <div class="space-y-6">
              <!-- Score de Desempenho Section -->
              <section>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Score de Desempenho
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Seu Score de Desempenho é calculado com base em 4 métricas principais com pesos
                  diferentes, que somadas resultam no seu score final.
                  <span class="relative inline-flex items-center group">
                    <span
                      class="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
                      @click="goToFaq"
                    >
                      Saiba mais
                    </span>
                  </span>
                </p>

                <div class="space-y-4">
                  <!-- Completion Index -->
                  <div :class="completionColors.bg + ' p-4 rounded-lg'">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        1️⃣ Entrega no prazo (40%)
                      </h4>
                      <span
                        v-if="userStats?.detailedMetrics"
                        :class="'text-sm font-bold ' + completionColors.text"
                      >
                        {{ completionColors.label }} · {{ Math.round(completionIndex * 100) }}%
                      </span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span class="font-medium">O que mede:</span> se você envia as tarefas para
                        verificação dentro do prazo.
                      </p>
                      <p v-if="userStats?.detailedMetrics">
                        <span class="font-medium">Neste período:</span>
                        {{
                          userStats.detailedMetrics.totalCompleted > 0
                            ? `${userStats.detailedMetrics.totalCompleted} tarefa${
                                userStats.detailedMetrics.onTimeCompleted !== 1 ? 's' : ''
                              } entregue${
                                userStats.detailedMetrics.onTimeCompleted !== 1 ? 's' : ''
                              }, ${
                                userStats.detailedMetrics.onTimeCompleted ===
                                userStats.detailedMetrics.totalCompleted
                                  ? 'todas no prazo'
                                  : `${userStats.detailedMetrics.onTimeCompleted} no prazo`
                              }.`
                            : 'nenhuma tarefa entregue.'
                        }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        <span class="font-medium">ℹ️</span> Ter poucas tarefas impacta negativamente
                        no índice de entrega no prazo. Possui 40% de peso no score final.
                      </p>
                    </div>
                  </div>

                  <!-- Return Index -->
                  <div :class="returnColors.bg + ' p-4 rounded-lg'">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        2️⃣ Qualidade da entrega (30%)
                      </h4>
                      <span
                        v-if="userStats?.detailedMetrics"
                        :class="'text-sm font-bold ' + returnColors.text"
                      >
                        {{ returnColors.label }} · {{ Math.round(returnIndex * 100) }}%
                      </span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span class="font-medium">O que mede:</span> se a tarefa foi entregue certa,
                        sem precisar voltar.
                      </p>
                      <p v-if="userStats?.detailedMetrics">
                        <span class="font-medium">Neste período:</span>
                        {{
                          userStats.detailedMetrics.totalCompleted > 0
                            ? `${userStats.detailedMetrics.totalCompleted - userStats.detailedMetrics.returnedCount} tarefa${
                                userStats.detailedMetrics.totalCompleted -
                                  userStats.detailedMetrics.returnedCount !==
                                1
                                  ? 's'
                                  : ''
                              } entregue${
                                userStats.detailedMetrics.totalCompleted -
                                  userStats.detailedMetrics.returnedCount !==
                                1
                                  ? 's'
                                  : ''
                              } sem ajustes${
                                userStats.detailedMetrics.returnedCount > 0
                                  ? `, ${userStats.detailedMetrics.returnedCount} com ajustes`
                                  : ''
                              }.`
                            : 'nenhuma tarefa entregue.'
                        }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        <span class="font-medium">ℹ️</span> Possui 30% de peso no score final.
                      </p>
                    </div>
                  </div>

                  <!-- Rejection Index -->
                  <div :class="rejectionColors.bg + ' p-4 rounded-lg'">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        3️⃣ Aprovação do trabalho (Peso: 15%)
                      </h4>
                      <span
                        v-if="userStats?.detailedMetrics"
                        :class="'text-sm font-bold ' + rejectionColors.text"
                      >
                        {{ rejectionColors.label }} · {{ Math.round(rejectionIndex * 100) }}%
                      </span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span class="font-medium">O que mede:</span> quantas tarefas foram
                        aprovadas.
                      </p>
                      <p v-if="userStats?.detailedMetrics">
                        <span class="font-medium">Neste período:</span>
                        {{
                          userStats.detailedMetrics.totalCompleted > 0
                            ? `${userStats.detailedMetrics.totalCompleted} tarefa${
                                userStats.detailedMetrics.totalCompleted !== 1 ? 's' : ''
                              } enviada${
                                userStats.detailedMetrics.totalCompleted !== 1 ? 's' : ''
                              }, ${
                                userStats.detailedMetrics.rejectedCount === 0
                                  ? 'todas aprovadas'
                                  : `${userStats.detailedMetrics.totalCompleted - userStats.detailedMetrics.rejectedCount} aprovadas`
                              }${
                                userStats.detailedMetrics.rejectedCount > 0
                                  ? `, ${userStats.detailedMetrics.rejectedCount} rejeitada${
                                      userStats.detailedMetrics.rejectedCount !== 1 ? 's' : ''
                                    }`
                                  : ''
                              }.`
                            : 'nenhuma tarefa enviada.'
                        }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        <span class="font-medium">ℹ️</span> Possui 15% de peso no score final.
                      </p>
                    </div>
                  </div>

                  <!-- Verification Index -->
                  <div :class="verificationColors.bg + ' p-4 rounded-lg'">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        4️⃣ Verificação no Prazo (Peso: 15%)
                      </h4>
                      <span
                        v-if="userStats?.detailedMetrics"
                        :class="'text-sm font-bold ' + verificationColors.text"
                      >
                        {{ verificationColors.label }} · {{ Math.round(verificationIndex * 100) }}%
                      </span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <span class="font-medium">O que mede:</span> se você verifica tarefas em até
                        24h.
                      </p>
                      <p v-if="userStats?.detailedMetrics">
                        <span class="font-medium">Neste período:</span>
                        {{
                          userStats.detailedMetrics.totalVerified > 0
                            ? `${userStats.detailedMetrics.onTimeVerified} verificação${
                                userStats.detailedMetrics.onTimeVerified !== 1 ? 'ões' : 'ão'
                              } no prazo de ${userStats.detailedMetrics.totalVerified} tota${
                                userStats.detailedMetrics.totalVerified !== 1 ? 'is' : 'l'
                              }.`
                            : 'nenhuma tarefa entrou em verificação.'
                        }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        <span class="font-medium">ℹ️</span> Possui 15% de peso no score final.
                      </p>
                    </div>
                  </div>

                  <!-- Score Final -->
                  <div
                    v-if="userStats"
                    :class="
                      'p-4 rounded-lg border-2 mb-4 ' +
                      (efficiencyScoreColors.bg + ' ' + efficiencyScoreColors.border)
                    "
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          Score Final
                        </h4>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          Calculado com base nas 4 métricas abaixo
                        </p>
                      </div>
                      <div class="text-right">
                        <div :class="'text-3xl font-bold ' + efficiencyScoreColors.text">
                          {{ Math.round(userStats.efficiencyScore * 100) }}%
                        </div>
                        <div :class="'text-sm font-medium ' + efficiencyScoreColors.text">
                          {{ efficiencyScoreColors.label }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    Em resumo, para manter um score alto, você deve:
                  </p>
                  <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    <li>Entregar as tarefas para verificação dentro do prazo.</li>
                    <li>Entregar as tarefas com qualidade.</li>
                    <li>Ter tarefas aprovadas.</li>
                    <li>Verificar as tarefas no prazo de 24h.</li>
                  </ul>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    (Obs: Os tempos médios de aceite e resolução servem apenas para fins de análise
                    e critérios de desemmpate entre colaboradores ou setores.)
                  </p>
                </div>
              </section>

              <!-- Other Metrics Section -->
              <section>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Outras Métricas
                </h3>

                <div class="space-y-4">
                  <!-- Tempo Médio de Aceite -->
                  <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        Tempo Médio de Aceite
                      </h4>
                      <span
                        v-if="userStats"
                        class="text-lg font-bold text-gray-900 dark:text-white"
                      >
                        {{ formatTimeShort(userStats.averageAcceptanceTimeSeconds) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Tempo médio entre a criação da tarefa e quando você a aceitou (mudou o status
                      de "Pendente" para "Em Andamento"). Este tempo é calculado apenas durante
                      horários comerciais, excluindo finais de semana.
                    </p>
                  </div>

                  <!-- Tempo Médio de Resolução -->
                  <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        Tempo Médio de Resolução
                      </h4>
                      <span
                        v-if="userStats"
                        class="text-lg font-bold text-gray-900 dark:text-white"
                      >
                        {{ formatTimeShort(userStats.averageResolutionTimeSeconds) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Tempo médio que você passou trabalhando na tarefa enquanto estava com status
                      "Em Andamento". Este tempo é calculado apenas durante horários comerciais,
                      excluindo finais de semana.
                    </p>
                  </div>

                  <!-- Taxa de Atraso na Entrega -->
                  <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        Taxa de Atraso na Entrega
                      </h4>
                      <span
                        v-if="userStats"
                        class="text-lg font-bold text-gray-900 dark:text-white"
                      >
                        {{ userStats.deliveryOverdueRate.toFixed(1) }}%
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Percentual de tarefas concluídas que foram enviadas para verificação após o
                      prazo. Quanto menor, melhor.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="$emit('close')"
              class="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, computed } from 'vue';
import type { UserStatistics } from '@/services/reportService';
import { useRouter } from 'vue-router';
import { formatTimeShort } from '@/utils/generic-helper';

const router = useRouter();

interface Props {
  isOpen: boolean;
  userStats: UserStatistics | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const goToFaq = () => {
  emit('close');
  router.push('/faq#metricas-de-desempenho');
};

// Get indices from backend (calculated server-side for consistency)
const completionIndex = computed(() => {
  return props.userStats?.detailedMetrics?.completionIndex ?? 0;
});

const verificationIndex = computed(() => {
  return props.userStats?.detailedMetrics?.verificationIndex ?? 0;
});

const rejectionIndex = computed(() => {
  return props.userStats?.detailedMetrics?.rejectionIndex ?? 1;
});

const returnIndex = computed(() => {
  return props.userStats?.detailedMetrics?.returnIndex ?? 1;
});

/**
 * Get color classes based on performance index
 * >= 0.85: green (excellent performance)
 * 0.75-0.85: blue (high performance)
 * 0.60-0.75: yellow/orange (good)
 * < 0.60: red (attention)
 */
const getPerformanceColorClasses = (index: number) => {
  if (index >= 0.85) {
    return {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      hover: 'hover:text-green-700 dark:hover:text-green-300',
      label: 'Excelente',
    };
  } else if (index >= 0.75) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
      label: 'Muito Bom',
    };
  } else if (index >= 0.6) {
    return {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      hover: 'hover:text-yellow-700 dark:hover:text-yellow-300',
      label: 'Bom',
    };
  } else {
    return {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      hover: 'hover:text-red-700 dark:hover:text-red-300',
      label: 'Atenção',
    };
  }
};

const completionColors = computed(() => getPerformanceColorClasses(completionIndex.value));
const verificationColors = computed(() => getPerformanceColorClasses(verificationIndex.value));
const rejectionColors = computed(() => getPerformanceColorClasses(rejectionIndex.value));
const returnColors = computed(() => getPerformanceColorClasses(returnIndex.value));

// Efficiency Score (final score)
const efficiencyScore = computed(() => {
  return props.userStats?.efficiencyScore ?? 0;
});

const efficiencyScoreColors = computed(() => {
  const score = efficiencyScore.value * 100; // Convert to percentage (0-100)
  if (score >= 85) {
    return {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      label: 'Excelente',
    };
  } else if (score >= 75) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'Muito Bom',
    };
  } else if (score >= 60) {
    return {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      label: 'Bom',
    };
  } else {
    return {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      label: 'Atenção',
    };
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
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
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white,
.modal-enter-from .bg-gray-800,
.modal-leave-to .bg-gray-800 {
  transform: scale(0.95);
  opacity: 0;
}
</style>
