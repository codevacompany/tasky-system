<template>
  <div>
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-scroll transition-all duration-200 mb-6"
    >
      <table class="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              ID
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Título
            </th>
            <th
              v-if="tableType === 'criados'"
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Destino
            </th>
            <th
              v-else
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Solicitante
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Setor
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Prioridade
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Status
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Criado em
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Concluir até
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Prazo
            </th>
            <th
              class="px-3 md:px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="10" class="px-3 md:px-4 py-6 md:py-8 text-center">
              <div class="flex justify-center items-center">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else-if="!displayedTickets || displayedTickets.length === 0">
            <td
              colspan="10"
              class="px-3 md:px-4 py-6 md:py-8 text-center text-gray-500 dark:text-gray-400"
            >
              <p>Nenhum ticket encontrado</p>
            </td>
          </tr>
          <tr
            v-for="ticket in displayedTickets"
            :key="ticket.customId"
            @click="openTicketDetails(ticket)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              {{ ticket.customId }}
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="max-w-[150px] truncate" :title="ticket.name">
                {{ ticket.name }}
              </div>
              <font-awesome-icon
                v-if="ticket.isPrivate"
                icon="lock"
                class="ml-2 text-gray-500 dark:text-gray-400 text-xs"
                title="Ticket Privado"
              />
            </td>
            <td
              v-if="tableType === 'criados'"
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="max-w-[120px]">
                <div class="truncate">
                  {{
                    ticket.targetUser
                      ? ticket.targetUser.firstName + ' ' + ticket.targetUser.lastName
                      : '-'
                  }}
                </div>
                <div
                  v-if="ticket.targetUser && !ticket.targetUser.isActive"
                  class="flex items-center justify-center gap-1 mt-1"
                >
                  <font-awesome-icon
                    icon="exclamation-triangle"
                    class="text-orange-500 text-xs"
                    title="Conta desativada"
                  />
                  <span class="text-orange-500 text-xs font-medium">Desativado</span>
                </div>
              </div>
            </td>
            <td
              v-else
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="max-w-[120px] truncate">
                {{ ticket.requester.firstName }} {{ ticket.requester.lastName }}
              </div>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="max-w-[100px] truncate" :title="ticket.department.name">
                {{ ticket.department.name }}
              </div>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center justify-center gap-1 md:gap-2">
                <span
                  :class="[
                    'font-bold tracking-tight text-xs md:text-sm',
                    ticket.priority === TicketPriority.Low
                      ? 'text-green-600 dark:text-green-400'
                      : ticket.priority === TicketPriority.Medium
                        ? 'text-orange-500 dark:text-orange-400'
                        : 'text-red-600 dark:text-red-400',
                  ]"
                >
                  {{ getPriorityBars(ticket.priority) }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">{{
                  ticket.priority
                }}</span>
              </div>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center border-b border-gray-200 dark:border-gray-700"
            >
              <span
                :class="[
                  'inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs font-medium gap-1 md:gap-2',
                  getStatusClass(ticket.status),
                ]"
              >
                <span class="hidden md:inline">{{
                  formatSnakeToNaturalCase(ticket.status).toUpperCase()
                }}</span>
                <span class="md:hidden">{{
                  formatSnakeToNaturalCase(ticket.status).substring(0, 3).toUpperCase()
                }}</span>
              </span>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="whitespace-nowrap">
                {{ formatDate(ticket.createdAt) }}
              </div>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="whitespace-nowrap">
                {{ ticket.dueAt ? formatDate(ticket.dueAt) : '—' }}
              </div>
            </td>
            <td
              :class="[
                'px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center border-b border-gray-200 dark:border-gray-700',
                calculateDeadline(ticket) === '—'
                  ? 'text-gray-900 dark:text-gray-100'
                  : getDeadlineClass(ticket.dueAt),
              ]"
            >
              <div class="whitespace-nowrap">
                {{ calculateDeadline(ticket) }}
                <font-awesome-icon
                  v-if="calculateDeadline(ticket) === 'Atrasado'"
                  icon="exclamation-triangle"
                  class="ml-1 text-red-500 text-xs"
                />
              </div>
            </td>
            <td
              class="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex gap-0.5 md:gap-1 justify-center">
                <!-- Botões para tabela de tickets recebidos -->
                <template v-if="tableType === 'recebidos'">
                  <button
                    v-if="ticket.status === TicketStatus.Pending"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                    @click.stop="handleAcceptTicket(ticket)"
                    title="Aceitar"
                  >
                    <font-awesome-icon icon="check" class="text-xs md:text-sm" />
                  </button>
                  <button
                    v-else-if="ticket.status === TicketStatus.InProgress"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200"
                    @click.stop="handleVerifyTicket(ticket)"
                    title="Enviar para Verificação"
                  >
                    <font-awesome-icon icon="arrow-right" class="text-xs md:text-sm" />
                  </button>
                  <button
                    v-else-if="ticket.status === TicketStatus.Returned"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                    @click.stop="handleCorrectTicket(ticket)"
                    title="Corrigir"
                  >
                    <font-awesome-icon icon="wrench" class="text-xs md:text-sm" />
                  </button>
                  <div
                    v-else-if="ticket.status === TicketStatus.AwaitingVerification"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 text-white"
                    title="Aguardando Verificação"
                  >
                    <font-awesome-icon icon="hourglass-half" spin class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Completed"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
                  </div>
                </template>

                <!-- Botões para tabela de tickets criados -->
                <template v-else-if="tableType === 'criados'">
                  <div
                    v-if="ticket.status === TicketStatus.Pending"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 text-white"
                    title="Não Iniciado"
                  >
                    <font-awesome-icon icon="clock" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.InProgress"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 text-white"
                    title="Fazendo"
                  >
                    <font-awesome-icon icon="cog" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Returned"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 text-white"
                    title="Devolvido para Correção"
                  >
                    <font-awesome-icon icon="wrench" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Completed"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
                  </div>
                  <button
                    v-else-if="ticket.status === TicketStatus.AwaitingVerification"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200"
                    @click.stop="handleStartVerification(ticket)"
                    title="Verificar"
                  >
                    <font-awesome-icon icon="search" class="text-xs md:text-sm" />
                  </button>
                  <div
                    v-else-if="
                      ticket.status === TicketStatus.UnderVerification &&
                      userStore.user?.id === ticket.requester.id
                    "
                    class="flex gap-0.5 md:gap-1"
                  >
                    <button
                      class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                      @click.stop="handleApproveTicket(ticket)"
                      title="Aprovar"
                    >
                      <font-awesome-icon icon="check" class="text-xs md:text-sm" />
                    </button>
                    <button
                      class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200"
                      @click.stop="handleRequestCorrection(ticket)"
                      title="Solicitar Correção"
                    >
                      <font-awesome-icon icon="exclamation-circle" class="text-xs md:text-sm" />
                    </button>
                    <button
                      class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                      @click.stop="handleRejectTicket(ticket)"
                      title="Reprovar"
                    >
                      <font-awesome-icon icon="times" class="text-xs md:text-sm" />
                    </button>
                  </div>
                </template>

                <!-- Botões para tabela de tickets arquivados -->
                <template v-else-if="tableType === 'arquivados'">
                  <div
                    v-if="ticket.status === TicketStatus.Completed"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
                    title="Finalizado"
                  >
                    <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
                  </div>
                  <div
                    v-else-if="ticket.status === TicketStatus.Rejected"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
                    title="Reprovado"
                  >
                    <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
                  </div>
                </template>

                <!-- Botões para tabela de tickets do setor -->
                <template v-else-if="tableType === 'setor'">
                  <button
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
                    @click.stop="openTicketDetails(ticket)"
                    title="Visualizar"
                  >
                    <font-awesome-icon icon="eye" class="text-xs md:text-sm" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination" class="flex items-center justify-center gap-4 mt-6">
      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <span class="text-sm text-gray-600 dark:text-gray-400"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >

      <button
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600 dark:disabled:hover:text-gray-300"
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
      <div class="p-6 text-center">
        <div class="text-3xl text-purple-700 dark:text-purple-400 mb-4">
          <font-awesome-icon icon="info-circle" />
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
          Para visualizar os detalhes deste ticket, você precisa iniciar a verificação clicando no
          botão "Verificar".
        </p>
        <div class="flex justify-center gap-4">
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
            @click="showVerificationAlert = false"
          >
            Cancelar
          </button>
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-200"
            @click="handleAlertVerification"
          >
            Verificar
          </button>
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
  if (!date) return 'text-gray-900 dark:text-gray-100';
  const deadline = new Date(date);
  const today = new Date();

  // Reset hours to compare just dates
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-red-600 dark:text-red-400 font-bold';
  if (diffDays <= 3) return 'text-orange-500 dark:text-orange-400 font-bold';
  return 'text-green-600 dark:text-green-400';
};

const priorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.Low:
      return 'text-green-600 dark:text-green-400';
    case TicketPriority.Medium:
      return 'text-orange-500 dark:text-orange-400';
    case TicketPriority.High:
      return 'text-red-600 dark:text-red-400';
    default:
      return '';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'bg-orange-100 text-orange-500 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
    case TicketStatus.InProgress:
      return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    case TicketStatus.AwaitingVerification:
    case TicketStatus.UnderVerification:
      return 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
    case TicketStatus.Completed:
      return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
    case TicketStatus.Rejected:
      return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
    case TicketStatus.Returned:
      return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
    case TicketStatus.Canceled:
      return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
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
/* All styles have been converted to Tailwind classes */
</style>
