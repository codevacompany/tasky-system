<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Notificações</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="notifications-content">
        <button
          v-if="notifications.some((n) => !n.read)"
          class="mark-all-btn"
          @click="markAllAsRead"
        >
          Marcar todas como lidas
        </button>

        <div v-if="isLoading" class="loading-wrapper">
          <LoadingSpinner />
        </div>
        <div v-else class="notifications-list">
          <div
            v-for="notification in sortedNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="fetchSelectedTicket(notification)"
          >
            <div class="notification-icon">
              <font-awesome-icon
                :icon="getNotificationIcon(notification.type)"
                :class="getNotificationIconClass(notification.type)"
              />
            </div>
            <div class="notification-details">
              <div v-html="formatNotificationMessage(notification)" class="notification-text"></div>
              <span class="notification-time">
                <font-awesome-icon :icon="['far', 'clock']" />
                {{ formatRelativeTime(notification.createdAt) }}</span
              >
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

  <TicketDetailsModal :isOpen="openTicket" :ticket="selectedTicket" @close="openTicket = false" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { notificationService } from '@/services/notificationService';
import type { Notification, Ticket } from '@/models';
import { NotificationType } from '@/models';
import { toast } from 'vue3-toastify';
import { formatRelativeTime } from '@/utils/date';
import TicketDetailsModal from '../tickets/TicketDetailsModal.vue';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import LoadingSpinner from '../common/LoadingSpinner.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'notifications-read'): void;
}>();

const notifications = ref<Notification[]>([]);

const openTicket = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const isLoading = ref(false);
const user = useUserStore().user;

const sortedNotifications = computed(() => {
  return [...notifications.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
});

const closeModal = () => {
  emit('close');
};

const fetchNotifications = async () => {
  isLoading.value = true;
  try {
    const response = await notificationService.getBytargetUser(user!.id);
    notifications.value = response.data.items;
    emit('notifications-read');
  } catch {
    toast.error('Erro ao carregar notificações. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const fetchSelectedTicket = async (notification: Notification) => {
  if (notification.resourceCustomId) {
    try {
      openTicket.value = true;
      const response = await ticketService.getById(notification.resourceCustomId);
      selectedTicket.value = response.data;
      notificationService.markAsRead(notification.id);
      await fetchNotifications();
    } catch(err) {
      console.error(err)
      toast.error('Erro ao carregar ticket.');
    }
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
      return 'comments';
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

const formatNotificationMessage = (notification: Notification) => {
  if (notification.resourceCustomId) {
    return `${notification.message.replace('user', notification.createdBy.firstName).replace('resource', notification.resourceCustomId.toString())}`;
  } else {
    return `${notification.message.replace('user', notification.createdBy.firstName).replace('resource', notification.resourceId.toString())}`;
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
  width: 420px;
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
  font-size: 16px;
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

.loading-wrapper {
  width: 100%;
  padding: 40px 0;
}

.notifications-content {
  padding: 0;
  text-align: center;
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
  overflow-x: hidden;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-item.unread {
  background-color: rgba(13, 110, 253, 0.05);
  border-left: 3px solid #0d6efd;
}

span {
  font-weight: 700;
  color: red
}

.notification-item:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.close-btn,
.mark-all-btn {
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
.close-btn:focus,
.mark-all-btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

.close-btn,
.mark-all-btn {
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.notification-text {
  font-size: 14px;
  color: #212529;
  margin: 0;
  line-height: 1.4;
  text-align: start;
}

.notification-time {
  font-size: 11px;
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
