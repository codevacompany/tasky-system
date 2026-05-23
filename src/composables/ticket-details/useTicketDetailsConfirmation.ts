import type { TicketDetailsContext } from './ticketDetailsContext';

export function useTicketDetailsConfirmation(ctx: TicketDetailsContext) {
  const { confirmationModal, emit } = ctx;

  const openConfirmationModal = (
    title: string,
    message: string,
    action: (data?: { reason: string; description: string; targetUserId?: number }) => Promise<void>,
    hasInput = false,
    reasonOptions: { value: string; label: string }[] = [],
    context = '',
    showUserSelector = false,
    targetUsers: Array<{ userId: number; userName: string; order: number }> = [],
    cancelAction: (() => void) | null = null,
  ) => {
    confirmationModal.value = {
      isOpen: true,
      title,
      message,
      action,
      cancelAction,
      hasInput,
      reasonOptions,
      context,
      showUserSelector,
      targetUsers,
      isLoading: false,
    };
  };

  const closeConfirmationModal = () => {
    if (confirmationModal.value.cancelAction) {
      confirmationModal.value.cancelAction();
    }
    confirmationModal.value.isOpen = false;
    confirmationModal.value.action = null;
    confirmationModal.value.cancelAction = null;
    confirmationModal.value.isLoading = false;
  };

  const handleConfirm = async (data?: {
    reason: string;
    description: string;
    targetUserId?: number;
  }) => {
    if (confirmationModal.value.action) {
      confirmationModal.value.isLoading = true;

      try {
        if (data) {
          await confirmationModal.value.action(data);
        } else {
          await confirmationModal.value.action();
        }
      } finally {
        confirmationModal.value.isLoading = false;
      }
    }
    closeConfirmationModal();
  };

  const handleCancel = (closeModal: () => void) => {
    if (confirmationModal.value.context === 'start-verification') {
      closeConfirmationModal();
      closeModal();
    } else if (confirmationModal.value.context === 'start-correction') {
      closeConfirmationModal();
      emit('close');
    } else if (confirmationModal.value.context === 'accept-pending') {
      closeConfirmationModal();
      emit('close');
    } else {
      closeConfirmationModal();
    }
    confirmationModal.value.context = '';
  };

  return {
    confirmationModal,
    openConfirmationModal,
    closeConfirmationModal,
    handleConfirm,
    handleCancel,
  };
}
