<template>
  <div>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header
        class="flex items-center justify-between p-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 sticky top-0 z-50 shadow-sm"
      >
        <div
          class="hidden md:flex items-center justify-center px-6 min-w-[150px] bg-gray-200 dark:bg-gray-900 h-full relative shadow-sm"
        >
          <img
            :src="userPreferencesStore.isDarkMode ? taskyWhiteLogo : taskyLogo"
            alt="Tasky Logo"
            class="w-[70px] h-[70px] block mx-auto relative top-2 object-contain"
          />
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden flex items-center justify-center w-12 h-12 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-4"
        >
          <font-awesome-icon icon="bars" class="text-xl" />
        </button>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex flex-1 ml-4">
          <nav>
            <ul class="flex items-center space-x-2">
              <router-link to="/">
                <li>
                  <div
                    :class="{ 'btn btn-primary text-white': isActive('/') }"
                    class="flex items-center px-4 py-2 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 whitespace-nowrap gap-2 menu-item-hover"
                  >
                    <font-awesome-icon icon="tachometer-alt-average" /> Dashboard
                  </div>
                </li>
              </router-link>
              <router-link v-if="user?.role.name !== RoleName.GlobalAdmin" to="/meus-tickets">
                <li>
                  <div
                    :class="{ 'btn btn-primary text-white': isActive('/meus-tickets') }"
                    class="flex items-center px-4 py-2 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 whitespace-nowrap gap-2 menu-item-hover"
                  >
                    <font-awesome-icon icon="ticket" />Tickets
                  </div>
                </li>
              </router-link>
              <router-link v-if="user?.role.name === RoleName.TenantAdmin" to="/admin/relatorios">
                <li>
                  <div
                    :class="{ 'btn btn-primary text-white': isActive('/admin/relatorios') }"
                    class="flex items-center px-4 py-2 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 whitespace-nowrap gap-2 menu-item-hover cursor-pointer"
                  >
                    <font-awesome-icon icon="chart-line" />
                    Relatórios
                  </div>
                </li>
              </router-link>

              <li
                v-if="
                  user?.role.name === RoleName.GlobalAdmin ||
                  user?.role.name === RoleName.TenantAdmin
                "
                class="relative"
                ref="adminDropdownRef"
              >
                <div
                  :class="{
                    'btn btn-primary text-white':
                      isActive('/admin/usuarios') ||
                      isActive('/admin/setores') ||
                      isActive('/admin/categorias') ||
                      isActive('/admin/clientes') ||
                      isActive('/admin/cadastros'),
                  }"
                  class="flex items-center px-4 py-2 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 whitespace-nowrap gap-2 menu-item-hover cursor-pointer"
                  @click="toggleAdminDropdown"
                >
                  <font-awesome-icon icon="cog" />
                  Administração
                  <font-awesome-icon
                    icon="chevron-down"
                    class="ml-2 transition-transform duration-200"
                    :class="{ 'rotate-180': showAdminDropdown }"
                  />
                </div>
                <div
                  v-show="showAdminDropdown"
                  class="absolute top-full left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[200px] z-50 mt-1 flex flex-col"
                >
                  <router-link
                    v-if="user?.role.name === RoleName.TenantAdmin"
                    to="/admin/usuarios"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="{ 'text-blue-600': isActive('/admin/usuarios') }"
                      class="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="users" />
                      Usuários
                    </div>
                  </router-link>
                  <router-link
                    v-if="user?.role.name === RoleName.TenantAdmin"
                    to="/admin/setores"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="{ 'text-blue-600': isActive('/admin/setores') }"
                      class="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="building" />
                      Setores
                    </div>
                  </router-link>
                  <router-link
                    v-if="user?.role.name === RoleName.TenantAdmin"
                    to="/admin/categorias"
                    @click="showAdminDropdown = false"
                  >
                    <div
                      :class="{ 'text-blue-600': isActive('/admin/categorias') }"
                      class="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="tag" />
                      Categorias
                    </div>
                  </router-link>
                  <router-link
                    to="/admin/clientes"
                    @click="showAdminDropdown = false"
                    v-if="user?.role.name === RoleName.GlobalAdmin"
                  >
                    <div
                      :class="{ 'text-blue-600': isActive('/admin/clientes') }"
                      class="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="building" />
                      Clientes
                    </div>
                  </router-link>
                  <router-link
                    to="/admin/cadastros"
                    @click="showAdminDropdown = false"
                    v-if="user?.role.name === RoleName.GlobalAdmin"
                  >
                    <div
                      :class="{ 'text-blue-600': isActive('/admin/cadastros') }"
                      class="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 no-underline transition-all duration-200 w-full text-left hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
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
          <button class="btn btn-primary flex items-center gap-2" @click="openTicketModal">
            <font-awesome-icon icon="plus" />
            <span class="hidden sm:inline">Novo Ticket</span>
          </button>

          <div
            class="text-gray-800 dark:text-gray-200 relative cursor-pointer ml-6"
            @click="toggleNotificationsModal"
          >
            <font-awesome-icon :icon="['far', 'bell']" class="text-xl" />
            <span v-if="unreadCount && unreadCount > 0" class="notification-badge">{{
              unreadCount
            }}</span>
          </div>

          <router-link
            to="/sync"
            class="hidden sm:flex text-slate-500 dark:text-slate-400 p-2 rounded cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
          >
            <div class="flex flex-col items-center gap-0.5">
              <font-awesome-icon icon="comments" />
              <span class="text-xs font-medium">Sync</span>
            </div>
          </router-link>

          <div
            class="flex items-center cursor-pointer text-gray-800 dark:text-gray-200 mr-4"
            @click="toggleProfileModal"
          >
            <div
              class="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white text-base font-bold"
            >
              <span>{{ userInitials }}</span>
            </div>
            <div class="ml-3 mr-3 hidden sm:block">
              <span class="text-gray-800 dark:text-gray-200 font-medium">{{
                user?.firstName
              }}</span>
              <font-awesome-icon icon="chevron-down" class="text-sm font-bold ml-2" />
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
          class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <img
            :src="userPreferencesStore.isDarkMode ? taskyWhiteLogo : taskyLogo"
            alt="Tasky Logo"
            class="w-12 h-12 object-contain"
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
                  :class="{ 'primary-gradient text-white': isActive('/') }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="tachometer-alt-average" />
                  Dashboard
                </div>
              </li>
            </router-link>
            <router-link
              v-if="user?.role.name !== RoleName.GlobalAdmin"
              to="/meus-tickets"
              @click="closeMobileMenu"
            >
              <li>
                <div
                  :class="{ 'primary-gradient text-white': isActive('/meus-tickets') }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="ticket" />
                  Tickets
                </div>
              </li>
            </router-link>
            <router-link
              v-if="user?.role.name === RoleName.TenantAdmin"
              to="/admin/relatorios"
              @click="closeMobileMenu"
            >
              <li>
                <div
                  :class="{ 'primary-gradient text-white': isActive('/admin/relatorios') }"
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover"
                >
                  <font-awesome-icon icon="chart-line" />
                  Relatórios
                </div>
              </li>
            </router-link>

            <!-- Mobile Admin Section -->
            <li
              v-if="
                user?.role.name === RoleName.GlobalAdmin || user?.role.name === RoleName.TenantAdmin
              "
            >
              <div
                :class="{
                  'primary-gradient text-white':
                    isActive('/admin/usuarios') ||
                    isActive('/admin/setores') ||
                    isActive('/admin/categorias') ||
                    isActive('/admin/clientes') ||
                    isActive('/admin/cadastros'),
                }"
                class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 menu-item-hover cursor-pointer"
                @click="toggleMobileAdminDropdown"
              >
                <font-awesome-icon icon="cog" />
                Administração
                <font-awesome-icon
                  icon="chevron-down"
                  class="ml-auto transition-transform duration-200"
                  :class="{ 'rotate-180': showMobileAdminDropdown }"
                />
              </div>
              <div v-show="showMobileAdminDropdown" class="ml-4 mt-2 space-y-1">
                <router-link
                  v-if="user?.role.name === RoleName.TenantAdmin"
                  to="/admin/usuarios"
                  @click="closeMobileMenu"
                >
                  <div
                    :class="{ 'text-blue-600': isActive('/admin/usuarios') }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="users" />
                    Usuários
                  </div>
                </router-link>
                <router-link
                  v-if="user?.role.name === RoleName.TenantAdmin"
                  to="/admin/setores"
                  @click="closeMobileMenu"
                >
                  <div
                    :class="{ 'text-blue-600': isActive('/admin/setores') }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="building" />
                    Setores
                  </div>
                </router-link>
                <router-link
                  v-if="user?.role.name === RoleName.TenantAdmin"
                  to="/admin/categorias"
                  @click="closeMobileMenu"
                >
                  <div
                    :class="{ 'text-blue-600': isActive('/admin/categorias') }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="tag" />
                    Categorias
                  </div>
                </router-link>
                <router-link
                  to="/admin/clientes"
                  @click="closeMobileMenu"
                  v-if="user?.role.name === RoleName.GlobalAdmin"
                >
                  <div
                    :class="{ 'text-blue-600': isActive('/admin/clientes') }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="building" />
                    Clientes
                  </div>
                </router-link>
                <router-link
                  to="/admin/cadastros"
                  @click="closeMobileMenu"
                  v-if="user?.role.name === RoleName.GlobalAdmin"
                >
                  <div
                    :class="{ 'text-blue-600': isActive('/admin/cadastros') }"
                    class="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-400 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <font-awesome-icon icon="user-plus" />
                    Cadastros
                  </div>
                </router-link>
              </div>
            </li>

            <!-- Mobile Sync Link -->
            <router-link to="/sync" @click="closeMobileMenu">
              <li>
                <div
                  class="flex items-center px-4 py-3 rounded text-gray-800 dark:text-gray-200 font-medium transition-all duration-200 gap-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <font-awesome-icon icon="comments" />
                  Sync
                </div>
              </li>
            </router-link>
          </ul>
        </nav>
      </div>

      <main class="py-2.5">
        <router-view />
      </main>
    </div>

    <NewTicketModal
      v-if="isTicketModalOpen"
      :isOpen="isTicketModalOpen"
      @close="closeTicketModal"
    />

    <ProfileModal
      v-if="showProfileModal"
      :showProfileModal="showProfileModal"
      @close="toggleProfileModal"
    />

    <NotificationsDropdown
      v-if="showNotificationsModal"
      :isOpen="showNotificationsModal"
      @close="toggleNotificationsModal"
      @notifications-read="fetchUnreadCount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NewTicketModal from '@/components/layout/NewTicketModal.vue';
