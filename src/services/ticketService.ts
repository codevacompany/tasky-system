import type { CreateTicketDto, Ticket } from "@/models";
import axios from "@/utils/axiosInstance";
import type { AxiosResponse } from "axios";

export const ticketService = {
  async create(data: CreateTicketDto): Promise<AxiosResponse<Ticket>> {
    return axios.post("/tickets", data);
  },

  async fetch(): Promise<AxiosResponse<Ticket[]>> {
    return axios.get("/tickets");
  },

  async getById(id: number): Promise<AxiosResponse<Ticket>> {
    return axios.get(`/tickets/${id}`);
  },

  async getByDepartment(departmentId: number): Promise<AxiosResponse<Ticket[]>> {
    return axios.get(`/tickets/department/${departmentId}`);
  },

  async getByRequester(requesterId: number): Promise<AxiosResponse<Ticket[]>> {
    return axios.get(`/tickets/requester/${requesterId}`);
  },

  async getByTargetUser(targetUserId: number): Promise<AxiosResponse<Ticket[]>> {
    return axios.get(`/tickets/target-user/${targetUserId}`);
  },

  async update(id: number): Promise<AxiosResponse<Ticket>> {
    return axios.patch(`/tickets/${id}`);
  },
};
