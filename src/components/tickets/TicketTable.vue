<template>
  <div>
    <div class="tickets-table-container">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Solicitante</th>
            <th>Setor</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Data Criação</th>
            <th>Conclusão</th>
            <th>Prazo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id" @click="openTicketDetails(ticket)">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.name }}</td>
            <td>{{ ticket.requester.firstName }} {{ ticket.requester.lastName }}</td>
            <td>{{ ticket.department.name }}</td>
            <td>
              <span :class="['priority-label', priorityColor(ticket.priority)]">{{
                ticket.priority
              }}</span>
            </td>
            <td>
              <span :class="['status-label', statusColor(ticket.status)]">{{ ticket.status }}</span>
            </td>
            <td>{{ formatDate(ticket.createdAt) }}</td>
            <td>{{ formatDate(ticket.completionDate) }}</td>
            <td :class="{ 'past-deadline': isPastDeadline(ticket.completionDate) }">
              {{ calculateDeadline(ticket) }}
              <font-awesome-icon
                v-if="isPastDeadline(ticket.completionDate)"
                icon="exclamation-triangle"
                class="warning-icon"
              />
            </td>
            <td>
              <button @click.stop="$emit('viewTicket', ticket)">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="tickets.length === 0" class="no-tickets-message">
        <font-awesome-icon icon="ticket" />
        <p>Nenhum ticket encontrado</p>
      </div>
    </div>
    <div class="pagination">
      <button class="pagination-btn" id="prevPageSetor">
        <font-awesome-icon icon="chevron-left" />
      </button>
      <span id="paginationInfoSetor">Página 1 de 1</span>
      <button class="pagination-btn" id="nextPageSetor">
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <TicketDetailsModal :isOpen="isModalOpen" :ticket="selectedTicket!" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ticket } from '@/models';
import { defineProps } from 'vue';
import { TicketStatus, TicketPriority } from '@/models';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';

defineProps<{ tickets: Ticket[] }>();
const isModalOpen = ref(false);
const selectedTicket = ref<Ticket | null>(null);

const openTicketDetails = (ticket: Ticket) => {
  selectedTicket.value = ticket;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedTicket.value = null;
};

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '—');
const calculateDeadline = (ticket: Ticket) => {
  return ticket.completionDate ? formatDate(ticket.completionDate) : '—';
};

const isPastDeadline = (date?: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const statusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'status-pending';
    case TicketStatus.InProgress:
      return 'status-in-progress';
    case TicketStatus.AwaitingVerification:
      return 'status-awaiting-verification';
    case TicketStatus.Overdue:
      return 'status-overdue';
    case TicketStatus.Completed:
      return 'status-completed';
    case TicketStatus.Returned:
      return 'status-returned';
    case TicketStatus.Rejected:
      return 'status-rejected';
    default:
      return '';
  }
};

const priorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.Low:
      return 'priority-low';
    case TicketPriority.Medium:
      return 'priority-medium';
    case TicketPriority.High:
      return 'priority-high';
    default:
      return '';
  }
};
</script>

<style scoped>
.tickets-table-container {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  margin-bottom: 1.5rem;
}

.tickets-table {
  width: 100%;
  border-collapse: collapse;
}

.tickets-table th,
.tickets-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.tickets-table th {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-light);
  background-color: rgba(0, 0, 0, 0.02);
}

.tickets-table tr:last-child td {
  border-bottom: none;
}

.tickets-table tr:hover td {
  background-color: rgba(0, 0, 0, 0.02);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.pagination-btn:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#paginationInfo {
  font-size: 0.9rem;
  color: var(--text-light);
}

.status-label,
.priority-label {
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  font-size: small;
}

.status-pending {
  background-color: #ffecb3;
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.5);
}

.status-in-progress {
  background-color: #e8f4fd;
  color: #288fe4;
  border: 1px solid rgba(40, 143, 228, 0.5);
}

.status-awaiting-verification {
  background-color: #e1bee7;
  color: #9c27b0;
  border: 1px solid rgba(156, 39, 176, 0.5);
}

.status-overdue {
  background-color: #ffcdd2;
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.status-completed {
  background-color: #c8e6c9;
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.status-returned {
  background-color: #ffccbc;
  color: #ff5722;
  border: 1px solid rgba(255, 87, 34, 0.5);
}

.status-rejected {
  background-color: #f8bbd0;
  color: #e91e63;
  border: 1px solid rgba(233, 30, 99, 0.5);
}

.priority-low {
  background-color: #ecf8ec;
  color: #63b900;
  border: 1px solid rgba(139, 195, 74, 0.5);
}

.priority-medium {
  background-color: #ffecb3;
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.priority-high {
  background-color: #ffcdd2;
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.past-deadline {
  color: red;
}

.warning-icon {
  margin-left: 5px;
}
</style>
