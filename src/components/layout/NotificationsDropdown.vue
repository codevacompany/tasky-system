<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Notificações</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="notifications-content">
        <button v-if="notifications.some(n => !n.read)" class="mark-all-btn" @click="markAllAsRead">
          Marcar todas como lidas
        </button>

        <div class="notifications-list">
          <div v-for="notification in sortedNotifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
            <div class="notification-icon">
              <font-awesome-icon :icon="getNotificationIcon(notification.type)" :class="getNotificationIconClass(notification.type)" />
            </div>
            <div class="notification-details">
              <p class="notification-text">{{ notification.message }}</p>
              <span class="notification-time">{{ formatRelativeTime(notification.createdAt) }}</span>
            </div>
          </div>

          <div v-if="sortedNotifications.length === 0" class="empty-notifications">
            <font-awesome-icon icon="bell-slash" size="lg" />
            <p>Nenhuma notificação</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/models';
import { NotificationType } from '@/models';
import { toast } from 'vue3-toastify';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const notifications = ref<Notification[]>([]);

const sortedNotifications = computed(() => {
  return [...notifications.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'Agora';
  }

  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes}min`;
  }

  if (diffInHours < 24) {
    return `Há ${diffInHours}h`;
  }

  if (diffInMonths < 12) {
    return `Há ${diffInMonths}m`;
  }

  return `Há ${diffInYears}a`;
};

const closeModal = () => {
  emit('close');
};

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
    await fetchNotifications();
    toast.success('Notificações marcadas como lidas.');
  } catch {
    toast.error('Erro ao marcar notificações como lidas.');
  }
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Open:
      return 'ticket';
    case NotificationType.Comment:
      return 'comment';
    default:
      return 'bell';
  }
};

const getNotificationIconClass = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Open:
      return 'icon-ticket';
    case NotificationType.Comment:
      return 'icon-comment';
    default:
      return '';
  }
};

onMounted(fetchNotifications);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
  pointer-events: auto;
}

.modal-content {
  position: fixed;
  top: calc(var(--header-height) + 4px);
  right: 20px;
  width: 360px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  line-height: 1;
}

.notifications-content {
  padding: 0;
}

.mark-all-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #212529;
  border: none;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.mark-all-btn:hover {
  background-color: #343a40;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification-item.unread {
  background-color: rgba(13, 110, 253, 0.05);
  border-left: 3px solid #0d6efd;
}

.notification-item.unread .notification-text {
  font-weight: 500;
}

.notification-item:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.close-btn, .mark-all-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #212529;
  transform: scale(1.1);
}

.mark-all-btn:hover {
  background-color: #343a40;
  transform: translateY(-1px);
}

.mark-all-btn:active {
  transform: translateY(0);
}

/* Melhorias de acessibilidade */
.close-btn:focus, .mark-all-btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

.close-btn, .mark-all-btn {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.icon-ticket {
  color: #0d6efd;
}

.icon-comment {
  color: #0dcaf0;
}

.notification-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.notification-text {
  font-size: 13px;
  color: #212529;
  margin: 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #6c757d;
}

.empty-notifications {
  padding: 24px 16px;
  text-align: center;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-notifications p {
  font-size: 13px;
  margin: 0;
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background-color: #212529;
  border: 1px solid #343a40;
}

:deep(body.dark-mode) .modal-header {
  background-color: #343a40;
  border-bottom-color: #495057;
}

:deep(body.dark-mode) .modal-header h2 {
  color: #f8f9fa;
}

:deep(body.dark-mode) .notification-item.unread {
  background-color: rgba(13, 110, 253, 0.1);
  border-left: 3px solid #0d6efd;
}

:deep(body.dark-mode) .notification-item:hover {
  background-color: #2c3237;
}

:deep(body.dark-mode) .close-btn:hover {
  color: #f8f9fa;
}

:deep(body.dark-mode) .notification-text {
  color: #f8f9fa;
}

:deep(body.dark-mode) .notification-time {
  color: #adb5bd;
}

:deep(body.dark-mode) .mark-all-btn {
  background-color: #495057;
}

:deep(body.dark-mode) .mark-all-btn:hover {
  background-color: #6c757d;
}

:deep(body.dark-mode) .icon-ticket {
  color: #3b82f6;
}

:deep(body.dark-mode) .icon-comment {
  color: #22d3ee;
}
</style>
