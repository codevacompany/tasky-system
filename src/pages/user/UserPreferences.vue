<template>
  <div class="min-h-[calc(100vh-var(--header-height))] bg-surface-soft dark:bg-gray-900">
    <div class="max-w-[1500px] mx-auto flex flex-col md:flex-row md:pt-6">
      <aside
        class="w-full rounded-xl md:w-64 lg:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-auto md:h-[calc(100vh-var(--header-height)-5rem)] sticky top-[calc(var(--header-height)+2.125rem)] self-start z-20 overflow-hidden"
      >
        <div class="p-6">
          <h2
            class="text-xs font-bold text-txt-light dark:text-gray-500 uppercase tracking-wider mb-6"
          >
            Preferências
          </h2>
          <nav class="space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group no-underline"
              :class="
                isActive(item.path)
                  ? 'bg-gray-50 dark:bg-gray-900/20 text-primary dark:text-primary-light'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              "
            >
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                :class="
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-gray-50 dark:bg-gray-700/30 group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50'
                "
              >
                <component
                  :is="item.icon"
                  class="w-5 h-5 transition-colors"
                  :class="
                    isActive(item.path)
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  "
                  aria-hidden="true"
                />
              </div>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </div>
      </aside>

      <main
        class="flex-1 w-full overflow-x-hidden pt-0 pb-12 min-h-[calc(100vh-var(--header-height)-2rem)]"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { useRoute } from 'vue-router';
import { BellIcon, SwatchIcon } from '@heroicons/vue/24/solid';

const route = useRoute();

const menuItems: { label: string; path: string; icon: Component }[] = [
  {
    label: 'Notificações',
    path: '/preferencias/notificacoes',
    icon: BellIcon,
  },
  {
    label: 'Tema',
    path: '/preferencias/tema',
    icon: SwatchIcon,
  },
];

const isActive = (path: string) => route.path === path;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
