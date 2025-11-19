<template>
  <div class="fixed inset-0 bg-transparent z-[999] pointer-events-auto" @click="closeModal">
    <div
      class="fixed top-[calc(var(--header-height)+4px)] right-5 w-[90vw] sm:w-[420px] bg-white dark:bg-gray-800 rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] z-[1000] overflow-hidden border border-gray-200 dark:border-gray-700"
      @click.stop
    >
      <div
        class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
      >
        <h2 class="text-base font-medium text-gray-900 dark:text-white m-0">Notificações</h2>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-600 dark:text-gray-400"
            >Mostrar apenas itens não lidos</span
          >
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="showOnlyUnread" class="sr-only peer" />
            <div
              class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-gray-500 peer-checked:bg-green-600 dark:peer-checked:bg-green-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed flex items-center"
            >
              <font-awesome-icon
                v-if="showOnlyUnread"
                icon="check"
                class="absolute left-[5px] text-white text-[8px] z-10 pointer-events-none"
              />
            </div>
          </label>
        </div>
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
        <div
          v-else
          ref="scrollContainer"
          class="max-h-[400px] overflow-y-auto overflow-x-hidden"
          @scroll="handleScroll"
        >
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

          <div v-if="isLoadingMore" class="px-4 py-4 flex justify-center items-center">
            <LoadingSpinner :size="20" />
          </div>

          <div
            v-if="!hasMore && sortedNotifications.length > 0"
            class="px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400"
          >
            Todas as notificações foram carregadas
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/models';
import { NotificationType } from '@/models';
import { toast } from 'vue3-toastify';
import { formatRelativeTime } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import { localStorageService } from '@/utils/localStorageService';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'notifications-read'): void;
}>();

const router = useRouter();
const route = useRoute();
const notifications = ref<Notification[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

const isLoading = ref(false);
const isLoadingMore = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const showOnlyUnread = ref(localStorageService.getNotificationsShowOnlyUnread());
const hasMore = computed(() => currentPage.value < totalPages.value);
const user = useUserStore().user;

const NOTIFICATIONS_PER_PAGE = 10;

const sortedNotifications = computed(() => {
  let filtered = [...notifications.value];

  if (showOnlyUnread.value) {
    filtered = filtered.filter((n) => !n.read);
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const closeModal = () => {
  emit('close');
};

const fetchNotifications = async (page: number = 1, append: boolean = false) => {
  if (append) {
    isLoadingMore.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    const response = await notificationService.getBytargetUser(user!.id, {
      page,
      limit: NOTIFICATIONS_PER_PAGE,
    });

    if (append) {
      notifications.value = [...notifications.value, ...response.data.items];
    } else {
      notifications.value = response.data.items;
    }

    currentPage.value = response.data.page;
    totalPages.value = response.data.totalPages;

    if (!append) {
      emit('notifications-read');
    }
  } catch {
    toast.error('Erro ao carregar notificações. Tente novamente.');
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value || isLoading.value) {
    return;
  }

  await fetchNotifications(currentPage.value + 1, true);
};

const handleScroll = () => {
  if (!scrollContainer.value || isLoadingMore.value || !hasMore.value) {
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  const threshold = 100; // Load more when 100px from bottom

  if (scrollHeight - scrollTop - clientHeight < threshold) {
    loadMore();
  }
};

const fetchSelectedTicket = async (notification: Notification) => {
  if (notification.resourceCustomId) {
    try {
      // Mark notification as read
      await notificationService.markAsRead(notification.id);
      
      // Close the notifications dropdown
      closeModal();
      
      // Navigate to tickets page with the ticket customId in the URL
      // Preserve current query params if already on tickets page, otherwise use default tab
      const isOnTicketsPage = route.path === '/meus-tickets';
      const query = isOnTicketsPage
        ? { ...route.query, ticket: notification.resourceCustomId }
        : { tab: 'recebidos', ticket: notification.resourceCustomId };
      
      router.push({
        path: '/meus-tickets',
        query,
      });
      
      // Refresh notifications to update the read status
      currentPage.value = 1;
      await fetchNotifications(1, false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar ticket.');
    }
  }
};

const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead();
    // Reset to first page when refreshing
    currentPage.value = 1;
    await fetchNotifications(1, false);
  } catch {
    toast.error('Erro inesperado. Tente novamente.');
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

// Watch for changes to showOnlyUnread and save to localStorage
watch(showOnlyUnread, (newValue) => {
  localStorageService.setNotificationsShowOnlyUnread(newValue);
});

onMounted(() => {
  fetchNotifications();
});

onBeforeUnmount(() => {
  // Cleanup if needed
});
</script>
