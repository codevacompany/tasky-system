export interface Department {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name?: string;
}
