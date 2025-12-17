import type { Department } from './department';
import type { Role } from './role';

export interface User {
  id: number;
  uuid: string;
  tenantId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  department: Department;
  isActive: boolean;
  role: Role;
  status?: 'online' | 'offline' | 'away';
  permissions?: string[];
  loginCount?: number;
  lastLogin?: string | Date | null;
}

export interface CreateUserDto {
  tenantId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  departmentId: number | null;
  roleId: number | null;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  departmentId?: number | null;
  isAdmin?: boolean;
  isActive?: boolean;
}
