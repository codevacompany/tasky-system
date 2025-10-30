export enum RoleName {
  GlobalAdmin = 'Administrador Global',
  TenantAdmin = 'Administrador',
  Supervisor = 'Supervisor',
  User = 'Usuário',
}

export interface Role {
  id: number;
  name: RoleName;
  createdAt: string;
}
