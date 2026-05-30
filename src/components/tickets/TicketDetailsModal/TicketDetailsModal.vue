<template>
  <BaseModal
    title="Detalhes da Tarefa"
    :isLoading="false"
    @close="closeModal"
    :showFooter="false"
    :hasCustomHeader="true"
    :isFullScreenMobile="true"
    desktop-width-class="sm:w-auto sm:max-w-[1360px] sm:h-auto"
  >
    <template #custom-header>
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-3 sm:px-6 sm:py-4"
      >
        <div class="flex items-center gap-3">
          <div v-if="loadedTicket">
            <h2 class="text-sm sm:text-lg font-semibold text-txt-primary dark:text-gray-100">
              Detalhes da Tarefa
            </h2>
            <p class="text-xs sm:text-base text-gray-600 font-medium dark:text-gray-400">
              {{ loadedTicket.customId }}
            </p>
          </div>
          <div v-else class="flex flex-col gap-2">
            <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
        </div>

        <!-- Action Buttons in Header -->
        <div
          class="flex items-center gap-2 ml-2 sm:ml-4 relative actions-dropdown-container"
          v-if="loadedTicket"
        >
          <!-- Desktop View: Show all buttons -->
          <div class="hidden sm:flex items-center gap-2">
            <button
              v-for="action in headerActions"
              :key="action.id"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-2 text-sm text-white font-medium rounded-md transition-colors whitespace-nowrap',
                action.color,
              ]"
              @click="action.onClick"
            >
              <font-awesome-icon :icon="action.icon" class="text-xs" />
              {{ action.label }}
            </button>
          </div>

          <!-- Mobile View: Split Button or single button -->
          <div class="flex sm:hidden items-center">
            <template v-if="headerActions.length === 1">
              <button
                :class="[
                  'inline-flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-white font-medium rounded-md transition-colors whitespace-nowrap',
                  headerActions[0].color,
                ]"
                @click="headerActions[0].onClick"
              >
                <font-awesome-icon :icon="headerActions[0].icon" class="text-[10px]" />
                {{ headerActions[0].label }}
              </button>
            </template>
            <template v-else-if="headerActions.length > 1">
              <div class="flex items-stretch rounded-md overflow-hidden shadow-sm">
                <!-- Primary Action -->
                <button
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-white font-medium transition-colors border-r border-white/20',
                    (headerActions.find((a) => a.isPrimary) || headerActions[0]).color,
                  ]"
                  @click="(headerActions.find((a) => a.isPrimary) || headerActions[0]).onClick()"
                >
                  <font-awesome-icon
                    :icon="(headerActions.find((a) => a.isPrimary) || headerActions[0]).icon"
                    class="text-[10px]"
                  />
                  {{ (headerActions.find((a) => a.isPrimary) || headerActions[0]).label }}
                </button>
                <!-- Toggle -->
                <button
                  :class="[
                    'px-2 py-1.5 text-white transition-colors flex items-center justify-center',
                    (headerActions.find((a) => a.isPrimary) || headerActions[0]).color,
                  ]"
                  @click.stop="toggleActionsDropdown"
                >
                  <font-awesome-icon
                    :icon="isActionsDropdownOpen ? 'chevron-up' : 'chevron-down'"
                    class="text-[10px]"
                  />
                </button>
              </div>

              <!-- Dropdown Menu -->
              <div
                v-if="isActionsDropdownOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[1100] py-1 animate-modalSlideIn"
              >
                <button
                  v-for="action in headerActions.filter(
                    (a) => a !== (headerActions.find((p) => p.isPrimary) || headerActions[0]),
                  )"
                  :key="action.id"
                  class="w-full text-left px-4 py-3 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  @click="action.onClick"
                >
                  <font-awesome-icon
                    :icon="action.icon"
                    class="w-3.5 h-3.5"
                    :class="action.color?.includes('bg-red') ? 'text-red-500' : 'text-primary'"
                  />
                  {{ action.label }}
                </button>
              </div>
            </template>
          </div>

          <button
            class="bg-transparent border-none text-xl text-gray-400 sm:ml-8 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1.5 rounded-full flex items-center justify-center transition-colors sm:ml-2"
            @click="closeModal"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
    </template>

    <div
      class="relative w-full sm:w-[85vw] max-w-[1280px] mx-auto p-3 sm:p-0 h-full sm:h-[calc(100vh-200px)] sm:max-h-[650px] flex flex-col"
    >
      <!-- Skeleton Loading State -->
      <div
        v-if="isLoadingTicket && !hasLoadedTicketOnce"
        class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0"
      >
        <!-- Left Sidebar Skeleton -->
        <div class="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-soft-xs"
          >
            <div class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"></div>
            <div class="space-y-4">
              <div v-for="n in 8" :key="n" class="flex items-start gap-3">
                <div class="w-[40%]">
                  <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                </div>
                <div class="flex-1">
                  <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content Skeleton -->
        <div class="lg:col-span-2 overflow-y-auto pl-2">
          <div class="bg-white dark:bg-gray-800 pr-4 rounded-lg shadow-soft-xs">
            <!-- Title Skeleton -->
            <div class="p-4">
              <div
                class="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"
              ></div>
              <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            </div>

            <!-- Description Skeleton -->
            <div class="my-2 px-4 sm:px-6">
              <div
                class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 skeleton-shimmer"
              ></div>
              <div class="space-y-2">
                <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
              </div>
            </div>

            <!-- Attachments Skeleton -->
            <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <div
                class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"
              ></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="n in 2"
                  :key="n"
                  class="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-shimmer"
                ></div>
              </div>
            </div>

            <!-- Activities Skeleton -->
            <div class="p-4 sm:p-6 border-t border-gray-200">
              <div
                class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6 skeleton-shimmer"
              ></div>
              <div class="space-y-4">
                <div v-for="n in 3" :key="n" class="flex gap-4">
                  <div
                    class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-shimmer"
                  ></div>
                  <div class="flex-1 space-y-2">
                    <div
                      class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
                    ></div>
                    <div
                      class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else-if="loadedTicket" class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <TicketDetailsSidebar />

        <!-- Right Content -->
        <div class="lg:col-span-2 overflow-y-auto pl-2">
          <div class="bg-white dark:bg-gray-800 pr-4 rounded-lg shadow-soft-xs">
            <!-- Ticket Title Section -->
            <div class="p-4">
              <div v-if="!isEditingName">
                <h1
                  class="text-xl sm:text-2xl font-semibold text-txt-primary dark:text-white leading-tight"
                  @click="startEditingName"
                  :class="{
                    'cursor-text hover:text-gray-600 dark:hover:text-gray-400 transition-colors':
                      isRequester,
                  }"
                  :title="isRequester ? 'Clique para editar' : ''"
                >
                  {{ loadedTicket.name }}
                </h1>
              </div>

              <div v-else class="space-y-3">
                <input
                  v-model="editingName"
                  class="w-full text-xl sm:text-2xl font-bold px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-txt-primary dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="saveTicketName"
                  @keyup.escape="cancelEditingName"
                  ref="nameInput"
                  placeholder="Nome da tarefa"
                />
                <div class="flex gap-3">
                  <Button variant="primary" type="button" @click="saveTicketName">Salvar</Button>
                  <Button variant="outlined" type="button" class="rounded-lg px-4 py-2" @click="cancelEditingName">
                    Cancelar
                  </Button>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <button
                  v-if="canEditTicket"
                  class="inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 dark:border-gray-600 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-100 rounded-md transition-colors whitespace-nowrap"
                  @click="scrollToTarefas"
                  title="Tarefas"
                >
                  <font-awesome-icon icon="tasks" class="text-sm" /> Subtarefas
                </button>
                <button
                  v-if="canEditTicket"
                  class="inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 dark:border-gray-600 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-100 rounded-md transition-colors whitespace-nowrap"
                  @click="openFileInput"
                  title="Anexar arquivo"
                >
                  <font-awesome-icon icon="paperclip" class="text-sm" /> Anexos
                </button>
              </div>
            </div>

            <!-- Description Section -->
            <div class="my-2 px-4 sm:px-6 pb-12">
              <h3
                class="font-semibold text-[16.5px] text-txt-primary dark:text-gray-100 flex items-center gap-2 mb-1"
              >
                <font-awesome-icon icon="align-left" class="text-gray-600 dark:text-gray-300" />
                Descrição
              </h3>

              <div v-if="!isEditingDescription">
                <div
                  class="description-text prose prose-sm max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline leading-relaxed"
                  v-html="convertUrlsToLinks(loadedTicket.description)"
                  @click="startEditingDescription"
                  :class="{
                    'cursor-text hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors':
                      isRequester,
                  }"
                  :title="isRequester ? 'Clique para editar' : ''"
                ></div>
              </div>

              <div v-else class="space-y-4">
                <div
                  class="quill-wrapper rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800"
                >
                  <QuillEditor
                    :key="descriptionEditorKey"
                    v-model:content="editingDescription"
                    contentType="html"
                    theme="snow"
                    :options="editorOptions"
                  />
                </div>
                <div class="flex gap-3">
                  <Button variant="primary" type="button" @click="saveTicketDescription">Salvar</Button>
                  <Button variant="outlined" type="button" class="rounded-lg px-4 py-2" @click="cancelEditingDescription">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>

            <!-- File Input (always present for functionality) -->
            <input class="hidden" type="file" ref="fileInput" multiple @change="handleFileChange" />

            <TicketDetailsAttachments />

            <div
              v-if="(showTarefasSection || checklistItems.length > 0) && loadedTicket"
              ref="tarefasSectionRef"
              id="tarefas-section"
            >
              <TicketChecklist
                :ticketId="loadedTicket.id"
                :items="checklistItems"
                :canEdit="canEditTicket"
                @update="loadChecklistItems"
                ref="ticketChecklistRef"
              />
            </div>

            <TicketDetailsActivitySection />
          </div>
        </div>
      </div>

    </div>
  </BaseModal>

  <TicketDetailsImageViewer />

  <ConfirmationModal
    v-if="confirmationModal.isOpen"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    :hasInput="confirmationModal.hasInput"
    :reasonOptions="confirmationModal.reasonOptions"
    :showUserSelector="confirmationModal.showUserSelector"
    :targetUsers="confirmationModal.targetUsers"
    :loading="confirmationModal.isLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <TicketDetailsReviewerModal />
  <TicketDetailsDueDateModal />
  <TicketDetailsAssigneesModal />
  <TicketDetailsWorkflowAlerts />
