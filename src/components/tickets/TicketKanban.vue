<template>
  <div class="kanban-board">
    <div v-for="status in statusColumns" :key="status" class="kanban-column">
      <div class="column-header">
        <h3 class="column-title">
          {{ formatSnakeToNaturalCase(status) }}
          <span class="ticket-count">{{ getTicketsByStatus(status).length }}</span>
        </h3>
      </div>
      <div class="column-content">
        <div
          v-for="ticket in getTicketsByStatus(status)"
          :key="ticket.customId"
          class="kanban-card"
          @click="openTicketDetails(ticket)"
        >
          <div class="card-header">
            <div class="card-title">{{ ticket.name }}</div>
            <div class="ticket-id">
              #{{ ticket.customId }}
              <font-awesome-icon 
                v-if="hasNotifications(ticket)"
                icon="bell" 
                class="notification-indicator" 
              />
            </div>
          </div>
          <div class="card-divider"></div>
          <div class="card-info">
            <div class="info-row three-columns">
              <div class="info-item requester" title="Solicitante">
                <font-awesome-icon icon="user" class="info-icon" />
                {{ ticket.requester.firstName }} {{ ticket.requester.lastName }}
              </div>
              <div class="info-item department" title="Setor">
                <font-awesome-icon icon="building" class="info-icon" />
                {{ ticket.department.name }}
              </div>
              <div class="info-item last-update" title="Última atualização">
                <font-awesome-icon icon="clock-rotate-left" class="info-icon" />
                {{ formatTimeAgo(ticket.updatedAt) }}
              </div>
            </div>
            <div class="info-row three-columns">
              <div class="info-item category" title="Categoria">
                <font-awesome-icon icon="tag" class="info-icon" />
                {{ ticket.category?.name || '—' }}
              </div>
              <div :class="['info-item deadline', getDeadlineClass(ticket.dueAt)]" :title="'Prazo: ' + (ticket.dueAt ? formatDate(ticket.dueAt) : 'Não definido')">
                <font-awesome-icon :icon="getDeadlineIcon(ticket)" class="info-icon" />
                {{ calculateDeadline(ticket) }}
              </div>
              <div class="priority-flag" :class="priorityColor(ticket.priority)" title="Prioridade">
                <font-awesome-icon :icon="priorityIcon(ticket.priority)" class="priority-icon" />
                {{ ticket.priority }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TicketDetailsModal
    v-if="isModalOpen"
    :isOpen="isModalOpen"
    :ticket="selectedTicket"
    @close="isModalOpen = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { Ticket } from '@/models';
import { TicketStatus } from '@/models';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { formatDate } from '@/utils/date';
import { notificationService } from '@/services/notificationService';
import TicketDetailsModal from '@/components/tickets/TicketDetailsModal.vue';

const props = defineProps<{
  tickets: Ticket[];
}>();

const statusColumns = [
  TicketStatus.Pending,
  TicketStatus.InProgress,
  TicketStatus.AwaitingVerification,
  TicketStatus.UnderVerification,
];

const ticketsWithNotifications = ref<Set<string>>(new Set());
let notificationInterval: number | null = null;

const selectedTicket = ref<Ticket | null>(null);
const isModalOpen = ref(false);

const fetchNotificationsForTickets = async () => {
  try {
    const response = await notificationService.getUnreadByTickets(props.tickets.map(t => t.customId));
    ticketsWithNotifications.value = new Set(response.data.map(n => n.resourceCustomId));
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
  }
};

onMounted(() => {
  fetchNotificationsForTickets();
  notificationInterval = setInterval(fetchNotificationsForTickets, 120000); // Atualiza a cada 2 minutos
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});

const hasNotifications = (ticket: Ticket) => {
  return ticketsWithNotifications.value.has(ticket.customId);
};

const getTicketsByStatus = (status: string) => {
  return props.tickets.filter(ticket => ticket.status === status);
};

const priorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'baixa':
      return 'priority-low';
    case 'média':
      return 'priority-medium';
    case 'alta':
      return 'priority-high';
    default:
      return '';
  }
};

const priorityIcon = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'baixa':
      return 'arrow-down';
    case 'média':
      return 'minus';
    case 'alta':
      return 'arrow-up';
    default:
      return 'minus';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'status-pending';
    case TicketStatus.InProgress:
      return 'status-progress';
    case TicketStatus.AwaitingVerification:
      return 'status-awaiting';
    case TicketStatus.UnderVerification:
      return 'status-verification';
    default:
      return '';
  }
};

