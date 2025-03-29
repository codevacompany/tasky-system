import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '@/models';
import axios from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const DepartmentService = {
  async create(data: CreateDepartmentDto): Promise<AxiosResponse<Department>> {
    return axios.post<Department>('/departments', data);
  },

  async fetch(): Promise<AxiosResponse<Department[]>> {
    return axios.get<Department[]>('/departments');
  },

  async getById(id: number): Promise<AxiosResponse<Department>> {
    return axios.get<Department>(`/departments/${id}`);
  },

  async update(id: number, data: UpdateDepartmentDto): Promise<AxiosResponse<Department>> {
    return axios.patch<Department>(`/departments/${id}`, data);
  },
};
