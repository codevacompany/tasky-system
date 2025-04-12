<template>
  <BaseModal
    v-if="isOpen"
    :isOpen="isOpen"
    title="Detalhes do Ticket"
    :isLoading="loadedTicket ? false : true"
    @close="closeModal"
  >
    <div v-if="loadedTicket" class="content">
      <!-- Assunto em largura total -->
      <div class="details-item full-width-subject">
        <div class="detail-icon">
          <font-awesome-icon icon="file-alt" />
        </div>
        <div class="detail-content">
          <div class="detail-label">Assunto</div>
          <div class="detail-value">{{ loadedTicket.name }}</div>
        </div>
      </div>

      <div class="ticket-details-container">
        <!-- Coluna da Esquerda - Informações -->
        <div class="left-column">
          <!-- ID -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="hashtag" />
            </div>
            <div class="detail-content">
              <div class="detail-label">ID</div>
              <div class="detail-value">{{ loadedTicket.id }}</div>
            </div>
          </div>

          <!-- Prioridade -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="exclamation-circle" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Prioridade</div>
              <div class="detail-value">
                <span :class="['priority-label', getPriorityClass(loadedTicket.priority)]">
                  <font-awesome-icon
                    :icon="getPriorityIcon(loadedTicket.priority)"
                    class="badge-icon"
                  />
                  {{ ticket?.priority }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="clock" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Status</div>
              <div class="detail-value">
                <span :class="['status-label', getStatusClass(loadedTicket.status)]">
                  <font-awesome-icon
                    :icon="getStatusIcon(loadedTicket.status)"
                    class="badge-icon"
                  />
                  {{ ticket?.status.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Solicitante e Setor -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="user-tie" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Solicitante / Setor</div>
              <div class="detail-value">
                {{ loadedTicket.requester.firstName }} {{ loadedTicket.requester.lastName }} / {{ loadedTicket.department.name }}
              </div>
            </div>
          </div>

          <!-- Responsável -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="user" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Responsável</div>
              <div class="detail-value">
                {{ loadedTicket.targetUser.firstName }} {{ loadedTicket.targetUser.lastName }}
              </div>
            </div>
          </div>

          <!-- Concluir até -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="calendar-check" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Concluir até</div>
              <div class="detail-value">{{ formatDate(loadedTicket.dueAt) }}</div>
            </div>
          </div>

          <!-- Prazo -->
          <div class="details-item" :class="getDeadlineClass(ticket?.completedAt)">
            <div class="detail-icon">
              <font-awesome-icon icon="hourglass-end" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Prazo</div>
              <div class="detail-value">
                {{ calculateDeadline(loadedTicket) }}
                <font-awesome-icon
                  v-if="isPastDeadline(loadedTicket.dueAt)"
                  icon="exclamation-triangle"
                  class="warning-icon"
                />
              </div>
            </div>
          </div>

          <!-- Privacidade -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="lock" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Privacidade</div>
              <div class="detail-value">{{ loadedTicket.isPrivate ? 'Privado' : 'Público' }}</div>
            </div>
          </div>

          <!-- Aceite em -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="user-check" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Aceite em</div>
              <div class="detail-value">{{ formatDate(loadedTicket.acceptedAt) }}</div>
            </div>
          </div>

          <!-- Categoria -->
          <div class="details-item">
            <div class="detail-icon">
              <font-awesome-icon icon="folder" />
            </div>
            <div class="detail-content">
              <div class="detail-label">Categoria</div>
              <div class="detail-value">{{ loadedTicket.category?.name || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita - Descrição -->
        <div class="right-column">
          <div class="description-header">
            <div class="detail-icon">
              <font-awesome-icon icon="file-alt" />
            </div>
            <div class="detail-label">Descrição</div>
          </div>
          <div class="description-box">
            <div class="description-text">{{ loadedTicket.description }}</div>
          </div>
        </div>
      </div>

      <div class="ticket-actions" v-if="isTargetUser || (isRequester && loadedTicket.status === TicketStatus.UnderVerification)">
        <button
          v-if="isTargetUser && ticket?.status === TicketStatus.Pending"
          class="action-button accept"
          @click="acceptTicket(ticket?.id)"
        >
          <font-awesome-icon icon="check" /> Aceitar
        </button>
        <button
          v-if="isTargetUser && ticket?.status === TicketStatus.InProgress"
          class="action-button verify"
          @click="sendForReview(loadedTicket.id)"
        >
          <font-awesome-icon icon="arrow-right" /> Enviar para Verificação
        </button>
        <div
          v-else-if="loadedTicket.status === TicketStatus.UnderVerification"
          class="verification-actions"
        >
          <div v-if="isTargetUser" class="status-waiting">
            <font-awesome-icon icon="hourglass-half" class="waiting-icon" /> EM VERIFICAÇÃO
          </div>
          <template v-if="isRequester">
            <button
              class="action-button approve"
              @click="approveTicket(loadedTicket.id)"
            >
              <font-awesome-icon icon="check" /> Aprovar
            </button>
            <button
              class="action-button request-correction"
              @click="requestCorrection(loadedTicket.id)"
            >
              <font-awesome-icon icon="exclamation-circle" /> Solicitar Correção
            </button>
            <button
              class="action-button reject"
              @click="rejectTicket(loadedTicket.id)"
            >
              <font-awesome-icon icon="times" /> Reprovar
            </button>
          </template>
        </div>
        <button
          v-else-if="loadedTicket.status === TicketStatus.Completed"
          class="btn btn-success disabled"
          disabled
        >
          <font-awesome-icon icon="check-circle" /> RESOLVIDO
        </button>
        <button
          v-else-if="loadedTicket.status === TicketStatus.Rejected"
          class="btn btn-danger disabled"
          disabled
        >
          <font-awesome-icon icon="times-circle" /> REPROVADO
        </button>
      </div>

      <div class="comment-section">
        <div class="section-header">
          <font-awesome-icon icon="comments" />
          <h3>Comentários</h3>
        </div>
        <div v-if="loadedTicket?.status !== TicketStatus.Rejected" class="comment-input">
          <textarea
            v-model="newComment"
            placeholder="Digite seu comentário aqui..."
            class="update-input"
          ></textarea>
          <button @click="comment()" class="btn btn-primary">
            <font-awesome-icon icon="paper-plane" /> Enviar
          </button>
        </div>
        <div v-else class="comment-disabled">
          <font-awesome-icon icon="ban" />
          <p>Comentários desabilitados para tickets reprovados</p>
        </div>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <font-awesome-icon icon="user-circle" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author"
                  >{{ comment.user.firstName }} {{ comment.user.lastName }}</span
                >
                <span class="comment-time">{{ formatRelativeTime(comment.createdAt) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>

  <ConfirmationModal
    v-if="confirmationModal.isOpen"
    :isOpen="confirmationModal.isOpen"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    :isCorrection="confirmationModal.isCorrection"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import { TicketStatus, type Ticket, type TicketComment } from '@/models';
import { ref, computed, watch } from 'vue';
import { ticketCommentService } from '@/services/ticketCommentService';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';
import { formatRelativeTime } from '@/utils/date';
import ConfirmationModal from '../common/ConfirmationModal.vue';

const props = defineProps<{
  isOpen: boolean;
  ticket: Ticket | null;
}>();

const emit = defineEmits(['close', 'refresh']);
const userStore = useUserStore();
const newComment = ref('');
const comments = ref<TicketComment[]>([]);
const loadedTicket = ref<Ticket | null>(null);

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  action: null as (() => Promise<void>) | null,
  isCorrection: false
});

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
      return 'status-aguardando-verificacao';
    case TicketStatus.UnderVerification:
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
  if (!ticket.completedAt) return '—';

  const deadline = new Date(ticket.completedAt);
  const today = new Date();

  // Reset hours to compare just dates
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'ATRASADO';
  }

  return `${diffDays} dias restantes`;
};

const isPastDeadline = (date?: string) => {
  if (!date) return false;
  const deadline = new Date(date);
  const today = new Date();

  // Reset hours to compare just dates
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 3; // Retorna true se faltam 3 dias ou menos
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

  if (diffDays <= 3) return 'deadline-danger';
  return 'deadline-normal';
};

const openConfirmationModal = (title: string, message: string, action: () => Promise<void>, isCorrection = false) => {
  confirmationModal.value = {
    isOpen: true,
    title,
    message,
    action,
    isCorrection
  };
};

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false;
  confirmationModal.value.action = null;
};

const handleConfirm = async () => {
  if (confirmationModal.value.action) {
    await confirmationModal.value.action();
  }
  closeConfirmationModal();
};

const handleCancel = () => {
  closeConfirmationModal();
};

const acceptTicket = async (ticketId: number) => {
  openConfirmationModal(
    'Aceitar Ticket',
    'Tem certeza que deseja aceitar este ticket?',
    async () => {
      try {
        await ticketService.accept(ticketId);
        toast.success('Ticket aceito com sucesso');
        emit('refresh');
      } catch {
        toast.error('Erro ao aceitar o ticket');
      }
    }
  );
};

const sendForReview = async (ticketId: number) => {
  openConfirmationModal(
    'Enviar para Verificação',
    'Tem certeza que deseja enviar este ticket para verificação?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: TicketStatus.AwaitingVerification });
        toast.success('Ticket enviado para revisão');
        emit('refresh');
      } catch {
        toast.error('Erro ao enviar o ticket para revisão');
      }
    }
  );
};