const calculateDeadline = (ticket: Ticket) => {
  if (!ticket.dueAt) return '—';
  
  const now = new Date();
  const dueDate = new Date(ticket.dueAt);
  
  if (dueDate < now) {
    return 'Atrasado';
  }
  
  const diffTime = Math.abs(dueDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `${diffDays}d`;
};

const getDeadlineClass = (dueDate: string | null) => {
  if (!dueDate) return 'normal';
  
  const now = new Date();
  const due = new Date(dueDate);
  
  if (due < now) {
    return 'overdue';
  }
  
  const diffTime = Math.abs(due.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    return 'critical';
  } else if (diffDays <= 3) {
    return 'urgent';
  } else if (diffDays <= 5) {
    return 'warning';
  }
  
  return 'normal';
};

const getDeadlineIcon = (ticket: Ticket) => {
  if (!ticket.dueAt) return 'clock';
  
  const now = new Date();
  const dueDate = new Date(ticket.dueAt);
  
  if (dueDate < now) {
    return 'exclamation-circle';
  }
  
  const diffTime = Math.abs(dueDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 2) {
    return 'exclamation-triangle';
  } else if (diffDays <= 5) {
    return 'clock';
  }
  
  return 'calendar-day';
};

const openTicketDetails = (ticket: Ticket) => {
  selectedTicket.value = ticket;
  isModalOpen.value = true;
};

const formatTimeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return 'agora';
  }

  // Minutos (1-59)
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes}min atrás`;
  }

  // Horas (1-23)
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h atrás`;
  }

  // Dias (1-30)
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d atrás`;
  }

  // Meses (1-11)
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}m atrás`;
  }

  // Anos
  const years = Math.floor(months / 12);
  return `${years}a atrás`;
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow-x: auto;
  min-height: 70vh;
  background: var(--surface-ground);
  border-radius: 8px;
  position: relative;
  width: 100%;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  width: 0;
  background: var(--surface-section);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.kanban-column:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -0.75rem;
  top: 1rem;
  bottom: 1rem;
  width: 1px;
  background: #000000;
  opacity: 0.2;
}

:deep(body.dark-mode) .kanban-column:not(:last-child)::after {
  background: #ffffff;
  opacity: 0.2;
}

.column-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-section);
  border-radius: 12px 12px 0 0;
  text-align: center;
}

.column-title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  padding: 0.5rem 0;
}

:deep(body.dark-mode) .column-title {
  background: none;
}

.ticket-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

:deep(body.dark-mode) .ticket-count {
  background: rgba(255, 255, 255, 0.1);
}

.column-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Estilização da barra de rolagem */
.column-content::-webkit-scrollbar {
  width: 8px;
}

.column-content::-webkit-scrollbar-track {
  background: transparent;
}

.column-content::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 4px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: var(--surface-hover);
}

.kanban-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--surface-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

:deep(body.dark-mode) .kanban-card {
  background: var(--surface-card);
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text-color);
  flex: 1;
  word-break: break-word;
}

.ticket-id {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.8;
}

.notification-indicator {
  color: #3b82f6;
  font-size: 0.875rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.card-divider {
  height: 1px;
  background: var(--surface-border);
  margin: 0.75rem 0;
  opacity: 0.7;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-row.three-columns {
  display: grid;
  grid-template-columns: minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: center;
  text-align: center;
}

.info-row.three-columns:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-icon {
  flex-shrink: 0;
}

.department {
  text-align: right;
}

.priority-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  color: white;
  min-width: 0;
}

.priority-icon {
  font-size: 0.75rem;
}

.priority-low {
  background-color: #22c55e; /* Verde */
}

.priority-medium {
  background-color: #f59e0b; /* Amarelo/Laranja */
}

.priority-high {
  background-color: #ef4444; /* Vermelho */
}

.deadline {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deadline.normal {
  background: rgba(100, 116, 139, 0.15);
  color: #64748b;
}

.deadline.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.deadline.urgent {
  background: #f97316;
  color: white;
}

.deadline.critical {
  background: #ef4444;
  color: white;
}

.deadline.overdue {
  background: #dc2626;
  color: white;
}

:deep(body.dark-mode) .deadline.normal {
  background: rgba(100, 116, 139, 0.25);
  color: #94a3b8;
}

:deep(body.dark-mode) .deadline.warning {
  background: rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}

.last-update {
  text-align: right;
}

.category {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.category .info-icon {
  opacity: 0.7;
}

.requester .info-icon {
  opacity: 0.7;
}

.department .info-icon {
  opacity: 0.7;
}

.last-update .info-icon {
  opacity: 0.7;
}
</style> 