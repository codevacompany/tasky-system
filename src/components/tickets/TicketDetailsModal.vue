<template>
  <BaseModal v-if="isOpen" :isOpen="isOpen" title="Detalhes do Ticket" @close="closeModal">
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
            <span :class="['priority-label', getPriorityClass(ticket!.priority)]">{{
              ticket?.priority.toUpperCase()
            }}</span>
          </div>
          <div class="details-item">
            <strong>Status:</strong>
            <span :class="['status-label', getStatusClass(ticket!.status)]">{{
              ticket?.status
            }}</span>
          </div>
        </div>

        <div class="details-row">
          <div class="details-item">
            <strong>Solicitante:</strong> {{ ticket?.requester.firstName }}
            {{ ticket?.requester.lastName }}
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
          <div
            class="details-item"
            :class="{ 'past-deadline': isPastDeadline(ticket?.completionDate) }"
          >
            <strong>Prazo:</strong> {{ calculateDeadline(ticket!) }}
            <font-awesome-icon
              v-if="isPastDeadline(ticket?.completionDate)"
              icon="exclamation-triangle"
              class="warning-icon"
            />
          </div>
        </div>

        <div class="details-row full-width">
          <div class="details-item"><strong>Descrição:</strong> {{ ticket?.description }}</div>
        </div>

        <div class="ticket-actions" v-if="showActionButton">
          <button
            v-if="ticket?.status === TicketStatus.Pending && isTargetUser"
            class="btn btn-success"
            @click="acceptTicket(ticket?.id)"
          >
            <font-awesome-icon icon="check" /> Aceitar
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.InProgress && isTargetUser"
            class="btn btn-primary"
            @click="sendForReview(ticket?.id)"
          >
            <font-awesome-icon icon="arrow-right" /> Enviar para Revisão
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.AwaitingVerification && isTargetUser"
            class="btn btn-primary disabled"
            disabled
          >
            Aguardando Verificação
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.Completed && isTargetUser"
            class="btn btn-success disabled"
            disabled
          >
            Resolvido
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.Rejected && isTargetUser"
            class="btn btn-danger disabled"
            disabled
          >
            Reprovado
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.Pending && isRequester"
            class="btn btn-primary disabled"
            disabled
          >
            Pendente
          </button>
          <button
            v-else-if="ticket?.status === TicketStatus.InProgress && isRequester"
            class="btn btn-primary disabled"
            disabled
          >
            Em andamento
          </button>
          <div v-else-if="ticket?.status === TicketStatus.AwaitingVerification && isRequester">
            <button class="btn btn-success" @click="approveTicket(ticket?.id)">
              <font-awesome-icon icon="check" /> Aprovar
            </button>
            <button class="btn btn-warning" @click="requestCorrection(ticket?.id)">
              <font-awesome-icon icon="edit" /> Solicitar Correção
            </button>
            <button class="btn btn-danger" @click="rejectTicket(ticket?.id)">
              <font-awesome-icon icon="times" /> Reprovar
            </button>
          </div>
        </div>
      </div>

      <div class="comment-section">
        <label for="novoComentario">Adicionar comentário</label>
        <textarea
          id="novoComentario"
          v-model="newComment"
          placeholder="Digite seu comentário aqui..."
          class="update-input"
        ></textarea>
        <div class="comment-actions">
          <button @click="comment()" class="btn btn-primary">
            <font-awesome-icon icon="paper-plane" /> Enviar comentário
          </button>
        </div>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-avatar">{{ comment.user.firstName.charAt(0) }}</div>
          <div class="comment-content">
            <div class="comment-author">
              {{ comment.user.firstName }} {{ comment.user.lastName }}
              <div class="comment-meta">{{ formatTimeAgo(comment.createdAt) }}</div>
            </div>
            <div class="comment-text">{{ comment.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import { TicketStatus, type Ticket, type TicketComment } from '@/models';
import { ref, computed, watch } from 'vue';
import { ticketCommentService } from '@/services/ticketCommentService';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  isOpen: boolean;
  ticket: Ticket;
}>();

const emit = defineEmits(['close', 'refresh']);
const userStore = useUserStore();
const newComment = ref('');
const comments = ref<TicketComment[]>([]);

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
    case TicketStatus.Pending:
      return 'status-pendente';
    case TicketStatus.InProgress:
      return 'status-em-andamento';
    case TicketStatus.AwaitingVerification:
      return 'status-em-verificacao';
    case TicketStatus.Completed:
      return 'status-resolvido';
    case TicketStatus.Rejected:
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

const acceptTicket = async (ticketId: number) => {
  try {
    await ticketService.accept(ticketId);
    toast.success('Ticket aceito com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao aceitar o ticket');
  }
};

const sendForReview = async (ticketId: number) => {
  try {
    await ticketService.update(ticketId, { status: TicketStatus.AwaitingVerification });
    toast.success('Ticket enviado para revisão');
    emit('refresh');
  } catch {
    toast.error('Erro ao enviar o ticket para revisão');
  }
};

const approveTicket = async (ticketId: number) => {
  try {
    await ticketService.update(ticketId, { status: TicketStatus.Completed });
    toast.success('Ticket aprovado com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao aprovar o ticket');
  }
};

const requestCorrection = async (ticketId: number) => {
  try {
    await ticketService.update(ticketId, { status: TicketStatus.InProgress });
    toast.success('Correção solicitada com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao solicitar correção');
  }
};

const rejectTicket = async (ticketId: number) => {
  try {
    await ticketService.update(ticketId, { status: TicketStatus.Rejected });
    toast.success('Ticket reprovado com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao reprovar o ticket');
  }
};

const comment = async () => {
  if (!newComment.value.trim()) {
    toast.error('Comentário não pode estar vazio');
    return;
  }

  try {
    const response = await ticketCommentService.create({
      ticketId: props.ticket!.id,
      userId: userStore.user!.id,
      content: newComment.value,
    });
    comments.value.push(response.data);
    newComment.value = '';
    toast.success('Comentário adicionado com sucesso');
  } catch {
    toast.error('Erro ao adicionar comentário');
  }
};

const fetchComments = async () => {
  try {
    const response = await ticketCommentService.getByTicket(props.ticket!.id);
    comments.value = response.data;
  } catch {
    toast.error('Erro ao buscar comentários');
  }
};

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diff / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return `${diffMinutes}m ago`;
  }
};

const isTargetUser = computed(() => userStore.user?.id === props.ticket?.targetUser.id);
const isRequester = computed(() => userStore.user?.id === props.ticket?.requester.id);

const showActionButton = computed(() => {
  if (isTargetUser.value) {
    return true;
  } else if (isRequester.value) {
    return (
      props.ticket?.status !== TicketStatus.Completed &&
      props.ticket?.status !== TicketStatus.Rejected
    );
  }
  return false;
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.ticket?.id) {
      fetchComments();
    }
  },
);
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

.comments-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.comment-content {
  flex: 1;
}

.comment-text {
  font-size: 0.95rem;
  color: #2c3e50;
}

.comment-meta {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #34495e;
  margin-bottom: 4px;
}

.disabled {
  opacity: 70%;
  cursor: not-allowed;
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
