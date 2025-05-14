<template>
  <section id="ticketsSection" class="section-content">
    <div class="section-header">
      <div class="header-content">
        <h1>Tickets</h1>
        <button
          class="view-toggle-btn"
          @click="toggleView"
          :title="
            isKanbanView ? 'Mudar para visualização em tabela' : 'Mudar para visualização Kanban'
          "
        >
          <font-awesome-icon :icon="isKanbanView ? 'table' : 'columns'" />
          <span>{{ isKanbanView ? 'Visualização em Tabela' : 'Visualização Kanban' }}</span>
        </button>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-buttons">
        <button
          :class="['tab-button', activeTab === 'recebidos' ? 'active' : '']"
          @click="switchTab('recebidos')"
        >
          Recebidos
        </button>
        <button
          :class="['tab-button', activeTab === 'criados' ? 'active' : '']"
          @click="switchTab('criados')"
        >
          Criados por Mim
        </button>
        <button
          :class="['tab-button', activeTab === 'setor' ? 'active' : '']"
          @click="switchTab('setor')"
        >
          Tickets do Setor
        </button>
        <button
          :class="['tab-button', activeTab === 'arquivo' ? 'active' : '']"
          @click="switchTab('arquivo')"
        >
          Arquivados
        </button>
      </div>

      <div class="tab-content">
        <div class="ticket-filters">
          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" v-model="statusFilter">
              <option :value="null">Todos</option>
              <option :value="TicketStatus.Pending">
                {{ formatSnakeToNaturalCase(TicketStatus.Pending) }}
              </option>
              <option :value="TicketStatus.InProgress">
                {{ formatSnakeToNaturalCase(TicketStatus.InProgress) }}
              </option>
              <option :value="TicketStatus.Completed">
                {{ formatSnakeToNaturalCase(TicketStatus.Completed) }}
              </option>
              <option :value="TicketStatus.AwaitingVerification">
                {{ formatSnakeToNaturalCase(TicketStatus.AwaitingVerification) }}
              </option>
              <option :value="TicketStatus.UnderVerification">
                {{ formatSnakeToNaturalCase(TicketStatus.UnderVerification) }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="priorityFilter">Prioridade:</label>
            <select id="priorityFilter" v-model="priorityFilter">
              <option :value="null">Todas</option>
              <option :value="TicketPriority.Low">
                {{ formatSnakeToNaturalCase(TicketPriority.Low) }}
              </option>
              <option :value="TicketPriority.Medium">
                {{ formatSnakeToNaturalCase(TicketPriority.Medium) }}
              </option>
              <option :value="TicketPriority.High">
                {{ formatSnakeToNaturalCase(TicketPriority.High) }}
              </option>
            </select>
          </div>

          <div class="search-group">
            <div class="search-input-wrapper">
              <font-awesome-icon icon="search" class="input-icon" />
              <input
                type="text"
                id="searchTickets"
                placeholder="Buscar tickets..."
                v-model="searchTerm"
              />
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div v-if="activeTab === 'arquivo'" class="archive-sections">
          <TicketTable
            :tickets="tickets"
            :isLoading="isLoading"
            :tableType="activeTab"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @changePage="(page) => (currentPage = page)"
            @viewTicket="handleViewTicket"
            @refresh="fetchTicketsWithFilters"
          />
        </div>

        <div v-else>
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
          </div>

          <!-- Tabela principal para tabs não-arquivo -->
          <TicketTable
            v-if="!isKanbanView"
            :tickets="tickets"
            :isLoading="isLoading"
            :tableType="activeTab"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @changePage="(page) => (currentPage = page)"
            @viewTicket="handleViewTicket"
            @editTicket="handleEditTicket"
            @cancelTicket="handleCancelTicket"
            @acceptTicket="handleAcceptTicket"
            @verifyTicket="handleVerifyTicket"
            @approveTicket="handleApproveTicket"
            @requestCorrection="handleRequestCorrection"
            @rejectTicket="handleRejectTicket"
            @refresh="fetchTicketsWithFilters"
          />
          <TicketKanban v-else :tickets="tickets" @viewTicket="handleViewTicket" />
        </div>
      </div>
    </div>

    <!-- Modal de Correção -->
    <div v-if="showCorrectionModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Solicitar Correção</h3>
          <button class="close-btn" @click="cancelCorrection">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <p class="mb-4">Por favor, defina uma nova data de conclusão para o ticket:</p>
          <div class="form-group">
            <label for="newCompletionDate">Nova Data de Conclusão:</label>
            <input
              type="date"
              id="newCompletionDate"
              v-model="newCompletionDate"
              class="form-control"
              :min="new Date().toISOString().split('T')[0]"
              required
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelCorrection">Cancelar</button>
          <button class="btn btn-primary" @click="confirmCorrection" :disabled="!newCompletionDate">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ticketService } from '@/services/ticketService';
