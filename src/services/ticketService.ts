import axios from "@/utils/axiosInstance"; // Optional: Create a custom Axios instance

export const TicketService = {
  async createTicket(data: { title: string; description: string }) {
    return axios.post("/tickets", data);
  },

  async getTickets() {
    return axios.get("/tickets");
  },

  async getTicketById(id: number) {
    return axios.get(`/tickets/${id}`);
  },
};
