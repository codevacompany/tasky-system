<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="showProfileModal" class="backdrop" @click="closeModal"></div>

    <!-- Profile Modal/Dropdown -->
    <div v-if="showProfileModal" class="profile-dropdown" id="profileModal" @click.stop>
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <h2>Meu Perfil</h2>
          <button class="close-btn" @click="closeModal">
            <font-awesome-icon icon="times" size="lg" />
          </button>
        </div>
        <div class="modal-body">
          <div class="profile-header">
            <div class="profile-avatar">
              <span class="initials">{{ userInitials }}</span>
            </div>
            <div class="profile-info">
              <h3 class="user-name">{{ user?.firstName }} {{ user?.lastName }}</h3>
              <p class="user-info">{{ user?.department.name }}</p>
              <p class="user-info">{{ user?.email }}</p>
            </div>
          </div>

          <div class="form-actions right-aligned">
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
  width: 360px;
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
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-header .close-btn {
  color: var(--text-color);
  opacity: 0.8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.profile-dropdown .modal-header .close-btn:hover {
  opacity: 1;
}

.profile-dropdown .modal-body {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
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
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.user-info {
  font-size: 0.9rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.right-aligned {
  text-align: right;
}
</style>
