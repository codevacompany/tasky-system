import { isAxiosError } from 'axios';
import { computed } from 'vue';
import { DefaultTicketStatus } from '@/models';
import { ticketService } from '@/services/ticketService';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { DepartmentUserSelection } from './types';
import type { useTicketDetailsAccess } from './useTicketDetailsAccess';
import type { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
};

export function useTicketDetailsAssignees(
  ctx: TicketDetailsContext,
  access: ReturnType<typeof useTicketDetailsAccess>,
  confirmation: ReturnType<typeof useTicketDetailsConfirmation>,
  refreshSelectedTicket: () => Promise<void>,
) {
  const {
    loadedTicket,
    isEditingAssignee,
    isAddingAssignee,
    currentlyEditingUser,
    assigneeSelection,
    newAssigneeSelection,
    showEditTargetUsersModal,
    showReviewerModal,
    reviewerSelection,
    tenantAdmins,
    isReviewerModalLoading,
    pendingTargetUserRemoval,
    isEditingReviewerOnly,
  } = ctx;

  const {
    canManageAssignees,
    canAdminEditAssignment,
    canEditTargetUser,
    canRemoveTargetUser,
  } = access;

  const { openConfirmationModal } = confirmation;

  const excludedUserIds = computed(() => {
    if (!loadedTicket.value?.targetUsers) return [];

    if (currentlyEditingUser.value) {
      return loadedTicket.value.targetUsers
        .filter((tu) => tu.userId !== currentlyEditingUser.value)
        .map((tu) => tu.userId)
        .filter((id): id is number => id !== null && id !== undefined);
    }

    return loadedTicket.value.targetUsers
      .map((tu) => tu.userId)
      .filter((id): id is number => id !== null && id !== undefined);
  });

  const reviewerOptions = computed(() =>
    tenantAdmins.value.map((admin) => ({
      value: admin.id.toString(),
      label: `${admin.firstName} ${admin.lastName}`,
    })),
  );

  const fetchTenantAdmins = async () => {
    try {
      const { data } = await userService.getTenantAdmins();
      tenantAdmins.value = data;
    } catch (err) {
      console.error('Failed to fetch tenant admins:', err);
      tenantAdmins.value = [];
      toast.error('Erro ao buscar revisores. Tente novamente.');
    }
  };

  const startEditingAssignee = (targetUserId?: number) => {
    if (!canManageAssignees.value) return;

    const userIdToEdit = targetUserId ?? loadedTicket.value?.currentTargetUserId ?? null;
    if (!userIdToEdit || !canEditTargetUser(userIdToEdit)) return;

    currentlyEditingUser.value = userIdToEdit;
    const targetUser = loadedTicket.value?.targetUsers?.find((tu) => tu.userId === userIdToEdit);

    assigneeSelection.value = {
      departmentId: targetUser?.user?.departmentId || null,
      userId: userIdToEdit,
    };
    isEditingAssignee.value = true;
  };

  const cancelEditingAssignee = () => {
    isEditingAssignee.value = false;
    currentlyEditingUser.value = null;
    assigneeSelection.value = { departmentId: null, userId: null };
  };

  const saveAssigneeChange = async (selection: DepartmentUserSelection) => {
    if (!selection.user || !loadedTicket.value) return;

    try {
      const editingUser = loadedTicket.value.targetUsers?.find(
        (tu) => tu.userId === currentlyEditingUser.value,
      );
      const order = editingUser?.order || 1;

      await ticketService.updateAssignee(loadedTicket.value.customId, selection.user.id, order);
      await refreshSelectedTicket();
      isEditingAssignee.value = false;
      currentlyEditingUser.value = null;
      assigneeSelection.value = { departmentId: null, userId: null };
      toast.success('Sucesso');
    } catch (error) {
      console.error('Erro ao alterar responsável:', error);
      toast.error('Erro ao alterar responsável');
    }
  };

  const startAddingAssignee = () => {
    isAddingAssignee.value = true;
    isEditingAssignee.value = false;
    currentlyEditingUser.value = null;
    newAssigneeSelection.value = { departmentId: null, userId: null };
  };

  const cancelAddingAssignee = () => {
    isAddingAssignee.value = false;
    newAssigneeSelection.value = { departmentId: null, userId: null };
  };

  const saveNewAssignee = async (selection: DepartmentUserSelection) => {
    if (!selection.user || !loadedTicket.value) return;

    try {
      await ticketService.addAssignee(loadedTicket.value.customId, selection.user.id);
      await refreshSelectedTicket();
      isAddingAssignee.value = false;
      newAssigneeSelection.value = { departmentId: null, userId: null };
      toast.success('Responsável adicionado com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao adicionar responsável:', error);
      toast.error(getApiErrorMessage(error, 'Erro ao adicionar responsável'));
    }
  };

  const removeTargetUser = async (targetUserId: number) => {
    if (!loadedTicket.value) return;
    if (!canRemoveTargetUser(targetUserId)) return;

    const targetUser = loadedTicket.value.targetUsers?.find((tu) => tu.userId === targetUserId);
    if (!targetUser) return;

    const userName = `${targetUser.user.firstName} ${targetUser.user.lastName}`;
    const isRemovingCurrentTargetUser = loadedTicket.value.currentTargetUserId === targetUserId;
    const isLastAssignee =
      loadedTicket.value.targetUsers &&
      loadedTicket.value.targetUsers.length > 0 &&
      targetUser.order === Math.max(...loadedTicket.value.targetUsers.map((tu) => tu.order));

    if (isRemovingCurrentTargetUser && isLastAssignee && !loadedTicket.value.reviewer) {
      await fetchTenantAdmins();
      pendingTargetUserRemoval.value = targetUserId;
      showReviewerModal.value = true;
      reviewerSelection.value = '';
      return;
    }

    openConfirmationModal(
      'Remover Responsável',
      `Tem certeza que deseja remover ${userName} como responsável desta tarefa?`,
      async () => {
        try {
          await ticketService.removeAssignee(loadedTicket.value!.customId, targetUserId);
          toast.success('Responsável removido com sucesso');
          await refreshSelectedTicket();
        } catch (error: unknown) {
          console.error('Erro ao remover responsável:', error);
          toast.error(getApiErrorMessage(error, 'Erro ao remover responsável'));
        }
      },
    );
  };

  const openEditTargetUsersModal = () => {
    showEditTargetUsersModal.value = true;
    isEditingAssignee.value = false;
    isAddingAssignee.value = false;
    currentlyEditingUser.value = null;
    assigneeSelection.value = { departmentId: null, userId: null };
    newAssigneeSelection.value = { departmentId: null, userId: null };
  };

  const closeEditTargetUsersModal = () => {
    showEditTargetUsersModal.value = false;
    isEditingAssignee.value = false;
    isAddingAssignee.value = false;
    currentlyEditingUser.value = null;
    assigneeSelection.value = { departmentId: null, userId: null };
    newAssigneeSelection.value = { departmentId: null, userId: null };
  };

  const closeReviewerModal = () => {
    showReviewerModal.value = false;
    pendingTargetUserRemoval.value = null;
    reviewerSelection.value = '';
    isEditingReviewerOnly.value = false;
  };

  const openEditReviewerModal = async () => {
    if (!canAdminEditAssignment.value) return;
    isEditingReviewerOnly.value = true;
    reviewerSelection.value = loadedTicket.value?.reviewer?.id?.toString() || '';
    await fetchTenantAdmins();
    showReviewerModal.value = true;
  };

  const confirmReviewerSelection = async () => {
    if (!reviewerSelection.value || reviewerSelection.value === '' || !loadedTicket.value) {
      toast.error('Selecione um revisor');
      return;
    }
    isReviewerModalLoading.value = true;
    try {
      await ticketService.updateReviewer(
        loadedTicket.value.customId,
        Number(reviewerSelection.value),
      );

      if (isEditingReviewerOnly.value) {
        toast.success('Revisor atualizado');
        showReviewerModal.value = false;
        reviewerSelection.value = '';
        isEditingReviewerOnly.value = false;
        await refreshSelectedTicket();
        return;
      }

      if (pendingTargetUserRemoval.value !== null) {
        await ticketService.removeAssignee(
          loadedTicket.value.customId,
          pendingTargetUserRemoval.value,
        );
        pendingTargetUserRemoval.value = null;
        toast.success('Responsável removido e tarefa enviada para revisão');
      } else {
        await ticketService.updateStatus(loadedTicket.value.customId, {
          status: DefaultTicketStatus.AwaitingVerification,
        });
        toast.success('Tarefa enviada para revisão');
      }

      showReviewerModal.value = false;
      reviewerSelection.value = '';
      await refreshSelectedTicket();
    } catch (error: unknown) {
      console.error('Erro ao definir revisor ou remover responsável:', error);
      toast.error(
        getApiErrorMessage(error, 'Erro ao definir revisor ou enviar para revisão'),
      );
    } finally {
      isReviewerModalLoading.value = false;
    }
  };

  return {
    excludedUserIds,
    reviewerOptions,
    fetchTenantAdmins,
    startEditingAssignee,
    cancelEditingAssignee,
    saveAssigneeChange,
    startAddingAssignee,
    cancelAddingAssignee,
    saveNewAssignee,
    removeTargetUser,
    openEditTargetUsersModal,
    closeEditTargetUsersModal,
    closeReviewerModal,
    openEditReviewerModal,
    confirmReviewerSelection,
  };
}
