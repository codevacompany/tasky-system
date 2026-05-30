import type { TicketComment } from '@/models';
import { ticketCommentService } from '@/services/ticketCommentService';
import { computed, nextTick, onUnmounted, watch } from 'vue';
import { TicketUpdateService } from '@/services/ticketUpdateService';
import { toast } from 'vue-sonner';
import QuillMention, { type MentionData, type QuillInstance } from '@/utils/quill-mention';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';

export function useTicketDetailsComments(
  ctx: TicketDetailsContext,
  confirmation: ReturnType<typeof useTicketDetailsConfirmation>,
) {
  const {
    loadedTicket,
    userStore,
    ticketsStore,
    userPreferencesStore,
    newComment,
    quillEditor,
    editorKey,
    isCommentLoading,
    comments,
    mentionableUsers,
    quillMentionInstance,
    ticketUpdates,
    openCommentMenuId,
    editingCommentUuid,
    editingCommentContent,
    nowRef,
    richText,
  } = ctx;

  const { openConfirmationModal } = confirmation;
  const { processRichTextContent } = richText;

  const nowInterval = setInterval(() => {
    nowRef.value = new Date();
  }, 10000);

  onUnmounted(() => {
    clearInterval(nowInterval);
  });

  const handleQuillTextChange = () => {};

  const restoreQuillFocus = () => {
    nextTick(() => {
      if (!quillEditor.value) return;
      const quill = quillEditor.value.getQuill?.();
      if (!quill || !quill.root || !(quill.root instanceof HTMLElement)) return;

      const currentSelection = quill.getSelection();
      const cursorPosition = currentSelection ? currentSelection.index : quill.getLength();
      const editor = quill.root;

      try {
        const [leaf, offset] = quill.getLeaf(cursorPosition);
        if (leaf && leaf.domNode) {
          const domNode = leaf.domNode;
          if (domNode.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            const textLength = domNode.textContent?.length || 0;
            const safeOffset = Math.min(offset, textLength);
            range.setStart(domNode, safeOffset);
            range.setEnd(domNode, safeOffset);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }
        editor.focus();
        quill.setSelection(cursorPosition, 'user');
      } catch {
        editor.click();
        editor.focus();
        quill.setSelection(cursorPosition, 'user');
      }
    });
  };

  const inlineQuillMentionInstances = new Set<QuillMention>();

  const resolveQuillInstance = (quillInstance?: QuillInstance): QuillInstance | undefined => {
    if (quillInstance?.root) return quillInstance;
    if (quillEditor.value?.getQuill) {
      return quillEditor.value.getQuill() as QuillInstance;
    }
    return undefined;
  };

  const syncMentionableUsers = () => {
    const users = mentionableUsers.value;
    quillMentionInstance.value?.updateMentionableUsers(users);
    inlineQuillMentionInstances.forEach((instance) => {
      instance.updateMentionableUsers(users);
    });
  };

  const initializeQuillMention = (
    quillInstance?: QuillInstance,
    editorKind: 'main' | 'inline' = 'main',
  ) => {
    nextTick(() => {
      const quill = resolveQuillInstance(quillInstance);
      if (!quill) return;

      if (editorKind === 'main') {
        const existing = quillMentionInstance.value;
        if (existing?.isBoundTo(quill)) {
          existing.updateMentionableUsers(mentionableUsers.value);
          return;
        }
        existing?.destroy();
        quillMentionInstance.value = new QuillMention(
          quill,
          mentionableUsers.value,
          restoreQuillFocus,
        );
        return;
      }

      inlineQuillMentionInstances.forEach((instance) => {
        if (instance.isBoundTo(quill)) {
          instance.updateMentionableUsers(mentionableUsers.value);
        }
      });

      const alreadyBound = Array.from(inlineQuillMentionInstances).some((instance) =>
        instance.isBoundTo(quill),
      );
      if (alreadyBound) return;

      const instance = new QuillMention(quill, mentionableUsers.value, restoreQuillFocus);
      inlineQuillMentionInstances.add(instance);
    });
  };

  const onMainCommentEditorReady = (quillInstance: QuillInstance) => {
    initializeQuillMention(quillInstance, 'main');
  };

  const onInlineCommentEditorReady = (quillInstance: QuillInstance) => {
    initializeQuillMention(quillInstance, 'inline');
  };

  const fetchMentionableUsers = async () => {
    if (!loadedTicket.value?.customId) return;

    try {
      const response = await ticketCommentService.getMentionableUsers(loadedTicket.value.customId);
      mentionableUsers.value = response.data;

      if (quillMentionInstance.value) {
        syncMentionableUsers();
        return;
      }

      const quill = resolveQuillInstance();
      if (quill) {
        initializeQuillMention(quill, 'main');
      }
    } catch (error) {
      console.error('Error fetching mentionable users:', error);
    }
  };

  const updateCommentLinksColor = () => {
    nextTick(() => {
      const isDarkMode =
        document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
      const commentTextElements = document.querySelectorAll('.comment-text');

      commentTextElements.forEach((commentElement) => {
        const links = commentElement.querySelectorAll('a');
        links.forEach((link) => {
          if (isDarkMode) {
            link.style.setProperty('color', '#60a5fa', 'important');
            link.setAttribute('data-dark-mode', 'true');
          } else {
            link.style.setProperty('color', '#2563eb', 'important');
            link.removeAttribute('data-dark-mode');
          }
          link.style.cursor = 'pointer';
        });
      });
    });
  };

  const updateDescriptionLinksColor = () => {
    nextTick(() => {
      const isDarkMode =
        document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
      const descriptionTextElements = document.querySelectorAll('.description-text');

      descriptionTextElements.forEach((descriptionElement) => {
        const links = descriptionElement.querySelectorAll('a');
        links.forEach((link) => {
          if (isDarkMode) {
            link.style.setProperty('color', '#60a5fa', 'important');
            link.setAttribute('data-dark-mode', 'true');
          } else {
            link.style.setProperty('color', '#4f46e5', 'important');
            link.removeAttribute('data-dark-mode');
          }
          if (!link.matches(':hover')) {
            link.style.textDecoration = 'none';
          }
          link.style.cursor = 'pointer';
        });
      });
    });
  };

  const fetchComments = async () => {
    try {
      if (loadedTicket.value) {
        const response = await ticketCommentService.getByTicket(loadedTicket.value.customId);
        comments.value = response.data;
        updateCommentLinksColor();
      }
    } catch {
      toast.error('Erro ao buscar comentários');
    }
  };

  const comment = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newComment.value;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const hasImages = tempDiv.querySelectorAll('img').length > 0;
    const hasVideos = tempDiv.querySelectorAll('video').length > 0;
    const hasContent = textContent.trim() || hasImages || hasVideos;

    if (!hasContent) {
      toast.error('Comentário não pode estar vazio');
      return;
    }

    if (isCommentLoading.value) return;

    isCommentLoading.value = true;

    try {
      const processedContent = await processRichTextContent(newComment.value);
      const mentions: MentionData[] = QuillMention.extractMentions(processedContent);

      await ticketCommentService.create({
        ticketId: loadedTicket.value!.id,
        ticketCustomId: loadedTicket.value!.customId,
        userId: userStore.user!.id,
        content: processedContent,
        mentions: mentions.length > 0 ? mentions : undefined,
      });

      newComment.value = '';
      editorKey.value += 1;

      Promise.all([
        fetchComments(),
        loadedTicket.value?.customId
          ? ticketsStore.fetchTicketDetails(loadedTicket.value.customId)
          : Promise.resolve(),
      ]).catch((error) => {
        console.error('Error refreshing comments/ticket:', error);
      });
    } catch {
      toast.error('Erro ao adicionar comentário');
    } finally {
      isCommentLoading.value = false;
    }
  };

  const handleDeleteCommentClick = (commentUuid: string) => {
    openCommentMenuId.value = null;
    openConfirmationModal(
      'Excluir Comentário',
      'Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.',
      async () => {
        try {
          await ticketCommentService.delete(commentUuid);
          toast.success('Comentário excluído com sucesso');
          fetchComments();
        } catch {
          toast.error('Erro ao excluir comentário');
        }
      },
    );
  };

  const startEditingComment = (comment: TicketComment) => {
    editingCommentUuid.value = comment.uuid;
    editingCommentContent.value = comment.content;
    openCommentMenuId.value = null;
  };

  const cancelEditingComment = () => {
    editingCommentUuid.value = null;
    editingCommentContent.value = '';
  };

  const saveEditedComment = async () => {
    if (!editingCommentUuid.value || isCommentLoading.value) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editingCommentContent.value;
    const hasContent =
      tempDiv.textContent?.trim() || tempDiv.querySelector('img') || tempDiv.querySelector('iframe');

    if (!hasContent) {
      toast.error('Comentário não pode estar vazio');
      return;
    }

    isCommentLoading.value = true;
    try {
      const processedContent = await processRichTextContent(editingCommentContent.value);
      const mentions = QuillMention.extractMentions(processedContent);

      await ticketCommentService.update(editingCommentUuid.value, {
        content: processedContent,
        mentions: mentions.length > 0 ? mentions : undefined,
      });

      toast.success('Comentário atualizado com sucesso');
      editingCommentUuid.value = null;
      editingCommentContent.value = '';
      fetchComments();
    } catch {
      toast.error('Erro ao atualizar comentário');
    } finally {
      isCommentLoading.value = false;
    }
  };

  const fetchTicketUpdates = async () => {
    try {
      if (loadedTicket.value) {
        const response = await TicketUpdateService.getByTicket(loadedTicket.value.customId);
        ticketUpdates.value = response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isMyComment = (userId: number) => userStore.user?.id === userId;

  const isCommentActionable = (createdAt: string) => {
    if (!createdAt) return false;
    const commentDate = new Date(createdAt);
    const diffInMinutes = (nowRef.value.getTime() - commentDate.getTime()) / (1000 * 60);
    return diffInMinutes <= 10;
  };

  const getCommentExpirationTime = (createdAt: string) => {
    if (!createdAt) return '';
    const commentDate = new Date(createdAt);
    const expirationDate = new Date(commentDate.getTime() + 10 * 60 * 1000);
    return expirationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const timeline = computed(() => {
    const commentEvents = comments.value.map((comment) => ({
      type: 'comment' as const,
      createdAt: comment.createdAt,
      data: comment,
    }));

    const updateEvents = ticketUpdates.value.map((update) => ({
      type: 'update' as const,
      createdAt: update.createdAt,
      data: update,
    }));

    const specialUpdateEvents = [];

    if (loadedTicket.value?.disapprovalReason) {
      specialUpdateEvents.push({
        type: 'specialUpdate' as const,
        subType: 'disapproval',
        createdAt: loadedTicket.value.disapprovalReason.createdAt,
        data: {
          id: `disapproval-${loadedTicket.value.id}`,
          content: loadedTicket.value.disapprovalReason.details,
          reason: loadedTicket.value.disapprovalReason.reason,
        },
      });
    }

    if (loadedTicket.value?.cancellationReason) {
      specialUpdateEvents.push({
        type: 'specialUpdate' as const,
        subType: 'cancellation',
        createdAt: loadedTicket.value.cancellationReason.createdAt,
        data: {
          id: `cancellation-${loadedTicket.value.id}`,
          content: loadedTicket.value.cancellationReason.details,
          reason: loadedTicket.value.cancellationReason.reason,
        },
      });
    }

    if (
      loadedTicket.value?.correctionRequests &&
      Array.isArray(loadedTicket.value.correctionRequests)
    ) {
      loadedTicket.value.correctionRequests.forEach((correctionRequest, index) => {
        specialUpdateEvents.push({
          type: 'specialUpdate' as const,
          subType: 'correction',
          createdAt: correctionRequest.createdAt,
          data: {
            id: `correction-${loadedTicket.value!.id}-${index}`,
            content: correctionRequest.details,
            reason: correctionRequest.reason,
          },
        });
      });
    }

    return [...commentEvents, ...updateEvents, ...specialUpdateEvents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  watch(
    () => userPreferencesStore.isDarkMode,
    () => {
      updateCommentLinksColor();
      updateDescriptionLinksColor();
    },
  );

  watch(
    () => comments.value,
    () => {
      updateCommentLinksColor();
    },
    { deep: true },
  );

  watch(
    () => loadedTicket.value,
    () => {
      updateDescriptionLinksColor();
    },
    { deep: true },
  );

  const destroyQuillMention = () => {
    if (quillMentionInstance.value) {
      quillMentionInstance.value.destroy();
      quillMentionInstance.value = null;
    }
    inlineQuillMentionInstances.forEach((instance) => instance.destroy());
    inlineQuillMentionInstances.clear();
  };

  return {
    nowRef,
    nowInterval,
    handleQuillTextChange,
    restoreQuillFocus,
    initializeQuillMention,
    onMainCommentEditorReady,
    onInlineCommentEditorReady,
    fetchMentionableUsers,
    comment,
    updateCommentLinksColor,
    updateDescriptionLinksColor,
    fetchComments,
    handleDeleteCommentClick,
    startEditingComment,
    cancelEditingComment,
    saveEditedComment,
    fetchTicketUpdates,
    timeline,
    isMyComment,
    isCommentActionable,
    getCommentExpirationTime,
    destroyQuillMention,
  };
}
