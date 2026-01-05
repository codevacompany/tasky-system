<template>
  <div>
    <DataTable
      :data="displayedTickets"
      :headers="tableHeaders"
      :isLoading="isLoading"
      :pagination="paginationInfo"
      :clickable="true"
      rowKey="customId"
      minWidth="1000px"
      :showActions="true"
      @rowClick="openTicketDetails"
      @pageChange="changePage"
      @sort="handleSort"
    >
      <template #column-customId="{ value }">
        <span
          class="text-sm text-center text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap"
        >
          {{ value }}
        </span>
      </template>

      <template #column-name="{ item }">
        <div class="text-left flex items-center gap-2">
          <div class="truncate max-w-[550px]" :title="item.name">
            {{ item.name }}
          </div>
          <font-awesome-icon
            v-if="item.isPrivate"
            icon="lock"
            class="text-gray-500 dark:text-gray-400 text-xs flex-shrink-0"
            title="Tarefa Privada"
          />
        </div>
      </template>

      <template #column-person="{ item }">
        <div class="text-sm text-txt-primary dark:text-gray-100">
          <template v-if="tableType === 'criadas'">
            <div v-if="item.targetUsers && item.targetUsers.length > 0" class="space-y-1">
              <div
                v-for="targetUser in getSortedTargetUsers(item)"
                :key="targetUser.userId"
                :class="[
                  'whitespace-nowrap overflow-hidden text-ellipsis',
                  shouldHighlightTargetUser(item, targetUser.userId)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-txt-primary dark:text-gray-100',
                ]"
              >
                {{ targetUser.user.firstName }} {{ targetUser.user.lastName }}
              </div>
              <div
                v-if="item.targetUsers.some((tu) => tu.user && !tu.user.isActive)"
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
          </template>
          <template v-else>
            <span class="whitespace-nowrap overflow-hidden text-ellipsis block">
              {{ item.requester.firstName }} {{ item.requester.lastName }}
            </span>
          </template>
        </div>
      </template>

      <template #column-destinatario="{ item }">
        <div
          v-if="tableType === 'gerais' || tableType === 'arquivadas'"
          class="text-sm text-txt-primary dark:text-gray-100"
        >
          <div v-if="item.targetUsers && item.targetUsers.length > 0" class="space-y-1">
            <div
              v-for="targetUser in getSortedTargetUsers(item)"
              :key="targetUser.userId"
              :class="[
                'whitespace-nowrap overflow-hidden text-ellipsis',
                shouldHighlightTargetUser(item, targetUser.userId)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-txt-primary dark:text-gray-100',
              ]"
            >
              {{ targetUser.user.firstName }} {{ targetUser.user.lastName }}
            </div>
          </div>
          <div v-else>-</div>
        </div>
      </template>

      <template #column-department="{ item }">
        <div class="text-sm text-txt-primary dark:text-gray-100">
          <template v-if="tableType === 'setor'">
            <div v-if="item.targetUsers && item.targetUsers.length > 0" class="space-y-1">
              <div
                v-for="targetUser in getSortedTargetUsers(item)"
                :key="targetUser.userId"
                :class="[
                  'whitespace-nowrap overflow-hidden text-ellipsis',
                  shouldHighlightTargetUser(item, targetUser.userId)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-txt-primary dark:text-gray-100',
                ]"
              >
                {{ targetUser.user.firstName }} {{ targetUser.user.lastName }}
              </div>
            </div>
            <div v-else>-</div>
          </template>
          <template v-else>
            <div v-if="item.targetUsers && item.targetUsers.length > 0" class="space-y-1">
              <div
                v-for="targetUser in getSortedTargetUsers(item)"
                :key="targetUser.userId"
                :class="[
                  shouldHighlightTargetUser(item, targetUser.userId)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-txt-primary dark:text-gray-100',
                ]"
              >
                {{ targetUser.user.department?.name || '-' }}
              </div>
            </div>
            <div
              v-else
              class="truncate"
              :title="getSortedTargetUsers(item)?.[0]?.user?.department?.name || '-'"
            >
              {{ getSortedTargetUsers(item)?.[0]?.user?.department?.name || '-' }}
            </div>
          </template>
        </div>
      </template>

      <template #column-priority="{ item }">
        <div class="flex items-center justify-center gap-2">
          <div
            :class="[
              'flex items-center justify-center text-sm',
              item.priority === TicketPriority.Low
                ? 'text-green-500'
                : item.priority === TicketPriority.Medium
                  ? 'text-yellow-500'
                  : 'text-red-500',
            ]"
            :title="'Prioridade ' + item.priority"
          >
            <font-awesome-icon
              v-if="item.priority !== TicketPriority.Medium"
              :icon="item.priority === TicketPriority.Low ? 'angles-down' : 'angles-up'"
              class="text-sm"
            />
            <font-awesome-icon v-else icon="equals" class="text-sm" />
          </div>
          <span
            class="text-xs text-txt-primary dark:text-gray-100 hidden md:inline whitespace-nowrap"
            >{{ formatSnakeToNaturalCase(item.priority) }}</span
          >
        </div>
      </template>

      <template #column-status="{ item }">
        <span
          :class="[
            'inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium gap-1 md:gap-2 whitespace-nowrap',
            getStatusClass(getTicketStatus(item)),
          ]"
        >
          <span class="hidden md:inline">{{
            formatSnakeToNaturalCase(getTicketStatus(item))
          }}</span>
          <span class="md:hidden">{{
            formatSnakeToNaturalCase(getTicketStatus(item)).substring(0, 3)
          }}</span>
        </span>
      </template>

      <template #column-dueDate="{ item }">
        <div class="text-xs md:text-sm text-center text-txt-primary dark:text-gray-100">
          <div class="whitespace-nowrap">
            <template
              v-if="
                getTicketStatus(item) !== DefaultTicketStatus.Completed &&
                getTicketStatus(item) !== DefaultTicketStatus.Canceled &&
                getTicketStatus(item) !== DefaultTicketStatus.Rejected
              "
            >
              <template v-if="item.dueAt">
                <!-- Always show message for overdue tickets -->
                <template v-if="isDeadlineOverdue(item.dueAt)">
                  <span
                    class="flex items-center gap-2 justify-center"
                    :class="getDeadlineClass(item.dueAt)"
                  >
                    <font-awesome-icon icon="exclamation-triangle" class="text-red-500 text-xs" />
                    {{
                      calculateDeadline(item) || getDeadlineInfoFromDate(item.dueAt)?.message || '-'
                    }}
                  </span>
                </template>
                <!-- Always show remaining days message -->
                <template v-else-if="calculateDeadline(item) && calculateDeadline(item) !== ''">
                  <span
                    class="flex items-center gap-2 justify-center"
                    :class="getDeadlineClass(item.dueAt)"
                  >
                    <span
                      v-if="
                        getDeadlineInfoFromDate(item.dueAt) &&
                        getDeadlineInfoFromDate(item.dueAt)!.businessDaysRemaining <= 3
                      "
                      :class="getDeadlineDotClass(item.dueAt)"
                      class="inline-block w-[9px] h-[9px] rounded-full"
                    ></span>
                    {{ calculateDeadline(item) }}
                  </span>
                </template>
                <!-- Fallback: show date if calculateDeadline returns empty -->
                <template v-else>
                  {{ formatDateOnly(item.dueAt) }}
                </template>
              </template>
              <template v-else> - </template>
            </template>
            <template v-else> - </template>
          </div>
        </div>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-0.5 md:gap-1 justify-center">
          <template v-if="tableType === 'recebidas' || tableType === 'gerais'">
            <button
              v-if="getTicketStatus(item) === DefaultTicketStatus.Pending"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
              @click.stop="handleAcceptTicket(item)"
              title="Aceitar"
            >
              <font-awesome-icon icon="check" class="text-xs md:text-sm" />
            </button>
            <button
              v-else-if="
                getTicketStatus(item) === DefaultTicketStatus.InProgress && !isLastTargetUser(item)
              "
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duração-200"
              @click.stop="handleSendToNextDepartment(item)"
              :title="
                isNextUserSameDepartment(item)
                  ? 'Enviar para Próximo Colaborador'
                  : 'Enviar para Próximo Setor'
              "
            >
              <font-awesome-icon icon="arrow-right" class="text-xs md:text-sm" />
            </button>
            <button
              v-else-if="
                getTicketStatus(item) === DefaultTicketStatus.InProgress && isLastTargetUser(item)
              "
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duração-200"
              @click.stop="handleVerifyTicket(item)"
              title="Enviar para Verificação"
            >
              <font-awesome-icon icon="arrow-right" class="text-xs md:text-sm" />
            </button>
            <button
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Returned"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duração-200"
              @click.stop="handleCorrectTicket(item)"
              title="Corrigir"
            >
              <font-awesome-icon icon="wrench" class="text-xs md:text-sm" />
            </button>
            <button
              v-else-if="
                getTicketStatus(item) === DefaultTicketStatus.AwaitingVerification &&
                isReviewer(item)
              "
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duração-200"
              @click.stop="handleStartVerification(item)"
              title="Iniciar Verificação"
            >
              <font-awesome-icon icon="search" class="text-xs md:text-sm" />
            </button>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.AwaitingVerification"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 text-white"
              title="Aguardando Verificação"
            >
              <font-awesome-icon icon="hourglass-half" spin class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Rejected"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
              title="Reprovado"
            >
              <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Completed"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
              title="Finalizado"
            >
              <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
            </div>
            <div
              v-if="
                isReviewer(item) && getTicketStatus(item) === DefaultTicketStatus.UnderVerification
              "
              class="flex gap-0.5 md:gap-1"
            >
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duração-200"
                @click.stop="handleApproveTicket(item)"
                title="Aprovar"
              >
                <font-awesome-icon icon="check" class="text-xs md:text-sm" />
              </button>
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duração-200"
                @click.stop="handleRequestCorrection(item)"
                title="Solicitar Correção"
              >
                <font-awesome-icon icon="exclamation-circle" class="text-xs md:text-sm" />
              </button>
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duração-200"
                @click.stop="handleRejectTicket(item)"
                title="Reprovar"
              >
                <font-awesome-icon icon="times" class="text-xs md:text-sm" />
              </button>
            </div>
          </template>

          <template v-else-if="tableType === 'criadas'">
            <div
              v-if="getTicketStatus(item) === DefaultTicketStatus.Pending && isSelfAssigned(item)"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duração-200"
              @click.stop="handleStartTicket(item)"
              title="Iniciar"
            >
              <font-awesome-icon icon="play" class="text-xs md:text-sm" />
            </div>
            <button
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Pending"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 text-white"
              title="Não Iniciado"
            >
              <font-awesome-icon icon="clock" class="text-xs md:text-sm" />
            </button>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.InProgress"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-blue-600 text-white"
              title="Fazendo"
            >
              <font-awesome-icon icon="cog" class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Returned"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-orange-500 text-white"
              title="Devolvido para Correção"
            >
              <font-awesome-icon icon="wrench" class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Rejected"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
              title="Reprovado"
            >
              <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Completed"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
              title="Finalizado"
            >
              <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
            </div>
            <button
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.AwaitingVerification"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duração-200"
              @click.stop="handleStartVerification(item)"
              title="Verificar"
            >
              <font-awesome-icon icon="search" class="text-xs md:text-sm" />
            </button>
            <div
              v-if="
                isReviewer(item) && getTicketStatus(item) === DefaultTicketStatus.UnderVerification
              "
              class="flex gap-0.5 md:gap-1"
            >
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duração-200"
                @click.stop="handleApproveTicket(item)"
                title="Aprovar"
              >
                <font-awesome-icon icon="check" class="text-xs md:text-sm" />
              </button>
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors duração-200"
                @click.stop="handleRequestCorrection(item)"
                title="Solicitar Correção"
              >
                <font-awesome-icon icon="exclamation-circle" class="text-xs md:text-sm" />
              </button>
              <button
                class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duração-200"
                @click.stop="handleRejectTicket(item)"
                title="Reprovar"
              >
                <font-awesome-icon icon="times" class="text-xs md:text-sm" />
              </button>
            </div>
          </template>

          <template v-else-if="tableType === 'arquivadas'">
            <div
              v-if="getTicketStatus(item) === DefaultTicketStatus.Completed"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-green-700 text-white"
              title="Finalizado"
            >
              <font-awesome-icon icon="check-circle" class="text-xs md:text-sm" />
            </div>
            <div
              v-else-if="getTicketStatus(item) === DefaultTicketStatus.Rejected"
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-red-600 text-white"
              title="Reprovado"
            >
              <font-awesome-icon icon="xmark-circle" class="text-xs md:text-sm" />
            </div>
          </template>

          <template v-else-if="tableType === 'setor'">
            <button
              class="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duração-200"
              @click.stop="openTicketDetails(item)"
              title="Visualizar"
            >
              <font-awesome-icon icon="eye" class="text-xs md:text-sm" />
            </button>
          </template>
        </div>
      </template>

      <template #empty>
        <div class="p-4 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <div
              class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              <font-awesome-icon icon="inbox" class="text-2xl text-gray-400 dark:text-gray-500" />
            </div>
            <div class="flex flex-col items-center gap-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 m-0">
                Nenhuma tarefa encontrada
              </p>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
    <ConfirmationModal
      v-if="confirmationModal.isOpen"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      :hasInput="confirmationModal.hasInput"
      :reasonOptions="confirmationModal.reasonOptions"
      :loading="confirmationModal.isLoading"
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
          Esta tarefa não possui um prazo definido. Para aceitar a tarefa, defina uma data estimada
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
            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="showDueDateModal = false"
            :disabled="isDueDateModalLoading"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
            @click="confirmDueDate"
            :disabled="!dueDateValue || isDueDateModalLoading"
          >
            <LoadingSpinner v-if="isDueDateModalLoading" :size="16" />
            <span v-if="!isDueDateModalLoading">Confirmar</span>
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal de Aviso de Verificação -->
    <BaseModal
      v-if="showVerificationAlert"
      title="Iniciar Verificação"
      @close="showVerificationAlert = false"
      :show-footer="false"
    >
      <div class="p-6 text-center">
        <div class="text-3xl text-purple-700 dark:text-purple-400 mb-4">
          <font-awesome-icon icon="info-circle" />
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
          Para visualizar os detalhes desta tarefa, você precisa iniciar a verificação clicando no
          botão "Verificar".
        </p>
        <div class="flex justify-center gap-4">
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="showVerificationAlert = false"
            :disabled="isVerificationAlertLoading"
          >
            Cancelar
          </button>
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            @click="handleAlertVerification"
            :disabled="isVerificationAlertLoading"
          >
            <LoadingSpinner v-if="isVerificationAlertLoading" :size="16" />
            <span v-if="!isVerificationAlertLoading">Verificar</span>
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de Aceitação de Tarefa -->
    <BaseModal
      v-if="showAcceptanceAlert"
      title="Aceitar Tarefa"
      @close="showAcceptanceAlert = false"
      :show-footer="false"
    >
      <div class="p-6 text-center">
        <div class="text-3xl text-blue-700 dark:text-blue-400 mb-4">
          <font-awesome-icon icon="info-circle" />
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
          Para visualizar os detalhes desta tarefa, você precisa aceitá-la clicando no botão
          "Aceitar".
        </p>
        <div class="flex justify-center gap-4">
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="showAcceptanceAlert = false"
            :disabled="isAcceptanceAlertLoading"
          >
            Cancelar
          </button>
          <button
            class="px-8 py-3 min-w-[120px] rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            @click="handleAlertAcceptance"
            :disabled="isAcceptanceAlertLoading"
          >
            <LoadingSpinner v-if="isAcceptanceAlertLoading" :size="16" />
            <span v-if="!isAcceptanceAlertLoading">Aceitar</span>
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Ticket } from '@/models';
import { TicketPriority, DefaultTicketStatus, DisapprovalReason, CorrectionReason } from '@/models';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import { ticketService } from '@/services/ticketService';
import { formatDate, getBusinessDayDifference } from '@/utils/date';
import { toast } from 'vue3-toastify';
import ConfirmationModal from '../common/ConfirmationModal.vue';
import { useUserStore } from '@/stores/user';
import { useTicketsStore, type TicketListFilters } from '@/stores/tickets';
import { useRoles } from '@/composables/useRoles';
import BaseModal from '../common/BaseModal.vue';
import DataTable from '../common/DataTable.vue';
import type { TableHeader, PaginationInfo } from '../common/DataTable.vue';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  enumToOptions,
  getDeadlineInfo,
} from '@/utils/generic-helper';

