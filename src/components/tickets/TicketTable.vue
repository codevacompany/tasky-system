<template>
  <div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              ID
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Título
            </th>
            <th
              v-if="tableType === 'criados'"
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Destino
            </th>
            <th
              v-else
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Solicitante
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Setor
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Prioridade
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Status
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Prazo
            </th>
            <th
              class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="px-3 md:px-4 py-6 md:py-8 text-center">
              <div class="flex justify-center items-center">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else-if="!displayedTickets || displayedTickets.length === 0">
            <td
              colspan="8"
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
              class="px-4 py-3 text-sm text-center text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap"
            >
              {{ ticket.customId }}
            </td>
            <td
              class="pl-4 pr-1 py-3 text-sm text-left text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="truncate max-w-[550px]" :title="ticket.name">
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
              class="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <div v-if="ticket.targetUsers && ticket.targetUsers.length > 0" class="space-y-1">
                  <div
                    v-for="targetUser in ticket.targetUsers"
                    :key="targetUser.userId"
                    :class="[
                      ticket.targetUsers.length > 1 &&
                      targetUser.userId === ticket.currentTargetUserId
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100',
                    ]"
                  >
                    {{ targetUser.user.firstName }} {{ targetUser.user.lastName }}
                  </div>
                  <div
                    v-if="ticket.targetUsers.some((tu) => tu.user && !tu.user.isActive)"
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
                <div v-else>-</div>
              </div>
            </td>
            <td
              v-else
              class="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div>{{ ticket.requester.firstName }} {{ ticket.requester.lastName }}</div>
            </td>
            <td
              class="px-4 py-3 text-sm text-center text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <div v-if="ticket.targetUsers && ticket.targetUsers.length > 0" class="space-y-1">
                  <div
                    v-for="targetUser in ticket.targetUsers"
                    :key="targetUser.userId"
                    :class="[
                      ticket.targetUsers.length > 1 &&
                      targetUser.userId === ticket.currentTargetUserId
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100',
                    ]"
                  >
                    {{ targetUser.user.department?.name || '-' }}
                  </div>
                </div>
                <div v-else class="truncate" :title="ticket.department.name">
                  {{ ticket.department.name }}
                </div>
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
              :class="[
                'px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-center border-b border-gray-200 dark:border-gray-700',
                !ticket.dueAt ? 'text-gray-900 dark:text-gray-100' : getDeadlineClass(ticket.dueAt),
              ]"
            >
              <div class="whitespace-nowrap">
                <template v-if="ticket.dueAt">
                  <span class="flex items-center gap-2 justify-center">
                    <span
                      v-if="!isDeadlineExceeded(ticket.dueAt)"
                      :class="getDeadlineDotClass(ticket.dueAt)"
                      class="inline-block w-[9px] h-[9px] rounded-full"
                    ></span>
                    <font-awesome-icon
                      v-else
                      icon="exclamation-triangle"
                      class="text-red-500 text-xs"
                    />
                    {{ formatDeadlineRelative(ticket.dueAt) }}
                  </span>
                </template>
                <template v-else>
                  {{ calculateDeadline(ticket) }}
                </template>
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
                    v-else-if="
                      ticket.status === TicketStatus.InProgress && !isLastTargetUser(ticket)
                    "
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    @click.stop="handleSendToNextDepartment(ticket)"
                    title="Enviar para Próximo Setor"
                  >
                    <font-awesome-icon icon="arrow-right" class="text-xs md:text-sm" />
                  </button>
                  <button
                    v-else-if="
                      ticket.status === TicketStatus.InProgress && isLastTargetUser(ticket)
                    "
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
                  <button
                    v-else-if="
                      ticket.status === TicketStatus.AwaitingVerification && isReviewer(ticket)
                    "
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-200"
                    @click.stop="handleStartVerification(ticket)"
                    title="Iniciar Verificação"
                  >
                    <font-awesome-icon icon="search" class="text-xs md:text-sm" />
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
                  <div
                    v-if="isReviewer(ticket) && ticket.status === TicketStatus.UnderVerification"
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

                <!-- Botões para tabela de tickets criados -->
                <template v-else-if="tableType === 'criados'">
                  <div
                    v-if="ticket.status === TicketStatus.Pending && isSelfAssigned(ticket)"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    @click.stop="handleStartTicket(ticket)"
                    title="Iniciar"
                  >
                    <font-awesome-icon icon="play" class="text-xs md:text-sm" />
                  </div>
                  <button
                    v-else-if="ticket.status === TicketStatus.Pending"
                    class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 text-white"
                    title="Não Iniciado"
                  >
                    <font-awesome-icon icon="clock" class="text-xs md:text-sm" />
                  </button>
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
                    v-if="isReviewer(ticket) && ticket.status === TicketStatus.UnderVerification"
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
    <div v-if="pagination" class="mt-5 flex items-center justify-between px-6 py-1">
      <span class="text-sm text-gray-600 dark:text-gray-400"
        >Página {{ currentPage }} de {{ totalPages }}</span
      >

      <div class="flex items-center gap-2">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Anterior
        </button>

        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          disabled
        >
          {{ currentPage }}
        </button>

        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Próximo
        </button>
      </div>
    </div>

    <TicketDetailsModal v-if="isModalOpen" :ticket="selectedTicket!" @close="closeModal" />
    <ConfirmationModal
      v-if="confirmationModal.isOpen"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      :hasInput="confirmationModal.hasInput"
      :reasonOptions="confirmationModal.reasonOptions"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- Due Date Modal -->
    <BaseModal
      v-if="showDueDateModal"
      title="Definir Prazo de Conclusão"
      :showFooter="true"
      @close="showDueDateModal = false"
    >
      <div class="p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Este ticket não possui um prazo definido. Para aceitar o ticket, defina uma data estimada
          de conclusão:
        </p>
        <div class="flex flex-col gap-2">
          <label for="dueDate" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data de Conclusão:
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            v-model="dueDateValue"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200"
            @click="showDueDateModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded"
            @click="confirmDueDate"
            :disabled="!dueDateValue"
          >
            Confirmar
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal de Aviso de Verificação -->
    <BaseModal
      v-if="showVerificationAlert"
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

