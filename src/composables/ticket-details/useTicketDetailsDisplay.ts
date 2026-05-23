import { DefaultTicketStatus } from '@/models';
import type { TicketUpdate } from '@/models/ticketUpdate';
import { formatSnakeToNaturalCase, getDeadlineInfo } from '@/utils/generic-helper';
import type { SpecialUpdateEvent } from './types';

export function useTicketDetailsDisplay() {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'baixa':
        return 'text-green-500';
      case 'média':
        return 'text-orange-500';
      case 'alta':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case DefaultTicketStatus.Pending:
        return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case DefaultTicketStatus.InProgress:
        return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case DefaultTicketStatus.AwaitingVerification:
      case DefaultTicketStatus.UnderVerification:
        return 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      case DefaultTicketStatus.Completed:
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case DefaultTicketStatus.Rejected:
        return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case DefaultTicketStatus.Returned:
        return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case DefaultTicketStatus.Canceled:
        return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getDeadlineInfoFromDate = (date?: string) => {
    if (!date) return null;
    const info = getDeadlineInfo(date);
    return info.isValid ? info : null;
  };

  const getDeadlineTextClass = (date?: string) => {
    const info = getDeadlineInfoFromDate(date);
    if (!info) return 'text-txt-primary dark:text-gray-100';

    if (info.isOverdue) return 'text-red-600 dark:text-red-400';
    if (!info.isOverdue && info.hoursDifference <= 6) return 'text-red-600 dark:text-red-400';
    if (info.businessDaysRemaining <= 2) return 'text-orange-500 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const isDeadlineOverdue = (date?: string) => {
    const info = getDeadlineInfoFromDate(date);
    return info ? info.isOverdue : false;
  };

  const formatTicketUpdateDescription = (ticketUpdate: TicketUpdate) => {
    return `${ticketUpdate.description.replace('user', `${ticketUpdate.performedBy.firstName} ${ticketUpdate.performedBy.lastName}`)}`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'baixa':
        return 'angles-down';
      case 'media':
        return 'equals';
      case 'alta':
        return 'angles-up';
      default:
        return 'equals';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case DefaultTicketStatus.Pending:
        return 'clock';
      case DefaultTicketStatus.InProgress:
        return 'spinner';
      case DefaultTicketStatus.AwaitingVerification:
        return 'hourglass-half';
      case DefaultTicketStatus.UnderVerification:
        return 'search';
      case DefaultTicketStatus.Completed:
        return 'check-circle';
      case DefaultTicketStatus.Rejected:
        return 'times-circle';
      case DefaultTicketStatus.Returned:
        return 'exclamation-circle';
      default:
        return 'question-circle';
    }
  };

  const getEventIcon = (description: string) => {
    if (description.includes('criou')) return 'plus-circle';
    if (description.includes('aceitou')) return 'check-circle';
    if (description.includes('enviou para verificação')) return 'eye';
    if (description.includes('aprovou')) return 'thumbs-up';
    if (description.includes('rejeitou')) return 'thumbs-down';
    if (description.includes('solicitou correção')) return 'undo';
    if (description.includes('cancelou')) return 'ban';
    if (description.includes('iniciou correção')) return 'wrench';
    return 'info-circle';
  };

  const getSpecialUpdateTitle = (subType: string, event?: SpecialUpdateEvent) => {
    const baseTitle = (() => {
      switch (subType) {
        case 'disapproval':
          return 'Tarefa Reprovada';
        case 'cancellation':
          return 'Tarefa Cancelada';
        case 'correction':
          return 'Solicitação de Correção';
        default:
          return 'Atualização';
      }
    })();

    if (event?.data?.reason) {
      return `${baseTitle} - ${formatSnakeToNaturalCase(event.data.reason)}`;
    }

    return baseTitle;
  };

  const getSpecialUpdateDescription = (_subType: string, event?: SpecialUpdateEvent) => {
    return event?.data?.content || '';
  };

  return {
    getPriorityClass,
    getStatusClass,
    getDeadlineInfoFromDate,
    getDeadlineTextClass,
    isDeadlineOverdue,
    formatTicketUpdateDescription,
    getPriorityIcon,
    getStatusIcon,
    getEventIcon,
    getSpecialUpdateTitle,
    getSpecialUpdateDescription,
  };
}
