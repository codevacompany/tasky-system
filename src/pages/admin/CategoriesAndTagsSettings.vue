<template>
  <div class="p-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-txt-primary dark:text-white tracking-tight">
        Categorias e Tags
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Classificação das tarefas da empresa
      </p>
    </div>

    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex gap-1 -mb-px" aria-label="Categorias e Tags">
        <router-link
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors no-underline"
          :class="
            isActive(tab.path)
              ? 'border-primary text-primary dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
          "
        >
          <font-awesome-icon :icon="tab.icon" class="w-3.5 h-3.5" />
          {{ tab.label }}
        </router-link>
      </nav>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  {
    label: 'Categorias',
    path: '/admin/categorias-e-tags/categorias',
    icon: 'tag',
  },
  {
    label: 'Tags',
    path: '/admin/categorias-e-tags/tags',
    icon: 'tags',
  },
];

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
