<template>
  <div>
    <div class="min-h-screen bg-surface-soft dark:bg-gray-900">
      <header
        class="flex items-center justify-between p-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-[var(--header-height)] sticky top-0 z-50 shadow-soft-xs"
      >
        <div
          class="hidden md:flex items-center justify-center px-6 min-w-[150px] bg-gray-100 dark:bg-gray-900 h-full relative shadow-soft-xs"
        >
          <img
            :src="userPreferencesStore.isDarkMode ? taskyWhiteLogo : taskyLogo"
            alt="Tasky Logo"
            class="h-[34px] block mx-auto"
          />
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden flex items-center justify-center w-12 h-12 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-4"
        >
          <font-awesome-icon icon="bars" class="text-xl" />
        </button>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex flex-1 items-center ml-4 h-full">
          <nav>
            <ul class="flex items-center space-x-2">
              <router-link to="/">
                <li>
                  <div
                    :class="{
                      'menu-item-active': isActive('/'),
                    }"
                    class="nav-menu-item flex items-center px-4 py-2 text-[14px] text-txt-secondary dark:text-gray-300 font-medium transition-all duration-200 whitespace-nowrap menu-item-hover relative gap-2"
                  >
                    <font-awesome-icon icon="home" class="text-sm" />
                    Início
                  </div>
                </li>
              </router-link>
              <router-link v-if="!isGlobalAdmin" to="/minhas-tarefas">
                <li>
                  <div
                    :class="{
                      'menu-item-active': isActive('/minhas-tarefas'),
                    }"
                    class="nav-menu-item flex items-center px-4 py-2 text-[14px] text-txt-secondary dark:text-gray-300 font-medium transition-all duration-200 whitespace-nowrap menu-item-hover relative gap-2"
                  >
                    <font-awesome-icon icon="tasks" class="text-sm" />
                    Tarefas
                  </div>
                </li>
              </router-link>
              <router-link v-if="isTenantAdmin || isSupervisor" to="/admin/relatorios">
                <li>
                  <div
                    :class="{
                      'menu-item-active': isActive('/admin/relatorios'),
                    }"
                    class="nav-menu-item flex items-center px-4 py-2 text-[14px] text-txt-secondary dark:text-gray-300 font-medium transition-all duration-200 whitespace-nowrap menu-item-hover cursor-pointer relative gap-2"
                  >
                    <font-awesome-icon icon="chart-line" class="text-sm" />
                    Relatórios
                  </div>
                </li>
              </router-link>

              <li
                v-if="isAdmin"
                class="relative"
                ref="adminDropdownRef"
                @mouseenter="showAdminDropdown = true"
                @mouseleave="showAdminDropdown = false"
              >
                <div
                  :class="{
                    'menu-item-active':
                      isActive('/admin/usuarios') ||
                      isActive('/admin/setores') ||
                      isActive('/admin/categorias') ||
                      isActive('/admin/clientes') ||
                      isActive('/admin/cadastros'),
                  }"
                  class="nav-menu-item flex items-center px-4 py-2 text-[14px] text-txt-secondary dark:text-gray-300 font-medium transition-all duration-200 whitespace-nowrap gap-2 menu-item-hover cursor-pointer relative"
                >
                  Administração
                  <font-awesome-icon
                    icon="chevron-down"
                    class="transition-transform duration-200"
                    :class="{ 'rotate-180': showAdminDropdown }"
                  />
                </div>
                <div
                  v-show="showAdminDropdown"
                  class="absolute top-[calc(100%-3px)] left-0 text-[14px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[200px] z-50 mt-1 flex flex-col"
                >
                  <router-link
                    v-if="isTenantAdmin"
                    to="/admin/usuarios"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="
                        isActive('/admin/usuarios')
                          ? 'admin-submenu-active bg-gray-50 dark:bg-gray-700'
                          : 'text-txt-secondary dark:text-gray-300'
                      "
                      class="flex items-center gap-2 px-4 py-3 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="users" />
                      Usuários
                    </div>
                  </router-link>
                  <router-link
                    v-if="isTenantAdmin"
                    to="/admin/setores"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="
                        isActive('/admin/setores')
                          ? 'admin-submenu-active bg-gray-50 dark:bg-gray-700'
                          : 'text-txt-secondary dark:text-gray-300'
                      "
                      class="flex items-center gap-2 px-4 py-3 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="building" />
                      Setores
                    </div>
                  </router-link>
                  <router-link
                    v-if="isTenantAdmin"
                    to="/admin/categorias"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="
                        isActive('/admin/categorias')
                          ? 'admin-submenu-active bg-gray-50 dark:bg-gray-700'
                          : 'text-txt-secondary dark:text-gray-300'
                      "
                      class="flex items-center gap-2 px-4 py-3 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="tag" />
                      Categorias
                    </div>
                  </router-link>
                  <router-link
                    to="/admin/clientes"
                    @click="showAdminDropdown = false"
                    v-if="isGlobalAdmin"
                  >
                    <div
                      :class="{
                        'admin-submenu-active bg-gray-50 dark:bg-gray-700':
                          isActive('/admin/clientes'),
                      }"
                      class="flex items-center gap-2 px-4 py-3 text-txt-secondary dark:text-gray-300 no-underline transition-all duration-200 w-full text-left admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="building" />
                      Clientes
                    </div>
                  </router-link>
                  <router-link
                    to="/admin/cadastros"
                    @click="showAdminDropdown = false"
                    v-if="isGlobalAdmin"
                  >
                    <div
                      :class="{
                        'admin-submenu-active bg-gray-50 dark:bg-gray-700':
                          isActive('/admin/cadastros'),
                      }"
                      class="flex items-center gap-2 px-4 py-3 text-txt-secondary dark:text-gray-300 no-underline transition-all duration-200 w-full text-left admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="user-plus" />
                      Cadastros
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <div class="flex items-center gap-6">
          <button
            v-if="userStore.hasActiveSubscription !== false"
            class="btn btn-primary flex items-center gap-2"
            @click="openTicketModal"
          >
            <font-awesome-icon icon="plus" class="text-xs sm:text-[13.5px]" />
            <span class="text-xs sm:text-[13.5px]">Nova Tarefa</span>
          </button>

          <div
            class="flex text-gray-800 dark:text-gray-200 relative cursor-pointer sm:ml-6"
            @click="toggleNotificationsModal"
          >
            <font-awesome-icon
              :icon="['far', 'bell']"
              class="text-lg text-txt-secondary dark:text-gray-200"
            />
            <span v-if="unreadCount && unreadCount > 0" class="notification-badge">{{
              unreadCount
            }}</span>
          </div>

          <!-- <router-link
            to="/sync"
            class="hidden sm:flex text-slate-500 dark:text-slate-400 p-2 rounded cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary"
          >
            <div class="flex flex-col items-center gap-0.5 text-[14px]">
              <font-awesome-icon icon="comments" />
              <span class="text-xs font-medium">Sync</span>
            </div>
          </router-link> -->

          <div
            class="flex items-center cursor-pointer text-gray-800 dark:text-gray-200 mr-4"
            @click="toggleProfileModal"
          >
            <div
              class="w-[29px] h-[29px] rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-semibold"
              :style="avatarStyle"
            >
              <span>{{ userInitials }}</span>
            </div>
            <div class="ml-2 mr-3 hidden sm:block">
              <span class="text-txt-secondary dark:text-gray-200 font-medium text-[14px]">{{
                user?.firstName
              }}</span>
              <font-awesome-icon
                icon="chevron-down"
                class="text-sm font-bold ml-2 text-txt-secondary dark:text-gray-200"
              />
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div
        v-if="showMobileMenu"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="closeMobileMenu"
      ></div>

      <!-- Mobile Menu -->
      <div
        :class="{ 'translate-x-0': showMobileMenu, '-translate-x-full': !showMobileMenu }"
        class="fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden"
      >
        <div
          class="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700"
        >
          <img
            :src="userPreferencesStore.isDarkMode ? taskyWhiteLogo : taskyLogo"
            alt="Tasky Logo"
            class="w-16 h-16 object-contain"
          />
          <button
            @click="closeMobileMenu"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <font-awesome-icon icon="times" class="text-xl" />
          </button>
        </div>

        <nav class="p-4">
          <ul class="space-y-2">
            <router-link to="/" @click="closeMobileMenu">
              <li>
                <div
                  :class="{
                    'menu-item-active': isActive('/'),
                  }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="home" />
                  Início
                </div>
              </li>
            </router-link>
            <router-link v-if="!isGlobalAdmin" to="/minhas-tarefas" @click="closeMobileMenu">
              <li>
                <div
                  :class="{
                    'menu-item-active': isActive('/minhas-tarefas'),
                  }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="tasks" />
                  Tarefas
                </div>
              </li>
            </router-link>
            <router-link
              v-if="isTenantAdmin || isSupervisor"
              to="/admin/relatorios"
              @click="closeMobileMenu"
            >
              <li>
                <div
                  :class="{
                    'menu-item-active': isActive('/admin/relatorios'),
                  }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="chart-line" />
                  Relatórios
                </div>
              </li>
            </router-link>

            <!-- Mobile Admin Section -->
            <li v-if="isAdmin">
              <div
                :class="{
                  'menu-item-active':
                    isActive('/admin/usuarios') ||
                    isActive('/admin/setores') ||
                    isActive('/admin/categorias') ||
                    isActive('/admin/clientes') ||
                    isActive('/admin/cadastros'),
                }"
                class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover cursor-pointer"
                @click="toggleMobileAdminDropdown"
              >
                <font-awesome-icon icon="user-cog" />
                Administração
                <font-awesome-icon
                  icon="chevron-down"
                  class="ml-auto transition-transform duration-200"
                  :class="{ 'rotate-180': showMobileAdminDropdown }"
                />
              </div>
              <div v-show="showMobileAdminDropdown" class="ml-4 mt-2 space-y-1">
                <router-link v-if="isTenantAdmin" to="/admin/usuarios" @click="closeMobileMenu">
                  <div
                    :class="{
                      'text-primary bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400':
                        isActive('/admin/usuarios'),
                    }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="users" />
                    Usuários
                  </div>
                </router-link>
                <router-link v-if="isTenantAdmin" to="/admin/setores" @click="closeMobileMenu">
                  <div
                    :class="{
                      'text-primary bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400':
                        isActive('/admin/setores'),
                    }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="building" />
                    Setores
                  </div>
                </router-link>
                <router-link v-if="isTenantAdmin" to="/admin/categorias" @click="closeMobileMenu">
                  <div
                    :class="{
                      'text-primary bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400':
                        isActive('/admin/categorias'),
                    }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="tag" />
                    Categorias
                  </div>
                </router-link>
                <router-link to="/admin/clientes" @click="closeMobileMenu" v-if="isGlobalAdmin">
                  <div
                    :class="{
                      'text-primary bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400':
                        isActive('/admin/clientes'),
                    }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="building" />
                    Clientes
                  </div>
                </router-link>
                <router-link to="/admin/cadastros" @click="closeMobileMenu" v-if="isGlobalAdmin">
                  <div
                    :class="{
                      'text-primary bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400':
                        isActive('/admin/cadastros'),
                    }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 admin-submenu-hover hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="user-plus" />
                    Cadastros
                  </div>
                </router-link>
              </div>
            </li>

            <!-- Mobile Sync Link -->
            <!-- <router-link to="/sync" @click="closeMobileMenu">
              <li>
                <div
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <font-awesome-icon icon="comments" />
                  Sync
                </div>
              </li>
            </router-link> -->
          </ul>
        </nav>
      </div>

      <main class="py-2.5">
        <router-view />
      </main>
    </div>

    <NewTicketModal v-if="isTicketModalOpen" @close="closeTicketModal" />

    <ProfileModal v-if="showProfileModal" @close="toggleProfileModal" />

    <NotificationsDropdown
      v-if="showNotificationsModal"
      @close="toggleNotificationsModal"
      @notifications-read="fetchUnreadCount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import NewTicketModal from '@/components/layout/NewTicketModal.vue';
