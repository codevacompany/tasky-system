import type { CreateTicketDto, Ticket, UpdateTicketDto, UpdateTicketStatusDto } from "@/models";
import apiClient from "@/utils/axiosInstance";
import type { AxiosResponse } from "axios";

export const ticketService = {
  async create(data: CreateTicketDto): Promise<AxiosResponse<Ticket>> {
    return apiClient.post("/tickets", data);
  },

  async fetch(): Promise<AxiosResponse<Ticket[]>> {
    return apiClient.get("/tickets");
  },

  async getById(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.get(`/tickets/${id}`);
  },

  async getByDepartment(departmentId: number): Promise<AxiosResponse<Ticket[]>> {
    return apiClient.get(`/tickets/department/${departmentId}`);
  },

  async getByRequester(requesterId: number): Promise<AxiosResponse<Ticket[]>> {
    return apiClient.get(`/tickets/requester/${requesterId}`);
  },

  async getByTargetUser(targetUserId: number): Promise<AxiosResponse<Ticket[]>> {
    return apiClient.get(`/tickets/target-user/${targetUserId}`);
  },

  async update(id: number, data: UpdateTicketDto): Promise<AxiosResponse<Ticket>> {
    return apiClient.patch(`/tickets/${id}`, data);
  },

  async updateStatus(id: number, data: UpdateTicketStatusDto): Promise<AxiosResponse<Ticket>> {
    return apiClient.patch(`/tickets/${id}/status`, data);
  },

  async accept(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/accept`);
  },

  async approve(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.post(`/tickets/${id}/approve`);
  },

  async delete(id: number) {
    return apiClient.delete(`/tickets/${id}`);
  },
};
