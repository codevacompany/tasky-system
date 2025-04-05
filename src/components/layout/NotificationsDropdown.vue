<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Notificações</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="notifications-content">
        <button class="mark-all-btn" @click="markAllAsRead">
          <font-awesome-icon icon="check" />
          Marcar todas como lidas
        </button>

        <div class="notifications-list">
          <div v-for="notification in sortedNotifications" :key="notification.id" class="notification-item">
            <div class="notification-icon" :class="notification.type">
              <font-awesome-icon :icon="getNotificationIcon(notification.type)" />
            </div>
            <div class="notification-details">
              <div class="notification-row">
                <p class="notification-text">{{ notification.text }}</p>
                <span class="notification-time">{{ formatRelativeTime(notification.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

interface Notification {
  id: number;
  type: 'new_ticket' | 'update' | 'mention' | 'assigned';
  text: string;
  date: Date;
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'new_ticket',
    text: 'Novo ticket criado por Rayandson Silva',
    date: new Date('2025-03-27T08:17:00')
  },
  {
    id: 2,
    type: 'new_ticket',
    text: 'Novo ticket criado por Rayandson Silva',
    date: new Date('2025-03-28T09:22:00')
  },
  {
    id: 3,
    type: 'new_ticket',
    text: 'Novo ticket criado por Isaac Silva Jr',
    date: new Date('2025-03-28T09:23:00')
  },
  {
    id: 4,
    type: 'new_ticket',
    text: 'Novo ticket criado por Isaac Silva Jr',
    date: new Date('2025-03-30T22:41:00')
  }
]);

const sortedNotifications = computed(() => {
  return [...notifications.value]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
});

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'new_ticket':
      return 'ticket';
    case 'update':
      return 'sync';
    case 'mention':
      return 'at';
    case 'assigned':
      return 'user-plus';
    default:
      return 'bell';
  }
};

const formatRelativeTime = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const closeModal = () => {
  emit('close');
};

const markAllAsRead = () => {
  // Implementar lógica para marcar todas como lidas
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
  align-items: flex-start;
  padding-top: 60px;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
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

.notifications-content {
  padding: 8px;
}

.mark-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px;
  margin-bottom: 8px;
}

.mark-all-btn:hover {
  text-decoration: underline;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  border-radius: 4px;
  background: #f8fafc;
}

.notification-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.notification-details {
  flex: 1;
}

.notification-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.notification-text {
  font-size: 12px;
  color: #1a2233;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.notification-time {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
}

.notification-icon.new_ticket {
  background-color: #4f46e5;
}

.notification-icon.update {
  background-color: #0ea5e9;
}

.notification-icon.mention {
  background-color: #f59e0b;
}

.notification-icon.assigned {
  background-color: #10b981;
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

:deep(body.dark-mode) .notification-item {
  background: #1a2233;
}

:deep(body.dark-mode) .notification-text {
  color: #e2e8f0;
}

:deep(body.dark-mode) .notification-time {
  color: #94a3b8;
}
</style> 