</template>

<script setup lang="ts">
import BaseModal from '../../common/BaseModal.vue';
import Button from '@/components/common/Button.vue';

import ConfirmationModal from '../../common/ConfirmationModal.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import TicketChecklist from '../TicketChecklist.vue';
import TicketDetailsAssigneesModal from '../details/TicketDetailsAssigneesModal.vue';
import TicketDetailsSidebar from '../details/TicketDetailsSidebar.vue';
import TicketDetailsAttachments from '../details/TicketDetailsAttachments.vue';
import TicketDetailsActivitySection from '../details/TicketDetailsActivitySection.vue';
import TicketDetailsImageViewer from '../details/TicketDetailsImageViewer.vue';
import TicketDetailsDueDateModal from '../details/TicketDetailsDueDateModal.vue';
import TicketDetailsReviewerModal from '../details/TicketDetailsReviewerModal.vue';
import TicketDetailsWorkflowAlerts from '../details/TicketDetailsWorkflowAlerts.vue';
import { useTicketDetailsModal } from '@/composables/ticket-details/useTicketDetailsModal';

const props = defineProps<{
  ticketCustomId: string | null;
}>();

const emit = defineEmits(['close']);

const {
  loadedTicket,
  isLoadingTicket,
  hasLoadedTicketOnce,
  fileInput,
  checklistItems,
  showTarefasSection,
  tarefasSectionRef,
  ticketChecklistRef,
  isEditingName,
  isEditingDescription,
  editingName,
  editingDescription,
  descriptionEditorKey,
  nameInput,
  isActionsDropdownOpen,
  headerActions,
  toggleActionsDropdown,
  confirmationModal,
  editorOptions,
  convertUrlsToLinks,
  closeModal,
  handleConfirm,
  handleCancel,
  isRequester,
  loadChecklistItems,
  scrollToTarefas,
  openFileInput,
  handleFileChange,
  canEditTicket,
  startEditingName,
  saveTicketName,
  cancelEditingName,
  startEditingDescription,
  saveTicketDescription,
  cancelEditingDescription,
} = useTicketDetailsModal(props, emit);
</script>

