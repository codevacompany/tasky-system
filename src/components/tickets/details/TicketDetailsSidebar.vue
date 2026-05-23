<template>
  <div class="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-soft-xs"
    >
      <h3
        class="text-sm font-semibold text-txt-primary dark:text-gray-100 mb-4 flex items-center gap-2"
      >
        <font-awesome-icon icon="info-circle" class="text-primary dark:text-blue-400" />
        Informações da Tarefa
      </h3>

      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ID da Tarefa</p>
          </div>
          <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
            {{ loadedTicket.customId }}
          </p>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
          </div>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium max-w-[140px] sm:max-w-[220px]',
              getStatusClass(ticketStatus),
            ]"
          >
            <font-awesome-icon
              :icon="getStatusIcon(ticketStatus)"
              class="text-xs mr-1.5 flex-shrink-0"
            />
            <span class="truncate">{{
              ticketStatus ? formatSnakeToNaturalCase(ticketStatus) : '-'
            }}</span>
          </span>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</p>
          </div>
          <span
            class="inline-flex items-center text-sm gap-1.5 text-txt-primary dark:text-gray-100"
          >
            <font-awesome-icon
              :icon="getPriorityIcon(loadedTicket.priority)"
              :class="['text-sm pl-1.5', getPriorityClass(loadedTicket.priority)]"
            />
            {{ formatSnakeToNaturalCase(loadedTicket.priority) }}
          </span>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solicitante</p>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <div
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-soft-xs"
                :style="getAvatarStyle(loadedTicket.requester.department?.name || '')"
              >
                {{
                  getUserInitials({
                    firstName: loadedTicket.requester.firstName,
                    lastName: loadedTicket.requester.lastName,
                  })
                }}
              </div>
              <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
                {{ loadedTicket.requester.firstName }} {{ loadedTicket.requester.lastName }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%] flex items-center gap-2">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Responsável</p>
            <font-awesome-icon
              v-if="canViewEditAssigneeIcon"
              icon="edit"
              class="text-gray-400 text-xs cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="openEditTargetUsersModal"
              title="Editar responsáveis"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div v-if="sortedTargetUsers.length > 0" class="space-y-2">
              <div
                v-for="targetUser in sortedTargetUsers"
                :key="targetUser.userId"
                class="flex items-center gap-2"
              >
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-soft-xs"
                  :style="getAvatarStyle(targetUser.user.department?.name || '')"
                >
                  {{
                    getUserInitials({
                      firstName: targetUser.user.firstName,
                      lastName: targetUser.user.lastName,
                    })
                  }}
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm text-txt-primary dark:text-gray-100 font-medium"
                    :class="{
                      'text-blue-600 dark:text-blue-400':
                        sortedTargetUsers.length > 1 &&
                        targetUser.userId === loadedTicket.currentTargetUserId,
                    }"
                  >
                    {{ targetUser.user.firstName }} {{ targetUser.user.lastName }}
                  </p>
                  <p
                    v-if="targetUser.user.department?.name"
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ targetUser.user.department.name }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else-if="loadedTicket.currentTargetUser" class="flex items-center gap-2">
              <div
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-soft-xs"
                :style="
                  getAvatarStyle(loadedTicket.currentTargetUser?.department?.name || '')
                "
              >
                {{
                  getUserInitials({
                    firstName: loadedTicket.currentTargetUser?.firstName || '',
                    lastName: loadedTicket.currentTargetUser?.lastName || '',
                  })
                }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
                  {{ loadedTicket.currentTargetUser?.firstName }}
                  {{ loadedTicket.currentTargetUser?.lastName }}
                </p>
                <p
                  v-if="loadedTicket.currentTargetUser?.department?.name"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ loadedTicket.currentTargetUser.department.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%] flex items-center gap-2">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Revisor</p>
            <font-awesome-icon
              v-if="canAdminEditAssignment"
              icon="edit"
              class="text-gray-400 text-xs cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="openEditReviewerModal"
              title="Editar revisor"
            />
          </div>
          <div v-if="loadedTicket.reviewer" class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <div
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-soft-xs"
                :style="getAvatarStyle(loadedTicket.reviewer.department?.name || '')"
              >
                {{
                  getUserInitials({
                    firstName: loadedTicket.reviewer.firstName,
                    lastName: loadedTicket.reviewer.lastName,
                  })
                }}
              </div>
              <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
                {{ loadedTicket.reviewer.firstName }} {{ loadedTicket.reviewer.lastName }}
              </p>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-8">
              {{ loadedTicket.reviewer.department?.name }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
          </div>
          <div class="flex-1 min-w-0">
            <span
              v-if="loadedTicket.category?.name"
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {{ loadedTicket.category.name }}
            </span>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Criado em</p>
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm text-txt-primary dark:text-gray-100"
              :title="loadedTicket.createdAt ? formatDateUtil(loadedTicket.createdAt) : ''"
            >
              {{ formatDateOnly(loadedTicket.createdAt) }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Concluir até</p>
          </div>
          <p
            class="text-sm text-txt-primary dark:text-gray-100"
            :title="loadedTicket.dueAt ? formatDateUtil(loadedTicket.dueAt) : ''"
          >
            {{ formatDateOnly(loadedTicket.dueAt) }}
          </p>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prazo</p>
          </div>
          <div class="flex-1 min-w-0">
            <p
              v-if="
                loadedTicket.dueAt &&
                isDeadlineOverdue(loadedTicket.dueAt) &&
                calculateDeadline(loadedTicket) &&
                calculateDeadline(loadedTicket) !== ''
              "
              class="text-sm text-red-600 dark:text-red-400 font-medium"
            >
              Atrasado
            </p>
            <p
              v-else
              :class="[
                'text-sm font-medium',
                calculateDeadline(loadedTicket) && calculateDeadline(loadedTicket) !== ''
                  ? getDeadlineTextClass(loadedTicket.dueAt)
                  : 'text-txt-primary dark:text-gray-100',
              ]"
            >
              {{ calculateDeadline(loadedTicket) || '-' }}
            </p>
          </div>
        </div>

        <div v-if="loadedTicket.acceptedAt" class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aceito em</p>
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm text-txt-primary dark:text-gray-100"
              :title="loadedTicket.acceptedAt ? formatDateUtil(loadedTicket.acceptedAt) : ''"
            >
              {{ formatDateOnly(loadedTicket.acceptedAt) }}
            </p>
          </div>
        </div>

        <div v-if="loadedTicket.completedAt" class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Concluído em</p>
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm text-txt-primary dark:text-gray-100"
              :title="
                loadedTicket.completedAt ? formatDateUtil(loadedTicket.completedAt) : ''
              "
            >
              {{ formatDateOnly(loadedTicket.completedAt) }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Privacidade</p>
          </div>
          <p class="text-sm text-txt-primary dark:text-gray-100">
            {{ loadedTicket.isPrivate ? 'Privado' : 'Público' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';
import { formatDate as formatDateUtil } from '@/utils/date';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  getUserInitials,
  getAvatarStyle,
} from '@/utils/generic-helper';

const { ctx, access, assignees, dueDate, display } = useTicketDetailsInjected();

const {
  getPriorityClass,
  getStatusClass,
  getDeadlineTextClass,
  isDeadlineOverdue,
  getPriorityIcon,
  getStatusIcon,
} = display;

const { openEditTargetUsersModal, openEditReviewerModal } = assignees;
const {
  sortedTargetUsers,
  ticketStatus,
  canViewEditAssigneeIcon,
  canAdminEditAssignment,
} = access;
const { formatDateOnly } = dueDate;

const loadedTicket = computed(() => ctx.loadedTicket.value!);
</script>
