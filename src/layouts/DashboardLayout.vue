<template>
  <div>
    <div class="admin-layout">
      <header class="main-header">
        <div class="header-logo">
          <img src="@/assets/images/tasky.png" alt="Tasky Logo" class="logo" />
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
                <li v-if="user?.isAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/relatorios') }">
                    <font-awesome-icon icon="chart-line" />
                    Relatórios
                  </div>
                </li>
              </router-link>

              <router-link to="/admin/usuarios">
                <li v-if="user?.isAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/usuarios') }">
                    <font-awesome-icon icon="users" />Usuários
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/setores">
                <li v-if="user?.isAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/setores') }">
                    <font-awesome-icon icon="building" /> Setores
                  </div>
                </li>
              </router-link>
              <router-link to="/admin/categorias">
                <li v-if="user?.isAdmin">
                  <div class="admin-menu-item" :class="{ active: isActive('/admin/categorias') }">
                    <font-awesome-icon icon="tag" /> Categorias
                  </div>
                </li>
              </router-link>
            </ul>
          </nav>
        </div>

        <div class="header-actions">
          <button class="header-action-btn" @click="openTicketModal">
            <font-awesome-icon icon="plus" />
            <span class="btn-text">Novo Ticket</span>
          </button>

          <div class="notification-icon" @click="toggleNotificationsModal">
            <font-awesome-icon :icon="['far', 'bell']" />
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </div>

          <!-- Dark Mode Toggle Button -->
          <button class="dark-mode-toggle" @click="toggleDarkMode">
            <font-awesome-icon icon="moon" />
          </button>

          <div class="user-profile" @click="toggleProfileModal">
            <img
              src="https://ui-avatars.com/api/?name=U&background=random&color=fff"
              alt="Perfil"
              class="user-avatar"
            />
            <span class="user-name">Usuário</span>
            <font-awesome-icon icon="chevron-down" />
          </div>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>

    <NewTicketModal :isOpen="isTicketModalOpen" @close="closeTicketModal" />

    <ProfileModal :showProfileModal="showProfileModal" @close="toggleProfileModal" />

    <NotificationsModal
      :showNotificationsModal="showNotificationsModal"
      @close="toggleNotificationsModal"
      @notifications-read="fetchUnreadCount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NewTicketModal from '@/components/layout/NewTicketModal.vue';
import ProfileModal from '@/components/layout/ProfileModal.vue';
import NotificationsModal from '@/components/layout/NotificationsModal.vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { notificationService } from '@/services/notificationService';

const user = useUserStore().user;
const route = useRoute();

const isTicketModalOpen = ref(false);
const showProfileModal = ref(false);
const showNotificationsModal = ref(false);
const unreadCount = ref(0);

// Fetch unread notifications count
const fetchUnreadCount = async () => {
  try {
    const response = await notificationService.fetch();
    unreadCount.value = response.data.filter((notification) => !notification.read).length;
  } catch (error) {
    console.error('Erro ao buscar notificações não lidas:', error);
  }
};

// Open and close ticket modal
const openTicketModal = () => {
  isTicketModalOpen.value = true;
};

const closeTicketModal = () => {
  isTicketModalOpen.value = false;
};

// Toggle profile modal visibility
const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value;
};

const toggleNotificationsModal = () => {
  showNotificationsModal.value = !showNotificationsModal.value;
};

// Dark mode toggle function
const toggleDarkMode = () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

const isActive = (path: string) => route.path === path;

// Fetch unread count when component mounts
onMounted(fetchUnreadCount);
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
  background-color: #1a2233;
  color: #f8f9fa;
}

/* Botão primário com melhor contraste */
.btn-primary {
  background-color: #1a2233;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background-color: #141b2a;
  color: #ffffff;
}

/* Estilo do botão no modo escuro */
body.dark-mode .btn-primary {
  background-color: #f8f9fa;
  color: #1a2233;
}

body.dark-mode .btn-primary:hover {
  background-color: #e8eaed;
  color: #1a2233;
}

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
  height: 70px;
  width: auto;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 7px;
}

.header-logo .logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a2233;
}

/* Cores inversas para o modo escuro */
body.dark-mode .header-logo {
  background-color: #2d3446;
}

body.dark-mode .header-logo .logo-text {
  color: #f8f9fa;
}
</style>
