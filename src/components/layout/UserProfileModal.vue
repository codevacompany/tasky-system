<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Meu Perfil</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="profile-content">
        <div class="profile-info">
          <div class="avatar">
            IJ
          </div>
          <div class="user-details">
            <h3>Isaac Silva Jr</h3>
            <p class="email">isaac@tasky.com</p>
            <p class="department">Diretoria</p>
          </div>
        </div>

        <button class="logout-btn" @click="handleLogout">
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userStore = useUserStore();
const router = useRouter();

const closeModal = () => {
  emit('close');
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 250px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 14px;
  font-weight: 500;
  color: #1a2233;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.profile-content {
  padding: 12px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  font-size: 13px;
  font-weight: 500;
  color: #1a2233;
  margin: 0 0 2px 0;
}

.user-details .email,
.user-details .department {
  font-size: 11px;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
}

.logout-btn {
  width: auto;
  padding: 4px 16px;
  background-color: #f43f5e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;
  display: block;
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background: #141b2a;
}

:deep(body.dark-mode) .modal-header {
  border-bottom-color: #2d3748;
}

:deep(body.dark-mode) .modal-header h2 {
  color: #e2e8f0;
}

:deep(body.dark-mode) .close-btn {
  color: #94a3b8;
}

:deep(body.dark-mode) .user-details h3 {
  color: #e2e8f0;
}

:deep(body.dark-mode) .user-details .email,
:deep(body.dark-mode) .user-details .department {
  color: #94a3b8;
}
</style> 