import type { Ticket } from "./ticket";
import type { User } from "./user";

export enum CorrectionReason {
  AnalysisErrors = 'erros_de_análise',
  LackOfDetail = 'falta_de_detalhamento',
  IncompleteResults = 'resultados_incompletos',
  InterpretationError = 'erro_de_interpretação',
  QualityProblems = 'problemas_de_qualidade',
  PreviousFeedbackNotConsidered = 'não_consideração_de_feedback_anterior',
  RequiredTestsNotPerformed = 'não_execução_de_testes_necessários',
  DataOrSystemsIntegrationFailures = 'falhas_na_integração_de_dados_ou_sistemas',
  NonComplianceWithRequirements = 'não_conformidade_com_requisitos',
  SupportDocumentationIssue = 'problema_com_a_documentação_de_suporte',
  LackOfRiskAssessment = 'falta_de_avaliação_de_riscos',
  Other = 'outro',
}

export interface CorrectionRequest {
  id: number;
  ticket: Ticket;
  user: User;
  details: string;
  reason: CorrectionReason;
  createdAt: string;
}

export interface CreateCorrectionRequestDto {
  ticketId: number;
  ticketCustomId: string;
  userId: number;
  content: string;
}

export interface UpdateCorrectionRequestDto {
  ticketId?: number;
  ticketCustomId?: string
  userId?: number;
  content?: string;
}
