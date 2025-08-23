export enum RoleName {
  GlobalAdmin = 'Global Admin',
  TenantAdmin = 'Tenant Admin',
  User = 'User',
}

export interface Role {
  id: number;
  name: RoleName;
  createdAt: string;
}
