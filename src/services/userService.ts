import type { User, CreateUserDto, UpdateUserDto } from '@/models';
import axios from '@/utils/axiosInstance';
import type { AxiosResponse } from 'axios';

export const userService = {
  async create(data: CreateUserDto): Promise<AxiosResponse<User>> {
    return axios.post<User>('/users', data);
  },

  async fetch(): Promise<AxiosResponse<User[]>> {
    return axios.get<User[]>('/users');
  },

  // async getById(id: number): Promise<AxiosResponse<User>> {
  //   return axios.get<User>(`/users/${id}`);
  // },

  async getByEmail(email: string): Promise<AxiosResponse<User[]>> {
    return axios.get<User[]>(`/users/${email}`);
  },

  async update(id: number, data: UpdateUserDto): Promise<AxiosResponse<User>> {
    return axios.patch<User>(`/users/${id}`, data);
  },
};
