export interface Tenant {
  id: number;
  name: string;
  isInternal: boolean;
  customKey: string;
  createdAt: string;
  stripeCustomerId?: string | null;
}

export interface CreateTenantDto {
  name: string;
  customKey: string;
}

export interface UpdateTenantDto {
  name?: string;
  customKey?: string;
}
