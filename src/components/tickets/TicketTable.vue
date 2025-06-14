<template>
  <div>
    <div class="tickets-table-container">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th v-if="tableType === 'criados'">Destino</th>
            <th v-else>Solicitante</th>
            <th>Setor</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Concluir até</th>
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
          <tr v-else-if="!displayedTickets || displayedTickets.length === 0">
            <td colspan="10" class="empty-state">
              <p>Nenhum ticket encontrado</p>
            </td>
          </tr>
          <tr
            v-for="ticket in displayedTickets"
            :key="ticket.customId"
            @click="openTicketDetails(ticket)"
          >
            <td>{{ ticket.customId }}</td>
            <td>
              {{ ticket.name }}
              <font-awesome-icon
                v-if="ticket.isPrivate"
                icon="lock"
                class="private-icon"
                title="Ticket Privado"
              />
            </td>
            <td v-if="tableType === 'criados'">
              {{
                ticket.targetUser
                  ? ticket.targetUser.firstName + ' ' + ticket.targetUser.lastName
                  : '-'
              }}
            </td>
            <td v-else>{{ ticket.requester.firstName }} {{ ticket.requester.lastName }}</td>
            <td>{{ ticket.department.name }}</td>
            <td>
              <div class="priority-wrapper">
                <span :class="['priority-bars', priorityColor(ticket.priority)]">
                  {{ getPriorityBars(ticket.priority) }}
                </span>
                <span class="priority-text">{{ ticket.priority }}</span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(ticket.status)]">
                {{ formatSnakeToNaturalCase(ticket.status).toUpperCase() }}
              </span>
            </td>
            <td>{{ formatDate(ticket.createdAt) }}</td>
            <td>{{ ticket.dueAt ? formatDate(ticket.dueAt) : '—' }}</td>
            <td :class="calculateDeadline(ticket) === '—' ? '' : getDeadlineClass(ticket.dueAt)">
              {{ calculateDeadline(ticket) }}
              <font-awesome-icon
                v-if="calculateDeadline(ticket) === 'Atrasado'"
                icon="exclamation-triangle"
                class="warning-icon"
              />
            </td>
            <td>
              <div class="action-buttons">
                <!-- Botões para tabela de tickets recebidos -->
                <template v-if="tableType === 'recebidos'">
                  <button
                    v-if="ticket.status === TicketStatus.Pending"
                    class="action-btn accept"
                    @click.stop="handleAcceptTicket(ticket)"
                    title="Aceitar"
                  >
                    <font-awesome-icon icon="check" />
                  </button>
                  <button
                    v-else-if="ticket.status === TicketStatus.InProgress"
                    class="action-btn verify"
                    @click.stop="handleVerifyTicket(ticket)"
                    title="Enviar para Verificação"
                  >
                    <font-awesome-icon icon="arrow-right" />
                  </button>
                  <button
                    v-else-if="ticket.status === TicketStatus.Returned"
                    class="action-btn correct"
                    @click.stop="handleCorrectTicket(ticket)"
                    title="Corrigir"
                  >
                    <font-awesome-icon icon="wrench" />
                  </button>
                  <div
                    v-else-if="ticket.status === TicketStatus.AwaitingVerification"
                    class="action-btn waiting"
                    title="Aguardando Verificação"
                  >
                    <font-awesome-icon icon="hourglass-half" spin />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="action-btn rejected"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Completed"
                    class="action-btn completed"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" />
                  </div>
                </template>

                <!-- Botões para tabela de tickets criados -->
                <template v-else-if="tableType === 'criados'">
                  <div
                    v-if="ticket.status === TicketStatus.Pending"
                    class="action-btn not-started"
                    title="Não Iniciado"
                  >
                    <font-awesome-icon icon="clock" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.InProgress"
                    class="action-btn doing"
                    title="Fazendo"
                  >
                    <font-awesome-icon icon="cog" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Returned"
                    class="action-btn not-started"
                    title="Devolvido para Correção"
                  >
                    <font-awesome-icon icon="wrench" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="action-btn rejected"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Completed"
                    class="action-btn completed"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" />
                  </div>
                  <button
                    v-else-if="ticket.status === TicketStatus.AwaitingVerification"
                    class="action-btn verify"
                    @click.stop="handleStartVerification(ticket)"
                    title="Verificar"
                  >
                    <font-awesome-icon icon="search" />
                  </button>
                  <div
                    v-else-if="
                      ticket.status === TicketStatus.UnderVerification &&
                      userStore.user?.id === ticket.requester.id
                    "
                    class="verification-actions"
                  >
                    <button
                      class="action-btn approve"
                      @click.stop="handleApproveTicket(ticket)"
                      title="Aprovar"
                    >
                      <font-awesome-icon icon="check" />
                    </button>
                    <button
                      class="action-btn request-correction"
                      @click.stop="handleRequestCorrection(ticket)"
                      title="Solicitar Correção"
                    >
                      <font-awesome-icon icon="exclamation-circle" />
                    </button>
                    <button
                      class="action-btn reject"
                      @click.stop="handleRejectTicket(ticket)"
                      title="Reprovar"
                    >
                      <font-awesome-icon icon="times" />
                    </button>
                  </div>
                </template>

                <!-- Botões para tabela de tickets arquivados -->
                <template v-else-if="tableType === 'arquivados'">
                  <div
                    v-if="ticket.status === TicketStatus.Completed"
                    class="action-btn completed"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="action-btn rejected"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" />
                  </div>
                </template>

                <!-- Botões para tabela de tickets do setor -->
                <template v-else-if="tableType === 'setor'">
                  <button
                    class="action-btn view"
                    @click.stop="openTicketDetails(ticket)"
                    title="Visualizar"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination" class="pagination">
      <button
        class="btn btn-icon"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <span>Página {{ currentPage }} de {{ totalPages }}</span>

      <button
        class="btn btn-icon"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <TicketDetailsModal
      :isOpen="isModalOpen"
      :ticket="selectedTicket!"
      @close="closeModal"
      @refresh="refreshSelectedTicket"
    />
    <ConfirmationModal
      v-if="confirmationModal.isOpen"
      :isOpen="confirmationModal.isOpen"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      :hasInput="confirmationModal.hasInput"
      :reasonOptions="confirmationModal.reasonOptions"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- Modal de Aviso de Verificação -->
    <BaseModal
      :isOpen="showVerificationAlert"
      title="Ação Necessária"
      @close="showVerificationAlert = false"
      :show-footer="false"
    >
      <div class="verification-alert">
        <div class="alert-icon">
          <font-awesome-icon icon="info-circle" />
        </div>
        <p>
          Para visualizar os detalhes deste ticket, você precisa iniciar a verificação clicando no
          botão "Verificar".
        </p>
        <div class="alert-actions">
          <button class="action-btn cancel" @click="showVerificationAlert = false">Cancelar</button>
          <button class="action-btn verify" @click="handleAlertVerification">Verificar</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Ticket } from '@/models';
