export interface Category {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}
