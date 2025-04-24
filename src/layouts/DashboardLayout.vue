<template>
  <div>
    <div class="admin-layout">
      <header class="main-header">
        <div class="header-logo">
          <img 
            :src="darkMode ? taskyWhiteLogo : taskyLogo" 
            alt="Tasky Logo" 
            class="logo" 
          />
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
                <li v-if="user?.role.name === RoleName.GlobalAdmin || user?.role.name === RoleName.TenantAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/relatorios') }">
                    <font-awesome-icon icon="chart-line" />
                    Relatórios
                  </div>
                </li>
              </router-link>

              <router-link to="/admin/usuarios">
                <li v-if="user?.role.name === RoleName.GlobalAdmin || user?.role.name === RoleName.TenantAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/usuarios') }">
                    <font-awesome-icon icon="users" />Usuários
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/setores">
                <li v-if="user?.role.name === RoleName.GlobalAdmin || user?.role.name === RoleName.TenantAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/setores') }">
                    <font-awesome-icon icon="building" /> Setores
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/categorias">
                <li v-if="user?.role.name === RoleName.GlobalAdmin || user?.role.name === RoleName.TenantAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/categorias') }">
                    <font-awesome-icon icon="tag" /> Categorias
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/clientes">
                <li v-if="user?.role.name === RoleName.GlobalAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/clientes') }">
                    <font-awesome-icon icon="building" /> Clientes
                  </div>
                </li>
              </router-link>
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
            <span v-if="unreadCount && unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </div>

          <!-- Dark Mode Toggle Button -->
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

const fetchUnreadCount = async () => {
  try {
    const response = await notificationService.count();

    if (unreadCount.value !== undefined && response.data.count > unreadCount.value) {
      playNotificationSound()
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
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  // source?.close();
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

.main-nav ul li div:hover,
.main-nav ul li div.active {
  background-color: var(--button-primary-color);
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
</style>