import { TicketPriority, TicketStatus, DisapprovalReason, CorrectionReason } from '@/models';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import { ticketService } from '@/services/ticketService';
import { formatDate } from '@/utils/date';
import { toast } from 'vue3-toastify';
import ConfirmationModal from '../common/ConfirmationModal.vue';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import BaseModal from '../common/BaseModal.vue';
import { calculateDeadline, formatSnakeToNaturalCase, enumToOptions } from '@/utils/generic-helper';

const props = defineProps<{
  tableType: 'recebidos' | 'criados' | 'setor' | 'arquivados';
  pagination?: boolean;
  currentPage: number;
}>();

const emit = defineEmits(['changePage']);

const userStore = useUserStore();
const ticketsStore = useTicketsStore();

const isModalOpen = ref(false);
const selectedTicket = ref<Ticket | null>(null);
const showVerificationAlert = ref(false);
const pendingVerificationTicket = ref<Ticket | null>(null);
const currentPage = ref(props.currentPage);

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  action: null as ((data?: { reason: string; description: string }) => Promise<void>) | null,
  hasInput: false,
  reasonOptions: [] as { value: string; label: string }[],
});

const displayedTickets = computed(() => {
  switch (props.tableType) {
    case 'recebidos':
      return ticketsStore.receivedTickets.data;
    case 'criados':
      return ticketsStore.myTickets.data;
    case 'setor':
      return ticketsStore.departmentTickets.data;
    case 'arquivados':
      return ticketsStore.archivedTickets.data;
    default:
      return [];
  }
});

