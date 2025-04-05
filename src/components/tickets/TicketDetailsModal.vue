<template>
  <BaseModal :isOpen="isOpen" title="Detalhes do Ticket" @close="closeModal">
    <div class="content">
      <div class="ticket-details ticket-details-grid">
        <div class="details-row">
          <div class="details-item"><strong>ID:</strong> {{ ticket?.id }}</div>
          <div class="details-item">
            <strong>Categoria:</strong> {{ ticket!.category?.name || '-' }}
          </div>
        </div>

        <div class="details-row full-width">
          <div class="details-item"><strong>Assunto:</strong> {{ ticket?.name }}</div>
        </div>

        <div class="details-row">
          <div class="details-item">
            <strong>Prioridade:</strong>
            <span :class="['priority-label', getPriorityClass(ticket!.priority)]">{{ ticket?.priority.toUpperCase() }}</span>
          </div>
          <div class="details-item">
            <strong>Status:</strong>
            <span :class="['status-label', getStatusClass(ticket!.status)]">{{ ticket?.status.toUpperCase() }}</span>
          </div>
        </div>

        <div class="details-row">
          <div class="details-item">
            <strong>Solicitante:</strong> {{ ticket?.requester.firstName }} {{ ticket?.requester.lastName }}
          </div>
          <div class="details-item"><strong>Setor:</strong> {{ ticket?.department.name }}</div>
        </div>

        <div class="details-row">
          <div class="details-item">
            <strong>Data de Criação:</strong> {{ formatDate(ticket?.createdAt) }}
          </div>
          <div class="details-item">
            <strong>Data de Aceitação:</strong> {{ formatDate(ticket?.acceptanceDate) }}
          </div>
        </div>

        <div class="details-row">
          <div class="details-item">
            <strong>Data de Conclusão:</strong> {{ formatDate(ticket?.completionDate) }}
          </div>
          <div class="details-item">
            <strong>Prazo:</strong>
            <div :class="{ 'past-deadline': isPastDeadline(ticket?.completionDate) }">
              {{ calculateDeadline(ticket!) }}
              <font-awesome-icon v-if="isPastDeadline(ticket?.completionDate)" icon="exclamation-triangle" class="warning-icon" />
            </div>
          </div>
        </div>

        <div class="details-row full-width">
          <div class="details-item"><strong>Descrição:</strong> {{ ticket?.description }}</div>
        </div>

        <div class="ticket-actions">
          <button v-if="ticket?.status === 'Pendente'" class="btn btn-success" @click="acceptTicket(ticket?.id)">
            <font-awesome-icon icon="check" /> Aceitar
          </button>
          <button v-else-if="ticket?.status === 'Em andamento'" class="btn btn-primary" @click="sendForReview(ticket?.id)">
            <font-awesome-icon icon="arrow-right" /> Enviar para Revisão
          </button>
          <span v-else-if="ticket?.status === TicketStatus.AwaitingVerification" class="action-icon" title="Aguardando verificação">
            <font-awesome-icon icon="clock" />
          </span>
        </div>
      </div>

      <div class="comment-section">
        <label for="novoComentario">Adicionar comentário</label>
        <textarea id="novoComentario" placeholder="Digite seu comentário aqui..." class="update-input"></textarea>
        <div class="comment-actions">
          <button @click="comment()" class="btn btn-primary">
            <font-awesome-icon icon="paper-plane" /> Enviar comentário
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import { TicketStatus, type Ticket } from '@/models';

defineProps({
  isOpen: Boolean,
  ticket: Object as () => Ticket,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '—');

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Baixa':
      return 'priority-baixa';
    case 'Média':
      return 'priority-media';
    case 'Alta':
      return 'priority-alta';
    default:
      return '';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Pendente':
      return 'status-pendente';
    case 'Em andamento':
      return 'status-em-andamento';
    case 'Em verificação':
      return 'status-em-verificacao';
    case 'Resolvido':
      return 'status-resolvido';
    case 'Cancelado':
      return 'status-cancelado';
    default:
      return '';
  }
};

const calculateDeadline = (ticket: Ticket) => {
  return ticket.completionDate ? formatDate(ticket.completionDate) : '—';
};

const isPastDeadline = (date?: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const acceptTicket = (ticketId: number) => {
  console.log(`Accepting ticket with ID: ${ticketId}`);
  // Add logic to accept the ticket
};

const sendForReview = (ticketId: number) => {
  console.log(`Sending ticket with ID: ${ticketId} for review`);
  // Add logic to send the ticket for review
};

const comment = () => {
  console.log('Adding comment');
  // Add logic to add a comment
};
</script>

<style scoped>
.content {
  min-width: 800px;
}

.ticket-details-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-row {
  display: flex;
  gap: 16px;
}

.details-row.full-width {
  flex-direction: column;
}

.details-item {
  flex: 1;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
  min-height: 45px;
}

.details-row.full-width .details-item {
  width: 100%;
  white-space: normal;
  word-break: break-word;
}

.ticket-details strong {
  color: #2c3e50;
  margin-right: 8px;
  font-weight: 600;
  min-width: 120px;
  display: inline-block;
}

.ticket-actions {
  display: flex;
  justify-content: end;
  margin-top: 20px;
}

.comment-section {
  margin-top: 32px;
  padding: 20px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.comment-section label {
  font-weight: 600;
  color: var(--text-color, #2c3e50);
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
}

.update-input {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  background: white;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;
}

.update-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.15);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

/* Classes para as etiquetas de prioridade */
.priority-label,
.status-label {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.priority-baixa {
  background-color: #28a745 !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
}

.priority-media {
  background-color: #ffc107 !important;
  color: black !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
}

.priority-alta {
  background-color: #dc3545 !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
}

/* Classes para as etiquetas de status */
.status-pendente,
.status-flag.pendente,
[data-status='Pendente'],
.status-flag.status-pendente {
  background-color: rgba(255, 152, 0, 0.1) !important;
  color: #ff9800 !important;
  border: 1px solid rgba(255, 152, 0, 0.3) !important;
}

.status-em-andamento,
.status-flag.em_andamento,
[data-status='Em andamento'],
.status-flag.status-em-andamento {
  background-color: #e8f4fd !important;
  color: #3498db !important;
  border: 1px solid rgba(52, 152, 219, 0.3) !important;
}

.status-em-verificacao,
.status-flag.em_verificacao,
[data-status='Em verificação'],
.status-flag.status-em-verificacao {
  background-color: rgba(156, 39, 176, 0.1) !important;
  color: #9c27b0 !important;
  border: 1px solid rgba(156, 39, 176, 0.3) !important;
}

.status-resolvido,
.status-flag.resolvido,
[data-status='Resolvido'],
.status-flag.status-resolvido {
  background-color: #e9f7ef !important;
  color: #27ae60 !important;
  border: 1px solid rgba(39, 174, 96, 0.3) !important;
}

.past-deadline {
  color: red;
}

.warning-icon {
  margin-left: 5px;
}
</style>