import ProfileModal from '@/components/layout/ProfileModal.vue';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown.vue';
import { useUserStore } from '@/stores/user';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useTicketsStore } from '@/stores/tickets';
import { useRoute } from 'vue-router';
import { notificationService } from '@/services/notificationService';
import { RoleName } from '@/models';
import taskyLogo from '@/assets/images/tasky.png';
import taskyWhiteLogo from '@/assets/images/tasky-white-large.png';

const user = useUserStore().user;
const userPreferencesStore = useUserPreferencesStore();
const ticketsStore = useTicketsStore();
const route = useRoute();

const isTicketModalOpen = ref(false);
const showProfileModal = ref(false);
const showNotificationsModal = ref(false);
const unreadCount = ref<number | undefined>(undefined);
let notificationsIntervalId: number | null = null;
// let source: EventSource | null = null;

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

const toggleAdminDropdown = () => {
  showAdminDropdown.value = !showAdminDropdown.value;
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

function playNotificationSound() {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play().catch((err) => {
    console.error('Failed to play notification sound:', err);
  });
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (adminDropdownRef.value && !adminDropdownRef.value.contains(event.target as Node)) {
    showAdminDropdown.value = false;
  }
};

const initializeTicketPolling = () => {
  ticketsStore.startPolling();
};

onMounted(() => {
  fetchUnreadCount();

  initializeTicketPolling();

  //let's use a polling strategy for now
  notificationsIntervalId = setInterval(() => {
    fetchUnreadCount();
  }, 90000) as unknown as number;

  // source = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/notifications/stream/${user?.id}`);
  // source.onmessage = () => {
  //   playNotificationSound();
  //   fetchUnreadCount();
  //   toast.info('Nova notificação recebida.');
  // };

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (notificationsIntervalId) {
    clearInterval(notificationsIntervalId);
  }

  ticketsStore.stopPolling();

  // source?.close();
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.notification-badge {
  @apply absolute -top-2 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold min-w-[16px];
}

.menu-item-hover:hover {
  background: var(--button-primary-color);
  color: white;
}

.dark-mode .menu-item-hover:hover {
  background: var(--primary-dark);
  color: white;
}
</style>
