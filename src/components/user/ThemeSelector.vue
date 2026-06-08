<template>
  <div :class="variant === 'page' ? 'space-y-3' : 'p-2 flex flex-col gap-1'">
    <button
      type="button"
      class="flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 text-left w-full border-none"
      :class="[
        variant === 'page' ? 'px-4 py-4 border' : 'px-3 py-3 rounded-md',
        !userPreferencesStore.isDarkMode
          ? variant === 'page'
            ? 'border-primary bg-primary-50 dark:bg-primary-950/20'
            : 'bg-blue-50 dark:bg-blue-900/10'
          : variant === 'page'
            ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700',
      ]"
      @click="selectTheme('light')"
    >
      <div class="relative flex items-center justify-center flex-shrink-0">
        <div
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          :class="
            !userPreferencesStore.isDarkMode
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-300 dark:border-gray-600'
          "
        >
          <div
            v-if="!userPreferencesStore.isDarkMode"
            class="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
          />
        </div>
      </div>
      <div
        class="w-[50px] h-8 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white"
      >
        <div class="h-2.5 bg-gray-100 border-b border-gray-200" />
        <div class="h-[22px] bg-white" />
      </div>
      <div class="flex-1 flex flex-col min-w-0">
        <span
          class="text-sm font-medium"
          :class="
            !userPreferencesStore.isDarkMode
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-txt-primary dark:text-white'
          "
        >
          Claro
        </span>
        <p class="m-0 text-xs text-gray-600 dark:text-gray-400">Tema padrão com fundo branco</p>
      </div>
    </button>

    <button
      type="button"
      class="flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 text-left w-full border-none"
      :class="[
        variant === 'page' ? 'px-4 py-4 border' : 'px-3 py-3 rounded-md',
        userPreferencesStore.isDarkMode
          ? variant === 'page'
            ? 'border-primary bg-primary-50 dark:bg-primary-950/20'
            : 'bg-blue-50 dark:bg-blue-900/10'
          : variant === 'page'
            ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700',
      ]"
      @click="selectTheme('dark')"
    >
      <div class="relative flex items-center justify-center flex-shrink-0">
        <div
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          :class="
            userPreferencesStore.isDarkMode
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-300 dark:border-gray-600'
          "
        >
          <div
            v-if="userPreferencesStore.isDarkMode"
            class="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
          />
        </div>
      </div>
      <div
        class="w-[50px] h-8 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-800"
      >
        <div class="h-2.5 bg-gray-700 border-b border-gray-600" />
        <div class="h-[22px] bg-gray-800" />
      </div>
      <div class="flex-1 flex flex-col min-w-0">
        <span
          class="text-sm font-medium"
          :class="
            userPreferencesStore.isDarkMode
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-txt-primary dark:text-white'
          "
        >
          Escuro
        </span>
        <p class="m-0 text-xs text-gray-600 dark:text-gray-400">
          Tema escuro para reduzir o cansaço visual
        </p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserPreferencesStore } from '@/stores/userPreferences';

withDefaults(
  defineProps<{
    variant?: 'popup' | 'page';
  }>(),
  {
    variant: 'popup',
  },
);

const emit = defineEmits<{
  selected: [];
}>();

const userPreferencesStore = useUserPreferencesStore();

const selectTheme = (theme: 'light' | 'dark') => {
  userPreferencesStore.setTheme(theme);
  emit('selected');
};
</script>
