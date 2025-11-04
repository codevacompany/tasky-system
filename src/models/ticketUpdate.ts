import type { DefaultTicketStatus } from './ticket';
import type { User } from './user';

export enum TicketActionType {
  Creation = 'criação',
  StatusUpdate = 'mudança_de_status',
  Completion = 'finalização',
  Update = 'atualização',
  Cancellation = 'cancelamento',
  AssigneeChange = 'mudança_de_responsável',
}

export interface TicketUpdate {
  id: number;
  ticketId: number;
  ticketCustomId: string;
  description: string;
  performedBy: User;
  fromStatus: DefaultTicketStatus;
  toStatus: DefaultTicketStatus;
  action: TicketActionType;
  createdAt: string;
}