import { useTicketsStore } from '@/stores/tickets';
import type { Ticket } from '@/models';
import { TicketStatus, TicketPriority } from '@/models';
import TicketTable from '@/components/tickets/TicketTable.vue';
import TicketKanban from '@/components/tickets/TicketKanban.vue';
import { toast } from 'vue3-toastify';
import { debounce, formatSnakeToNaturalCase } from '@/utils/generic-helper';

const ticketsStore = useTicketsStore();
const activeTab = ref<'recebidos' | 'criados' | 'setor' | 'arquivo'>('recebidos');
const searchTerm = ref('');
const statusFilter = ref<TicketStatus | null>(null);
const priorityFilter = ref<TicketPriority | null>(null);
const currentPage = ref(1);

const showCorrectionModal = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const newCompletionDate = ref('');

const isKanbanView = ref(false);

const debouncedSearch = debounce(() => {
  fetchTicketsWithFilters();
}, 400);

// Get tickets from the store based on active tab
const tickets = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return ticketsStore.receivedTickets.data;
    case 'criados':
      return ticketsStore.myTickets.data;
    case 'setor':
      return ticketsStore.departmentTickets.data;
    case 'arquivo':
      return ticketsStore.archivedTickets.data;
    default:
      return [];
  }
});

// Get loading state from the store
const isLoading = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return ticketsStore.receivedTickets.isLoading;
    case 'criados':
      return ticketsStore.myTickets.isLoading;
    case 'setor':
      return ticketsStore.departmentTickets.isLoading;
    case 'arquivo':
      return ticketsStore.archivedTickets.isLoading;
    default:
      return false;
  }
});

// Get total pages from the store
const totalPages = computed(() => {
  switch (activeTab.value) {
    case 'recebidos':
      return Math.ceil(ticketsStore.receivedTickets.totalCount / 10);
    case 'criados':
      return Math.ceil(ticketsStore.myTickets.totalCount / 10);
    case 'setor':
      return Math.ceil(ticketsStore.departmentTickets.totalCount / 10);
    case 'arquivo':
      return Math.ceil(ticketsStore.archivedTickets.totalCount / 10);
    default:
      return 1;
  }
});

// Switch tabs without refetching data
const switchTab = (tab: 'recebidos' | 'criados' | 'setor' | 'arquivo') => {
  activeTab.value = tab;
  currentPage.value = 1;
};

const fetchTicketsWithFilters = async () => {
  const typeMap: Record<string, 'received' | 'createdByMe' | 'department' | 'archived'> = {
    recebidos: 'received',
    criados: 'createdByMe',
    setor: 'department',
    arquivo: 'archived',
  };

  const storeType = typeMap[activeTab.value];
  await ticketsStore.fetchTickets(storeType, currentPage.value, 10);
};

const totalTickets = computed(() => tickets.value.length);
const pendingTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.Pending).length,
);
const inProgressTickets = computed(
  () => tickets.value.filter((ticket) => ticket.status === TicketStatus.InProgress).length,
);

const handleViewTicket = (ticket: Ticket) => {
  console.log('Viewing ticket:', ticket);
};

const handleEditTicket = (ticket: Ticket) => {
  console.log('Editing ticket:', ticket);
  // Implementar lógica de edição
};

