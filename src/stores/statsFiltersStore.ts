import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { localStorageService } from '@/utils/localStorageService';

export type StatsAnalysisPeriod = 'weekly' | 'monthly' | 'trimestral' | 'semestral' | 'annual';

const DEFAULT_ANALYSIS_PERIOD: StatsAnalysisPeriod = 'trimestral';

export const useStatsFiltersStore = defineStore('statsFilters', () => {
  const analysisPeriod = ref<StatsAnalysisPeriod>(
    localStorageService.getStatsAnalysisPeriod() ?? DEFAULT_ANALYSIS_PERIOD,
  );

  watch(
    analysisPeriod,
    (newValue) => {
      localStorageService.setStatsAnalysisPeriod(newValue);
    },
    { immediate: true },
  );

  const setAnalysisPeriod = (period: StatsAnalysisPeriod) => {
    analysisPeriod.value = period;
  };

  return {
    analysisPeriod,
    setAnalysisPeriod,
  };
});
