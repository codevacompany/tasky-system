import { provide } from 'vue';
import { createTicketDetailsContext } from './ticketDetailsContext';
import { TICKET_DETAILS_DEPS_KEY } from './ticketDetailsInjection';
import { useTicketDetailsAccess } from './useTicketDetailsAccess';
import { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';
import { useTicketDetailsComments } from './useTicketDetailsComments';
import { useTicketDetailsFiles } from './useTicketDetailsFiles';
import { useTicketDetailsCore } from './useTicketDetailsCore';
import { useTicketDetailsDueDate } from './useTicketDetailsDueDate';
import { useTicketDetailsEditing } from './useTicketDetailsEditing';
import { useTicketDetailsAssignees } from './useTicketDetailsAssignees';
import { useTicketDetailsWorkflow } from './useTicketDetailsWorkflow';

export interface TicketDetailsModalProps {
  ticketCustomId: string | null;
}

export function useTicketDetailsModal(
  props: TicketDetailsModalProps,
  emit: (event: 'close') => void,
) {
  const ctx = createTicketDetailsContext(props, emit);
  const { display, richText } = ctx;

  const confirmation = useTicketDetailsConfirmation(ctx);
  const access = useTicketDetailsAccess(ctx);
  const comments = useTicketDetailsComments(ctx, confirmation);

  const coreRef: { refreshSelectedTicket: () => Promise<void> } = {
    refreshSelectedTicket: async () => {},
  };

  const files = useTicketDetailsFiles(ctx, () => coreRef.refreshSelectedTicket());
  const assignees = useTicketDetailsAssignees(ctx, access, confirmation, () =>
    coreRef.refreshSelectedTicket(),
  );
  const editing = useTicketDetailsEditing(ctx, access, confirmation, () =>
    coreRef.refreshSelectedTicket(),
  );

  const dueDate = useTicketDetailsDueDate({
    loadedTicket: ctx.loadedTicket,
    refreshSelectedTicket: () => coreRef.refreshSelectedTicket(),
  });

  const workflow = useTicketDetailsWorkflow(
    ctx,
    access,
    confirmation,
    assignees,
    editing,
    dueDate,
    () => coreRef.refreshSelectedTicket(),
  );

  const core = useTicketDetailsCore(ctx, comments, files, workflow);
  coreRef.refreshSelectedTicket = core.refreshSelectedTicket;

  provide(TICKET_DETAILS_DEPS_KEY, {
    ctx,
    access,
    confirmation,
    refreshSelectedTicket: () => coreRef.refreshSelectedTicket(),
    display,
    comments,
    files,
    workflow,
    editing,
    assignees,
    dueDate,
    core,
  });

  const selectAttachFile = () => editing.selectAttachFile(files.openFileInput);

  return {
    userStore: ctx.userStore,
    ticketsStore: ctx.ticketsStore,
    userPreferencesStore: ctx.userPreferencesStore,
    newComment: ctx.newComment,
    quillEditor: ctx.quillEditor,
    editorKey: ctx.editorKey,
    isCommentLoading: ctx.isCommentLoading,
    comments: ctx.comments,
    mentionableUsers: ctx.mentionableUsers,
    quillMentionInstance: ctx.quillMentionInstance,
    ticketUpdates: ctx.ticketUpdates,
    loadedTicket: ctx.loadedTicket,
    isLoadingTicket: ctx.isLoadingTicket,
    hasLoadedTicketOnce: ctx.hasLoadedTicketOnce,
    selectedFiles: ctx.selectedFiles,
    fileInput: ctx.fileInput,
    isUploading: ctx.isUploading,
    checklistItems: ctx.checklistItems,
    showTarefasSection: ctx.showTarefasSection,
    tarefasSectionRef: ctx.tarefasSectionRef,
    ticketChecklistRef: ctx.ticketChecklistRef,
    selectedImage: ctx.selectedImage,
    currentImageIndex: ctx.currentImageIndex,
    isEditingName: ctx.isEditingName,
    isEditingDescription: ctx.isEditingDescription,
    editingName: ctx.editingName,
    editingDescription: ctx.editingDescription,
    descriptionEditorKey: ctx.descriptionEditorKey,
    nameInput: ctx.nameInput,
    openCommentMenuId: ctx.openCommentMenuId,
    editingCommentUuid: ctx.editingCommentUuid,
    editingCommentContent: ctx.editingCommentContent,
    isActionsDropdownOpen: ctx.isActionsDropdownOpen,
    showVerificationAlert: ctx.showVerificationAlert,
    showAcceptanceAlert: ctx.showAcceptanceAlert,
    isVerifying: ctx.isVerifying,
    isAccepting: ctx.isAccepting,
    showAddMenu: ctx.showAddMenu,
    isEditingAssignee: ctx.isEditingAssignee,
    isAddingAssignee: ctx.isAddingAssignee,
    currentlyEditingUser: ctx.currentlyEditingUser,
    assigneeSelection: ctx.assigneeSelection,
    newAssigneeSelection: ctx.newAssigneeSelection,
    showEditTargetUsersModal: ctx.showEditTargetUsersModal,
    showReviewerModal: ctx.showReviewerModal,
    reviewerSelection: ctx.reviewerSelection,
    tenantAdmins: ctx.tenantAdmins,
    isReviewerModalLoading: ctx.isReviewerModalLoading,
    pendingTargetUserRemoval: ctx.pendingTargetUserRemoval,
    isEditingReviewerOnly: ctx.isEditingReviewerOnly,
    confirmationModal: ctx.confirmationModal,
    editorOptions: richText.editorOptions,
    processRichTextContent: richText.processRichTextContent,
    convertUrlsToLinks: richText.convertUrlsToLinks,
    ...display,
    ...comments,
    ...files,
    ...access,
    ...workflow,
    ...editing,
    selectAttachFile,
    ...assignees,
    ...core,
    ...dueDate,
  };
}
