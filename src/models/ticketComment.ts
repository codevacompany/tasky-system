import type { Ticket } from "./ticket";
import type { User } from "./user";

export interface TicketComment {
  id: number;
  ticket: Ticket;
  user: User;
  content: string;
  createdAt: string;
}

export interface CreateTicketCommentDto {
  ticketId: number;
  ticketCustomId: string;
  userId: number;
  content: string;
}

export interface UpdateTicketCommentDto {
  ticketId?: number;
  ticketCustomId?: string
  userId?: number;
  content?: string;
}
