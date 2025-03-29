import type { CreateTicketDto, Ticket } from "@/models";
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

  async update(id: number): Promise<AxiosResponse<Ticket>> {
    return apiClient.patch(`/tickets/${id}`);
  },
};
