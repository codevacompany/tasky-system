<template>
<!-- Activities Section -->
<div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
  <h3
    class="font-semibold text-[16.5px] text-txt-primary dark:text-white mb-6 flex items-center gap-2"
  >
    <font-awesome-icon
      :icon="['far', 'comment']"
      class="text-gray-600 dark:text-gray-300"
    />
    Atividade
  </h3>

  <!-- Add Comment Form -->
  <div
    v-if="
      ticketStatus === DefaultTicketStatus.InProgress ||
      ticketStatus === DefaultTicketStatus.UnderVerification
    "
    class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
  >
    <div class="space-y-4">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden activity-comment-editor"
      >
        <QuillEditor
          :key="editorKey"
          v-model:content="newComment"
          contentType="html"
          theme="snow"
          :options="editorOptions"
          @text-change="handleQuillTextChange"
          @ready="initializeQuillMention"
        />
      </div>
      <div class="flex justify-end">
        <Button variant="primary" type="button" @click="comment" :disabled="isCommentLoading">
          <LoadingSpinner v-if="isCommentLoading" :size="16" />
          <font-awesome-icon v-else icon="paper-plane" />
          <span v-if="isCommentLoading">Enviando...</span>
          <span v-else>Enviar Comentário</span>
        </Button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="mb-6 flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-lg border border-yellow-200 dark:border-yellow-800"
  >
    <font-awesome-icon icon="info-circle" />
    <p class="text-sm">
      Comentários permitidos apenas para tarefas em andamento ou em verificação
    </p>
  </div>

  <!-- Timeline -->
  <div class="space-y-1 relative">
    <div
      class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600 hidden sm:block"
    ></div>

    <div v-for="event in timeline" :key="event.data.id" class="relative">
      <!-- Comment -->
      <div
        v-if="event.type === 'comment'"
        class="flex flex-col gap-1 pl-2 pb-6 relative"
      >
        <!-- Header: Avatar, Name, Time, Options -->
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-soft-xs"
            :style="getAvatarStyle(event.data.user.department?.name || '')"
          >
            {{
              getUserInitials({
                firstName: event.data.user.firstName,
                lastName: event.data.user.lastName,
              })
            }}
          </div>

          <div class="flex items-center justify-between flex-1 min-w-0">
            <!-- Name and Relative Time -->
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="font-bold text-txt-primary dark:text-gray-100 text-[15px] truncate"
              >
                {{ event.data.user.firstName }} {{ event.data.user.lastName }}
              </span>
              <span class="text-gray-400 dark:text-gray-500 text-xs">•</span>
              <span
                class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
                :title="formatDateUtil(event.createdAt)"
              >
                {{ formatRelativeTime(event.createdAt) }}
              </span>
            </div>

            <!-- Options Menu -->
            <div
              v-if="isMyComment(event.data.user.id)"
              class="relative comment-menu-container"
            >
              <button
                @click.stop="toggleCommentMenu(event.data.uuid)"
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                title="Opções"
              >
                <font-awesome-icon icon="ellipsis" class="text-sm" />
              </button>
              <div
                v-if="openCommentMenuId === event.data.uuid"
                class="absolute right-0 top-9 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 min-w-[200px]"
                @click.stop
              >
                <Tooltip
                  message="O tempo para executar essa ação esgotou"
                  :width="'220px'"
                  position="center"
                  v-if="!isCommentActionable(event.createdAt)"
                  class="w-full"
                >
                  <button
                    disabled
                    class="w-full px-4 py-2 text-left text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center gap-2 opacity-60"
                  >
                    <font-awesome-icon icon="pen" class="text-xs" />
                    Editar
                  </button>
                </Tooltip>
                <button
                  v-else
                  @click="startEditingComment(event.data)"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                >
                  <font-awesome-icon icon="pen" class="text-xs" />
                  Editar
                </button>

                <Tooltip
                  message="O tempo para executar essa ação esgotou"
                  :width="'220px'"
                  position="center"
                  v-if="!isCommentActionable(event.createdAt)"
                  class="w-full"
                >
                  <button
                    disabled
                    class="w-full px-4 py-2 text-left text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center gap-2 opacity-60"
                  >
                    <font-awesome-icon icon="trash" class="text-xs" />
                    Excluir
                  </button>
                </Tooltip>
                <button
                  v-else
                  @click="handleDeleteCommentClick(event.data.uuid)"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <font-awesome-icon icon="trash" class="text-xs" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Body Bubble -->
        <div class="ml-11">
          <div
            :class="[
              'rounded-lg px-4 py-3 border shadow-soft-xs transition-all duration-200',
              isMyComment(event.data.user.id)
                ? 'bg-blue-50/30 dark:bg-[#1e2532] border-blue-100 dark:border-blue-900/30'
                : 'bg-white dark:bg-[#222933] border-gray-200 dark:border-gray-700/50',
            ]"
          >
            <div v-if="editingCommentUuid === event.data.uuid" class="space-y-4">
              <div
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden activity-comment-editor"
              >
                <QuillEditor
                  v-model:content="editingCommentContent"
                  contentType="html"
                  theme="snow"
                  :options="editorOptions"
                  @ready="initializeQuillMention"
                />
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="text-[11px] text-txt-muted dark:text-gray-400 font-medium">
                  Edição será desabilitada às
                  {{ getCommentExpirationTime(event.createdAt) }}
                </div>
                <div class="flex gap-2">
                  <Button variant="outlined" type="button" class="text-xs px-3 py-1.5" @click="cancelEditingComment">
                    Cancelar
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    class="text-xs px-3 py-2"
                    @click="saveEditedComment"
                    :disabled="!isCommentActionable(event.createdAt) || isCommentLoading"
                  >
                    {{ isCommentLoading ? 'Salvando...' : 'Salvar' }}
                  </Button>
                </div>
              </div>
            </div>
            <div
              v-else
              class="comment-text prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
              style="font-size: 15px; line-height: 1.5"
              v-html="convertUrlsToLinks(event.data.content)"
            ></div>
          </div>
        </div>
      </div>

      <!-- System Updates -->
      <div v-else-if="event.type === 'specialUpdate'" class="flex gap-4 relative">
        <div class="flex-1 min-w-0 pb-4">
          <div
            :class="[
              'rounded-lg p-4 border',
              event.subType === 'disapproval'
                ? 'bg-red-50 dark:bg-[#322732] border-red-200 dark:border-red-800'
                : event.subType === 'cancellation'
                  ? 'bg-red-50 dark:bg-[#322732] border-red-200 dark:border-red-800'
                  : event.subType === 'correction'
                    ? 'bg-yellow-50 dark:bg-[#302e30] border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
            ]"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0',
                  event.subType === 'disapproval'
                    ? 'bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-700'
                    : event.subType === 'cancellation'
                      ? 'bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-700'
                      : event.subType === 'correction'
                        ? 'bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
                ]"
              >
                <span
                  :class="[
                    'text-xs font-medium',
                    event.subType === 'disapproval'
                      ? 'text-red-600 dark:text-red-300'
                      : event.subType === 'cancellation'
                        ? 'text-red-600 dark:text-red-300'
                        : event.subType === 'correction'
                          ? 'text-yellow-600 dark:text-yellow-300'
                          : 'text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ getUserInitials(loadedTicket?.requester) }}
                </span>
              </div>
              <div class="flex items-center justify-between flex-1">
                <span
                  :class="[
                    'font-medium',
                    event.subType === 'disapproval'
                      ? 'text-red-900 dark:text-red-200'
                      : event.subType === 'cancellation'
                        ? 'text-red-900 dark:text-red-200'
                        : event.subType === 'correction'
                          ? 'text-yellow-900 dark:text-yellow-300/90'
                          : 'text-gray-700 dark:text-gray-300',
                  ]"
                >
                  {{ getSpecialUpdateTitle(event.subType, event) }}
                </span>
                <span
                  class="text-sm text-gray-500 dark:text-gray-400"
                  :title="formatDateUtil(event.createdAt)"
                >
                  {{ formatRelativeTime(event.createdAt) }}
                </span>
              </div>
            </div>
            <div
              class="text-sm text-gray-600 dark:text-gray-400 description-text prose prose-sm max-w-none dark:prose-invert"
              v-html="
                convertUrlsToLinks(getSpecialUpdateDescription(event.subType, event))
              "
            ></div>
          </div>
        </div>
      </div>

      <!-- Regular Events -->
      <div v-else class="flex gap-4 relative">
        <div class="flex-1 min-w-0 pb-4">
          <div
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
              >
                <font-awesome-icon :icon="getEventIcon(event.data.description)" />
              </div>
              <div class="flex items-center justify-between flex-1">
                <div
                  class="text-sm text-txt-muted dark:text-gray-400 flex-1"
                  v-html="formatTicketUpdateDescription(event.data)"
                ></div>
                <span
                  class="text-sm text-txt-muted dark:text-gray-400 ml-4 flex-shrink-0"
                  :title="formatDateUtil(event.createdAt)"
                >
                  {{ formatRelativeTime(event.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DefaultTicketStatus, type TicketComment } from '@/models';
import type { TicketUpdate } from '@/models/ticketUpdate';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';
import Button from '@/components/common/Button.vue';
import Tooltip from '@/components/common/Tooltip.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { formatRelativeTime, formatDate as formatDateUtil } from '@/utils/date';
import { getUserInitials, getAvatarStyle } from '@/utils/generic-helper';

export type TimelineEvent =
  | { type: 'comment'; createdAt: string; data: TicketComment }
  | { type: 'update'; createdAt: string; data: TicketUpdate }
  | {
      type: 'specialUpdate';
      subType: string;
      createdAt: string;
      data: { id: string; content?: string; reason?: string };
    };

const { ctx, access, comments, display } = useTicketDetailsInjected();

const {
  comment,
  handleQuillTextChange,
  initializeQuillMention,
  handleDeleteCommentClick,
  startEditingComment,
  cancelEditingComment,
  saveEditedComment,
  timeline,
  isMyComment,
  isCommentActionable,
  getCommentExpirationTime,
} = comments;

const { ticketStatus } = access;
const {
  formatTicketUpdateDescription,
  getSpecialUpdateTitle,
  getSpecialUpdateDescription,
  getEventIcon,
} = display;
const { convertUrlsToLinks, editorOptions } = ctx.richText;

const toggleCommentMenu = (uuid: string) => {
  ctx.openCommentMenuId.value =
    ctx.openCommentMenuId.value === uuid ? null : uuid;
};

const newComment = computed({
  get: () => ctx.newComment.value,
  set: (value) => {
    ctx.newComment.value = value;
  },
});

const editingCommentContent = computed({
  get: () => ctx.editingCommentContent.value,
  set: (value) => {
    ctx.editingCommentContent.value = value;
  },
});

const openCommentMenuId = computed({
  get: () => ctx.openCommentMenuId.value,
  set: (value) => {
    ctx.openCommentMenuId.value = value;
  },
});

const editingCommentUuid = computed({
  get: () => ctx.editingCommentUuid.value,
  set: (value) => {
    ctx.editingCommentUuid.value = value;
  },
});

const loadedTicket = computed(() => ctx.loadedTicket.value);
const editorKey = computed(() => ctx.editorKey.value);
const isCommentLoading = computed(() => ctx.isCommentLoading.value);
</script>

<style scoped>
.activity-comment-editor :deep(.ql-container) {
  min-height: 120px;
  border: none;
}

.activity-comment-editor :deep(.ql-editor) {
  min-height: 120px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
