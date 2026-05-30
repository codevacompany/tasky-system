import type { Ticket } from '@/models';
import { ticketService } from '@/services/ticketService';
import { ref, type Ref } from 'vue';
import { toast } from 'vue-sonner';

export function useTicketDetailsDueDate(deps: {
  loadedTicket: Ref<Ticket | null>;
  refreshSelectedTicket: () => Promise<void>;
}) {
  const { loadedTicket, refreshSelectedTicket } = deps;

  const showDueDateModal = ref(false);
  const dueDateValue = ref<string | null>(null);
  const dueDateDate = ref<Date | null>(null);
  const isDueDateModalLoading = ref(false);

  const disabledWeekendDate = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const parseDateTime = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
      );
    } catch {
      return null;
    }
  };

  const handleDatePickerChange = (value: string | null) => {
    if (value) {
      dueDateValue.value = value;
      dueDateDate.value = parseDateTime(value);
    } else {
      dueDateValue.value = null;
      dueDateDate.value = null;
    }
  };

  const formatDateOnly = (date: string | Date | null | undefined): string => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) return '-';

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const confirmDueDate = async () => {
    if (!dueDateValue.value || !loadedTicket.value) return;

    isDueDateModalLoading.value = true;
    try {
      const dueAtISO = dueDateDate.value ? dueDateDate.value.toISOString() : null;

      if (!dueAtISO) {
        toast.error('Data inválida');
        isDueDateModalLoading.value = false;
        return;
      }

      await ticketService.update(loadedTicket.value.customId, { dueAt: dueAtISO });
      await ticketService.accept(loadedTicket.value.customId);

      toast.success('Tarefa aceita com sucesso');
      showDueDateModal.value = false;
      dueDateValue.value = null;
      dueDateDate.value = null;
      await refreshSelectedTicket();
    } catch {
      toast.error('Erro ao definir prazo e aceitar tarefa');
    } finally {
      isDueDateModalLoading.value = false;
    }
  };

  return {
    showDueDateModal,
    dueDateValue,
    dueDateDate,
    isDueDateModalLoading,
    disabledWeekendDate,
    parseDateTime,
    handleDatePickerChange,
    formatDateOnly,
    confirmDueDate,
  };
}
