import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Ticket } from '@/models';
import { DefaultTicketStatus } from '@/models';
import { ticketService } from '@/services/ticketService';
import { useTicketsStore } from '@/stores/tickets';
import { useUserStore } from '@/stores/user';
import { debounce, getDeadlineInfo } from '@/utils/generic-helper';

export type HomeActionKind = 'corrigir' | 'aceitar' | 'revisar' | 'continuar';
export type HomeDeadlineUrgency = 'overdue' | 'soon' | 'verification_late';

export interface HomeActionItem {
  ticket: Ticket;
  kind: HomeActionKind;
}

export interface HomeDeadlineItem {
  ticket: Ticket;
  urgency: HomeDeadlineUrgency;
  label: string;
}

const ACTION_ORDER: Record<HomeActionKind, number> = {
  corrigir: 0,
  aceitar: 1,
  revisar: 2,
  continuar: 3,
};

const DEADLINE_ORDER: Record<HomeDeadlineUrgency, number> = {
  overdue: 0,
  soon: 1,
  verification_late: 2,
};

const TERMINAL_STATUSES = new Set([
  DefaultTicketStatus.Completed,
  DefaultTicketStatus.Canceled,
  DefaultTicketStatus.Rejected,
]);

const VERIFICATION_STATUSES = new Set([
  DefaultTicketStatus.AwaitingVerification,
  DefaultTicketStatus.UnderVerification,
]);

const MS_PER_HOUR = 1000 * 60 * 60;
const ACTION_DISPLAY_LIMIT = 6;
const DEADLINE_DISPLAY_LIMIT = 5;

function getTicketStatus(ticket: Ticket): string {
  return ticket.ticketStatus?.key || ticket.status || '';
}

function getActionKind(ticket: Ticket, userId: number): HomeActionKind | null {
  const status = getTicketStatus(ticket);
  if (TERMINAL_STATUSES.has(status as DefaultTicketStatus)) return null;

  const isTarget = ticket.currentTargetUserId === userId;
  const isReviewer = ticket.reviewer?.id === userId;

  if (isTarget) {
    if (status === DefaultTicketStatus.Returned) return 'corrigir';
    if (status === DefaultTicketStatus.Pending) return 'aceitar';
    if (VERIFICATION_STATUSES.has(status as DefaultTicketStatus) && isReviewer) return 'revisar';
    if (!VERIFICATION_STATUSES.has(status as DefaultTicketStatus)) return 'continuar';
    return null;
  }

  if (isReviewer && VERIFICATION_STATUSES.has(status as DefaultTicketStatus)) {
    return 'revisar';
  }

  return null;
}

function mergeTickets(lists: Ticket[][]): Ticket[] {
  const byCustomId = new Map<string, Ticket>();
  for (const list of lists) {
    for (const ticket of list) {
      if (!ticket.customId) continue;
      byCustomId.set(ticket.customId, ticket);
    }
  }
  return [...byCustomId.values()];
}

export function useHomeDashboardWidgets() {
  const userStore = useUserStore();
  const ticketsStore = useTicketsStore();
  const router = useRouter();
  const route = useRoute();

  const tickets = ref<Ticket[]>([]);
  const isLoading = ref(true);

  const actionItems = computed<HomeActionItem[]>(() => {
    const userId = userStore.user?.id;
    if (!userId) return [];

    return tickets.value
      .map((ticket) => {
        const kind = getActionKind(ticket, userId);
        return kind ? { ticket, kind } : null;
      })
      .filter((item): item is HomeActionItem => item !== null)
      .sort((a, b) => {
        const kindDiff = ACTION_ORDER[a.kind] - ACTION_ORDER[b.kind];
        if (kindDiff !== 0) return kindDiff;
        return new Date(b.ticket.updatedAt).getTime() - new Date(a.ticket.updatedAt).getTime();
      });
  });

  const displayedActionItems = computed(() => actionItems.value.slice(0, ACTION_DISPLAY_LIMIT));

  const deadlineItems = computed<HomeDeadlineItem[]>(() => {
    const items: HomeDeadlineItem[] = [];

    for (const { ticket, kind } of actionItems.value) {
      if (ticket.dueAt) {
        const info = getDeadlineInfo(ticket.dueAt);
        if (info.isValid && info.isOverdue) {
          items.push({ ticket, urgency: 'overdue', label: info.message });
          continue;
        }
        if (info.isValid && info.businessDaysRemaining <= 3) {
          items.push({ ticket, urgency: 'soon', label: info.message });
          continue;
        }
      }

      if (kind === 'revisar' && ticket.updatedAt) {
        const hoursWaiting = (Date.now() - new Date(ticket.updatedAt).getTime()) / MS_PER_HOUR;
        if (hoursWaiting >= 24) {
          const days = Math.floor(hoursWaiting / 24);
          const label =
            days <= 1 ? 'Verificação há 1 dia' : `Verificação há ${days} dias`;
          items.push({ ticket, urgency: 'verification_late', label });
        }
      }
    }

    return items.sort((a, b) => {
      const urgencyDiff = DEADLINE_ORDER[a.urgency] - DEADLINE_ORDER[b.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      const aDue = a.ticket.dueAt ? new Date(a.ticket.dueAt).getTime() : Number.POSITIVE_INFINITY;
      const bDue = b.ticket.dueAt ? new Date(b.ticket.dueAt).getTime() : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    });
  });

  const displayedDeadlineItems = computed(() =>
    deadlineItems.value.slice(0, DEADLINE_DISPLAY_LIMIT),
  );

  async function load(silent = false) {
    const user = userStore.user;
    if (!user?.id || !user.termsAccepted || !user.privacyPolicyAccepted) {
      isLoading.value = false;
      return;
    }

    if (!silent) {
      isLoading.value = true;
    }
    try {
      const params = { paginated: false, limit: 100 };
      const [received, created] = await Promise.all([
        ticketService.getReceivedTickets(user.id, params),
        ticketService.getByRequester(user.id, params),
      ]);
      tickets.value = mergeTickets([received.data.items, created.data.items]);
    } catch (error) {
      console.error('Error loading home dashboard widgets:', error);
      if (!silent) {
        tickets.value = [];
      }
    } finally {
      isLoading.value = false;
    }
  }

  function openTicket(ticket: Ticket) {
    if (!ticket.customId) return;
    const isOnTicketsPage = route.path === '/minhas-tarefas';
    const query = isOnTicketsPage
      ? { ...route.query, ticket: ticket.customId }
      : { tab: 'recebidas', ticket: ticket.customId };

    router.push({ path: '/minhas-tarefas', query });
  }

  const loadDebounced = debounce(() => {
    void load(true);
  }, 400);

  watch(
    () => ticketsStore.lastTicketUpdateEvent,
    (event) => {
      if (!event) return;
      loadDebounced();
    },
  );

  onMounted(() => {
    void load();
  });

  return {
    isLoading,
    actionItems,
    displayedActionItems,
    deadlineItems,
    displayedDeadlineItems,
    openTicket,
  };
}