type TableType = 'recebidas' | 'criadas' | 'setor' | 'arquivadas' | 'gerais';

const props = defineProps<{
  tableType: TableType;
  pagination?: boolean;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: 'changePage', page: number): void;
  (e: 'viewTicket', ticket: Ticket): void;
}>();

const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const { isSupervisor } = useRoles();

type SortKey = 'customId' | 'name';
type SortDirection = 'asc' | 'desc';
type SortState = { key: SortKey; direction: SortDirection };

const activeFilters = computed<TicketListFilters | undefined>(() => {
  switch (props.tableType) {
    case 'recebidas':
      return ticketsStore.receivedTickets.currentFilters;
    case 'criadas':
      return ticketsStore.myTickets.currentFilters;
    case 'setor':
      return ticketsStore.departmentTickets.currentFilters;
    case 'arquivadas':
      return ticketsStore.archivedTickets.currentFilters;
    case 'gerais':
      return ticketsStore.tenantTickets.currentFilters;
    default:
      return undefined;
  }
});

const extractSortState = (filters?: TicketListFilters | null): SortState | null => {
  const sortBy = filters?.sortBy;
  const sortOrder = filters?.sortOrder;
  if (
    (sortBy === 'customId' || sortBy === 'name') &&
    (sortOrder === 'asc' || sortOrder === 'desc')
  ) {
    return { key: sortBy, direction: sortOrder };
  }
  return null;
};