import ProfileModal from '@/components/layout/ProfileModal.vue';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown.vue';
import { useUserStore } from '@/stores/user';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useTicketsStore } from '@/stores/tickets';
import { useRoute } from 'vue-router';
import { notificationService } from '@/services/notificationService';
import { useRoles } from '@/composables';
import { getAvatarStyle } from '@/utils/generic-helper';
import taskyLogo from '@/assets/images/tasky-pro-black.png';
import taskyWhiteLogo from '@/assets/images/tasky-pro-white.png';

const userStore = useUserStore();
const user = userStore.user;
const userPreferencesStore = useUserPreferencesStore();
const ticketsStore = useTicketsStore();
const route = useRoute();

// Use the roles composable
const { isGlobalAdmin, isTenantAdmin, isSupervisor, isAdmin } = useRoles();

const isTicketModalOpen = ref(false);
const showProfileModal = ref(false);
const showNotificationsModal = ref(false);
const unreadCount = ref<number | undefined>(undefined);
let notificationsIntervalId: number | null = null;
const source = ref<EventSource | null>(null);
const reconnectionTimeout = ref<number | null>(null);

const showAdminDropdown = ref(false);
const showMobileMenu = ref(false);
const showMobileAdminDropdown = ref(false);
const adminDropdownRef = ref<HTMLElement | null>(null);

