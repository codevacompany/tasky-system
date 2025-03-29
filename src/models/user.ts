export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  isAdmin?: boolean;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: number;
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
