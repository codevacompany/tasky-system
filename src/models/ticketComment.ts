import type { Ticket } from './ticket';
import type { User } from './user';

export interface TicketComment {
  id: number;
  uuid: string;
  ticket: Ticket;
  user: User;
  content: string;
  createdAt: string;
}

export interface Mention {
  userId: number;
  position: number;
  length: number;
}

export interface CreateTicketCommentDto {
  ticketId: number;
  ticketCustomId: string;
  userId: number;
  content: string;
  mentions?: Mention[];
}

export interface UpdateTicketCommentDto {
  ticketId?: number;
  ticketCustomId?: string;
  userId?: number;
  content?: string;
  mentions?: Mention[];
}