<style scoped>
/* Quill editor (description field in modal) */
.quill-wrapper :deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 8px 8px 0 0 !important;
  background-color: #f9fafb;
}

.quill-wrapper :deep(.ql-container) {
  border: none !important;
  border-radius: 0 0 8px 8px !important;
  min-height: 120px;
}

.dark .quill-wrapper :deep(.ql-toolbar) {
  border-bottom-color: #4b5563 !important;
  background-color: #374151 !important;
}

.dark .quill-wrapper :deep(.ql-container) {
  background-color: #374151 !important;
  color: #ffffff !important;
}

.dark .quill-wrapper :deep(.ql-editor) {
  color: #f3f4f6 !important;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: italic;
}

/* Rich HTML content (description + comments via v-html) */
:deep(.description-text a),
:deep(.comment-text a) {
  @apply text-blue-600 no-underline cursor-pointer hover:underline;
}

.dark :deep(.description-text a),
.dark :deep(.comment-text a),
body.dark-mode :deep(.description-text a),
body.dark-mode :deep(.comment-text a) {
  @apply text-blue-400;
}

/* @mentions in Quill / rendered HTML */
:deep(span.mention[data-mention]),
:deep(span[data-mention='true'].mention),
:deep(.mention) {
  @apply inline-block rounded px-1.5 py-px text-xs font-bold cursor-default select-none;
  background-color: #dbeafe !important;
  color: #1e40af !important;
  border: 1px solid #bfdbfe !important;
}

