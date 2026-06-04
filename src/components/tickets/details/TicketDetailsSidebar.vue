<template>
  <div class="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-soft-xs"
    >
      <h3
        class="text-sm font-semibold text-txt-primary dark:text-gray-100 mb-4 flex items-start gap-2"
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
          <div class="w-[40%] flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</p>
            <font-awesome-icon
              v-if="canEditTicketMeta && priorityHovered"
              icon="edit"
              class="text-gray-400 text-xs mb-1"
            />
          </div>
          <div class="flex-1 min-w-0 relative" data-priority-dropdown>
            <div
              :class="[
                'rounded px-1.5 py-1 -mx-1.5 -my-1 transition-colors flex items-center gap-1.5 text-sm text-txt-primary dark:text-gray-100',
                canEditTicketMeta ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
              ]"
              @mouseenter="priorityHovered = true"
              @mouseleave="priorityHovered = false"
              @click="canEditTicketMeta ? (showPriorityDropdown = !showPriorityDropdown) : undefined"
            >
              <font-awesome-icon
                :icon="getPriorityIcon(loadedTicket.priority)"
                :class="['text-sm pl-1.5', getPriorityClass(loadedTicket.priority)]"
              />
              {{ formatSnakeToNaturalCase(loadedTicket.priority) }}
            </div>
            <div
              v-if="showPriorityDropdown"
              class="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]"
            >
              <button
                v-for="opt in priorityOptions"
                :key="opt.value"
                class="w-full text-left px-3 py-2 text-sm text-txt-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-start gap-2 transition-colors"
                :class="{ 'font-semibold': loadedTicket.priority === opt.value }"
                @click="updatePriority(opt.value)"
              >
                <font-awesome-icon
                  :icon="getPriorityIcon(opt.value)"
                  :class="getPriorityClass(opt.value)"
                  class="text-xs"
                />
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solicitante</p>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-2">
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
              <div class="flex-1 min-w-0">
                <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
                  {{ loadedTicket.requester.firstName }} {{ loadedTicket.requester.lastName }}
                </p>
                <p v-if="loadedTicket.requester.department?.name" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ loadedTicket.requester.department.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%] flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Responsável</p>
            <font-awesome-icon
              v-if="canViewEditAssigneeIcon && assigneeHovered"
              icon="edit"
              class="text-gray-400 text-xs mb-1 transition-opacity"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div
              :class="[
                'rounded px-1.5 py-1 -mx-1.5 -my-1 transition-colors',
                canViewEditAssigneeIcon ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
              ]"
              @mouseenter="assigneeHovered = true"
              @mouseleave="assigneeHovered = false"
              @click="canViewEditAssigneeIcon ? openEditTargetUsersModal() : undefined"
            >
              <div v-if="sortedTargetUsers.length > 0" class="space-y-2">
                <div
                  v-for="targetUser in sortedTargetUsers"
                  :key="targetUser.userId"
                  class="flex items-start gap-2"
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
              <div v-else-if="loadedTicket.currentTargetUser" class="flex items-start gap-2">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-soft-xs"
                  :style="getAvatarStyle(loadedTicket.currentTargetUser?.department?.name || '')"
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
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%] flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Revisor</p>
            <font-awesome-icon
              v-if="canAdminEditAssignment && reviewerHovered"
              icon="edit"
              class="text-gray-400 text-xs mb-1 transition-opacity"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div
              :class="[
                'rounded px-1.5 py-1 -mx-1.5 -my-1 transition-colors',
                canAdminEditAssignment ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
              ]"
              @mouseenter="reviewerHovered = true"
              @mouseleave="reviewerHovered = false"
              @click="canAdminEditAssignment ? openEditReviewerModal() : undefined"
            >
              <div v-if="loadedTicket.reviewer" class="flex items-start gap-2">
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
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-txt-primary dark:text-gray-100 font-medium">
                    {{ loadedTicket.reviewer.firstName }} {{ loadedTicket.reviewer.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ loadedTicket.reviewer.department?.name }}
                  </p>
                </div>
              </div>
              <p v-else-if="canAdminEditAssignment" class="text-sm text-gray-400 dark:text-gray-500 italic">
                Sem revisor
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%] flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
            <font-awesome-icon
              v-if="canEditTicketMeta && categoryHovered"
              icon="edit"
              class="text-gray-400 text-xs mb-1"
            />
          </div>
          <div class="flex-1 min-w-0 relative" data-category-dropdown>
            <div
              :class="[
                'rounded px-1.5 py-1 -mx-1.5 -my-1 transition-colors',
                canEditTicketMeta ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
              ]"
              @mouseenter="categoryHovered = true"
              @mouseleave="categoryHovered = false"
              @click="canEditTicketMeta ? (showCategoryDropdown = !showCategoryDropdown) : undefined"
            >
              <span
                v-if="loadedTicket.category?.name"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ loadedTicket.category.name }}
              </span>
              <span v-else class="text-sm text-gray-400 dark:text-gray-500 italic">Sem categoria</span>
            </div>
            <div
              v-if="showCategoryDropdown"
              class="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px] max-h-48 overflow-y-auto"
            >
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="w-full text-left px-3 py-2 text-sm text-txt-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'font-semibold': loadedTicket.category?.id === cat.id }"
                @click="updateCategory(cat.id)"
              >
                {{ cat.name }}
              </button>
            </div>
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

        <div class="flex items-center gap-3">
          <div class="w-[40%] flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Concluir até</p>
            <font-awesome-icon
              v-if="canEditDueDate && dueDateHovered"
              icon="edit"
              class="text-gray-400 text-xs"
            />
          </div>
          <div class="flex-1 min-w-0" data-due-date-inline @click.stop>
            <div
              v-if="!showDueDateInline"
              :class="[
                'rounded px-2 py-1 -mx-2 border border-transparent transition-colors text-sm text-txt-primary dark:text-gray-100',
                canEditDueDate ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
              ]"
              :title="loadedTicket.dueAt ? formatDateUtil(loadedTicket.dueAt) : ''"
              @mouseenter="dueDateHovered = true"
              @mouseleave="dueDateHovered = false"
              @click="canEditDueDate ? openDueDateInline() : undefined"
            >
              {{ formatDateOnly(loadedTicket.dueAt) || '-' }}
            </div>
            <DatePicker
              v-else
              ref="dueDatePickerRef"
              :value="inlineDueDateValue"
              type="datetime"
              format="DD/MM/YYYY HH:mm"
              value-type="format"
              :lang="pt"
              placeholder="Selecione data e hora"
              :clearable="false"
              :editable="false"
              :disabled-date="disabledDueDateInline"
              :append-to-body="true"
              :time-picker-options="{ start: '00:00', step: '00:15', end: '23:45' }"
              style="width: 100%; display: block;"
              input-class="w-full px-2 py-1 text-sm border border-blue-400 rounded bg-white dark:bg-gray-700 text-txt-primary dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="saveDueDateInline"
              @close="showDueDateInline = false"
            />
          </div>
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
          <span
            :class="loadedTicket.isPrivate
              ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
              : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'"
          >
            <font-awesome-icon :icon="loadedTicket.isPrivate ? 'lock' : 'globe'" class="text-[10px] mr-1" />
            {{ loadedTicket.isPrivate ? 'Privado' : 'Público' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';
import { formatDate as formatDateUtil } from '@/utils/date';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  getUserInitials,
  getAvatarStyle,
} from '@/utils/generic-helper';
import { TicketPriority, DefaultTicketStatus } from '@/models/ticket';
import { ticketService } from '@/services/ticketService';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/models';
import { toast } from 'vue-sonner';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import pt from 'vue-datepicker-next/locale/pt-br.es';

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
  isRequester,
} = access;

