<template>
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-soft-xs flex-1 min-w-0"
  >
    <div
      class="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-[22px] border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2 min-w-0">
        <h2 class="text-sm font-semibold text-txt-primary dark:text-white m-0 truncate">
          Precisa da sua ação
        </h2>
        <span
          v-if="!isLoading && totalCount > 0"
          class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold bg-primary-100 text-primary-700 dark:bg-blue-900/40 dark:text-blue-300"
        >
          {{ totalCount }}
        </span>
      </div>
      <router-link
        to="/minhas-tarefas?tab=recebidas"
        class="text-xs sm:text-sm text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
      >
        Ver todos
      </router-link>
    </div>

    <div class="px-3 sm:px-6 pb-4 sm:pb-6">
      <div v-if="isLoading" class="space-y-4 pt-4">
        <div
          v-for="n in 4"
          :key="`action-skeleton-${n}`"
          class="flex items-center gap-3 py-3"
        >
          <div class="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse-custom"></div>
          <div class="h-4 flex-1 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
          <div class="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse-custom"></div>
        </div>
      </div>

      <div v-else-if="items.length === 0" class="py-12 text-center h-[260px]">
        <div class="flex flex-col items-center justify-center gap-3 h-full">
          <div
            class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
          >
            <font-awesome-icon icon="check" class="text-2xl text-gray-400 dark:text-gray-500" />
          </div>
          <div class="flex flex-col items-center gap-1">
            <p class="text-sm font-medium text-txt-primary dark:text-gray-300 m-0">
              Nenhuma ação pendente
            </p>
            <p class="text-xs text-txt-light dark:text-gray-400 m-0">
              Tarefas que precisam de você aparecerão aqui
            </p>
          </div>
        </div>
      </div>

      <div v-else class="space-y-3 pt-4">
        <div
          v-for="item in items"
          :key="item.ticket.customId"
          class="flex items-center gap-2 sm:gap-3 py-3 sm:py-3.5 px-2 sm:px-4 border dark:border-solid border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
          @click="emit('select', item.ticket)"
        >
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0"
            :class="kindClasses[item.kind]"
          >
            {{ kindLabels[item.kind] }}
          </span>
          <div class="flex-1 min-w-0 text-left">
            <p class="text-[13px] sm:text-sm font-medium text-txt-primary dark:text-white truncate m-0">
              {{ item.ticket.name }}
            </p>
            <p class="text-[11px] text-txt-light dark:text-gray-400 m-0 truncate">
              {{ item.ticket.customId }}
            </p>
          </div>
          <span
            class="text-[10px] sm:text-xs text-txt-muted dark:text-gray-300 opacity-70 whitespace-nowrap flex-shrink-0"
          >
            {{ formatRelativeTime(item.ticket.updatedAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from '@/models';
import type { HomeActionItem, HomeActionKind } from '@/composables/useHomeDashboardWidgets';
import { formatRelativeTime } from '@/utils/date';

defineProps<{
  items: HomeActionItem[];
  totalCount: number;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  select: [ticket: Ticket];
}>();

const kindLabels: Record<HomeActionKind, string> = {
  aceitar: 'Aceitar',
  continuar: 'Continuar',
  revisar: 'Revisar',
  corrigir: 'Corrigir',
};

const kindClasses: Record<HomeActionKind, string> = {
  aceitar:
    'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  continuar:
    'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  revisar:
    'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  corrigir:
    'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
};
</script>

<style scoped>
@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse-custom {
  animation: fadeInOut 2s ease-in-out infinite;
}
</style>
