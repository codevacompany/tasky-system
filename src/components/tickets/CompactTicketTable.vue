<!-- src/components/tickets/TicketTable.vue -->
<template>
  <div class="dashboard-card">
    <div class="card-header">
      <h2>{{ title }}</h2>
      <a href="#tickets" class="card-action">Ver todos</a>
    </div>
    <div class="card-content">
      <table class="data-table">
        <thead>
          <tr>
            <th>Assunto</th>
            <th>Solicitante</th>
            <th>Setor</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="loading-cell">
              <LoadingSpinner :size="28" />
            </td>
          </tr>
          <tr v-else v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.name }}</td>
            <td>{{ ticket.requester.firstName }}</td>
            <td>{{ ticket.department.name }}</td>
            <td>{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
            <td>
              <span :class="['status-label', statusColor(ticket.status)]">{{ ticket.status }}</span>
            </td>
          </tr>
          <tr v-if="!isLoading && tickets.length === 0">
            <td colspan="5" class="empty-state">
              <font-awesome-icon icon="inbox" /> Nenhum ticket encontrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { TicketStatus, type Ticket } from '@/models';

defineProps<{
  title: string;
  tickets: Ticket[];
  isLoading: boolean;
}>();

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
</script>

<style scoped>
.loading-cell {
  text-align: center;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-light);
  background-color: rgba(0, 0, 0, 0.02);
  text-align: center;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background-color: rgba(0, 0, 0, 0.02);
}

.status-label {
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  color: #fff;
  font-weight: 400;
  text-align: center;
  display: inline-block;
  font-size: small;
}

.status-pending {
  background-color: #ffecb3;
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.status-in-progress {
  background-color: #e8f4fd;
  color: #288fe4;
  border: 1px solid rgba(40, 143, 228, 0.3);
}

.status-awaiting-verification {
  background-color: #e1bee7;
  color: #9c27b0;
  border: 1px solid rgba(156, 39, 176, 0.3);
}

.status-overdue {
  background-color: #ffcdd2;
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-completed {
  background-color: #c8e6c9;
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-returned {
  background-color: #ffccbc;
  color: #ff5722;
  border: 1px solid rgba(255, 87, 34, 0.3);
}

.status-rejected {
  background-color: #f8bbd0;
  color: #e91e63;
  border: 1px solid rgba(233, 30, 99, 0.3);
}
</style>