const canEditTicketMeta = computed(() => isRequester.value || canAdminEditAssignment.value);
const canEditDueDate = computed(
  () => canEditTicketMeta.value && ticketStatus.value === DefaultTicketStatus.Pending,
);
const { formatDateOnly } = dueDate;

const loadedTicket = computed(() => ctx.loadedTicket.value!);

// Hover state for editable fields
const assigneeHovered = ref(false);
const reviewerHovered = ref(false);
const priorityHovered = ref(false);
const categoryHovered = ref(false);
const dueDateHovered = ref(false);

// Inline edit dropdowns
const showPriorityDropdown = ref(false);
const showCategoryDropdown = ref(false);
const showDueDateInline = ref(false);
const inlineDueDateValue = ref<string | null>(null);
const dueDatePickerRef = ref<any>(null);

const priorityOptions = [
  { value: TicketPriority.Low, label: 'Baixa' },
  { value: TicketPriority.Medium, label: 'Média' },
  { value: TicketPriority.High, label: 'Alta' },
];

const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const { data } = await categoryService.fetch({ limit: 100 });
    categories.value = data.items;
  } catch {
    // silently ignore
  }
};

const updatePriority = async (priority: TicketPriority) => {
  showPriorityDropdown.value = false;
  if (priority === loadedTicket.value.priority) return;
  try {
    await ticketService.update(loadedTicket.value.customId, { priority });
    ctx.loadedTicket.value = await ctx.ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    toast.success('Prioridade atualizada');
  } catch {
    toast.error('Erro ao atualizar prioridade');
  }
};

