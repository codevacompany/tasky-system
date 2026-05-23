<template>
  <div
    v-if="ticketFiles.length > 0"
    class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-txt-primary dark:text-gray-100 flex items-center gap-2">
        <font-awesome-icon icon="paperclip" class="text-primary dark:text-blue-400" />
        Anexos
        <span
          class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium"
        >
          {{ ticketFiles.length }}
        </span>
      </h3>
      <button
        v-if="canEdit"
        class="inline-flex items-center justify-center w-8 h-8 bg-primary hover:bg-blue-700 text-white rounded-full transition-colors"
        @click="openFileInput"
        title="Adicionar anexos"
      >
        <font-awesome-icon icon="plus" />
      </button>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      <div v-for="file in ticketFiles" :key="file.id" class="relative group">
        <div
          v-if="isImageFile(file)"
          class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] w-[140px] flex items-center justify-center"
          @click="openImageViewer(file)"
        >
          <img
            :src="file.url"
            :alt="file.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
          ></div>
          <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
          >
            <div class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis">
              {{ truncateFileName(file.name) }}
            </div>
          </div>
          <button
            v-if="canEdit"
            @click.stop="removeFile(file)"
            class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Remover arquivo"
          >
            <font-awesome-icon icon="times" class="text-xs" />
          </button>
        </div>
        <div
          v-else
          class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] w-[140px] flex items-center justify-center"
          @click="downloadFile(file)"
        >
          <div class="text-primary dark:text-blue-400">
            <font-awesome-icon icon="file" size="3x" />
          </div>
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
          ></div>
          <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
          >
            <div class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis">
              {{ truncateFileName(file.name) }}
            </div>
          </div>
          <button
            v-if="canEdit"
            @click.stop="removeFile(file)"
            class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Remover arquivo"
          >
            <font-awesome-icon icon="times" class="text-xs" />
          </button>
        </div>
      </div>

      <div
        v-for="(_, i) in uploadingCount"
        :key="`new-${i}`"
        class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden aspect-[4/3] w-[140px]"
      >
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg skeleton-shimmer"></div>
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2"
        >
          <div class="h-3 bg-gray-300 dark:bg-gray-500 rounded skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';

const { ctx, access, files: filesApi } = useTicketDetailsInjected();

const {
  isImageFile,
  truncateFileName,
  openFileInput,
  openImageViewer,
  downloadFile,
  removeFile,
  handleImageError,
  handleImageLoad,
} = filesApi;

const { canEditTicket } = access;

const ticketFiles = computed(() => ctx.loadedTicket.value?.files ?? []);
const uploadingCount = computed(() => ctx.selectedFiles.value.length);
const canEdit = computed(() => canEditTicket.value);
</script>