const fetchUnreadCount = async () => {
  try {
    const response = await notificationService.count();

    if (unreadCount.value !== undefined && response.data.count > unreadCount.value) {
      playNotificationSound();
    }
    unreadCount.value = response.data.count;
  } catch {
    console.error('Error fetching unread count.');
  }
};

const openTicketModal = () => {
  isTicketModalOpen.value = true;
};

const closeTicketModal = () => {
  isTicketModalOpen.value = false;
};

const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value;
};

const toggleNotificationsModal = () => {
  showNotificationsModal.value = !showNotificationsModal.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
  showMobileAdminDropdown.value = false;
};

const toggleMobileAdminDropdown = () => {
  showMobileAdminDropdown.value = !showMobileAdminDropdown.value;
};

const isActive = (path: string) => route.path === path;

const userInitials = computed(() => {
  if (user?.firstName && user?.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  } else if (user?.firstName) {
    return user.firstName.substring(0, 2).toUpperCase();
  }
  return '';
});

const avatarStyle = computed(() => {
  const departmentName = user?.department?.name || user?.firstName || 'User';
  return getAvatarStyle(departmentName);
});

function playNotificationSound() {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play().catch((err) => {
    console.error('Failed to play notification sound:', err);
  });
}

// Close dropdown when clicking outside (for hover behavior, this helps with edge cases)
const handleClickOutside = (event: MouseEvent) => {
  if (adminDropdownRef.value && !adminDropdownRef.value.contains(event.target as Node)) {
    showAdminDropdown.value = false;
  }
};

