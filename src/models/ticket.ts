import type { Category } from './category';
import type { Department } from './department';
import type { TicketUpdate } from './ticketUpdate';
import type { User } from './user';

export enum TicketPriority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
}

export enum TicketStatus {
  Pending = 'Pendente',
  InProgress = 'Em andamento',
  AwaitingVerification = 'Aguardando verificação',
  Overdue = 'Atrasado',
  Completed = 'Finalizado',
  Returned = 'Devolvido',
  Rejected = 'Reprovado',
}

export interface Ticket {
  id: number;
  name: string;
  priority: TicketPriority;
  description: string;
  department: Department;
  requester: User;
  targetUser: User;
  status: TicketStatus;
  completionDate?: string;
  acceptanceDate?: string;
  category?: Category;
  updates: TicketUpdate[];
  disapprovalReason?: string;
  createdAt: string;
}

export interface CreateTicketDto {
  name: string;
  priority: TicketPriority;
  description: string;
  departmentId: number | null;
  requesterId: number | null;
  targetUserId: number | null;
  completionDate?: string;
}

export interface UpdateTicketDto {
  name?: string;
  priority?: TicketPriority;
  description?: string;
  departmentId?: number;
  requesterId?: User;
  targetUserId?: User;
  completionDate?: string;
}