const approveTicket = async (ticketId: number) => {
  openConfirmationModal(
    'Aprovar Ticket',
    'Tem certeza que deseja aprovar este ticket?',
    async () => {
      try {
        await ticketService.approve(ticketId);
        toast.success('Ticket aprovado com sucesso');
        emit('refresh');
      } catch {
        toast.error('Erro ao aprovar o ticket');
      }
    }
  );
};

const requestCorrection = async (ticketId: number) => {
  openConfirmationModal(
    'Solicitar Correção',
    'Por favor, preencha os detalhes da correção necessária:',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: TicketStatus.InProgress });
        toast.success('Correção solicitada com sucesso');
        emit('refresh');
      } catch {
        toast.error('Erro ao solicitar correção');
      }
    },
    true // indica que é uma solicitação de correção
  );
};

const rejectTicket = async (ticketId: number) => {
  openConfirmationModal(
    'Reprovar Ticket',
    'Tem certeza que deseja reprovar este ticket?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: TicketStatus.Rejected });
        toast.success('Ticket reprovado com sucesso');
        emit('refresh');
      } catch {
        toast.error('Erro ao reprovar o ticket');
      }
    }
  );
};

const comment = async () => {
  if (!newComment.value.trim()) {
    toast.error('Comentário não pode estar vazio');
    return;
  }

  try {
    await ticketCommentService.create({
      ticketId: loadedTicket.value!.id,
      userId: userStore.user!.id,
      content: newComment.value,
    });
    fetchComments();
    newComment.value = '';
  } catch {
    toast.error('Erro ao adicionar comentário');
  }
};

