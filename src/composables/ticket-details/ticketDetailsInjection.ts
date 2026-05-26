import type { InjectionKey } from 'vue';
import type { TicketDetailsContext } from './ticketDetailsContext';
import type { useTicketDetailsAccess } from './useTicketDetailsAccess';
import type { useTicketDetailsAssignees } from './useTicketDetailsAssignees';
import type { useTicketDetailsComments } from './useTicketDetailsComments';
import type { useTicketDetailsConfirmation } from './useTicketDetailsConfirmation';
import type { useTicketDetailsCore } from './useTicketDetailsCore';
import type { useTicketDetailsDisplay } from './useTicketDetailsDisplay';
import type { useTicketDetailsDueDate } from './useTicketDetailsDueDate';
import type { useTicketDetailsEditing } from './useTicketDetailsEditing';
import type { useTicketDetailsFiles } from './useTicketDetailsFiles';
import type { useTicketDetailsWorkflow } from './useTicketDetailsWorkflow';

export interface TicketDetailsProvided {
  ctx: TicketDetailsContext;
  access: ReturnType<typeof useTicketDetailsAccess>;
  confirmation: ReturnType<typeof useTicketDetailsConfirmation>;
  refreshSelectedTicket: () => Promise<void>;
  display: ReturnType<typeof useTicketDetailsDisplay>;
  comments: ReturnType<typeof useTicketDetailsComments>;
  files: ReturnType<typeof useTicketDetailsFiles>;
  workflow: ReturnType<typeof useTicketDetailsWorkflow>;
  editing: ReturnType<typeof useTicketDetailsEditing>;
  assignees: ReturnType<typeof useTicketDetailsAssignees>;
  dueDate: ReturnType<typeof useTicketDetailsDueDate>;
  core: ReturnType<typeof useTicketDetailsCore>;
}

export const TICKET_DETAILS_DEPS_KEY: InjectionKey<TicketDetailsProvided> =
  Symbol('ticketDetailsDeps');
