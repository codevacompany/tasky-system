import type { Department } from './department';

export interface Tag {
  id: number;
  uuid: string;
  name: string;
  color: string;
  isActive: boolean;
  suggestedForDepartments?: Department[];
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagDto {
  name: string;
  color: string;
  suggestedForDepartmentIds?: number[];
}

export interface UpdateTagDto {
  name?: string;
  color?: string;
  isActive?: boolean;
  suggestedForDepartmentIds?: number[];
}
