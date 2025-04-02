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
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.name }}</td>
            <td>{{ ticket.requester.firstName }} {{ ticket.requester.lastName }}</td>
            <td>{{ ticket.department.name }}</td>
            <td>{{ ticket.priority }}</td>
            <td>{{ ticket.status }}</td>
            <td>{{ formatDate(ticket.createdAt) }}</td>
            <td>{{ formatDate(ticket.completionDate) }}</td>
            <td>{{ calculateDeadline(ticket) }}</td>
            <td>
              <button @click="$emit('viewTicket', ticket)">Ver</button>
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
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from '@/models';
import { defineProps, defineEmits } from 'vue';

defineProps<{ tickets: Ticket[] }>();
const emit = defineEmits(['viewTicket']);

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '—');
const calculateDeadline = (ticket: Ticket) => {
  return ticket.completionDate ? formatDate(ticket.completionDate) : '—';
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
</style>
