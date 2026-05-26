import { computed } from 'vue';
import { DefaultTicketStatus } from '@/models';
import type { TicketDetailsContext } from './ticketDetailsContext';

export function useTicketDetailsAccess(ctx: TicketDetailsContext) {
  const { loadedTicket, userStore, isAdmin } = ctx;

  const ticketStatus = computed(() => {
    return loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
  });

  const isTargetUser = computed(
    () => userStore.user?.id === loadedTicket.value?.currentTargetUserId,
  );

  const isAnyTargetUser = computed(() => {
    if (!loadedTicket.value || !userStore.user?.id) return false;
    return loadedTicket.value.targetUsers?.some((tu) => tu.userId === userStore.user?.id) || false;
  });

  const isRequester = computed(() => userStore.user?.id === loadedTicket.value?.requester.id);

  const isReviewer = computed(() => userStore.user?.id === loadedTicket.value?.reviewer?.id);

  const sortedTargetUsers = computed(() => {
    if (!loadedTicket.value?.targetUsers) return [];
    return [...loadedTicket.value.targetUsers].sort((a, b) => a.order - b.order);
  });

  const isLastTargetUser = computed(() => {
    if (!loadedTicket.value?.targetUsers || !isTargetUser.value) return false;
    const sortedTargetUsersList = sortedTargetUsers.value;
    const lastUser = sortedTargetUsersList[sortedTargetUsersList.length - 1];
    return lastUser.userId === loadedTicket.value.currentTargetUserId;
  });

  const isNextUserSameDepartment = computed(() => {
    if (!loadedTicket.value?.targetUsers || !isTargetUser.value || isLastTargetUser.value) {
      return false;
    }

    const sortedTargetUsersList = sortedTargetUsers.value;
    const currentUserIndex = sortedTargetUsersList.findIndex(
      (tu) => tu.userId === loadedTicket.value?.currentTargetUserId,
    );

    if (currentUserIndex === -1 || currentUserIndex === sortedTargetUsersList.length - 1) {
      return false;
    }

    const currentUser = sortedTargetUsersList[currentUserIndex];
    const nextUser = sortedTargetUsersList[currentUserIndex + 1];

    return (
      currentUser.user?.departmentId !== null &&
      currentUser.user?.departmentId === nextUser.user?.departmentId
    );
  });

  const isSelfAssigned = computed(
    () =>
      loadedTicket.value &&
      loadedTicket.value.requester.id === loadedTicket.value.currentTargetUserId,
  );

  const isTicketActive = computed(() => {
    const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
    return (
      currentStatus !== DefaultTicketStatus.Completed &&
      currentStatus !== DefaultTicketStatus.Rejected &&
      currentStatus !== DefaultTicketStatus.Canceled
    );
  });

  const canAdminEditAssignment = computed(() => isAdmin.value && isTicketActive.value);

  const canRequesterEditAssignee = computed(() => {
    if (!loadedTicket.value || !isRequester.value) return false;
    const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
    return (
      currentStatus === DefaultTicketStatus.Pending ||
      currentStatus === DefaultTicketStatus.InProgress
    );
  });

  const canManageAssignees = computed(
    () => canRequesterEditAssignee.value || canAdminEditAssignment.value,
  );

  const canViewEditAssigneeIcon = computed(() => {
    if (!loadedTicket.value || !userStore.user?.id) return false;
    if (canAdminEditAssignment.value) return true;
    if (isRequester.value) return true;
    return isAnyTargetUser.value;
  });

  const canAddNewAssignee = computed(() => {
    if (canAdminEditAssignment.value) return true;
    if (canRequesterEditAssignee.value) return true;
    return isAnyTargetUser.value;
  });

  const canEditTicket = computed(() => {
    if (!loadedTicket.value) return false;
    const isUserInvolved =
      userStore.user?.id === loadedTicket.value.requester.id ||
      userStore.user?.id === loadedTicket.value.currentTargetUserId;
    return isUserInvolved && isTicketActive.value;
  });

  const canEditTargetUser = (targetUserId: number): boolean => {
    if (!loadedTicket.value) return false;
    if (canAdminEditAssignment.value) return true;
    if (!canRequesterEditAssignee.value) return false;

    const targetUser = loadedTicket.value.targetUsers?.find((tu) => tu.userId === targetUserId);
    const currentTargetUser = loadedTicket.value.targetUsers?.find(
      (tu) => tu.userId === loadedTicket.value?.currentTargetUserId,
    );

    if (!targetUser || !currentTargetUser) return false;
    if (targetUser.userId === currentTargetUser.userId) return true;
    return targetUser.order > currentTargetUser.order;
  };

  const canRemoveTargetUser = (targetUserId: number): boolean => {
    if (!loadedTicket.value) return false;
    if (!loadedTicket.value.targetUsers || loadedTicket.value.targetUsers.length < 2) {
      return false;
    }
    if (canAdminEditAssignment.value) return true;
    if (!canRequesterEditAssignee.value) return false;

    const targetUser = loadedTicket.value.targetUsers?.find((tu) => tu.userId === targetUserId);
    const currentTargetUser = loadedTicket.value.targetUsers?.find(
      (tu) => tu.userId === loadedTicket.value?.currentTargetUserId,
    );

    if (!targetUser || !currentTargetUser) return false;

    const isRemovingCurrentTargetUser = loadedTicket.value.currentTargetUserId === targetUserId;
    if (isRemovingCurrentTargetUser) return true;
    if (targetUser.order < currentTargetUser.order) return false;
    return true;
  };

  return {
    ticketStatus,
    isTargetUser,
    isAnyTargetUser,
    isRequester,
    isReviewer,
    sortedTargetUsers,
    isLastTargetUser,
    isNextUserSameDepartment,
    isSelfAssigned,
    isTicketActive,
    canAdminEditAssignment,
    canRequesterEditAssignee,
    canManageAssignees,
    canViewEditAssigneeIcon,
    canAddNewAssignee,
    canEditTicket,
    canEditTargetUser,
    canRemoveTargetUser,
  };
}