const initializeTicketPolling = () => {
  // Only start polling if terms have been accepted
  if (userStore.user?.termsAccepted && userStore.user?.privacyPolicyAccepted) {
    ticketsStore.startPolling();
  }
};

const connectToNotificationStream = async () => {
  if (source.value) {
    console.log('Closing existing EventSource connection');
    source.value.close();
  }

  try {
    const response = await notificationService.getStreamTicket();
    const streamTicket = response.data.streamTicket;

    const streamUrl = `${import.meta.env.VITE_API_BASE_URL}/notifications/stream?streamTicket=${streamTicket}`;

    source.value = new EventSource(streamUrl);
    console.log('Connected to notification stream');

    source.value.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        // Handle Notification events
        if (payload?.type === 'notification') {
          if (payload.unreadCount !== undefined) {
            if (unreadCount.value !== undefined && payload.unreadCount > unreadCount.value) {
              playNotificationSound();
            }
            unreadCount.value = payload.unreadCount;
          }
        } else if (payload?.type === 'ticket_update' && payload.ticket) {
          const ticketsStore = useTicketsStore();
          ticketsStore.updateTicketInCollections(payload.ticket);

          // Record the update event to trigger UI silent refreshes
          ticketsStore.lastTicketUpdateEvent = {
            ticketId: payload.ticket.id,
            customId: payload.ticket.customId,
            timestamp: Date.now(),
          };

          if (
            ticketsStore.selectedTicket &&
            ticketsStore.selectedTicket.customId === payload.ticket.customId
          ) {
            ticketsStore.selectedTicket = payload.ticket;
          }
        }
      } catch (e) {
        console.error('Error parsing SSE event:', e);
      }
    };

    source.value.onerror = (err) => {
      console.error('SSE connection error:', err);
      source.value?.close();

      // Try to reconnect after 5 seconds
      if (reconnectionTimeout.value) clearTimeout(reconnectionTimeout.value);
      reconnectionTimeout.value = setTimeout(() => {
        connectToNotificationStream();
      }, 5000) as unknown as number;
    };
  } catch (err) {
    console.error('Error fetching stream ticket:', err);
    // Retry after 10 seconds if ticket request fails
    if (reconnectionTimeout.value) clearTimeout(reconnectionTimeout.value);
    reconnectionTimeout.value = setTimeout(() => {
      connectToNotificationStream();
    }, 10000) as unknown as number;
  }
};