const sortState = ref<SortState | null>(null);

watch(
  activeFilters,
  (filters) => {
    sortState.value = extractSortState(filters);
  },
  { immediate: true },
);

const tableHeaders = computed<TableHeader<Ticket>[]>(() => {
  const getSortDirection = (key: SortKey): 'asc' | 'desc' | 'none' => {
    return sortState.value?.key === key ? sortState.value.direction : 'none';
  };

  const baseHeaders: TableHeader<Ticket>[] = [
    {
      key: 'customId',
      label: 'ID',
      align: 'center',
      width: 0.08,
      sortable: true,
      sortKey: 'customId',
      sortDirection: getSortDirection('customId'),
    },
    {
      key: 'name',
      label: 'Título',
      align: 'left',
      width: 0.25,
      sortable: true,
      sortKey: 'name',
      sortDirection: getSortDirection('name'),
    },
    {
      key: 'person',
      label: props.tableType === 'criadas' ? 'Destinatário' : 'Solicitante',
      align: 'center',
      width: 0.18,
    },
  ];

  if (props.tableType === 'gerais' || props.tableType === 'arquivadas') {
    baseHeaders.push({
      key: 'destinatario',
      label: 'Destinatário',
      align: 'center',
      width: 0.18,
    });
  }

  baseHeaders.push({
    key: 'department',
    label: props.tableType === 'setor' ? 'Destinatário' : 'Setor',
    align: 'center',
    width: 0.18,
  });

  baseHeaders.push(
    { key: 'priority', label: 'Prioridade', align: 'center', width: 0.1 },
    { key: 'status', label: 'Status', align: 'center', width: 0.11 },
  );

  return baseHeaders;
});

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
  isLoading: false,
});

