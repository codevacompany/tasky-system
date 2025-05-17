import type { Ticket } from "./ticket";
import type { User } from "./user";

export enum CancellationReason {
  ChangedPriorities = 'mudança_de_prioridades',
  LackOfResources = 'falta_de_recursos',
  ProcessChange = 'mudança_no_processo',
  PersonalUnexpected = 'imprevisto_pessoal',
  RedundantTask = 'tarefa_redundante',
  StrategyChange = 'mudança_na_estratégia',
  ResponsibleAbsence = 'ausência_de_responsável',
  CostReassessment = 'reavaliação_de_custos',
  PlanningError = 'erro_de_planejamento',
  TechnicalIssues = 'problemas_técnicos',
  Other = 'outro',
}

export interface TicketCancellationReason {
  id: number;
  ticket: Ticket;
  user: User;
  details: string;
  reason: CancellationReason;
  createdAt: string;
}

export interface CreateTicketCancellationReasonDto {
  ticketId: number;
  ticketCustomId: string;
  userId: number;
  content: string;
}

export interface UpdateTicketCancellationReasonDto {
  ticketId?: number;
  ticketCustomId?: string
  userId?: number;
  content?: string;
}
