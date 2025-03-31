<template>
  <section id="ticketsSection" class="section-content">
    <h1>Tickets</h1>

    <div class="tab-container">
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'recebidos' }"
          @click="fetchTickets('recebidos')"
        >
          Recebidos
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'criados' }"
          @click="fetchTickets('criados')"
        >
          Criados por Mim
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'setor' }"
          @click="fetchTickets('setor')"
        >
          Tickets do Setor
        </button>
      </div>

      <div class="tab-content">
        <TicketTable :tickets="tickets" @viewTicket="handleViewTicket" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import type { Ticket } from '@/models';
import TicketTable from '@/components/tickets/TicketTable.vue';

const user = useUserStore().user;
const activeTab = ref<'recebidos' | 'criados' | 'setor'>('recebidos');
const tickets = ref<Ticket[]>([]);

const fetchTickets = async (tab: 'recebidos' | 'criados' | 'setor') => {
  activeTab.value = tab;
  try {
    if (tab === 'recebidos') {
      const response = await ticketService.getByTargetUser(user!.id);
      tickets.value = response.data;
    } else if (tab === 'criados') {
      const response = await ticketService.getByRequester(user!.id);
      tickets.value = response.data;
    } else if (tab === 'setor') {
      const response = await ticketService.getByDepartment(user!.department.id);
      tickets.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
};

const handleViewTicket = (ticket: Ticket) => {
  console.log('Viewing ticket:', ticket);
};

onMounted(() => fetchTickets(activeTab.value));
</script>

<style scoped>
.tab-container {
  margin-top: 1.5rem;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-light);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  min-height: 300px;
}

/* .tab-pane {
  display: none;
} */

.tab-pane.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

/* Filtros */
.ticket-filters {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
}

.filter-group select {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-group {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.search-group input {
  padding: 0.5rem 1rem;
  border-radius: var(--radius) 0 0 var(--radius);
  border: 1px solid var(--border-color);
  border-right: none;
  background-color: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  width: 250px;
  transition: var(--transition);
}

.search-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-group .btn-icon {
  border-radius: 0 var(--radius) var(--radius) 0;
  border: 1px solid var(--border-color);
  border-left: none;
  height: 38px;
}

/* Status e Prioridade */
.status-label,
.priority-label {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  gap: 0.3rem;
}

.status-pendente {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.status-em_andamento {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--info-color);
}

.status-resolvido {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-cancelado {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.priority-alta {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.priority-media {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.priority-baixa {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

/* Prazo */
.prazo-col {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
}

.prazo-atrasado {
  color: #dc2626;
  font-weight: bold;
}

.prazo-urgente {
  color: #ef4444;
  font-weight: 600;
}

.prazo-proximo {
  color: #f97316;
}

.prazo-ok {
  color: #10b981;
}

/* Paginação */
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

/* Estado Vazio */
.no-tickets-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-light);
}

.no-tickets-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-tickets-message p {
  font-size: 1rem;
}

@media (max-width: 992px) {
  .ticket-details {
    grid-template-columns: 1fr;
  }

  .ticket-details p.full-width {
    grid-column: span 1;
  }

  .search-group input {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .tab-btn {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .ticket-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select {
    width: 100%;
  }

  .search-group {
    width: 100%;
    margin-left: 0;
  }

  .search-group input {
    width: 100%;
  }

  .tickets-table-container {
    overflow-x: auto;
  }

  .tickets-table th,
  .tickets-table td {
    padding: 0.8rem;
  }
}
</style>