const showDueDateModal = ref(false);
const dueDateValue = ref('');
const ticketForDueDate = ref<Ticket | null>(null);
const isDueDateModalLoading = ref(false);

const isVerificationAlertLoading = ref(false);
const showAcceptanceAlert = ref(false);
const pendingAcceptanceTicket = ref<Ticket | null>(null);
const isAcceptanceAlertLoading = ref(false);

const displayedTickets = computed(() => {
  switch (props.tableType) {
    case 'recebidas':
      return ticketsStore.receivedTickets.data;
    case 'criadas':
      return ticketsStore.myTickets.data;
    case 'setor':
      return ticketsStore.departmentTickets.data;
    case 'arquivadas':
      return ticketsStore.archivedTickets.data;
    case 'gerais':
      return ticketsStore.tenantTickets.data;
    default:
      return [];
  }
});

const isLoading = computed(() => {
  switch (props.tableType) {
    case 'recebidas':
      return ticketsStore.receivedTickets.isLoading;
    case 'criadas':
      return ticketsStore.myTickets.isLoading;
    case 'setor':
      return ticketsStore.departmentTickets.isLoading;
    case 'arquivadas':
      return ticketsStore.archivedTickets.isLoading;
    case 'gerais':
      return ticketsStore.tenantTickets.isLoading;
    default:
      return false;
  }
});

