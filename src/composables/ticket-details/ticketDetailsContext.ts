import type { Ticket, TicketComment } from '@/models';
import type { ChecklistItem } from '@/models/checklist';
import type { TicketUpdate } from '@/models/ticketUpdate';
import type { TicketFile } from '@/models/ticketFile';
import type { User } from '@/models';
import TicketChecklist from '@/components/tickets/TicketChecklist.vue';
import QuillMention from '@/utils/quill-mention';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useRoles } from '@/composables';
import { useTicketDetailsDisplay } from './useTicketDetailsDisplay';
import { useTicketDetailsRichText } from './useTicketDetailsRichText';
import type { TicketDetailsModalProps } from './useTicketDetailsModal';

export function createTicketDetailsContext(
  props: TicketDetailsModalProps,
  emit: (event: 'close') => void,
) {
  const userStore = useUserStore();
  const { isAdmin } = useRoles();
  const ticketsStore = useTicketsStore();
  const userPreferencesStore = useUserPreferencesStore();
  const display = useTicketDetailsDisplay();
  const richText = useTicketDetailsRichText();

  const newComment = ref('');
  const quillEditor = ref<any>(null);
  const editorKey = ref(0);
  const isCommentLoading = ref(false);
  const comments = ref<TicketComment[]>([]);
  const mentionableUsers = ref<User[]>([]);
  const quillMentionInstance = ref<QuillMention | null>(null);
  const ticketUpdates = ref<TicketUpdate[]>([]);
  const loadedTicket = ref<Ticket | null>(null);
  const isLoadingTicket = ref(false);
  const hasLoadedTicketOnce = ref(false);
  const selectedFiles = ref<File[]>([]);
  const fileInput = ref<HTMLInputElement | null>(null);
  const isUploading = ref(false);
  const checklistItems = ref<ChecklistItem[]>([]);
  const showTarefasSection = ref(false);
  const tarefasSectionRef = ref<HTMLElement | null>(null);
  const ticketChecklistRef = ref<InstanceType<typeof TicketChecklist> | null>(null);

  const selectedImage = ref<TicketFile | null>(null);
  const currentImageIndex = ref(0);

  const isEditingName = ref(false);
  const isEditingDescription = ref(false);
  const editingName = ref('');
  const editingDescription = ref('');
  const descriptionEditorKey = ref(0);
  const nameInput = ref<HTMLInputElement | null>(null);

  const openCommentMenuId = ref<string | null>(null);
  const editingCommentUuid = ref<string | null>(null);
  const editingCommentContent = ref('');
  const isActionsDropdownOpen = ref(false);

  const showVerificationAlert = ref(false);
  const showAcceptanceAlert = ref(false);
  const isVerifying = ref(false);
  const isAccepting = ref(false);

  const showAddMenu = ref(false);
  const isEditingAssignee = ref(false);
  const isAddingAssignee = ref(false);
  const currentlyEditingUser = ref<number | null>(null);
  const assigneeSelection = ref<{ departmentId: number | null; userId: number | null }>({
    departmentId: null,
    userId: null,
  });
  const newAssigneeSelection = ref<{ departmentId: number | null; userId: number | null }>({
    departmentId: null,
    userId: null,
  });
  const showEditTargetUsersModal = ref(false);

  const showReviewerModal = ref(false);
  const reviewerSelection = ref<string>('');
  const tenantAdmins = ref<any[]>([]);
  const isReviewerModalLoading = ref(false);
  const pendingTargetUserRemoval = ref<number | null>(null);
  const isEditingReviewerOnly = ref(false);

  const nowRef = ref(new Date());

  const confirmationModal = ref({
    isOpen: false,
    title: '',
    message: '',
    action: null as
      | ((data?: { reason: string; description: string; targetUserId?: number }) => Promise<void>)
      | null,
    cancelAction: null as (() => void) | null,
    hasInput: false,
    reasonOptions: [] as { value: string; label: string }[],
    context: '',
    showUserSelector: false,
    targetUsers: [] as Array<{ userId: number; userName: string; order: number }>,
    isLoading: false,
  });

  return {
    props,
    emit,
    userStore,
    isAdmin,
    ticketsStore,
    userPreferencesStore,
    display,
    richText,
    newComment,
    quillEditor,
    editorKey,
    isCommentLoading,
    comments,
    mentionableUsers,
    quillMentionInstance,
    ticketUpdates,
    loadedTicket,
    isLoadingTicket,
    hasLoadedTicketOnce,
    selectedFiles,
    fileInput,
    isUploading,
    checklistItems,
    showTarefasSection,
    tarefasSectionRef,
    ticketChecklistRef,
    selectedImage,
    currentImageIndex,
    isEditingName,
    isEditingDescription,
    editingName,
    editingDescription,
    descriptionEditorKey,
    nameInput,
    openCommentMenuId,
    editingCommentUuid,
    editingCommentContent,
    isActionsDropdownOpen,
    showVerificationAlert,
    showAcceptanceAlert,
    isVerifying,
    isAccepting,
    showAddMenu,
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
    nowRef,
    confirmationModal,
  };
}

export type TicketDetailsContext = ReturnType<typeof createTicketDetailsContext>;