const handleCancelTicket = async (ticket: Ticket) => {
  if (confirm('Tem certeza que deseja excluir este ticket?')) {
    try {
      await ticketService.cancel(ticket.customId);
      toast.success('Ticket excluído com sucesso!');
      fetchTicketsWithFilters();
    } catch {
      toast.error('Erro ao excluir ticket. Tente novamente.');
    }
  }
};

const handleAcceptTicket = async (ticket: Ticket) => {
  try {
    await ticketService.accept(ticket.customId);
    toast.success('Ticket aceito com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aceitar ticket. Tente novamente.');
  }
};

const handleVerifyTicket = async (ticketId: string) => {
  try {
    await ticketService.updateStatus(ticketId, { status: TicketStatus.AwaitingVerification });
    toast.success('Ticket enviado para revisão');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao enviar o ticket para revisão');
  }
};

const handleApproveTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Completed });
    toast.success('Ticket aprovado com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao aprovar ticket. Tente novamente.');
  }
};

const handleRequestCorrection = async (ticket: Ticket) => {
  selectedTicket.value = ticket;
  showCorrectionModal.value = true;
};

const confirmCorrection = async () => {
  if (!selectedTicket.value || !newCompletionDate.value) return;

  try {
    await ticketService.updateStatus(selectedTicket.value.customId, {
      status: TicketStatus.InProgress,
    });

    await ticketService.update(selectedTicket.value.customId, { dueAt: newCompletionDate.value });
    toast.success('Correção solicitada com sucesso!');
    showCorrectionModal.value = false;
    selectedTicket.value = null;
    newCompletionDate.value = '';
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao solicitar correção. Tente novamente.');
  }
};

const cancelCorrection = () => {
  showCorrectionModal.value = false;
  selectedTicket.value = null;
  newCompletionDate.value = '';
};

const handleRejectTicket = async (ticket: Ticket) => {
  try {
    await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Rejected });
    toast.success('Ticket reprovado com sucesso!');
    fetchTicketsWithFilters();
  } catch {
    toast.error('Erro ao reprovar ticket. Tente novamente.');
  }
};

const toggleView = () => {
  isKanbanView.value = !isKanbanView.value;
};

onMounted(() => {
  Promise.all([
    ticketsStore.fetchReceivedTickets(),
    ticketsStore.fetchMyTickets(),
    ticketsStore.fetchDepartmentTickets(),
    ticketsStore.fetchArchivedTickets(),
  ]);
});

watch(searchTerm, () => {
  debouncedSearch();
});

watch([statusFilter, priorityFilter], () => {
  fetchTicketsWithFilters();
});

watch(currentPage, () => {
  fetchTicketsWithFilters();
});
</script>

<style scoped>
.tab-container {
  margin-top: 1.5rem;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tab-button:hover {
  color: var(--primary-color);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* Dark mode */
:deep(body.dark-mode) .tab-button {
  color: #94a3b8;
}

:deep(body.dark-mode) .tab-button:hover {
  color: #818cf8;
}

:deep(body.dark-mode) .tab-button.active {
  color: #818cf8;
  border-bottom-color: #818cf8;
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
  gap: 1rem;
}

.search-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input-wrapper input {
  padding-left: 2rem; /* space for the icon */
}

.input-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
  height: 15px;
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

.status-finalizado {
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

.archive-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.archive-section {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.archive-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.archive-title::before {
  content: '';
  width: 4px;
  height: 1.1rem;
  background: var(--primary-color);
  border-radius: 2px;
}

/* Dark mode */
:deep(body.dark-mode) .archive-section {
  background: var(--dark-card-bg);
}

:deep(body.dark-mode) .archive-title {
  color: var(--dark-text-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  color: var(--text-color);
  background-color: var(--input-bg);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background-color: var(--card-bg-dark);
}

:deep(body.dark-mode) .modal-header {
  border-bottom-color: var(--border-color-dark);
}

:deep(body.dark-mode) .modal-footer {
  border-top-color: var(--border-color-dark);
}

:deep(body.dark-mode) .modal-header h3 {
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .form-group label {
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .form-control {
  background-color: var(--input-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  background: var(--surface-card);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  background: var(--surface-hover);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}
</style>
