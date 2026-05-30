import { DefaultTicketStatus } from '@/models';
import { ticketService } from '@/services/ticketService';
import { nextTick } from 'vue';
import { toast } from 'vue-sonner';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { useTicketDetailsAccess } from './useTicketDetailsAccess';
import type { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';

export function useTicketDetailsEditing(
  ctx: TicketDetailsContext,
  access: ReturnType<typeof useTicketDetailsAccess>,
  confirmation: ReturnType<typeof useTicketDetailsConfirmation>,
  refreshSelectedTicket: () => Promise<void>,
) {
  const {
    loadedTicket,
    isEditingName,
    isEditingDescription,
    editingName,
    editingDescription,
    descriptionEditorKey,
    nameInput,
    showAddMenu,
    richText,
  } = ctx;

  const { isRequester } = access;
  const { openConfirmationModal } = confirmation;
  const { processRichTextContent } = richText;

  const startEditingName = () => {
    const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
    if (!isRequester.value || currentStatus !== DefaultTicketStatus.Pending) return;
    isEditingName.value = true;
    editingName.value = loadedTicket.value?.name || '';
    nextTick(() => {
      nameInput.value?.focus();
    });
  };

  const saveTicketName = async () => {
    if (!editingName.value.trim()) {
      toast.error('O assunto da tarefa não pode estar vazio');
      return;
    }

    try {
      await ticketService.update(loadedTicket.value!.customId, {
        name: editingName.value.trim(),
      });

      isEditingName.value = false;

      if (loadedTicket.value) {
        loadedTicket.value.name = editingName.value.trim();
      }

      toast.success('Assunto atualizado com sucesso');
      await refreshSelectedTicket();
    } catch {
      toast.error('Erro ao atualizar nome da tarefa');
    }
  };

  const cancelEditingName = () => {
    isEditingName.value = false;
    editingName.value = loadedTicket.value?.name || '';
  };

  const startEditingDescription = () => {
    const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
    if (!isRequester.value || currentStatus !== DefaultTicketStatus.Pending) return;
    isEditingDescription.value = true;
    editingDescription.value = loadedTicket.value?.description || '';
    descriptionEditorKey.value += 1;
  };

  const saveTicketDescription = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editingDescription.value;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    if (!textContent.trim()) {
      toast.error('Descrição da tarefa não pode estar vazia');
      return;
    }

    try {
      const processedDescription = await processRichTextContent(editingDescription.value);

      await ticketService.update(loadedTicket.value!.customId, {
        description: processedDescription,
      });

      isEditingDescription.value = false;

      if (loadedTicket.value) {
        loadedTicket.value.description = processedDescription;
      }
      editingDescription.value = processedDescription;

      await refreshSelectedTicket();
    } catch {
      toast.error('Erro ao atualizar descrição da tarefa');
    }
  };

  const cancelEditingDescription = () => {
    isEditingDescription.value = false;
    editingDescription.value = loadedTicket.value?.description || '';
    descriptionEditorKey.value += 1;
  };

  const cancelVerificationRequest = async (ticketId: string) => {
    openConfirmationModal(
      'Cancelar Envio para Verificação',
      'Tem certeza que deseja cancelar o envio para verificação?',
      async () => {
        try {
          await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
          toast.success('Envio para verificação cancelado');
          await refreshSelectedTicket();
        } catch {
          toast.error('Erro ao cancelar envio para verificação');
        }
      },
    );
  };

  const selectAttachFile = (openFileInput: () => void) => {
    showAddMenu.value = false;
    openFileInput();
  };

  const closeAddMenu = () => {
    showAddMenu.value = false;
  };

  return {
    startEditingName,
    saveTicketName,
    cancelEditingName,
    startEditingDescription,
    saveTicketDescription,
    cancelEditingDescription,
    cancelVerificationRequest,
    selectAttachFile,
    closeAddMenu,
  };
}
