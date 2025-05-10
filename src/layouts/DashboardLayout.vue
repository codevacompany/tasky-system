<template>
  <div>
    <div class="admin-layout">
      <header class="main-header">
        <div class="header-logo">
          <img :src="darkMode ? taskyWhiteLogo : taskyLogo" alt="Tasky Logo" class="logo" />
        </div>

        <div class="header-nav">
          <nav class="main-nav">
            <ul>
              <router-link to="/">
                <li>
                  <div :class="{ active: isActive('/') }">
                    <font-awesome-icon icon="tachometer-alt-average" /> Dashboard
                  </div>
                </li>
              </router-link>
              <router-link to="/meus-tickets">
                <li>
                  <div :class="{ active: isActive('/meus-tickets') }">
                    <font-awesome-icon icon="ticket" />Tickets
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/relatorios">
                <li
                  v-if="
                    user?.role.name === RoleName.GlobalAdmin ||
                    user?.role.name === RoleName.TenantAdmin
                  "
                >
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/relatorios') }">
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
                class="dropdown"
              >
                <div
                  class="admin-menu-item"
                  :class="{
                    active:
                      isActive('/admin/usuarios') ||
                      isActive('/admin/setores') ||
                      isActive('/admin/categorias') ||
                      isActive('/admin/clientes'),
                  }"
                  @click="toggleAdminDropdown"
                >
                  <font-awesome-icon icon="cog" />
                  Administração
                  <font-awesome-icon
                    icon="chevron-down"
                    class="dropdown-icon"
                    :class="{ rotate: showAdminDropdown }"
                  />
                </div>
                <div class="dropdown-menu" v-show="showAdminDropdown">
                  <router-link to="/admin/usuarios" @click="showAdminDropdown = false">
                    <div class="dropdown-item" :class="{ active: isActive('/admin/usuarios') }">
                      <font-awesome-icon icon="users" />
                      Usuários
                    </div>
                  </router-link>
                  <router-link to="/admin/setores" @click="showAdminDropdown = false">
                    <div class="dropdown-item" :class="{ active: isActive('/admin/setores') }">
                      <font-awesome-icon icon="building" />
                      Setores
                    </div>
                  </router-link>
                  <router-link to="/admin/categorias" @click="showAdminDropdown = false">
                    <div class="dropdown-item" :class="{ active: isActive('/admin/categorias') }">
                      <font-awesome-icon icon="tag" />
                      Categorias
                    </div>
                  </router-link>
                  <router-link
                    to="/admin/clientes"
                    @click="showAdminDropdown = false"
                    v-if="user?.role.name === RoleName.GlobalAdmin"
                  >
                    <div class="dropdown-item" :class="{ active: isActive('/admin/clientes') }">
                      <font-awesome-icon icon="building" />
                      Clientes
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <div class="header-actions">
          <button class="btn btn-primary new-ticket-button" @click="openTicketModal">
            <font-awesome-icon icon="plus" />
            <p>Novo Ticket</p>
          </button>

          <div class="notification-icon" @click="toggleNotificationsModal">
            <font-awesome-icon :icon="['far', 'bell']" />
            <span v-if="unreadCount && unreadCount > 0" class="notification-badge">{{
              unreadCount
            }}</span>
          </div>

          <router-link to="/sync" class="sync-icon">
            <div class="sync-content">
              <font-awesome-icon icon="comments" />
              <span>Sync</span>
            </div>
          </router-link>

          <button class="dark-mode-toggle" @click="toggleDarkMode">
            <font-awesome-icon icon="moon" />
          </button>

          <div class="user-profile" @click="toggleProfileModal">
            <div class="profile-avatar">
              <span class="initials">{{ userInitials }}</span>
            </div>
            <div>
              <span class="user-name">{{ user?.firstName }}</span>
              <font-awesome-icon icon="chevron-down" />
            </div>
          </div>
        </div>
      </header>

      <main class="content">
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
import { useRoute } from 'vue-router';
import { notificationService } from '@/services/notificationService';
import { toast } from 'vue3-toastify';
import { RoleName } from '@/models';
import taskyLogo from '@/assets/images/tasky.png';
import taskyWhiteLogo from '@/assets/images/tasky-white-large.png';

const user = useUserStore().user;
const route = useRoute();

const isTicketModalOpen = ref(false);
const showProfileModal = ref(false);
const showNotificationsModal = ref(false);
const unreadCount = ref<number | undefined>(undefined);
let intervalId: number | null = null;
// let source: EventSource | null = null;

