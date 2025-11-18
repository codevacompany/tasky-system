import type { Category } from './category';
import type { CorrectionRequest } from './correctionRequest';
import type { TicketCancellationReason } from './ticketCancellationReason';
import type { TicketComment } from './ticketComment';
import type { TicketDisapprovalReason } from './ticketDisapprovalReason';
import type { TicketFile } from './ticketFile';
import type { TicketUpdate } from './ticketUpdate';
import type { User } from './user';

export enum TicketPriority {
  Low = 'baixa',
  Medium = 'média',
  High = 'alta',
}

export enum DefaultTicketStatus {
  Pending = 'pendente',
  InProgress = 'em_andamento',
  AwaitingVerification = 'aguardando_verificação',
  UnderVerification = 'em_verificação',
  Completed = 'finalizado',
  Canceled = 'cancelado',
  Returned = 'devolvido',
  Rejected = 'reprovado',
}

export interface TicketTargetUser {
  id: number;
  userId: number;
  ticketId: number;
  order: number;
  user: User;
}

export interface Ticket {
  id: number;
  uuid: string;
  customId: string;
  name: string;
  priority: TicketPriority;
  description: string;
  requester: User;
  targetUsers: TicketTargetUser[];
  currentTargetUser?: User;
  currentTargetUserId?: number;
  reviewer?: User;
  status: DefaultTicketStatus;
  ticketStatus?: {
    id: number;
    key: string;
    name: string;
    statusColumnId: number;
  };
  completedAt?: string;
  acceptedAt?: string;
  dueAt?: string;
  canceledAt?: string;
  category?: Category;
  comments: TicketComment[];
  updates: TicketUpdate[];
  disapprovalReason?: TicketDisapprovalReason;
  correctionRequests?: CorrectionRequest[];
  cancellationReason?: TicketCancellationReason;
  isPrivate: boolean;
  files: TicketFile[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  name: string;
  priority: TicketPriority;
  description: string;
  requesterId: number | null;
  targetUserIds: number[];
  categoryId: number | null;
  dueAt?: string;
  canceledAt?: string;
  isPrivate: boolean;
  files?: string[];
}

export interface UpdateTicketDto {
  name?: string;
  priority?: TicketPriority;
  description?: string;
  requesterId?: User;
  targetUserIds?: number[];
  categoryId?: number | null;
  dueAt?: string;
}

export interface UpdateTicketStatusDto {
  status: DefaultTicketStatus;
}