const updateCategory = async (categoryId: number | null) => {
  showCategoryDropdown.value = false;
  try {
    await ticketService.update(loadedTicket.value.customId, { categoryId });
    ctx.loadedTicket.value = await ctx.ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    toast.success('Categoria atualizada');
  } catch {
    toast.error('Erro ao atualizar categoria');
  }
};

watch(showDueDateInline, async (val) => {
  if (val) {
    await nextTick();
    const input = dueDatePickerRef.value?.$el?.querySelector('input');
    input?.focus();
  }
});

const disabledDueDateInline = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6 || d < today;
};

const openDueDateInline = () => {
  if (loadedTicket.value.dueAt) {
    const d = new Date(loadedTicket.value.dueAt);
    const pad = (n: number) => n.toString().padStart(2, '0');
    inlineDueDateValue.value = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } else {
    inlineDueDateValue.value = null;
  }
  showDueDateInline.value = true;
};

const saveDueDateInline = async (value: string | null) => {
  showDueDateInline.value = false;
  if (!value) return;
  try {
    const [datePart, timePart] = value.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = (timePart || '00:00').split(':');
    const dueAt = new Date(+year, +month - 1, +day, +hours, +minutes).toISOString();
    await ticketService.update(loadedTicket.value.customId, { dueAt });
    ctx.loadedTicket.value = await ctx.ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    toast.success('Prazo atualizado');
  } catch {
    toast.error('Erro ao atualizar prazo');
  }
};


const closeDueDateInline = (e: MouseEvent) => {
  if (!(e.target as Element).closest('.mx-datepicker-popup')) {
    showDueDateInline.value = false;
  }
};

const closePriorityDropdown = (e: MouseEvent) => {
  if (!(e.target as Element).closest('[data-priority-dropdown]')) {
    showPriorityDropdown.value = false;
  }
};
const closeCategoryDropdown = (e: MouseEvent) => {
  if (!(e.target as Element).closest('[data-category-dropdown]')) {
    showCategoryDropdown.value = false;
  }
};

onMounted(() => {
  fetchCategories();
  document.addEventListener('click', closeDueDateInline);
  document.addEventListener('click', closePriorityDropdown);
  document.addEventListener('click', closeCategoryDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDueDateInline);
  document.removeEventListener('click', closePriorityDropdown);
  document.removeEventListener('click', closeCategoryDropdown);
});
</script>
