import type { Ticket } from "./ticket";
import type { User } from "./user";

export interface TicketUpdate {
  id: number;
  ticket: Ticket;
  user: User;
  comment: string;
  dateTime: string;
  createdAt: string;
}

export interface CreateTicketUpdateDto {
  ticketId: number;
  userId: number;
  dateTime: string;
  comment: string;
}

export interface UpdateTicketUpdateDto {
  ticketId?: number;
  userId?: number;
  dateTime?: string;
  comment?: string;
}
