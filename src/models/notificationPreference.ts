export type NotificationPreferenceGroup =
  | 'atribuicoes'
  | 'status'
  | 'comentarios'
  | 'atualizacoes';

export interface NotificationEventPreference {
  event: string;
  label: string;
  description: string;
  group: NotificationPreferenceGroup;
  groupLabel: string;
  required: boolean;
  supportsEmail: boolean;
  inAppEnabled: boolean;
  emailEnabled: boolean | null;
}

export interface NotificationPreferencesResponse {
  emailEnabled: boolean;
  tenantEmailAvailable: boolean;
  events: NotificationEventPreference[];
}

export interface UpdateNotificationPreferencesDto {
  emailEnabled?: boolean;
  disabledInAppEvents?: string[];
  disabledEmailEvents?: string[];
}
