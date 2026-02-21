<template>
  <BaseModal
    @close="close"
    :show-footer="false"
    title="Guia do Tasky"
    :hasCustomHeader="true"
    :closeOnClickOutside="true"
    :blurBackdrop="true"
    class="tutorial-guide-modal"
  >
    <template #custom-header>
      <div
        class="primary-gradient flex items-center justify-between p-3 sm:p-4 text-white"
      >
        <div class="min-w-0 pr-2">
          <h2 class="text-base sm:text-lg font-semibold truncate">
            {{ currentVideo?.title ?? 'Guia do Tasky' }}
          </h2>
          <p
            v-if="currentVideo?.description"
            class="text-xs sm:text-sm text-white/85 truncate mt-0.5"
          >
            {{ currentVideo.description }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 bg-transparent border-none text-white opacity-80 text-lg sm:text-xl cursor-pointer p-1 sm:p-2 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
          @click="close"
          aria-label="Fechar"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </template>

    <div
      v-if="currentVideo"
      class="tutorial-guide-content flex flex-col"
    >
      <div class="tutorial-video-wrapper">
        <div class="tutorial-video-ratio">
          <iframe
            :key="currentVideo.youtubeId"
            :src="embedUrl"
            title="Tutorial em vídeo"
            class="tutorial-video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>

      <div class="mt-4 pt-3 flex justify-between items-center shrink-0 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-txt-primary dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isFirst"
          @click="goPrev"
        >
          < Anterior
        </button>
        <div class="flex gap-1">
          <button
            v-for="(_, idx) in videos.length"
            :key="idx"
            type="button"
            class="w-2 h-2 rounded-full transition-colors"
            :class="
              idx === currentIndex
                ? 'bg-primary-600 dark:bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            "
            :aria-label="`Vídeo ${idx + 1}`"
            @click="currentIndex = idx"
          />
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-md bg-primary-600 dark:bg-blue-600 text-white text-sm font-medium hover:bg-primary-700 dark:hover:bg-blue-700 transition-colors"
          @click="isLast ? close() : goNext()"
        >
          {{ isLast ? 'Concluir' : 'Próximo >' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import type { TutorialVideo } from '@/config/tutorialVideos';

const props = withDefaults(
  defineProps<{
    videos: TutorialVideo[];
  }>(),
  {
    videos: () => [],
  }
);

const emit = defineEmits<{
  /** Emitted when modal closes. completed: true only when user was on last video (Concluir or X). */
  close: [payload: { completed: boolean }];
}>();

const currentIndex = ref(0);

const currentVideo = computed(() =>
  props.videos.length > 0 ? props.videos[currentIndex.value] : null
);

const embedUrl = computed(() =>
  currentVideo.value
    ? `https://www.youtube.com/embed/${currentVideo.value.youtubeId}?rel=0`
    : ''
);

const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === props.videos.length - 1);

function goPrev() {
  if (!isFirst.value) currentIndex.value--;
}

function goNext() {
  if (!isLast.value) currentIndex.value++;
  else emit('close', { completed: true });
}

function close() {
  emit('close', { completed: isLast.value });
}

watch(
  () => props.videos.length,
  () => {
    if (currentIndex.value >= props.videos.length) {
      currentIndex.value = Math.max(0, props.videos.length - 1);
    }
  }
);
</script>

<style scoped>
/* Modal width: enough for a larger video without being too wide */
.tutorial-guide-content {
  min-width: min(90vw, 960px);
}

/* Video area; true 16:9. Larger max so video isn’t too small. */
.tutorial-video-wrapper {
  position: relative;
  width: 100%;
  max-width: min(100%, 133.33vh); /* 75vh * 16/9 */
  max-height: 75vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #000;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}
.dark .tutorial-video-wrapper {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4);
}

/* 16:9 = 9/16 = 56.25% of width */
.tutorial-video-ratio {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.tutorial-video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
