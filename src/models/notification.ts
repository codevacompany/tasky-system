import type { User } from "./user";

export enum NotificationType {
  Open = 'Abertura',
  Comment = 'Comentário',
  StatusUpdated = 'Atualização de Status',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  createdBy?: User;
  targetUser: User;
  resourceId: number | null;
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