const totalPages = computed(() => {
  let totalCount = 0;
  switch (props.tableType) {
    case 'recebidas':
      totalCount = ticketsStore.receivedTickets.totalCount;
      break;
    case 'criadas':
      totalCount = ticketsStore.myTickets.totalCount;
      break;
    case 'setor':
      totalCount = ticketsStore.departmentTickets.totalCount;
      break;
    case 'arquivadas':
      totalCount = ticketsStore.archivedTickets.totalCount;
      break;
    case 'gerais':
      totalCount = ticketsStore.tenantTickets.totalCount;
      break;
  }
  return Math.ceil(totalCount / 10);
});

const buildFiltersWithSort = (): TicketListFilters => {
  const {
    sortBy: _ignoredSortBy,
    sortOrder: _ignoredSortOrder,
    ...rest
  } = activeFilters.value || {};
  const filters: TicketListFilters = { ...rest };

  if (sortState.value) {
    filters.sortBy = sortState.value.key;
    filters.sortOrder = sortState.value.direction;
  }

  return filters;
};

const paginationInfo = computed<PaginationInfo | undefined>(() => {
  if (!props.pagination) return undefined;
  return {
    currentPage: currentPage.value,
    totalPages: Math.max(totalPages.value, 1),
  };
});

watch(
  () => props.currentPage,
  (newPage) => {
    currentPage.value = newPage;
  },
);

const changePage = (page: number) => {
  emit('changePage', page);
};

