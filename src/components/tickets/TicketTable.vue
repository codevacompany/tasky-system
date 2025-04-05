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
          <tr v-if="isLoading">
            <td colspan="10" class="loading-cell">
              <div class="loading-wrapper">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else-if="!tickets || tickets.length === 0">
            <td colspan="10" class="empty-state">
              <p>Nenhum ticket encontrado</p>
            </td>
          </tr>
          <tr v-else v-for="ticket in tickets" :key="ticket.id" @click="openTicketDetails(ticket)">
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
              <span :class="['status-badge', getStatusClass(ticket.status)]">
                {{ ticket.status }}
              </span>
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
    </div>
    <div class="pagination">
      <button class="btn btn-icon" id="prevPageSetor">
        <font-awesome-icon icon="chevron-left" />
      </button>
      <span id="paginationInfoSetor">Página 1 de 1</span>
      <button class="btn btn-icon" id="nextPageSetor">
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
import LoadingSpinner from '../common/LoadingSpinner.vue';

defineProps<{ tickets: Ticket[]; isLoading: boolean }>();
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Pendente':
      return 'pendente';
    case 'Em andamento':
      return 'em-andamento';
    case 'Atrasado':
      return 'atrasado';
    default:
      return '';
  }
};
</script>

<style scoped>
.loading-cell {
  margin: 2rem 0;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

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

.btn-icon {
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

.btn-icon:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#paginationInfo {
  font-size: 0.9rem;
  color: var(--text-light);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pendente {
  background-color: #fff7ed;
  color: #f97316;
}

.status-badge.em-andamento {
  background-color: #eef2ff;
  color: #4f46e5;
}

.status-badge.atrasado {
  background-color: #fef2f2;
  color: #ef4444;
}

.priority-label {
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  font-size: small;
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

.loading-state,
.empty-state {
  text-align: center;
  padding: 32px 16px;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode */
:deep(body.dark-mode) .tickets-table th {
  background: #1a2233;
  color: #94a3b8;
  border-color: #2d3748;
}

:deep(body.dark-mode) .tickets-table td {
  color: #e2e8f0;
  border-color: #2d3748;
}

:deep(body.dark-mode) .tickets-table tr:hover td {
  background-color: #1e293b;
}

:deep(body.dark-mode) .loading-spinner {
  border-color: #2d3748;
  border-top-color: #818cf8;
}
</style>
