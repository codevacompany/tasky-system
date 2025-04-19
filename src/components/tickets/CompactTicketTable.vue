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
            <td>{{ formatDate(ticket.createdAt) }}</td>
            <td>
              <span :class="['status-label', statusColor(ticket.status)]">{{ formatSnakeToNaturalCase(ticket.status).toUpperCase() }}</span>
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
import { formatDate } from '@/utils/date';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';

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

.card-content {
  padding: 0;
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
  font-size: 0.85rem;
}

.data-table th {
  font-size: 0.85rem;
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
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  gap: 0.5rem;
}

.status-pending {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-in-progress {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.status-awaiting-verification {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid rgba(123, 31, 162, 0.3);
}

.status-overdue {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}

.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
}

.status-returned {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-rejected {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}
</style>
