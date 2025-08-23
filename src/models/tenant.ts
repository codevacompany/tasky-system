export interface Tenant {
  id: number;
  name: string;
  isInternal: boolean;
  customKey: string;
  createdAt: string;
}

export interface CreateTenantDto {
  name: string;
  customKey: string;
}

export interface UpdateTenantDto {
  name?: string;
  customKey?: string;
}
