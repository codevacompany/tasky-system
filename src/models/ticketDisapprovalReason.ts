import type { Ticket } from "./ticket";
import type { User } from "./user";

export enum DisapprovalReason {
  QualityErrors = 'erros_de_qualidade',
  ComprehensionProblems = 'problemas_de_compreensão',
  ProcessFollowingFailure = 'falha_na_acompanhamento_de_processos',
  RequirementsNotMet = 'não_atende_aos_requisitos',
  DeadlineNotMet = 'prazo_não_cumprido',
  ExecutionOrImplementationError = 'erro_de_execução_ou_implementação',
  FeedbackNotConsidered = 'não_consideração_de_feedbacks',
  InconsistentTask = 'tarefa_com_inconsistências',
  CommunicationError = 'erro_de_comunicação',
  InadequateTools = 'inadequação_de_ferramentas',
  LackOfResources = 'falta_de_recursos',
  LackOfKnowledgeOrSkill = 'falta_de_conhecimento_ou_habilidade',
  Other = 'outro',
}

export interface TicketDisapprovalReason {
  id: number;
  ticket: Ticket;
  user: User;
  details: string;
  reason: DisapprovalReason;
  createdAt: string;
}

export interface CreateTicketDisapprovalReasonDto {
  ticketId: number;
  ticketCustomId: string;
  userId: number;
  content: string;
}

export interface UpdateTicketDisapprovalReasonDto {
  ticketId?: number;
  ticketCustomId?: string
  userId?: number;
  content?: string;
}
