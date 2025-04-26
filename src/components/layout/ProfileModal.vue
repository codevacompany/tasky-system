<template>
  <Teleport to="body">
    <div v-if="showProfileModal" class="backdrop" @click="closeModal"></div>
    <div v-if="showProfileModal" class="profile-dropdown" id="profileModal" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="display: flex; align-items: center; gap: 8px">
            Meu Perfil
          </h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="profile-header">
            <div class="profile-avatar">
              <span class="initials">{{ userInitials }}</span>
            </div>
            <div class="profile-info">
              <h3 class="user-name">{{ user?.firstName }} {{ user?.lastName }}</h3>
              <p class="user-info">{{ user?.email }}</p>
              <p class="user-info">{{ user?.department.name }}</p>
            </div>
          </div>

          <div class="form-actions">
            <router-link
              to="/faq"
            >
            <button type="button" class="btn btn-secondary" @click="openSupport">
              <font-awesome-icon icon="question-circle" />
              Ajuda
            </button>
            </router-link>
            <button type="button" id="logoutBtn" class="btn btn-danger" @click="logout">
              <font-awesome-icon icon="sign-out-alt" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { authService } from '@/services/authService';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  showProfileModal: Boolean,
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const user = useUserStore().user;

const closeModal = () => {
  emit('close');
};

const logout = () => {
  authService.logout();
  router.push('/login');
};

const openSupport = () => {
  // Implementar lógica de suporte/ajuda
  console.log('Abrir suporte');
};

const userInitials = computed(() => {
  if (user?.firstName && user?.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  }
  return '';
});
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
  pointer-events: auto;
}

.profile-dropdown {
  position: fixed;
  top: calc(var(--header-height) + 4px);
  right: 20px;
  width: 280px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  pointer-events: auto;
  border: 1px solid var(--border-color);
}

.modal-content {
  width: 100%;
}

.modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.modal-header .close-btn {
  color: var(--text-color);
  opacity: 0.8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 1.5rem;
  line-height: 1;
}

.profile-dropdown .modal-header .close-btn:hover {
  opacity: 1;
}

.profile-dropdown .modal-body {
  padding: 1rem;
}

/* Modo escuro para o dropdown de perfil */
body.dark-mode .profile-dropdown {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

body.dark-mode .profile-dropdown .modal-header {
  border-bottom-color: var(--border-color);
  color: var(--text-color);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8b8b8b;
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.profile-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.profile-info .user-info {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
