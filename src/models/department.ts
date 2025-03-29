export interface Department {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name?: string;
}
