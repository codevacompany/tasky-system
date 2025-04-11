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
        <div class="ticket-filters">
          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter">
              <option value="all">Todos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Em andamento">Em Andamento</option>
              <option value="Finalizado">Resolvidos</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="priorityFilter">Prioridade:</label>
            <select id="priorityFilter">
              <option value="all">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div class="search-group">
            <input type="text" id="searchTickets" placeholder="Buscar tickets..." />
            <button class="btn-icon">
              <font-awesome-icon icon="search" />
            </button>
          </div>
        </div>

        <div class="tickets-summary">
          <div class="summary-item">
            <div class="summary-item-content">
              <div class="stat-icon">
                <font-awesome-icon icon="ticket" />
              </div>
              <span class="summary-label">Total</span>
            </div>
            <span class="stat-number">{{ totalTickets }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-item-content">
              <div class="stat-icon orange">
                <font-awesome-icon icon="clock" />
              </div>
              <span class="summary-label">Pendentes</span>
            </div>
            <span class="stat-number">{{ pendingTickets }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-item-content">
              <div class="stat-icon blue">
                <font-awesome-icon icon="spinner" />
              </div>
              <span class="summary-label">Em Andamento</span>
            </div>
            <span class="stat-number">{{ inProgressTickets }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-item-content">
              <div class="stat-icon green">
                <font-awesome-icon icon="check-circle" />
              </div>
              <span class="summary-label">Resolvidos</span>
            </div>
            <span class="stat-number">{{ resolvedTickets }}</span>
          </div>
        </div>

        <TicketTable
          :tickets="tickets"
          :isLoading="isLoading"
          :tableType="activeTab"
          @viewTicket="handleViewTicket"
          @editTicket="handleEditTicket"
          @deleteTicket="handleDeleteTicket"
          @acceptTicket="handleAcceptTicket"
          @verifyTicket="handleVerifyTicket"
          @approveTicket="handleApproveTicket"
          @requestCorrection="handleRequestCorrection"
          @rejectTicket="handleRejectTicket"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import type { Ticket } from '@/models';
import { TicketStatus } from '@/models';
import TicketTable from '@/components/tickets/TicketTable.vue';
import { toast } from 'vue3-toastify';

const user = useUserStore().user;
const activeTab = ref<'recebidos' | 'criados' | 'setor'>('recebidos');
const tickets = ref<Ticket[]>([]);
const isLoading = ref(false);

const fetchTickets = async (tab: 'recebidos' | 'criados' | 'setor') => {
  activeTab.value = tab;
  isLoading.value = true;
  try {
    let response;
    if (tab === 'recebidos') {
      response = await ticketService.getByTargetUser(user!.id);
    } else if (tab === 'criados') {
      response = await ticketService.getByRequester(user!.id);
    } else {
      response = await ticketService.getByDepartment(user!.department.id);
    }
    tickets.value = response.data;
  } catch {
    toast.error('Erro ao carregar tickets. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const totalTickets = computed(() => tickets.value.length);
const pendingTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.Pending).length,
);
const inProgressTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.InProgress).length,
);
const resolvedTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.Completed).length,
);

const handleViewTicket = (ticket: Ticket) => {
  console.log('Viewing ticket:', ticket);
};

const handleEditTicket = (ticket: Ticket) => {
  console.log('Editing ticket:', ticket);
  // Implementar lógica de edição
};

const handleDeleteTicket = async (ticket: Ticket) => {
  if (confirm('Tem certeza que deseja excluir este ticket?')) {
    try {
      await ticketService.delete(ticket.id);
      toast.success('Ticket excluído com sucesso!');
      fetchTickets(activeTab.value);
    } catch {
      toast.error('Erro ao excluir ticket. Tente novamente.');
    }
  }
};

const handleAcceptTicket = async (ticket: Ticket) => {
  try {
    await ticketService.accept(ticket.id);
    toast.success('Ticket aceito com sucesso!');
    fetchTickets(activeTab.value);
  } catch {
    toast.error('Erro ao aceitar ticket. Tente novamente.');
  }
};

const handleVerifyTicket = async (ticketId: number) => {
  try {
    await ticketService.updateStatus(ticketId, { status: TicketStatus.AwaitingVerification });
    toast.success('Ticket enviado para revisão');
    fetchTickets(activeTab.value);
  } catch {
    toast.error('Erro ao enviar o ticket para revisão');
  }
};

const handleApproveTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.id, { status: TicketStatus.Completed });
    toast.success('Ticket aprovado com sucesso!');
    fetchTickets(activeTab.value);
  } catch {
    toast.error('Erro ao aprovar ticket. Tente novamente.');
  }
};

const handleRequestCorrection = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.id, { status: TicketStatus.InProgress });
    toast.success('Correção solicitada com sucesso!');
    fetchTickets(activeTab.value);
  } catch {
    toast.error('Erro ao solicitar correção. Tente novamente.');
  }
};

const handleRejectTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.id, { status: TicketStatus.Rejected });
    toast.success('Ticket reprovado com sucesso!');
    fetchTickets(activeTab.value);
  } catch {
    toast.error('Erro ao reprovar ticket. Tente novamente.');
  }
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