const fetchComments = async () => {
  try {
    if (loadedTicket.value) {
      const response = await ticketCommentService.getByTicket(loadedTicket.value.id);
      comments.value = response.data;
    }
  } catch {
    toast.error('Erro ao buscar comentários');
  }
};

const isTargetUser = computed(() => userStore.user?.id === loadedTicket.value?.targetUser.id);
const isRequester = computed(() => userStore.user?.id === loadedTicket.value?.requester.id);

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Baixa':
      return 'arrow-down';
    case 'Média':
      return 'minus';
    case 'Alta':
      return 'arrow-up';
    default:
      return 'exclamation-circle';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'clock';
    case TicketStatus.InProgress:
      return 'spinner';
    case TicketStatus.AwaitingVerification:
      return 'hourglass-half';
    case TicketStatus.UnderVerification:
      return 'search';
    case TicketStatus.Completed:
      return 'check-circle';
    case TicketStatus.Rejected:
      return 'times-circle';
    default:
      return 'question-circle';
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.ticket?.id) {
      fetchComments();
    }
  },
);

watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      loadedTicket.value = newTicket;
      fetchComments();
    }
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      loadedTicket.value = null;
    }
  },
);
</script>

<style scoped>
.content {
  min-width: 800px;
  min-height: 90vh;
  padding: 1.5rem;
}

