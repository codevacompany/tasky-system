import { ref, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { toast } from 'vue-sonner';
import type { Ticket } from '@/models';
import { DefaultTicketStatus } from '@/models';
import { ticketService } from '@/services/ticketService';

type TicketsTab = 'recebidas' | 'criadas' | 'setor' | 'gerais';

type TicketStoreApi = {
  getTicketById: (id: string) => Ticket | undefined;
  fetchTicketDetails: (id: string) => Promise<Ticket>;
};

type Params = {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  activeTab: Ref<TicketsTab>;
  userId: Ref<number | null | undefined>;
  ticketStoreApi: TicketStoreApi;
  fetchTicketsWithFilters: () => Promise<void>;
};

export function useTicketModalGates({
  route,
  router,
  activeTab,
  userId,
  ticketStoreApi,
  fetchTicketsWithFilters,
}: Params) {
  const selectedTicketCustomId = ref<string | null>(null);
  const isResolvingTicketQuery = ref(false);

  const showReturnedCorrectionGate = ref(false);
  const pendingReturnedTicketCustomId = ref<string | null>(null);
  const returnedCorrectionGateLoading = ref(false);

  const showPendingAcceptanceGate = ref(false);
  const pendingAcceptTicketForGate = ref<Ticket | null>(null);
  const pendingAcceptanceLoading = ref(false);
  const showPendingDueDateModal = ref(false);
  const pendingAcceptDueDateValue = ref<string | null>(null);
  const pendingAcceptDueDateDate = ref<Date | null>(null);
  const pendingAcceptDueDateLoading = ref(false);

  const showAwaitingVerificationGate = ref(false);
  const pendingVerificationTicketCustomId = ref<string | null>(null);
  const awaitingVerificationGateLoading = ref(false);

  function getTicketStatus(ticket: Ticket): string {
    return ticket.ticketStatus?.key || ticket.status || '';
  }

  function resetPendingAcceptFlow() {
    showPendingAcceptanceGate.value = false;
    pendingAcceptTicketForGate.value = null;
    pendingAcceptanceLoading.value = false;
    showPendingDueDateModal.value = false;
    pendingAcceptDueDateValue.value = null;
    pendingAcceptDueDateDate.value = null;
    pendingAcceptDueDateLoading.value = false;
  }

  function resetAwaitingVerificationGateFlow() {
    showAwaitingVerificationGate.value = false;
    pendingVerificationTicketCustomId.value = null;
    awaitingVerificationGateLoading.value = false;
  }

  const closeTicketModal = () => {
    selectedTicketCustomId.value = null;
    showReturnedCorrectionGate.value = false;
    pendingReturnedTicketCustomId.value = null;
    resetPendingAcceptFlow();
    resetAwaitingVerificationGateFlow();
    const query = { ...route.query };
    delete query.ticket;
    router.push({ query });
  };

  let syncTicketRouteSeq = 0;

  const syncTicketModalFromRoute = async () => {
    const seq = ++syncTicketRouteSeq;
    const rawId = route.query.ticket;
    const id = typeof rawId === 'string' && rawId ? rawId : undefined;

    if (!id) {
      if (seq !== syncTicketRouteSeq) return;
      selectedTicketCustomId.value = null;
      showReturnedCorrectionGate.value = false;
      pendingReturnedTicketCustomId.value = null;
      resetPendingAcceptFlow();
      resetAwaitingVerificationGateFlow();
      isResolvingTicketQuery.value = false;
      return;
    }

    const uid = userId.value;
    if (uid == null) {
      if (seq !== syncTicketRouteSeq) return;
      selectedTicketCustomId.value = null;
      showReturnedCorrectionGate.value = false;
      pendingReturnedTicketCustomId.value = null;
      resetPendingAcceptFlow();
      resetAwaitingVerificationGateFlow();
      isResolvingTicketQuery.value = false;
      return;
    }

    let ticket = ticketStoreApi.getTicketById(id);
    if (!ticket) {
      isResolvingTicketQuery.value = true;
      try {
        const { data } = await ticketService.getById(id);
        if (seq !== syncTicketRouteSeq) return;
        ticket = data;
      } catch {
        if (seq !== syncTicketRouteSeq) return;
        isResolvingTicketQuery.value = false;
        toast.error('Tarefa não encontrada');
        closeTicketModal();
        return;
      } finally {
        if (seq === syncTicketRouteSeq) isResolvingTicketQuery.value = false;
      }
    }

    if (seq !== syncTicketRouteSeq || !ticket) return;

    const status = getTicketStatus(ticket);
    const needsCorrectionGate =
      status === DefaultTicketStatus.Returned &&
      uid === ticket.currentTargetUserId &&
      activeTab.value !== 'setor';

    if (needsCorrectionGate) {
      resetPendingAcceptFlow();
      resetAwaitingVerificationGateFlow();
      pendingReturnedTicketCustomId.value = id;
      showReturnedCorrectionGate.value = true;
      selectedTicketCustomId.value = null;
      return;
    }

    const needsPendingAcceptanceGate =
      status === DefaultTicketStatus.Pending &&
      uid === ticket.currentTargetUserId &&
      activeTab.value !== 'setor';

    if (needsPendingAcceptanceGate) {
      showReturnedCorrectionGate.value = false;
      pendingReturnedTicketCustomId.value = null;
      resetAwaitingVerificationGateFlow();
      pendingAcceptTicketForGate.value = ticket;
      showPendingAcceptanceGate.value = true;
      showPendingDueDateModal.value = false;
      pendingAcceptDueDateValue.value = null;
      pendingAcceptDueDateDate.value = null;
      selectedTicketCustomId.value = null;
      return;
    }

    const reviewerId = ticket.reviewer?.id;
    const tabAllowsReviewerVerificationGate =
      activeTab.value === 'recebidas' ||
      activeTab.value === 'criadas' ||
      activeTab.value === 'gerais';

    const needsAwaitingVerificationGate =
      status === DefaultTicketStatus.AwaitingVerification &&
      reviewerId != null &&
      uid === reviewerId &&
      tabAllowsReviewerVerificationGate;

    if (needsAwaitingVerificationGate) {
      showReturnedCorrectionGate.value = false;
      pendingReturnedTicketCustomId.value = null;
      resetPendingAcceptFlow();
      pendingVerificationTicketCustomId.value = id;
      showAwaitingVerificationGate.value = true;
      selectedTicketCustomId.value = null;
      return;
    }

    showReturnedCorrectionGate.value = false;
    pendingReturnedTicketCustomId.value = null;
    resetPendingAcceptFlow();
    resetAwaitingVerificationGateFlow();
    selectedTicketCustomId.value = id;
  };

  const confirmReturnedCorrectionFromPage = async () => {
    const id = pendingReturnedTicketCustomId.value;
    if (!id) return;
    returnedCorrectionGateLoading.value = true;
    try {
      await ticketService.updateStatus(id, { status: DefaultTicketStatus.InProgress });
      toast.success('Correção iniciada com sucesso');
      await ticketStoreApi.fetchTicketDetails(id);
      await fetchTicketsWithFilters();
      showReturnedCorrectionGate.value = false;
      pendingReturnedTicketCustomId.value = null;
      selectedTicketCustomId.value = id;
    } catch {
      toast.error('Erro ao iniciar correção');
    } finally {
      returnedCorrectionGateLoading.value = false;
    }
  };

  const cancelReturnedCorrectionFromPage = () => {
    showReturnedCorrectionGate.value = false;
    pendingReturnedTicketCustomId.value = null;
    closeTicketModal();
  };

  const confirmAwaitingVerificationFromPage = async () => {
    const id = pendingVerificationTicketCustomId.value;
    if (!id) return;
    awaitingVerificationGateLoading.value = true;
    try {
      await ticketService.updateStatus(id, { status: DefaultTicketStatus.UnderVerification });
      toast.success('Verificação iniciada');
      await ticketStoreApi.fetchTicketDetails(id);
      await fetchTicketsWithFilters();
      showAwaitingVerificationGate.value = false;
      pendingVerificationTicketCustomId.value = null;
      selectedTicketCustomId.value = id;
    } catch {
      toast.error('Erro ao iniciar verificação');
    } finally {
      awaitingVerificationGateLoading.value = false;
    }
  };

  const cancelAwaitingVerificationFromPage = () => {
    closeTicketModal();
  };

  const disabledWeekendDateForPendingAccept = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const parsePendingAcceptDateTime = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hours, 10),
        parseInt(minutes, 10),
      );
    } catch {
      return null;
    }
  };

  function onPendingAcceptDateChange(value: unknown) {
    if (value && typeof value === 'string') {
      pendingAcceptDueDateValue.value = value;
      pendingAcceptDueDateDate.value = parsePendingAcceptDateTime(value);
    } else {
      pendingAcceptDueDateValue.value = null;
      pendingAcceptDueDateDate.value = null;
    }
  }

  const cancelPendingAcceptanceFromPage = () => {
    closeTicketModal();
  };

  const confirmPendingAcceptanceFromPage = async () => {
    const ticket = pendingAcceptTicketForGate.value;
    if (!ticket) return;

    if (!ticket.dueAt) {
      showPendingAcceptanceGate.value = false;
      pendingAcceptDueDateValue.value = null;
      pendingAcceptDueDateDate.value = null;
      showPendingDueDateModal.value = true;
      return;
    }

    pendingAcceptanceLoading.value = true;
    try {
      await ticketService.accept(ticket.customId);
      toast.success('Tarefa aceita com sucesso');
      await ticketStoreApi.fetchTicketDetails(ticket.customId);
      await fetchTicketsWithFilters();
      showPendingAcceptanceGate.value = false;
      pendingAcceptTicketForGate.value = null;
      selectedTicketCustomId.value = ticket.customId;
    } catch {
      toast.error('Erro ao aceitar a tarefa');
    } finally {
      pendingAcceptanceLoading.value = false;
    }
  };

  const cancelPendingDueDateFromPage = () => {
    closeTicketModal();
  };

  const confirmPendingDueDateFromPage = async () => {
    const ticket = pendingAcceptTicketForGate.value;
    if (!pendingAcceptDueDateValue.value || !ticket) return;

    pendingAcceptDueDateLoading.value = true;
    try {
      const dueAtISO = pendingAcceptDueDateDate.value
        ? pendingAcceptDueDateDate.value.toISOString()
        : null;
      if (!dueAtISO) {
        toast.error('Data inválida');
        return;
      }
      await ticketService.update(ticket.customId, { dueAt: dueAtISO });
      await ticketService.accept(ticket.customId);
      toast.success('Tarefa aceita com sucesso');
      showPendingDueDateModal.value = false;
      pendingAcceptDueDateValue.value = null;
      pendingAcceptDueDateDate.value = null;
      pendingAcceptTicketForGate.value = null;
      showPendingAcceptanceGate.value = false;
      await ticketStoreApi.fetchTicketDetails(ticket.customId);
      await fetchTicketsWithFilters();
      selectedTicketCustomId.value = ticket.customId;
    } catch {
      toast.error('Erro ao definir prazo e aceitar tarefa');
    } finally {
      pendingAcceptDueDateLoading.value = false;
    }
  };

  return {
    selectedTicketCustomId,
    isResolvingTicketQuery,
    showReturnedCorrectionGate,
    returnedCorrectionGateLoading,
    showPendingAcceptanceGate,
    pendingAcceptanceLoading,
    showPendingDueDateModal,
    pendingAcceptDueDateValue,
    pendingAcceptDueDateLoading,
    showAwaitingVerificationGate,
    awaitingVerificationGateLoading,
    syncTicketModalFromRoute,
    closeTicketModal,
    confirmReturnedCorrectionFromPage,
    cancelReturnedCorrectionFromPage,
    confirmAwaitingVerificationFromPage,
    cancelAwaitingVerificationFromPage,
    disabledWeekendDateForPendingAccept,
    onPendingAcceptDateChange,
    cancelPendingAcceptanceFromPage,
    confirmPendingAcceptanceFromPage,
    cancelPendingDueDateFromPage,
    confirmPendingDueDateFromPage,
  };
}
