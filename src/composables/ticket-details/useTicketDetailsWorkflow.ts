import { computed } from 'vue';
import {
  CancellationReason,
  CorrectionReason,
  DefaultTicketStatus,
  DisapprovalReason,
} from '@/models';
import { ticketService } from '@/services/ticketService';
import { toast } from 'vue3-toastify';
import { enumToOptions } from '@/utils/generic-helper';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { useTicketDetailsAccess } from './useTicketDetailsAccess';
import type { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';
import type { useTicketDetailsAssignees } from './useTicketDetailsAssignees';
import type { useTicketDetailsEditing } from './useTicketDetailsEditing';
import type { useTicketDetailsDueDate } from './useTicketDetailsDueDate';

export function useTicketDetailsWorkflow(
  ctx: TicketDetailsContext,
  access: ReturnType<typeof useTicketDetailsAccess>,
  confirmation: ReturnType<typeof useTicketDetailsConfirmation>,
  assignees: ReturnType<typeof useTicketDetailsAssignees>,
  editing: ReturnType<typeof useTicketDetailsEditing>,
  dueDate: ReturnType<typeof useTicketDetailsDueDate>,
  refreshSelectedTicket: () => Promise<void>,
) {
  const {
    loadedTicket,
    ticketsStore,
    userStore,
    isActionsDropdownOpen,
    showVerificationAlert,
    showAcceptanceAlert,
    isVerifying,
    isAccepting,
    showTarefasSection,
    emit,
    confirmationModal,
  } = ctx;

  const {
    ticketStatus,
    isTargetUser,
    isRequester,
    isReviewer,
    isLastTargetUser,
    isNextUserSameDepartment,
    isSelfAssigned,
  } = access;

  const { openConfirmationModal, closeConfirmationModal, handleConfirm, handleCancel } =
    confirmation;

  const { fetchTenantAdmins } = assignees;
  const { cancelVerificationRequest } = editing;
  const { showDueDateModal } = dueDate;

  const startCorrectionDirectly = async (ticketId: string) => {
    try {
      await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
      await refreshSelectedTicket();
    } catch {
      toast.error('Erro ao iniciar correção');
    }
  };

  const closeModal = () => {
    if (
      ticketStatus.value === DefaultTicketStatus.Returned &&
      isTargetUser.value &&
      !confirmationModal.value.isOpen
    ) {
      openConfirmationModal(
        'Iniciar Correção',
        'Esta tarefa foi devolvida para correção. Deseja iniciar as correções agora?',
        async () => {
          await startCorrectionDirectly(loadedTicket.value!.customId);
        },
        false,
        [],
        'start-correction',
      );
      return;
    }

    showTarefasSection.value = false;
    emit('close');
  };

  const handleVerificationCancel = () => {
    showVerificationAlert.value = false;
    closeModal();
  };

  const handleVerificationConfirm = async () => {
    if (!loadedTicket.value) return;

    isVerifying.value = true;
    try {
      await ticketService.updateStatus(loadedTicket.value.customId, {
        status: DefaultTicketStatus.UnderVerification,
      });
      showVerificationAlert.value = false;
      loadedTicket.value = await ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    } catch {
      toast.error('Erro ao iniciar verificação');
    } finally {
      isVerifying.value = false;
    }
  };

  const handleAcceptanceCancel = () => {
    showAcceptanceAlert.value = false;
    closeModal();
  };

  const handleDueDateCancel = () => {
    showDueDateModal.value = false;
    closeModal();
  };

  const handleAcceptanceConfirm = async () => {
    if (!loadedTicket.value) return;

    isAccepting.value = true;
    try {
      if (!loadedTicket.value.dueAt) {
        showAcceptanceAlert.value = false;
        showDueDateModal.value = true;
        return;
      }

      await ticketService.accept(loadedTicket.value.customId);
      toast.success('Tarefa aceita com sucesso');
      showAcceptanceAlert.value = false;
      loadedTicket.value = await ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    } catch {
      toast.error('Erro ao aceitar a tarefa');
    } finally {
      isAccepting.value = false;
    }
  };

  const onHandleCancel = () => handleCancel(closeModal);

  const sendToNextDepartment = async (ticketId: string) => {
    const isSameDepartment = isNextUserSameDepartment.value;
    const title = isSameDepartment ? 'Próximo Colaborador' : 'Próximo Setor';
    const message = isSameDepartment
      ? 'Tem certeza que deseja enviar esta tarefa para o próximo colaborador?'
      : 'Tem certeza que deseja enviar esta tarefa para o próximo setor?';
    const successMessage = isSameDepartment
      ? 'Tarefa enviada para o próximo colaborador'
      : 'Tarefa enviada para o próximo setor';
    const errorMessage = isSameDepartment
      ? 'Erro ao enviar a tarefa para o próximo colaborador'
      : 'Erro ao enviar a tarefa para o próximo setor';

    openConfirmationModal(title, message, async () => {
      try {
        await ticketService.sendToNextDepartment(ticketId);
        toast.success(successMessage);
        await refreshSelectedTicket();
      } catch {
        toast.error(errorMessage);
      }
    });
  };

  const sendForReview = async (ticketId: string) => {
    if (loadedTicket.value && !loadedTicket.value.reviewer) {
      await fetchTenantAdmins();
      ctx.showReviewerModal.value = true;
      ctx.pendingTargetUserRemoval.value = null;
      return;
    }

    openConfirmationModal(
      'Enviar Para Revisão',
      'Tem certeza que deseja enviar esta tarefa para revisão?',
      async () => {
        try {
          await ticketService.updateStatus(ticketId, {
            status: DefaultTicketStatus.AwaitingVerification,
          });
          toast.success('Tarefa enviada para revisão');
          await refreshSelectedTicket();
        } catch {
          toast.error('Erro ao enviar a tarefa para revisão');
        }
      },
    );
  };

  const approveTicket = async (ticketId: string) => {
    openConfirmationModal(
      'Aprovar Tarefa',
      'Tem certeza que deseja aprovar esta tarefa?',
      async () => {
        try {
          await ticketService.approve(ticketId);
          toast.success('Tarefa aprovada com sucesso');
          if (loadedTicket.value) {
            await refreshSelectedTicket();
          } else {
            await ticketsStore.fetchTicketDetails(ticketId);
          }
        } catch {
          toast.error('Erro ao aprovar a tarefa');
        }
      },
    );
  };

  const requestCorrection = async (ticketId: string) => {
    if (!loadedTicket.value) return;

    const reasonOptions = enumToOptions(CorrectionReason);
    const showUserSelector =
      loadedTicket.value.targetUsers && loadedTicket.value.targetUsers.length > 1;
    const targetUsers = showUserSelector
      ? [...loadedTicket.value.targetUsers]
          .sort((a, b) => a.order - b.order)
          .map((tu) => ({
            userId: tu.userId,
            userName: `${tu.user.firstName} ${tu.user.lastName}`,
            order: tu.order,
            departmentName: tu.user.department?.name || '',
          }))
      : [];

    openConfirmationModal(
      'Solicitar Correção',
      'Por favor, preencha os detalhes da correção necessária:',
      async (data?: { reason: string; description: string; targetUserId?: number }) => {
        try {
          await ticketService.requestCorrection(ticketId, {
            reason: data?.reason ?? '',
            details: data?.description ?? '',
            targetUserId: data?.targetUserId,
          });
          toast.success('Correção solicitada com sucesso');
          await refreshSelectedTicket();
        } catch {
          toast.error('Erro ao solicitar correção');
        }
      },
      true,
      reasonOptions,
      '',
      showUserSelector,
      targetUsers,
    );
  };

  const correctTicket = async (ticketId: string) => {
    openConfirmationModal(
      'Corrigir Tarefa',
      'Tem certeza que deseja iniciar as correções desta tarefa?',
      async () => {
        try {
          await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
          await refreshSelectedTicket();
        } catch {
          toast.error('Erro ao iniciar correção');
        }
      },
    );
  };

  const rejectTicket = async (ticketId: string) => {
    const reasonOptions = enumToOptions(DisapprovalReason);
    openConfirmationModal(
      'Reprovar Tarefa',
      'Por favor, informe o motivo da reprovação:',
      async (data?: { reason: string; description: string }) => {
        try {
          await ticketService.reject(ticketId, {
            reason: data?.reason ?? '',
            details: data?.description ?? '',
          });
          toast.success('Tarefa reprovada com sucesso');
          await refreshSelectedTicket();
        } catch {
          toast.error('Erro ao reprovar a tarefa');
        }
      },
      true,
      reasonOptions,
    );
  };

  const cancelTicket = async (ticketId: string) => {
    const reasonOptions = enumToOptions(CancellationReason);
    openConfirmationModal(
      'Cancelar Tarefa',
      'Por favor, informe o motivo do cancelamento:',
      async (data?: { reason: string; description: string }) => {
        try {
          await ticketService.cancel(ticketId, {
            reason: data?.reason ?? '',
            details: data?.description ?? '',
          });
          toast.success('Tarefa cancelada com sucesso');
          await refreshSelectedTicket();
          emit('close');
        } catch {
          toast.error('Erro ao cancelar a tarefa');
        }
      },
      true,
      reasonOptions,
    );
  };

  const startTicket = async () => {
    showAcceptanceAlert.value = true;
  };

  const acceptTicket = async () => {
    if (loadedTicket.value && !loadedTicket.value.dueAt) {
      showDueDateModal.value = true;
      return;
    }
    showAcceptanceAlert.value = true;
  };

  type HeaderAction = {
    id: string;
    label: string;
    icon: string;
    color: string;
    onClick: () => void;
    isPrimary?: boolean;
  };

  const headerActions = computed(() => {
    const actions: HeaderAction[] = [];
    if (!loadedTicket.value) return actions;

    const currentStatus = ticketStatus.value;

    if (
      isTargetUser.value &&
      currentStatus === DefaultTicketStatus.Pending &&
      isSelfAssigned.value
    ) {
      actions.push({
        id: 'start',
        label: 'Iniciar',
        icon: 'play',
        color: 'bg-green-600 hover:bg-green-700',
        onClick: () => {
          void startTicket();
          isActionsDropdownOpen.value = false;
        },
        isPrimary: true,
      });
    }

    if (isTargetUser.value && currentStatus === DefaultTicketStatus.InProgress) {
      if (!isLastTargetUser.value) {
        actions.push({
          id: 'next',
          label: isNextUserSameDepartment.value ? 'Próximo Colaborador' : 'Próximo Setor',
          icon: 'arrow-right',
          color: 'bg-blue-600 hover:bg-blue-700',
          onClick: () => {
            sendToNextDepartment(loadedTicket.value!.customId);
            isActionsDropdownOpen.value = false;
          },
          isPrimary: true,
        });
      } else {
        actions.push({
          id: 'review',
          label: 'Enviar Para Verificação',
          icon: 'arrow-right',
          color: 'bg-primary hover:bg-blue-700',
          onClick: () => {
            sendForReview(loadedTicket.value!.customId);
            isActionsDropdownOpen.value = false;
          },
          isPrimary: true,
        });
      }
    }

    if (isTargetUser.value && currentStatus === DefaultTicketStatus.AwaitingVerification) {
      actions.push({
        id: 'undo-envio',
        label: 'Cancelar Envio',
        icon: 'undo',
        color: 'bg-yellow-600 hover:bg-yellow-700',
        onClick: () => {
          cancelVerificationRequest(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: true,
      });
    }

    if (isTargetUser.value && currentStatus === DefaultTicketStatus.Returned) {
      actions.push({
        id: 'correct',
        label: 'Corrigir',
        icon: 'wrench',
        color: 'bg-orange-600 hover:bg-orange-700',
        onClick: () => {
          correctTicket(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: true,
      });
    }

    if (isReviewer.value && currentStatus === DefaultTicketStatus.UnderVerification) {
      actions.push({
        id: 'approve',
        label: 'Aprovar',
        icon: 'check-double',
        color: 'bg-emerald-600 hover:bg-emerald-700',
        onClick: () => {
          approveTicket(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: true,
      });
      actions.push({
        id: 'request-correction',
        label: 'Correção',
        icon: 'undo',
        color: 'bg-purple-600 hover:bg-purple-700',
        onClick: () => {
          requestCorrection(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: false,
      });
      actions.push({
        id: 'reject',
        label: 'Reprovar',
        icon: 'times',
        color: 'bg-red-600 hover:bg-red-700',
        onClick: () => {
          rejectTicket(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: false,
      });
    }

    if (
      isRequester.value &&
      ![
        DefaultTicketStatus.Completed,
        DefaultTicketStatus.Rejected,
        DefaultTicketStatus.Canceled,
      ].includes(currentStatus as DefaultTicketStatus)
    ) {
      actions.push({
        id: 'cancel-ticket',
        label: 'Cancelar',
        icon: 'ban',
        color: 'bg-red-600 hover:bg-red-700',
        onClick: () => {
          cancelTicket(loadedTicket.value!.customId);
          isActionsDropdownOpen.value = false;
        },
        isPrimary: actions.length === 0,
      });
    }

    return actions;
  });

  const toggleActionsDropdown = () => {
    isActionsDropdownOpen.value = !isActionsDropdownOpen.value;
  };

  const applyPostLoadAlerts = (silent: boolean) => {
    const ticket = loadedTicket.value;
    if (!ticket || silent) return;

    if (
      userStore.user?.id === ticket.reviewer?.id &&
      (ticket.ticketStatus?.key === DefaultTicketStatus.AwaitingVerification ||
        ticket.status === DefaultTicketStatus.AwaitingVerification) &&
      !confirmationModal.value.isOpen
    ) {
      showVerificationAlert.value = true;
    }

    if (
      userStore.user?.id === ticket.currentTargetUserId &&
      (ticket.ticketStatus?.key === DefaultTicketStatus.Pending ||
        ticket.status === DefaultTicketStatus.Pending) &&
      !confirmationModal.value.isOpen
    ) {
      showAcceptanceAlert.value = true;
    }
  };

  return {
    headerActions,
    toggleActionsDropdown,
    closeModal,
    handleVerificationCancel,
    handleVerificationConfirm,
    handleAcceptanceCancel,
    handleDueDateCancel,
    handleAcceptanceConfirm,
    openConfirmationModal,
    closeConfirmationModal,
    handleConfirm,
    handleCancel: onHandleCancel,
    acceptTicket,
    sendToNextDepartment,
    sendForReview,
    approveTicket,
    requestCorrection,
    correctTicket,
    startCorrectionDirectly,
    rejectTicket,
    cancelTicket,
    startTicket,
    applyPostLoadAlerts,
  };
}
