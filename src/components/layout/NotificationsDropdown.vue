<template>
  <div
    class="fixed inset-0 bg-transparent z-[999] pointer-events-auto"
    v-if="isOpen"
    @click="closeModal"
  >
    <div
      class="fixed top-[calc(var(--header-height)+4px)] right-5 w-[420px] bg-white dark:bg-gray-800 rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] z-[1000] overflow-hidden border border-gray-200 dark:border-gray-700"
      @click.stop
    >
      <div
        class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
      >
        <h2 class="text-base font-medium text-gray-900 dark:text-white m-0">Notificações</h2>
        <button
          class="bg-none border-none text-gray-500 dark:text-gray-400 cursor-pointer text-xl p-0 leading-none transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:scale-110 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <div class="p-0 text-center">
        <button
          v-if="notifications.some((n) => !n.read)"
          class="block w-full px-3 py-3 bg-gray-900 dark:bg-gray-600 border-none text-white text-sm font-medium cursor-pointer text-center transition-all duration-200 hover:bg-gray-700 dark:hover:bg-gray-500 hover:-translate-y-px active:translate-y-0 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 select-none"
          @click="markAllAsRead"
        >
          Marcar todas como lidas
        </button>

        <div v-if="isLoading" class="w-full py-10">
          <LoadingSpinner />
        </div>
        <div v-else class="max-h-[400px] overflow-y-auto overflow-x-hidden">
          <div
            v-for="notification in sortedNotifications"
            :key="notification.id"
            class="px-4 py-3 border-b border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-200 relative flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 hover:translate-x-0.5"
            :class="{
              'bg-blue-50/50 dark:bg-blue-900/10 border-l-[3px] border-l-blue-500':
                !notification.read,
            }"
            @click="fetchSelectedTicket(notification)"
          >
            <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-base">
              <font-awesome-icon
                :icon="getNotificationIcon(notification.type)"
                :class="{
                  'text-blue-500 dark:text-blue-400': notification.type === NotificationType.Open,
                  'text-cyan-500 dark:text-cyan-400':
                    notification.type === NotificationType.Comment,
                }"
              />
            </div>
            <div class="w-full flex justify-between gap-1">
              <div
                v-html="formatNotificationMessage(notification)"
                class="text-sm text-gray-900 dark:text-white m-0 leading-relaxed text-left"
              ></div>
              <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <font-awesome-icon :icon="['far', 'clock']" />
                {{ formatRelativeTime(notification.createdAt) }}
              </span>
            </div>
          </div>

          <div
            v-if="sortedNotifications.length === 0"
            class="px-4 py-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2"
          >
            <font-awesome-icon icon="bell-slash" size="lg" />
            <p class="text-sm m-0">Nenhuma notificação</p>
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
    } catch (err) {
      console.error(err);
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

const formatNotificationMessage = (notification: Notification) => {
  const userName = `<span class="font-medium text-gray-900 dark:text-gray-300">${notification.createdBy.firstName} ${notification.createdBy.lastName}</span>`;
  const ticketId = notification.resourceCustomId
    ? `<span class="font-medium text-gray-900 dark:text-gray-300">${notification.resourceCustomId.toString()}</span>`
    : `<span class="font-medium text-gray-900 dark:text-gray-300">${notification.resourceId.toString()}</span>`;

  return notification.message.replace('user', userName).replace('resource', ticketId);
};

onMounted(fetchNotifications);
</script>
