import type { Department } from "./department";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  department: Department;
  isAdmin?: boolean;
}

export interface CreateUserDto {
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