.dark :deep(span.mention[data-mention]),
.dark :deep(.comment-text span.mention),
.dark :deep(.description-text span.mention),
.dark :deep(.ql-editor span.mention),
body.dark-mode :deep(span.mention[data-mention]),
body.dark-mode :deep(.comment-text span.mention),
body.dark-mode :deep(.description-text span.mention) {
  background-color: #1e3a8a !important;
  color: #eff6ff !important;
  border-color: #3b82f6 !important;
}

/* Quill mention autocomplete dropdown */
:deep(.quill-mention-selector) {
  font-family: inherit;
}

:deep(.quill-mention-selector .mention-item:hover) {
  @apply bg-gray-100;
}

.dark :deep(.quill-mention-selector),
body.dark-mode :deep(.quill-mention-selector) {
  @apply bg-gray-800 border-gray-700;
}

.dark :deep(.quill-mention-selector .mention-item),
body.dark-mode :deep(.quill-mention-selector .mention-item) {
  @apply text-gray-200;
}

.dark :deep(.quill-mention-selector .mention-item:hover),
.dark :deep(.quill-mention-selector .mention-item.active),
body.dark-mode :deep(.quill-mention-selector .mention-item:hover),
body.dark-mode :deep(.quill-mention-selector .mention-item.active) {
  @apply bg-gray-700;
}
</style>
