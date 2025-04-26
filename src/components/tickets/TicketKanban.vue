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
            <div class="header-left">
              <div class="card-title">{{ ticket.name }}</div>
            </div>
            <div class="ticket-indicators">
              <div class="indicator" title="Comentários">
                <font-awesome-icon icon="comment" />
                <span>{{ ticket.comments?.length || 0 }}</span>
              </div>
              <div class="indicator" title="Anexos">
                <font-awesome-icon icon="paperclip" />
                <span>{{ ticket.files?.length || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="card-divider"></div>
          <div class="card-info">
            <div class="info-row">
              <div class="requester-info">
                {{ ticket.requester.firstName }} {{ ticket.requester.lastName }} / {{ ticket.department.name }}
              </div>
              <div class="priority-flag" :class="priorityColor(ticket.priority)" title="Prioridade">
                <font-awesome-icon :icon="priorityIcon(ticket.priority)" class="priority-icon" />
                {{ ticket.priority }}
              </div>
            </div>
            <div class="info-row">
              <div class="info-item last-update" title="Última atualização">
                <font-awesome-icon icon="clock-rotate-left" class="info-icon" />
                {{ formatRelativeTime(ticket.updatedAt) }}
              </div>
              <div
                v-if="ticket.dueAt"
                :class="['info-item deadline', getDeadlineClass(ticket.dueAt)]"
                :title="'Prazo: ' + (ticket.dueAt ? formatDate(ticket.dueAt) : 'Não definido')"
              >
                <font-awesome-icon :icon="getDeadlineIcon(ticket)" class="info-icon" />
                {{ calculateDeadline(ticket) }}
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
import { ref } from 'vue';
import type { Ticket } from '@/models';
import { TicketStatus } from '@/models';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { formatDate, formatRelativeTime } from '@/utils/date';
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

const selectedTicket = ref<Ticket | null>(null);
const isModalOpen = ref(false);

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

const calculateDeadline = (ticket: Ticket) => {
  if (!ticket.dueAt) return '—';

  const now = new Date();
  const dueDate = new Date(ticket.dueAt);

  if (dueDate < now) {
    return 'Atrasado';
  }

  const diffTime = Math.abs(dueDate.getTime() - now.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hora restante' : `${diffHours} horas restantes`;
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1 ? '1 dia restante' : `${diffDays} dias restantes`;
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
  } else if (diffDays <= 2) {
    return 'urgent';
  } else if (diffDays <= 3) {
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
  } else if (diffDays <= 3) {
    return 'clock';
  }

  return 'calendar-day';
};

const openTicketDetails = (ticket: Ticket) => {
  selectedTicket.value = ticket;
  isModalOpen.value = true;
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow-x: auto;
  min-height: 70vh;
  background: #ffffff;
  border-radius: 8px;
  position: relative;
  width: 100%;
}

:deep(body.dark-mode) .kanban-board {
  background: #111827;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  width: 0;
  background: #f0f2f5;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

:deep(body.dark-mode) .kanban-column {
  background: #1e293b;
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

:deep(body.dark-mode) .column-header {
  background: var(--surface-card);
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
  background: var(--surface-hover);
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
  background: var(--surface-hover);
  border-radius: 4px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: var(--surface-border);
}

.kanban-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 0.875rem;
  display: flex;
  flex-direction: column;
}

:deep(body.dark-mode) .kanban-card {
  background: #252f3f;
  border-color: #374151;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #4b5563;
}

:deep(body.dark-mode) .kanban-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: #4b5563;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  width: 100%;
  padding: 0;
}

.header-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
}

.card-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  margin: 0;
  padding: 0;
  text-align: left;
  width: 100%;
}

.ticket-indicators {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  opacity: 0.8;
}

.indicator span {
  font-size: 0.7rem;
  min-width: 1rem;
}

.deadline {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.deadline.normal {
  background: #e5e7eb;
  color: #4b5563;
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
  background: #374151;
  color: #9ca3af;
}

.card-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
  opacity: 0.5;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.requester-info {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.priority-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  color: white;
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

.requester-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
}

.notification-indicator {
  color: #3b82f6;
  font-size: 0.75rem;
  animation: pulse 2s infinite;
  margin-left: 0.25rem;
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

:deep(body.dark-mode) .notification-indicator {
  color: #60a5fa;
}
</style>