// TODO: Refactor this
const isInitialized = ref(false);

const initializeDashboardFeatures = () => {
  if (isInitialized.value) return;

  if (userStore.user?.termsAccepted && userStore.user?.privacyPolicyAccepted) {
    isInitialized.value = true;
    fetchUnreadCount();
    initializeTicketPolling();
    connectToNotificationStream();
  }
};

watch(
  () => [userStore.user?.termsAccepted, userStore.user?.privacyPolicyAccepted, userStore.user?.id],
  () => {
    if (userStore.user) {
      initializeDashboardFeatures();
    }
  },
  { immediate: true },
);

onMounted(() => {
  initializeDashboardFeatures();

  // Keep a long polling as backup (10 minutes) for unread count consistency if connection drops
  notificationsIntervalId = setInterval(() => {
    if (userStore.user?.termsAccepted && userStore.user?.privacyPolicyAccepted) {
      fetchUnreadCount();
    }
  }, 180000) as unknown as number;

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (notificationsIntervalId) {
    clearInterval(notificationsIntervalId);
  }

  ticketsStore.stopPolling();

  if (source.value) {
    source.value.close();
  }

  if (reconnectionTimeout.value) {
    clearTimeout(reconnectionTimeout.value);
  }
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.notification-badge {
  @apply absolute -top-2 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-[15px] h-[15px] flex items-center justify-center font-bold min-w-[16px];
}

.menu-item-hover:hover {
  color: #001866;
}

.dark-mode .menu-item-hover:hover {
  color: var(--primary-color);
}

.admin-submenu-hover:hover {
  color: #001866;
}

.dark-mode .admin-submenu-hover:hover {
  color: var(--primary-color);
}

.admin-submenu-active {
  color: #003566;
}

.dark-mode .admin-submenu-active {
  color: var(--primary-color);
}

.nav-menu-item {
  height: calc(var(--header-height) - 2px);
  border-bottom: 2px solid transparent;
}

.menu-item-active {
  color: #003566;
  border-bottom: 2px solid #003566;
}

.dark-mode .menu-item-active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.dark-mode .menu-item-active:hover {
  color: #3b82f6;
}

.menu-item-active:hover {
  color: #003566;
}
</style>
