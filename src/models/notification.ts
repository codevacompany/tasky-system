import type { User } from "./user";

export enum NotificationType {
  Open = 'abertura',
  Comment = 'comentário',
  StatusUpdate = 'atualização_de_status',
  TicketUpdate = 'atualização',
  Cancellation = 'cancelamento',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  createdBy: User;
  targetUser: User;
  resourceId: number;
  resourceCustomId?: string
  createdAt: string;
}

export interface CreateNotificationDto {
  type: NotificationType;
  message: string;
  dateTime: string;
}

export interface UpdateNotificationDto {
  type?: NotificationType;
  message?: string;
  dateTime?: string;
  read?: boolean;
}