const isLoading = computed(() => {
  switch (props.tableType) {
    case 'recebidos':
      return ticketsStore.receivedTickets.isLoading;
    case 'criados':
      return ticketsStore.myTickets.isLoading;
    case 'setor':
      return ticketsStore.departmentTickets.isLoading;
    case 'arquivados':
      return ticketsStore.archivedTickets.isLoading;
    default:
      return false;
  }
});

const totalPages = computed(() => {
  let totalCount = 0;
  switch (props.tableType) {
    case 'recebidos':
      totalCount = ticketsStore.receivedTickets.totalCount;
      break;
    case 'criados':
      totalCount = ticketsStore.myTickets.totalCount;
      break;
    case 'setor':
      totalCount = ticketsStore.departmentTickets.totalCount;
      break;
    case 'arquivados':
      totalCount = ticketsStore.archivedTickets.totalCount;
      break;
  }
  return Math.ceil(totalCount / 10);
});

watch(
  () => props.currentPage,
  (newPage) => {
    currentPage.value = newPage;
  },
);

function changePage(page: number) {
  emit('changePage', page);
}

const openTicketDetails = (ticket: Ticket) => {
  // Se for o solicitante e o ticket estiver aguardando verificação
  if (
    props.tableType === 'criados' &&
    ticket.status === TicketStatus.AwaitingVerification &&
    userStore.user?.id === ticket.requester.id
  ) {
    pendingVerificationTicket.value = ticket;
    showVerificationAlert.value = true;
    return;
  }

  selectedTicket.value = ticket;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedTicket.value = null;
};

const refreshTickets = async () => {
  switch (props.tableType) {
    case 'recebidos':
      await ticketsStore.fetchReceivedTickets(currentPage.value);
      break;
    case 'criados':
      await ticketsStore.fetchMyTickets(currentPage.value);
      break;
    case 'setor':
      await ticketsStore.fetchDepartmentTickets(currentPage.value);
      break;
    case 'arquivados':
      await ticketsStore.fetchArchivedTickets(currentPage.value);
      break;
  }
};

const refreshSelectedTicket = async () => {
  if (!selectedTicket.value?.customId) return;

  try {
    const updatedTicket = await ticketsStore.fetchTicketDetails(selectedTicket.value.customId);
    selectedTicket.value = updatedTicket;
  } catch {
    toast.error('Erro ao atualizar o ticket');
  }
};

const getDeadlineClass = (date?: string) => {
  if (!date) return '';
  const deadline = new Date(date);
  const today = new Date();

  // Reset hours to compare just dates
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'deadline-danger';
  if (diffDays <= 3) return 'deadline-warning';
  return 'deadline-normal';
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
    case TicketStatus.Pending:
      return 'status-pending';
    case TicketStatus.InProgress:
      return 'status-in-progress';
    case TicketStatus.AwaitingVerification:
    case TicketStatus.UnderVerification:
      return 'status-awaiting-verification';
    case TicketStatus.Completed:
      return 'status-completed';
    case TicketStatus.Rejected:
      return 'status-rejected';
    case TicketStatus.Returned:
      return 'status-returned';
    case TicketStatus.Canceled:
      return 'status-cancelled';
    default:
      return '';
  }
};

const getPriorityBars = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.Low:
      return '|';
    case TicketPriority.Medium:
      return '||';
    case TicketPriority.High:
      return '|||';
    default:
      return '';
  }
};

