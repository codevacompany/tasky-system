<template>
  <div class="min-h-[calc(100vh-var(--header-height))] bg-surface-soft dark:bg-gray-900">
    <div class="max-w-[1500px] mx-auto flex flex-col md:flex-row md:pt-6">
      <!-- Sidebar de Configurações -->
      <aside
        class="w-full rounded-xl md:w-64 lg:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-auto md:h-[calc(100vh-var(--header-height)-5rem)] sticky top-[calc(var(--header-height)+2.125rem)] self-start z-20 overflow-hidden"
      >
        <div class="p-6">
          <h2
            class="text-xs font-bold text-txt-light dark:text-gray-500 uppercase tracking-wider mb-6"
          >
            Configurações da Empresa
          </h2>
          <nav class="space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group no-underline"
              :class="
                isActive(item.path)
                  ? 'bg-gray-50 dark:bg-gray-900/20 text-primary dark:text-blue-400 hover: text-primary dark:hover:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              "
            >
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                :class="
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-800/30'
                    : 'bg-gray-50 dark:bg-gray-700/30'
                "
              >
                <font-awesome-icon
                  :icon="item.icon"
                  :class="
                    isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  "
                />
              </div>
              <div class="flex flex-col">
                <span>{{ item.label }}</span>
              </div>
            </router-link>
          </nav>

          <div class="mt-10 pt-10 border-t border-gray-100 dark:border-gray-700">
            <h2
              class="text-xs font-bold text-txt-light dark:text-gray-500 uppercase tracking-wider mb-6"
            >
              Preferências
            </h2>
            <div class="space-y-1">
              <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 dark:text-gray-600 cursor-not-allowed italic"
              >
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 opacity-50"
                >
                  <font-awesome-icon icon="bell" />
                </div>
                <div class="flex flex-col">
                  <span>Notificações</span>
                  <span class="text-[10px] font-normal">Em breve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
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
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = [
  {
    label: 'Dados Gerais',
    description: 'Identificação e Endereço',
    path: '/admin/configuracoes/empresa',
    icon: 'building',
  },
  {
    label: 'Plano e Cobrança',
    description: 'Gestão de assinaturas',
    path: '/admin/configuracoes/assinaturas',
    icon: 'credit-card',
  },
];

const isActive = (path: string) => {
  return route.path === path;
};
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

/* Custom scrollbar for the sidebar if needed */
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark aside::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
