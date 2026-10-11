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
              'inline-flex items-center gap-1 h-6 min-w-0 max-w-full rounded-md px-2 text-xs font-medium leading-none border',
              getStatusClass(displayedStatus),
            ]"
            :title="displayedStatus ? formatSnakeToNaturalCase(displayedStatus) : undefined"
          >
            <font-awesome-icon
              :icon="getStatusIcon(displayedStatus)"
              class="text-[10px] shrink-0"
            />
            <span class="min-w-0 truncate">{{
              displayedStatus ? formatSnakeToNaturalCase(displayedStatus) : '-'
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
              <div v-else class="flex items-center gap-2">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 border border-dashed border-gray-300 dark:border-gray-500"
                >
                  <font-awesome-icon icon="user-plus" class="text-[10px]" />
                </div>
                <p class="text-sm text-txt-muted dark:text-gray-400 font-medium">Sem responsável</p>
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
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
          </div>
          <template v-if="canEditTicketMeta">
            <InlineMetaPicker
              v-model:open="showCategoryDropdown"
              v-model:search="categorySearch"
              dropdown-key="category"
              placeholder="Selecionar categoria"
              :loading="categoryLoading"
            >
              <template #value="{ open }">
                <span
                  v-if="loadedTicket.category?.name && !open"
                  class="inline-flex items-center gap-1 min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  :title="loadedTicket.category.name"
                >
                  <span class="min-w-0 truncate leading-4">{{ loadedTicket.category.name }}</span>
                </span>
              </template>
              <template #empty>
                <span
                  v-if="!loadedTicket.category?.name"
                  class="text-sm text-gray-400 dark:text-gray-500"
                >
                  Adicionar categoria
                </span>
              </template>
              <template #panel="{ reposition }">
                <div class="max-h-64 overflow-y-auto py-1">
                  <p class="px-3 pt-2.5 pb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Todas as categorias
                  </p>
                  <button
                    v-for="cat in filteredCategories"
                    :key="cat.id"
                    type="button"
                    class="category-picker-option relative w-full flex items-center min-w-0 px-2 py-1.5 text-left rounded-none hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                    :class="{ 'font-semibold': loadedTicket.category?.id === cat.id }"
                    :title="cat.name"
                    @click="updateCategory(cat.id)"
                  >
                    <span
                      class="inline-flex items-center gap-1 min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <span class="min-w-0 truncate leading-4">{{ cat.name }}</span>
                    </span>
                  </button>
                  <p
                    v-if="!filteredCategories.length"
                    class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center"
                  >
                    Nenhuma categoria encontrada
                  </p>
                </div>
              </template>
            </InlineMetaPicker>
          </template>
          <div v-else class="flex-1 min-w-0">
            <span
              v-if="loadedTicket.category?.name"
              class="inline-flex items-center gap-1 min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              :title="loadedTicket.category.name"
            >
              <span class="min-w-0 truncate leading-4">{{ loadedTicket.category.name }}</span>
            </span>
            <span v-else class="text-sm text-gray-400 dark:text-gray-500">Sem categoria</span>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-[40%]">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</p>
          </div>
          <InlineMetaPicker
            ref="tagMetaPickerRef"
            v-model:open="showTagPicker"
            v-model:search="tagSearch"
            dropdown-key="tags"
            placeholder="Selecionar tag"
            :loading="tagLoading"
            :hide-panel="tagCreating"
            :ignore-outside-selectors="['[data-tag-create-modal]']"
            wrap-chips
          >
            <template #value="{ open }">
              <TagChip
                v-for="tag in sortedTicketTags"
                :key="tag.uuid"
                :tag="tag"
                removable
                @remove="removeTag"
              />
            </template>
            <template #empty>
              <span
                v-if="!sortedTicketTags.length"
                class="text-sm text-gray-400 dark:text-gray-500"
              >
                Adicionar tags
              </span>
            </template>
            <template #panel="{ reposition }">
              <TagPicker
                v-if="showTagPicker"
                :ticket-custom-id="loadedTicket.customId"
                :applied-tag-uuids="appliedTagUuids"
                :search="tagSearch"
                @select="applyTag"
                @update:loading="tagLoading = $event"
                @update:creating="tagCreating = $event"
                @content-change="reposition()"
              />
            </template>
          </InlineMetaPicker>
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
              input-class="w-full px-2 py-1 text-sm border border-primary rounded-md bg-white dark:bg-gray-800 text-txt-primary dark:text-gray-100 shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)] focus:outline-none"
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
import type { Category, Tag } from '@/models';
import InlineMetaPicker from '@/components/common/InlineMetaPicker.vue';
import TagChip from '@/components/tags/TagChip.vue';
import TagPicker from '@/components/tags/TagPicker.vue';
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
const displayedStatus = computed(() =>
  loadedTicket.value?.isDraft ? 'rascunho' : ticketStatus.value,
);

// Hover state for editable fields
const assigneeHovered = ref(false);
const reviewerHovered = ref(false);
const priorityHovered = ref(false);
const dueDateHovered = ref(false);

// Inline edit dropdowns
const showPriorityDropdown = ref(false);
const showCategoryDropdown = ref(false);
const categorySearch = ref('');
const categoryLoading = ref(false);
const showTagPicker = ref(false);
const tagSearch = ref('');
const tagLoading = ref(false);
const tagCreating = ref(false);
const tagMetaPickerRef = ref<InstanceType<typeof InlineMetaPicker> | null>(null);
const showDueDateInline = ref(false);
const inlineDueDateValue = ref<string | null>(null);
const dueDatePickerRef = ref<any>(null);

const priorityOptions = [
  { value: TicketPriority.Low, label: 'Baixa' },
  { value: TicketPriority.Medium, label: 'Média' },
  { value: TicketPriority.High, label: 'Alta' },
];

const categories = ref<Category[]>([]);

const filteredCategories = computed(() => {
  const q = categorySearch.value.trim().toLowerCase();
  if (!q) return categories.value;
  return categories.value.filter((c) => c.name.toLowerCase().includes(q));
});

const sortedTicketTags = computed(() =>
  [...(loadedTicket.value.tags || [])].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
);

const appliedTagUuids = computed(() => sortedTicketTags.value.map((t) => t.uuid));

watch(showCategoryDropdown, async (open) => {
  if (!open) {
    categoryLoading.value = false;
    return;
  }
  categoryLoading.value = true;
  try {
    await fetchCategories();
  } finally {
    categoryLoading.value = false;
  }
});

watch(showTagPicker, (open) => {
  if (open) {
    tagLoading.value = true;
    tagCreating.value = false;
  } else {
    tagLoading.value = false;
    tagCreating.value = false;
  }
});

const applyTag = async (tag: Tag) => {
  try {
    const { data } = await ticketService.applyTag(loadedTicket.value.customId, tag.uuid);
    ctx.loadedTicket.value = data;
    ctx.ticketsStore.updateTicketInCollections(data);
    tagSearch.value = '';
    await nextTick();
    tagMetaPickerRef.value?.focusSearch();
    toast.success('Tag adicionada');
  } catch {
    toast.error('Erro ao adicionar tag');
  }
};

const removeTag = async (tag: Tag) => {
  try {
    const { data } = await ticketService.removeTag(loadedTicket.value.customId, tag.uuid);
    ctx.loadedTicket.value = data;
    ctx.ticketsStore.updateTicketInCollections(data);
    toast.success('Tag removida');
  } catch {
    toast.error('Erro ao remover tag');
  }
};

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

const updateCategory = async (categoryId: number) => {
  showCategoryDropdown.value = false;
  categorySearch.value = '';
  if (categoryId === loadedTicket.value.category?.id) return;
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
onMounted(() => {
  document.addEventListener('click', closeDueDateInline);
  document.addEventListener('click', closePriorityDropdown);
});
onUnmounted(() => {
  document.removeEventListener('click', closeDueDateInline);
  document.removeEventListener('click', closePriorityDropdown);
});
</script>

<style scoped>
button.category-picker-option {
  border-radius: 0 !important;
}

button.category-picker-option::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 0;
  background: transparent;
}

button.category-picker-option:hover::before,
button.category-picker-option:focus-visible::before {
  background: var(--primary-color, #5564db);
}
</style>