const openConfirmationModal = (
  title: string,
  message: string,
  action: (data?: { reason: string; description: string }) => Promise<void>,
  hasInput = false,
  reasonOptions: { value: string; label: string }[] = [],
) => {
  confirmationModal.value = {
    isOpen: true,
    title,
    message,
    action,
    hasInput,
    reasonOptions,
  };
};

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false;
  confirmationModal.value.action = null;
};

const handleConfirm = async (data?: { reason: string; description: string }) => {
  if (confirmationModal.value.action) {
    await confirmationModal.value.action(data);
  }
  closeConfirmationModal();
};

const handleCancel = () => {
  closeConfirmationModal();
};

const handleAcceptTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Aceitar Ticket',
    'Tem certeza que deseja aceitar este ticket?',
    async () => {
      try {
        await ticketService.accept(ticket.customId);
        toast.success('Ticket aceito com sucesso');

        await refreshTickets();

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao aceitar o ticket');
      }
    },
  );
};

const handleVerifyTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Enviar para Verificação',
    'Tem certeza que deseja enviar este ticket para verificação?',
    async () => {
      try {
        await ticketService.updateStatus(ticket.customId, {
          status: TicketStatus.AwaitingVerification,
        });
        toast.success('Ticket enviado para revisão');

        await refreshTickets();

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao enviar o ticket para revisão');
      }
    },
  );
};

const handleApproveTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Aprovar Ticket',
    'Tem certeza que deseja aprovar este ticket?',
    async () => {
      try {
        await ticketService.approve(ticket.customId);
        toast.success('Ticket aprovado com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao aprovar o ticket');
      }
    },
  );
};

const handleRequestCorrection = async (ticket: Ticket) => {
  const reasonOptions = enumToOptions(CorrectionReason);
  openConfirmationModal(
    'Solicitar Correção',
    'Por favor, preencha os detalhes da correção necessária:',
    async (data?: { reason: string; description: string }) => {
      try {
        if (data?.reason && data?.description) {
          await ticketService.requestCorrection(ticket.customId, {
            reason: data.reason,
            details: data.description,
          });
        } else {
          await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Returned });
        }

        toast.success('Correção solicitada com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao solicitar correção');
      }
    },
    true,
    reasonOptions,
  );
};

const handleRejectTicket = async (ticket: Ticket) => {
  const reasonOptions = enumToOptions(DisapprovalReason);
  openConfirmationModal(
    'Reprovar Ticket',
    'Por favor, informe o motivo da reprovação:',
    async (data?: { reason: string; description: string }) => {
      try {
        if (data?.reason && data?.description) {
          await ticketService.reject(ticket.customId, {
            reason: data.reason,
            details: data.description,
          });
        } else {
          await ticketService.updateStatus(ticket.customId, { status: TicketStatus.Rejected });
        }

        toast.success('Ticket reprovado com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao reprovar o ticket');
      }
    },
    true,
    reasonOptions,
  );
};

const handleStartVerification = async (ticket: Ticket) => {
  try {
    const ticketResponse = await ticketService.updateStatus(ticket.customId, {
      status: TicketStatus.UnderVerification,
    });

    selectedTicket.value = ticketResponse.data.ticketData;
    isModalOpen.value = true;

    await ticketsStore.fetchTicketDetails(ticket.customId);
  } catch {
    toast.error('Erro ao iniciar verificação');
  }
};

const handleAlertVerification = () => {
  if (pendingVerificationTicket.value) {
    handleStartVerification(pendingVerificationTicket.value);
    showVerificationAlert.value = false;
    pendingVerificationTicket.value = null;
  }
};

const handleCorrectTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Corrigir Ticket',
    'Tem certeza que deseja iniciar as correções deste ticket?',
    async () => {
      try {
        await ticketService.updateStatus(ticket.customId, { status: TicketStatus.InProgress });
        toast.success('Ticket em correção');

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao iniciar correção');
      }
    },
  );
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
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.tickets-table th {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-light);
  background-color: rgba(0, 0, 0, 0.02);
  text-align: center;
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
  font-size: 0.75rem;
  font-weight: 500;
  gap: 0.5rem;
}

