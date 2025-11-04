export interface TicketStatus {
  id: number;
  key: string;
  name: string;
  statusColumnId: number;
  isDefault: boolean;
}

export interface StatusColumn {
  id: number;
  name: string;
  index: number;
  isDefault: boolean;
  isDisableable: boolean;
  isActive: boolean;
  statuses: TicketStatus[];
  createdAt: string;
  updatedAt: string;
}