const showDueDateModal = ref(false);
const dueDateValue = ref('');
const ticketForDueDate = ref<Ticket | null>(null);

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
    (props.tableType === 'criados' || props.tableType === 'recebidos') &&
    ticket.status === TicketStatus.AwaitingVerification &&
    userStore.user?.id === ticket.reviewer?.id
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

const getDeadlineClass = (date?: string) => {
  if (!date) return 'text-gray-900 dark:text-gray-100';
  const deadline = new Date(date);
  const now = new Date();

  const diffTime = deadline.getTime() - now.getTime();
  const diffDays =
    diffTime < 0
      ? Math.floor(diffTime / (1000 * 60 * 60 * 24))
      : Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-red-600 dark:text-red-400 font-semibold';
  if (diffDays <= 3) return 'text-orange-500 dark:text-orange-400 font-semibold';
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
  if (!ticket.dueAt) {
    ticketForDueDate.value = ticket;
    showDueDateModal.value = true;
    return;
  }

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

const handleSendToNextDepartment = async (ticket: Ticket) => {
  openConfirmationModal(
    'Enviar para Próximo Setor',
    'Tem certeza que deseja enviar este ticket para o próximo setor?',
    async () => {
      try {
        await ticketService.sendToNextDepartment(ticket.customId);
        toast.success('Ticket enviado para o próximo setor');

        await refreshTickets();

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao enviar o ticket para o próximo setor');
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

const isReviewer = (ticket: Ticket) => userStore.user?.id === ticket.reviewer?.id;

const isSelfAssigned = (ticket: Ticket) =>
  ticket.targetUsers && ticket.targetUsers.some((tu) => tu.userId === ticket.requester.id);

const isLastTargetUser = (ticket: Ticket) => {
  if (!ticket.targetUsers || ticket.targetUsers.length === 0) return true;
  if (!userStore.user?.id) return false;

  const sortedTargetUsers = [...ticket.targetUsers].sort((a, b) => a.order - b.order);
  const lastUser = sortedTargetUsers[sortedTargetUsers.length - 1];

  return lastUser.userId === ticket.currentTargetUserId;
};

const handleStartTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Iniciar Ticket',
    'Tem certeza que deseja iniciar este ticket?',
    async () => {
      try {
        await ticketService.accept(ticket.customId);
        toast.success('Ticket iniciado com sucesso');
        await refreshTickets();
        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao iniciar o ticket');
      }
    },
  );
};

const confirmDueDate = async () => {
  if (!dueDateValue.value || !ticketForDueDate.value) return;

  try {
    await ticketService.update(ticketForDueDate.value.customId, { dueAt: dueDateValue.value });

    await ticketService.accept(ticketForDueDate.value.customId);

    toast.success('Prazo definido e ticket aceito com sucesso');
    showDueDateModal.value = false;
    dueDateValue.value = '';
    ticketForDueDate.value = null;
    await refreshTickets();
  } catch {
    toast.error('Erro ao definir prazo e aceitar ticket');
  }
};

const getDeadlineDotClass = (dueAt: string) => {
  const deadline = new Date(dueAt);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();

  const diffDays =
    diffTime < 0
      ? Math.floor(diffTime / (1000 * 60 * 60 * 24))
      : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours =
    diffTime < 0 ? Math.floor(diffTime / (1000 * 60 * 60)) : Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays < 0) {
    return 'bg-red-500';
  } else if (diffDays === 0 || (diffDays === 1 && diffHours < 8)) {
    return 'bg-yellow-500';
  } else {
    return 'bg-emerald-400';
  }
};

const formatDeadlineRelative = (dueAt: string) => {
  const deadline = new Date(dueAt);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();

  const diffDays =
    diffTime < 0
      ? Math.floor(diffTime / (1000 * 60 * 60 * 24))
      : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours =
    diffTime < 0 ? Math.floor(diffTime / (1000 * 60 * 60)) : Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays < 0) {
    const overdueHours = Math.abs(diffHours);
    const overdueDays = Math.abs(diffDays);

    if (overdueHours < 1) {
      return 'Vencendo agora';
    } else if (overdueDays === 0) {
      // Overdue but less than 1 day
      return overdueHours === 1 ? 'Atrasado há 1 hora' : `Atrasado há ${overdueHours} horas`;
    } else {
      // Overdue more than 1 day
      return overdueDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${overdueDays} dias`;
    }
  } else if (diffDays === 0) {
    // Today
    if (diffHours === 1) {
      return '1 hora restante';
    } else if (diffHours < 0) {
      const overdueHours = Math.abs(diffHours);
      return overdueHours === 1 ? 'Atrasado há 1 hora' : `Atrasado há ${overdueHours} horas`;
    } else {
      return `${diffHours} horas restantes`;
    }
  } else if (diffDays === 1) {
    // Tomorrow
    if (diffHours < 8) {
      // Less than 8 hours until tomorrow
      if (diffHours === 1) {
        return '1 hora restante';
      } else {
        return `${diffHours} horas restantes`;
      }
    } else {
      // More than 8 hours until tomorrow
      return '1 dia restante';
    }
  } else {
    // 2+ days
    return `${diffDays} dias restantes`;
  }
};

const isDeadlineExceeded = (dueAt: string) => {
  const deadline = new Date(dueAt);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return diffTime < 0;
};
</script>

<style scoped>
/* All styles have been converted to Tailwind classes */
</style>
