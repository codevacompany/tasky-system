import { checklistService } from '@/services/checklistService';
import { nextTick, onMounted, onUnmounted, watch } from 'vue';
import { toast } from 'vue-sonner';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { useTicketDetailsComments } from './useTicketDetailsComments';
import type { useTicketDetailsFiles } from './useTicketDetailsFiles';
import type { useTicketDetailsWorkflow } from './useTicketDetailsWorkflow';

export function useTicketDetailsCore(
  ctx: TicketDetailsContext,
  comments: ReturnType<typeof useTicketDetailsComments>,
  files: ReturnType<typeof useTicketDetailsFiles>,
  workflow: ReturnType<typeof useTicketDetailsWorkflow>,
) {
  const {
    props,
    emit,
    ticketsStore,
    loadedTicket,
    isLoadingTicket,
    hasLoadedTicketOnce,
    checklistItems,
    showTarefasSection,
    tarefasSectionRef,
    ticketChecklistRef,
    comments: commentsRef,
    ticketUpdates,
    openCommentMenuId,
    isActionsDropdownOpen,
  } = ctx;

  const {
    fetchComments,
    fetchTicketUpdates,
    fetchMentionableUsers,
    updateDescriptionLinksColor,
    destroyQuillMention,
  } = comments;

  const { applyPostLoadAlerts } = workflow;

  const loadChecklistItems = async () => {
    if (!loadedTicket.value) return;
    try {
      const { data } = await checklistService.getByTicket(loadedTicket.value.id);
      checklistItems.value = data;

      if (data.length > 0) {
        showTarefasSection.value = true;
      }

      if (loadedTicket.value) {
        loadedTicket.value.checklistItems = data;
        ticketsStore.updateTicketInCollections(loadedTicket.value);
      }
    } catch (error) {
      console.error('Error loading checklist items:', error);
    }
  };

  const scrollToTarefas = async () => {
    showTarefasSection.value = true;
    await nextTick();
    if (tarefasSectionRef.value) {
      tarefasSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(async () => {
        if (ticketChecklistRef.value) {
          await ticketChecklistRef.value.startAddItem();
        }
      }, 200);
    }
  };

  const fetchTicket = async (customId: string, silent = false) => {
    if (!silent) {
      isLoadingTicket.value = true;
      showTarefasSection.value = false;
    }
    try {
      const ticket = await ticketsStore.fetchTicketDetails(customId);
      loadedTicket.value = ticket;
      hasLoadedTicketOnce.value = true;
      fetchComments();
      fetchTicketUpdates();
      loadChecklistItems();
      fetchMentionableUsers();
      updateDescriptionLinksColor();
      applyPostLoadAlerts(silent);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      if (!silent) {
        toast.error('Erro ao carregar tarefa');
        emit('close');
      }
    } finally {
      if (!silent) isLoadingTicket.value = false;
    }
  };

  const refreshSelectedTicket = async () => {
    if (loadedTicket.value?.customId) {
      await fetchTicket(loadedTicket.value.customId);
    } else if (props.ticketCustomId) {
      await fetchTicket(props.ticketCustomId);
    }
  };

  watch(
    () => props.ticketCustomId,
    (newCustomId) => {
      if (newCustomId) {
        hasLoadedTicketOnce.value = false;
        fetchTicket(newCustomId);
      } else {
        loadedTicket.value = null;
        commentsRef.value = [];
        ticketUpdates.value = [];
        hasLoadedTicketOnce.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    () => ticketsStore.lastTicketUpdateEvent,
    (event) => {
      if (event && event.customId === props.ticketCustomId) {
        fetchTicket(event.customId, true);
      }
    },
  );

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.comment-menu-container')) {
      openCommentMenuId.value = null;
    }
    if (!target.closest('.actions-dropdown-container')) {
      isActionsDropdownOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', files.handleImageViewerKeyboard);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', files.handleImageViewerKeyboard);
    destroyQuillMention();
    files.cleanupFiles();
  });

  return {
    fetchTicket,
    refreshSelectedTicket,
    loadChecklistItems,
    scrollToTarefas,
    handleClickOutside,
  };
}