.full-width-subject {
  margin-bottom: 1rem;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.ticket-details-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: start;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.description-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.description-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.75rem;
  flex: 1;
  border: 1px solid #e2e8f0;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.5;
  min-height: 200px;
  font-size: 0.9rem;
  color: #212529;
}

.details-item {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.details-item:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.detail-icon {
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 0.9rem;
}

.detail-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6c757d;
  min-width: 85px;
}

.detail-value {
  font-size: 0.9rem;
  color: #212529;
  flex: 1;
}

.priority-label,
.status-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  gap: 0.5rem;
}

.badge-icon {
  font-size: 0.9rem;
}

.priority-label.priority-baixa {
  background: #e8f5e9;
  color: #2e7d32;
}

.priority-label.priority-media {
  background: #fff3e0;
  color: #f57c00;
}

.priority-label.priority-alta {
  background: #ffebee;
  color: #c62828;
}

.status-label.status-pendente {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-label.status-em-andamento {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.status-label.status-aguardando-verificacao {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid rgba(123, 31, 162, 0.3);
}

.status-label.status-em-verificacao {
  background-color: #e9d5ff;
  color: #7e22ce;
  border: 1px solid rgba(126, 34, 206, 0.3);
}

.status-label.status-resolvido {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
}

.status-label.status-cancelado {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}

.ticket-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-button.accept {
  background-color: #16a34a;
}

.action-button.accept:hover {
  background-color: #15803d;
}

.action-button.verify {
  background-color: #0284c7;
}

.action-button.verify:hover {
  background-color: #0369a1;
}

.action-button.approve {
  background-color: #059669;
}

.action-button.approve:hover {
  background-color: #047857;
}

.action-button.request-correction {
  background-color: #7b1fa2;
}

.action-button.request-correction:hover {
  background-color: #6a1b9a;
}

.action-button.reject {
  background-color: #dc2626;
}

.action-button.reject:hover {
  background-color: #b91c1c;
}

.status-waiting {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #7e22ce;
}

.waiting-icon {
  color: #7e22ce;
}

.comment-section {
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #495057;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.update-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  background: white;
  transition: all 0.3s ease;
}

.update-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.comments-list {
  margin-top: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 1.5rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 500;
  color: #212529;
}

.comment-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.comment-text {
  color: #495057;
  line-height: 1.5;
}

.deadline-danger {
  background: #fff3f3 !important;
}

.deadline-danger .detail-value {
  color: #dc3545 !important;
  font-weight: bold !important;
}

.deadline-normal {
  background: #f0fff4 !important;
}

.deadline-normal .detail-value {
  color: #28a745 !important;
}

.warning-icon {
  color: #dc3545;
  margin-left: 0.5rem;
}

.comment-disabled {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffebee;
  border-radius: 8px;
  color: #c62828;
}

.comment-disabled svg {
  font-size: 1.2rem;
}

.comment-disabled p {
  margin: 0;
  font-size: 0.9rem;
}

/* Dark mode */
:deep(body.dark-mode) .details-item {
  background: #1a2233;
  border-color: #2d3748;
}

:deep(body.dark-mode) .details-item:hover {
  background: #1e293b;
  border-color: #374151;
}

:deep(body.dark-mode) .detail-icon {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .detail-label {
  color: #94a3b8;
}

:deep(body.dark-mode) .detail-value {
  color: #e2e8f0;
}

:deep(body.dark-mode) .comment-section {
  background: #1a2233;
}

:deep(body.dark-mode) .comment-item {
  background: #1e293b;
}

:deep(body.dark-mode) .comment-avatar {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .comment-author {
  color: #e2e8f0;
}

:deep(body.dark-mode) .comment-text {
  color: #94a3b8;
}

:deep(body.dark-mode) .update-input {
  background: #1e293b;
  border-color: #2d3748;
  color: #e2e8f0;
}

:deep(body.dark-mode) .update-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

:deep(body.dark-mode) .comment-disabled {
  background: #1a1a1a;
  color: #ef5350;
}

.verification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
