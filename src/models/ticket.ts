import type { Category } from './category';
import type { CorrectionRequest } from './correctionRequest';
import type { Department } from './department';
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

export enum TicketStatus {
  Pending = 'pendente',
  InProgress = 'em_andamento',
  AwaitingVerification = 'aguardando_verificação',
  UnderVerification = 'em_verificação',
  Completed = 'finalizado',
  Canceled = 'cancelado',
  Returned = 'devolvido',
  Rejected = 'reprovado',
}

export interface Ticket {
  id: number;
  customId: string;
  name: string;
  priority: TicketPriority;
  description: string;
  department: Department;
  requester: User;
  targetUser: User;
  status: TicketStatus;
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
  departmentId: number | null;
  requesterId: number | null;
  targetUserId: number | null;
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
  departmentId?: number;
  requesterId?: User;
  targetUserId?: User;
  categoryId?: number | null;
  dueAt?: string;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
}