const darkMode = ref(localStorage.getItem('theme') === 'dark');

const showAdminDropdown = ref(false);

const fetchUnreadCount = async () => {
  try {
    const response = await notificationService.count();

    if (unreadCount.value !== undefined && response.data.count > unreadCount.value) {
      playNotificationSound();
    }
    unreadCount.value = response.data.count;
  } catch {
    toast.error('Erro ao carregar notificações. Tente novamente.');
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

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle('dark-mode', darkMode.value);
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
};

const toggleAdminDropdown = () => {
  showAdminDropdown.value = !showAdminDropdown.value;
};

const isActive = (path: string) => route.path === path;

const userInitials = computed(() => {
  if (user?.firstName && user?.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
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
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showAdminDropdown.value = false;
  }
};

onMounted(fetchUnreadCount);

onMounted(() => {
  // Sincroniza o estado inicial do modo escuro
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  }

  //let's use a polling strategy for now
  intervalId = setInterval(() => {
    fetchUnreadCount();
  }, 60000);

  // source = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/notifications/stream/${user?.id}`);
  // source.onmessage = () => {
  //   playNotificationSound();
  //   fetchUnreadCount();
  //   toast.info('Nova notificação recebida.');
  // };

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  // source?.close();
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.content {
  padding: 10px 0px;
}
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 8px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.dark-mode-toggle:hover {
  background-color: var(--hover-bg);
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  height: 65px;
  position: sticky;
  top: 0;
  z-index: 100;
}

body.dark-mode .main-header {
  background-color: #1a2233;
  border-bottom: 1px solid #2d3446;
}

.header-nav {
  flex: 1;
  margin-left: 1rem;
}

/* Ajustes de cores para o header */
.main-nav ul li div {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #1a2233;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  gap: 8px;
}

.main-nav ul li div:hover:not(.dropdown-menu *):not(.dropdown-menu),
.main-nav ul li div.active:not(.dropdown-menu *):not(.dropdown-menu) {
  background: var(--button-primary-color);
  color: #f8f9fa;
}

/* Botão primário com melhor contraste */
/* Estilo do botão no modo escuro */

/* Ajustes para elementos no header */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-icon {
  color: #1a2233;
  position: relative;
  cursor: pointer;
  margin-left: 1.4rem;
}

.notification-icon i {
  font-size: 1.2rem;
  color: #1a2233;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #1a2233;
  margin-right: 1rem;
}

.user-profile .user-name {
  margin: 0 0.5rem;
  color: #1a2233;
}

.user-profile i {
  font-size: 0.8rem;
  color: #1a2233;
}

.dark-mode-toggle {
  color: #1a2233;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dark-mode-toggle i {
  font-size: 1.2rem;
}

.new-ticket-button {
  gap: 8px;
}

/* Cores invertidas para o modo escuro */
body.dark-mode .notification-icon i,
body.dark-mode .user-profile,
body.dark-mode .user-profile .user-name,
body.dark-mode .user-profile i,
body.dark-mode .dark-mode-toggle,
body.dark-mode .theme-toggle {
  color: #f8f9fa;
}

/* Ajustes para o logo no header */
.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  min-width: 150px;
  background-color: #e8eaed;
  height: 100%;
  position: relative;
}

.header-logo .logo {
  width: 70px;
  height: 70px;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 7px;
  object-fit: contain;
}

body.dark-mode .header-logo {
  background-color: #111827;
}

.header-logo .logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a2233;
}

/* Cores inversas para o modo escuro */
body.dark-mode .header-logo .logo-text {
  color: #f8f9fa;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  font-weight: bold;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sync-icon {
  color: #64748b;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sync-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.sync-content span {
  font-size: 12px;
  font-weight: 500;
}

.sync-icon:hover {
  background-color: #f1f5f9;
  color: #4361ee;
}

:deep(body.dark-mode) {
  .sync-icon {
    color: #94a3b8;
  }

  .sync-icon:hover {
    background-color: #1e293b;
    color: #4361ee;
  }
}

.dropdown {
  position: relative;
}

.dropdown .admin-menu-item {
  cursor: pointer;
}

.dropdown-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
}

.dropdown-menu a {
  padding: 0;
  text-align: left;
  width: 100%;
}

.dropdown-menu a:hover {
  background-color: transparent;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  color: var(--primary-color);
}

.dropdown-item.active {
  color: var(--primary-color);
}

body.dark-mode .dropdown-menu {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
}

body.dark-mode .dropdown-item {
  color: var(--text-color-dark);
}

body.dark-mode .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--primary-color);
}
</style>
