<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div v-if="showNotificationsModal" class="backdrop" @click="closeModal"></div>

    <!-- Notifications Modal/Dropdown -->
    <div
      v-if="showNotificationsModal"
      class="notification-dropdown"
      id="notificationModal"
      @click.stop
    >
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <h2>Notificações</h2>
          <button class="close-btn" @click="closeModal">
            <font-awesome-icon icon="times" size="lg" />
          </button>
        </div>
        <div class="modal-body">
          <!-- Mark all as read button -->
          <button
            v-if="notifications.some((n) => !n.read)"
            class="mark-all-btn"
            @click="markAllAsRead"
          >
            Marcar todas como lidas
          </button>

          <div class="notifications-list" id="notificationList">
            <template v-if="notifications.length > 0">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.read }"
              >
                <font-awesome-icon icon="bell" size="lg" />
                <div class="notification-content">
                  <div class="notification-message">
                    {{ notification.message }}
                  </div>
                  <div class="notification-time">
                    {{ formatDate(notification.createdAt) }}
                  </div>
                </div>
              </div>
            </template>

            <div v-else class="notification-empty">
              <font-awesome-icon icon="bell-slash" size="2x" />
              <p>Você não tem novas notificações</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/models';
import { toast } from 'vue3-toastify';

defineProps({
  showNotificationsModal: Boolean,
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const notifications = ref<Notification[]>([]);

const fetchNotifications = async () => {
  try {
    const response = await notificationService.fetch();
    notifications.value = response.data;
  } catch {
    toast.error('Erro ao carregar notificações. Tente novamente.');
  }
};

const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead();
    notifications.value.forEach((notification) => (notification.read = true));
    toast.success('Notificações marcadas como lidas.');
  } catch {
    toast.error('Erro ao marcar notificações como lidas.');
  }
};

const closeModal = () => {
  emit('close');
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

// Fetch notifications when the component is mounted
onMounted(fetchNotifications);
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent; /* Semi-transparent black */
  z-index: 999; /* Behind the modal */
  pointer-events: auto;
}

/* notification Dropdown */
.notification-dropdown {
  position: fixed;
  top: calc(var(--header-height) + 4px);
  right: 100px;
  width: 440px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  pointer-events: auto; /* Changed from 'none' to 'auto' */
  border: 1px solid var(--border-color);
}

.modal-content {
  width: 100%;
}

.modal-header {
  width: 100%;
  padding: 1.3rem 1.2rem;
  border-bottom: 1px solid var(--border-color);
  background-color: #f5f5f5;
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

.modal-header .close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

#notificationsModal .modal-content {
  width: 450px;
  max-width: 100%;
  max-height: 600px;
}

.notifications-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 0 1rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.notifications-list {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 0.8rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  gap: 1rem;
  align-items: center;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.notification-item.unread {
  background-color: rgba(37, 99, 235, 0.05);
  border-left: 3px solid var(--primary-color);
}

.notification-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--text-color);
}

.notification-message {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.notification-time {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
  gap: 0.3rem;
}

.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-light);
}

.notification-empty i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notification-empty p {
  font-size: 1rem;
}

/* Efeitos de Animação */
.notification-item.fade-out {
  animation: fadeOut 0.3s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(10px);
  }
}

/* Scrollbar Personalizada */
.notifications-list::-webkit-scrollbar {
  width: 5px;
}

.notifications-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Tipos de Notificação */
.notification-item i.fa-ticket-alt {
  color: var(--primary-color);
}

.notification-item i.fa-comment-alt {
  color: var(--info-color);
}

.notification-item i.fa-user-check {
  color: var(--success-color);
}

.notification-item i.fa-exchange-alt {
  color: var(--warning-color);
}

.notification-item i.fa-clock {
  color: var(--danger-color);
}

.mark-all-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
  width: 100%;
}

.mark-all-btn:hover {
  background-color: #0056b3;
}

/* Responsividade */
@media (max-width: 576px) {
  #notificationsModal .modal-content {
    width: 95%;
    margin: 0 auto;
  }

  .notification-item {
    padding: 0.8rem;
  }

  .notification-title {
    font-size: 0.95rem;
  }

  .notification-message {
    font-size: 0.85rem;
  }
}
</style>