const handleSort = async (sortKey: string) => {
  if (sortKey !== 'customId' && sortKey !== 'name') return;

  if (sortState.value?.key === sortKey) {
    if (sortState.value.direction === 'asc') {
      sortState.value = { key: sortKey, direction: 'desc' };
    } else if (sortState.value.direction === 'desc') {
      sortState.value = null;
    }
  } else {
    sortState.value = { key: sortKey, direction: 'asc' };
  }

  await refreshTickets();
};

const openTicketDetails = (ticket: Ticket) => {
  if (isSupervisor.value && props.tableType === 'setor' && ticket.isPrivate) {
    toast.warning('Esta tarefa é privada');
    return;
  }

  const status = getTicketStatus(ticket);

  // Check if it's a pending ticket for the target user (not in department view where they can see others' tickets)
  if (
    status === DefaultTicketStatus.Pending &&
    userStore.user?.id === ticket.currentTargetUserId &&
    props.tableType !== 'setor'
  ) {
    pendingAcceptanceTicket.value = ticket;
    showAcceptanceAlert.value = true;
    return;
  }

  // Se for o solicitante e o ticket estiver aguardando verificação
  if (
    (props.tableType === 'criadas' ||
      props.tableType === 'recebidas' ||
      props.tableType === 'gerais') &&
    status === DefaultTicketStatus.AwaitingVerification &&
    userStore.user?.id === ticket.reviewer?.id
  ) {
    pendingVerificationTicket.value = ticket;
    showVerificationAlert.value = true;
    return;
  }

  // Emit the viewTicket event with the ticket UUID
  emit('viewTicket', ticket);
};

const refreshTickets = async (pageOverride?: number) => {
  const pageToUse = pageOverride ?? currentPage.value;
  const filters = buildFiltersWithSort();

  switch (props.tableType) {
    case 'recebidas':
      await ticketsStore.fetchReceivedTickets(pageToUse, 10, filters);
      break;
    case 'criadas':
      await ticketsStore.fetchMyTickets(pageToUse, 10, filters);
      break;
    case 'setor':
      await ticketsStore.fetchDepartmentTickets(pageToUse, 10, filters);
      break;
    case 'arquivadas':
      await ticketsStore.fetchArchivedTickets(pageToUse, 10, filters);
      break;
    case 'gerais':
      await ticketsStore.fetchTenantTickets(pageToUse, 10, filters);
      break;
  }
};

const getDeadlineInfoFromDate = (date?: string) => {
  if (!date) return null;
  const info = getDeadlineInfo(date);
  return info.isValid ? info : null;
};

const getDeadlineClass = (date?: string) => {
  if (!date) return 'text-txt-primary dark:text-gray-100';

  // First check if date is overdue by comparing directly
  const dueDate = new Date(date);
  const now = new Date();
  if (dueDate < now) {
    return 'text-red-600 dark:text-red-400 font-semibold';
  }

  const info = getDeadlineInfoFromDate(date);
  if (!info) return 'text-txt-primary dark:text-gray-100';

  if (info.isOverdue) return 'text-red-600 dark:text-red-400 font-semibold';
  // Red when 6 hours or less remaining
  if (!info.isOverdue && info.hoursDifference <= 6)
    return 'text-red-600 dark:text-red-400 font-semibold';
  if (info.businessDaysRemaining <= 2) return 'text-orange-500 dark:text-orange-400 font-semibold';
  // Black when more than 3 days remaining
  if (info.businessDaysRemaining > 3) return 'text-txt-primary dark:text-gray-100';
  return 'text-green-600 dark:text-green-400';
};

const getStatusClass = (status: string) => {
  switch (status) {
    case DefaultTicketStatus.Pending:
      return 'bg-orange-50 text-orange-500 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case DefaultTicketStatus.InProgress:
      return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case DefaultTicketStatus.AwaitingVerification:
    case DefaultTicketStatus.UnderVerification:
      return 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
    case DefaultTicketStatus.Completed:
      return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case DefaultTicketStatus.Rejected:
      return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    case DefaultTicketStatus.Returned:
      return 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
    case DefaultTicketStatus.Canceled:
      return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
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
    isLoading: false,
  };
};

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false;
  confirmationModal.value.action = null;
  confirmationModal.value.isLoading = false;
};