.status-badge.status-pending {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-badge.status-in-progress {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.status-badge.status-awaiting-verification,
.status-badge.status-under-verification {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid rgba(123, 31, 162, 0.3);
}

.status-badge.status-overdue {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}

.status-badge.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
}

.status-badge.status-rejected {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}

.status-badge.status-returned {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-badge.status-cancelled {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid rgba(153, 27, 27, 0.3);
}

.priority-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.priority-bars {
  font-weight: bold;
  letter-spacing: -1px;
}

.priority-bars.priority-low {
  color: #63b900;
}

.priority-bars.priority-medium {
  color: #f57c00;
}

.priority-bars.priority-high {
  color: #dc2626;
}

.priority-text {
  color: var(--text-light);
  font-size: 0.85rem;
}

.deadline-warning {
  color: #f57c00;
  font-weight: bold;
}

.deadline-danger {
  color: #dc3545;
  font-weight: bold;
}

.deadline-normal {
  color: #28a745;
}

td {
  color: var(--text-color);
}

.warning-icon {
  margin-left: 5px;
  color: #dc3545;
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

.notification-text {
  font-size: 12px;
  color: #1a2233;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-btn.accept {
  background-color: #16a34a;
}

.action-btn.accept:hover {
  background-color: #15803d;
}

.action-btn.verify {
  background-color: #7e22ce;
}

.action-btn.verify:hover {
  background-color: #6b21a8;
}

.action-btn.waiting {
  background-color: #7e22ce;
  color: white;
  cursor: default;
}

.verification-actions {
  display: flex;
  gap: 4px;
}

.action-btn.approve {
  background-color: #059669;
  color: white;
}

.action-btn.approve:hover {
  background-color: #047857;
}

.action-btn.request-correction {
  background-color: #7b1fa2;
  color: white;
}

.action-btn.request-correction:hover {
  background-color: #6a1b9a;
}

.action-btn.reject {
  background-color: #dc2626;
  color: white;
}

.action-btn.reject:hover {
  background-color: #b91c1c;
}

.action-btn.not-started {
  background-color: #f57c00;
  color: white;
  cursor: default;
}

.action-btn.not-started svg {
  color: white;
}

.action-btn.doing {
  background-color: #1976d2;
  color: white;
  cursor: default;
}

.action-btn.doing svg {
  color: white;
}

.action-btn.rejected {
  background-color: #c62828;
  color: white;
  cursor: default;
}

.action-btn.rejected svg {
  color: white;
}

.action-btn.completed {
  background-color: #2e7d32;
  color: white;
  cursor: default;
}

.action-btn.completed svg {
  color: white;
}

.action-btn.view {
  background-color: #6366f1;
  color: white;
}

.action-btn.view:hover {
  background-color: #4f46e5;
}

.action-btn.comment {
  background-color: #0ea5e9;
  color: white;
}

.action-btn.comment:hover {
  background-color: #0284c7;
}

.private-icon {
  margin-left: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.verification-alert {
  padding: 1.5rem;
  text-align: center;
}

.alert-icon {
  font-size: 2rem;
  color: #7e22ce;
  margin-bottom: 1rem;
}

.verification-alert p {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.alert-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.alert-actions .action-btn {
  padding: 0.75rem 2rem;
  min-width: 120px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  width: auto;
  height: auto;
}

.alert-actions .action-btn.cancel {
  background-color: #64748b;
  color: white;
}

.alert-actions .action-btn.cancel:hover {
  background-color: #475569;
}

.alert-actions .action-btn.verify {
  background-color: #7e22ce;
  color: white;
}

.alert-actions .action-btn.verify:hover {
  background-color: #6b21a8;
}

/* Dark mode */
:deep(body.dark-mode) .verification-alert p {
  color: #e2e8f0;
}

:deep(body.dark-mode) .alert-icon {
  color: #9333ea;
}

.action-btn.rejected {
  color: #dc2626;
}

.action-btn.correct {
  background-color: #f57c00;
  color: white;
}

.action-btn.correct svg {
  color: white;
}
</style>
