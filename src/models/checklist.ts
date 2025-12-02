import type { User } from './user';

export interface ChecklistItem {
  id: number;
  title: string;
  isCompleted: boolean;
  ticketId: number;
  assignedToId?: number;
  assignedTo?: User;
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChecklistItemDto {
  title: string;
  ticketId: number;
  assignedToId?: number;
  dueDate?: string;
  order?: number;
}

export interface UpdateChecklistItemDto {
  title?: string;
  isCompleted?: boolean;
  assignedToId?: number;
  dueDate?: string;
  order?: number;
}
