import type { User } from './user';

export interface ChecklistItem {
  id: number;
  title: string;
  isCompleted: boolean;
  checklistId: number;
  assignedToId?: number;
  assignedTo?: User;
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Checklist {
  id: number;
  title: string;
  ticketId: number;
  items: ChecklistItem[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChecklistDto {
  title: string;
  ticketId: number;
}

export interface UpdateChecklistDto {
  title?: string;
  order?: number;
}

export interface CreateChecklistItemDto {
  title: string;
  checklistId: number;
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

