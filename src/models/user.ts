import type { Department } from './department';
import type { Role } from './role';

export interface User {
  id: number;
  tenantId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  department: Department;
  isActive: boolean;
  role: Role;
  status?: 'online' | 'offline' | 'away';
}

export interface CreateUserDto {
  tenantId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: number | null;
  isAdmin?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  departmentId?: number;
  isAdmin?: boolean;
}