const handleConfirm = async (data?: { reason: string; description: string }) => {
  if (confirmationModal.value.action) {
    confirmationModal.value.isLoading = true;
    try {
      await confirmationModal.value.action(data);
    } finally {
      confirmationModal.value.isLoading = false;
    }
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
    'Aceitar Tarefa',
    'Tem certeza que deseja aceitar esta tarefa?',
    async () => {
      try {
        await ticketService.accept(ticket.customId);
        toast.success('Tarefa aceita com sucesso');

        await refreshTickets();

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao aceitar a tarefa');
      }
    },
  );
};

const handleSendToNextDepartment = async (ticket: Ticket) => {
  const isSameDepartment = isNextUserSameDepartment(ticket);
  const title = isSameDepartment ? 'Próximo Colaborador' : 'Próximo Setor';
  const message = isSameDepartment
    ? 'Tem certeza que deseja enviar esta tarefa para o próximo colaborador?'
    : 'Tem certeza que deseja enviar esta tarefa para o próximo setor?';
  const successMessage = isSameDepartment
    ? 'Tarefa enviada para o próximo colaborador'
    : 'Tarefa enviada para o próximo setor';
  const errorMessage = isSameDepartment
    ? 'Erro ao enviar a tarefa para o próximo colaborador'
    : 'Erro ao enviar a tarefa para o próximo setor';

  openConfirmationModal(title, message, async () => {
    try {
      await ticketService.sendToNextDepartment(ticket.customId);
      toast.success(successMessage);

      await refreshTickets();

      await ticketsStore.fetchTicketDetails(ticket.customId);
    } catch {
      toast.error(errorMessage);
    }
  });
};

const handleVerifyTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Enviar para Verificação',
    'Tem certeza que deseja enviar esta tarefa para verificação?',
    async () => {
      try {
        await ticketService.updateStatus(ticket.customId, {
          status: DefaultTicketStatus.AwaitingVerification,
        });
        toast.success('Tarefa enviada para revisão');

        await refreshTickets();

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao enviar a tarefa para revisão');
      }
    },
  );
};

const handleApproveTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Aprovar Tarefa',
    'Tem certeza que deseja aprovar esta tarefa?',
    async () => {
      try {
        await ticketService.approve(ticket.customId);
        toast.success('Tarefa aprovada com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao aprovar a tarefa');
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
          await ticketService.requestCorrection(ticket.uuid, {
            reason: data.reason,
            details: data.description,
          });
        } else {
          await ticketService.updateStatus(ticket.uuid, {
            status: DefaultTicketStatus.Returned,
          });
        }

        toast.success('Correção solicitada com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.uuid);
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
    'Reprovar Tarefa',
    'Por favor, informe o motivo da reprovação:',
    async (data?: { reason: string; description: string }) => {
      try {
        if (data?.reason && data?.description) {
          await ticketService.reject(ticket.uuid, {
            reason: data.reason,
            details: data.description,
          });
        } else {
          await ticketService.updateStatus(ticket.uuid, {
            status: DefaultTicketStatus.Rejected,
          });
        }

        toast.success('Tarefa reprovada com sucesso');

        await ticketsStore.fetchTicketDetails(ticket.uuid);
      } catch {
        toast.error('Erro ao reprovar a tarefa');
      }
    },
    true,
    reasonOptions,
  );
};

const handleStartVerification = async (ticket: Ticket) => {
  try {
    const ticketResponse = await ticketService.updateStatus(ticket.customId, {
      status: DefaultTicketStatus.UnderVerification,
    });

    // Emit viewTicket to navigate to URL
    emit('viewTicket', ticket);
  } catch {
    toast.error('Erro ao iniciar verificação');
  }
};

const handleAlertVerification = async () => {
  if (pendingVerificationTicket.value) {
    isVerificationAlertLoading.value = true;
    try {
      await handleStartVerification(pendingVerificationTicket.value);
      showVerificationAlert.value = false;
      pendingVerificationTicket.value = null;
    } finally {
      isVerificationAlertLoading.value = false;
    }
  }
};

const handleAlertAcceptance = async () => {
  if (!pendingAcceptanceTicket.value) return;

  isAcceptanceAlertLoading.value = true;
  try {
    // Check if ticket has due date
    if (!pendingAcceptanceTicket.value.dueAt) {
      // Close acceptance alert and show due date modal
      showAcceptanceAlert.value = false;
      ticketForDueDate.value = pendingAcceptanceTicket.value;
      showDueDateModal.value = true;
      isAcceptanceAlertLoading.value = false;
      return;
    }

    // Accept the ticket
    await ticketService.accept(pendingAcceptanceTicket.value.customId);
    toast.success('Tarefa aceita com sucesso');

    await refreshTickets();
    await ticketsStore.fetchTicketDetails(pendingAcceptanceTicket.value.customId);

    // Close modal and open ticket details
    showAcceptanceAlert.value = false;
    const acceptedTicket = pendingAcceptanceTicket.value;
    pendingAcceptanceTicket.value = null;

    // Emit viewTicket to open details
    emit('viewTicket', acceptedTicket);
  } catch {
    toast.error('Erro ao aceitar a tarefa');
  } finally {
    isAcceptanceAlertLoading.value = false;
  }
};

const handleCorrectTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Corrigir Tarefa',
    'Tem certeza que deseja iniciar as correções desta tarefa?',
    async () => {
      try {
        await ticketService.updateStatus(ticket.customId, {
          status: DefaultTicketStatus.InProgress,
        });

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

const isNextUserSameDepartment = (ticket: Ticket) => {
  if (!ticket.targetUsers || ticket.targetUsers.length === 0) return false;
  if (!userStore.user?.id) return false;
  if (isLastTargetUser(ticket)) return false;

  const sortedTargetUsers = [...ticket.targetUsers].sort((a, b) => a.order - b.order);
  const currentUserIndex = sortedTargetUsers.findIndex(
    (tu) => tu.userId === ticket.currentTargetUserId,
  );

  if (currentUserIndex === -1 || currentUserIndex === sortedTargetUsers.length - 1) {
    return false;
  }

  const currentUser = sortedTargetUsers[currentUserIndex];
  const nextUser = sortedTargetUsers[currentUserIndex + 1];

  return (
    currentUser.user?.departmentId !== null &&
    currentUser.user?.departmentId === nextUser.user?.departmentId
  );
};

const handleStartTicket = async (ticket: Ticket) => {
  openConfirmationModal(
    'Iniciar Tarefa',
    'Tem certeza que deseja iniciar esta tarefa?',
    async () => {
      try {
        await ticketService.accept(ticket.customId);
        toast.success('Tarefa iniciada com sucesso');
        await refreshTickets();
        await ticketsStore.fetchTicketDetails(ticket.customId);
      } catch {
        toast.error('Erro ao iniciar a tarefa');
      }
    },
  );
};

const confirmDueDate = async () => {
  if (!dueDateValue.value || !ticketForDueDate.value) return;

  isDueDateModalLoading.value = true;
  try {
    await ticketService.update(ticketForDueDate.value.customId, { dueAt: dueDateValue.value });

    await ticketService.accept(ticketForDueDate.value.customId);

    showDueDateModal.value = false;
    dueDateValue.value = '';
    ticketForDueDate.value = null;
    await refreshTickets();
  } catch {
    toast.error('Erro ao definir prazo e aceitar tarefa');
  } finally {
    isDueDateModalLoading.value = false;
  }
};

const getDeadlineDotClass = (dueAt: string) => {
  const info = getDeadlineInfoFromDate(dueAt);
  if (!info) return 'bg-emerald-400';

  if (info.isOverdue) return 'bg-red-500';
  // Red when 6 hours or less remaining
  if (!info.isOverdue && info.hoursDifference <= 6) return 'bg-red-500';
  if (info.businessDaysRemaining <= 2) return 'bg-orange-500';
  return 'bg-emerald-400';
};

const isDeadlineOverdue = (dueAt: string) => {
  if (!dueAt) return false;

  // Check directly if date is in the past
  const dueDate = new Date(dueAt);
  const now = new Date();
  if (Number.isNaN(dueDate.getTime())) return false;

  return dueDate < now;
};

const formatDateOnly = (date: string | Date): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return '-';
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to get ticket status (supports both new and old format)
const getTicketStatus = (ticket: Ticket): string => {
  return ticket.ticketStatus?.key || ticket.status || '';
};

const terminalStatuses = new Set([
  DefaultTicketStatus.Completed,
  DefaultTicketStatus.Canceled,
  DefaultTicketStatus.Rejected,
]);

const getSortedTargetUsers = (ticket: Ticket) => {
  if (!ticket?.targetUsers || ticket.targetUsers.length === 0)
    return [] as NonNullable<Ticket['targetUsers']>;
  return [...ticket.targetUsers].sort((a, b) => a.order - b.order);
};

const shouldHighlightTargetUser = (ticket: Ticket, userId: number) => {
  if (!ticket.targetUsers || ticket.targetUsers.length <= 1) return false;

  if (terminalStatuses.has(getTicketStatus(ticket) as DefaultTicketStatus)) {
    return false;
  }

  return ticket.currentTargetUserId === userId;
};
</script>

<style scoped>
/* Ensure names don't wrap */
:deep(.text-sm) .whitespace-nowrap {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
