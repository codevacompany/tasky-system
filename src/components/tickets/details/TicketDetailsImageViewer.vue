<template>
  <div
    v-if="selectedImage"
    class="fixed inset-0 z-[10001] bg-black/90 flex items-center justify-center"
    @click="closeImageViewer"
  >
    <div class="fixed top-4 right-4 z-10 flex items-center gap-2">
      <button
        @click.stop="downloadImage"
        class="w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Baixar imagem"
      >
        <font-awesome-icon icon="download" class="text-xl" />
      </button>
      <button
        @click="closeImageViewer"
        class="w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Fechar (ESC)"
      >
        <font-awesome-icon icon="times" class="text-xl" />
      </button>
    </div>

    <button
      v-if="hasPreviousImage"
      @click.stop="previousImage"
      class="fixed left-5 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      title="Imagem anterior (←)"
    >
      <font-awesome-icon icon="chevron-left" class="text-xl" />
    </button>
    <button
      v-if="hasNextImage"
      @click.stop="nextImage"
      class="fixed right-5 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      title="Próxima imagem (→)"
    >
      <font-awesome-icon icon="chevron-right" class="text-xl" />
    </button>

    <div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
      <img
        :src="selectedImage.url"
        :alt="selectedImage.name"
        class="max-w-full max-h-[90vh] object-contain"
        @click.stop
      />
    </div>

    <div
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-10"
    >
      {{ selectedImage.name }} ({{ currentImageIndex + 1 }} / {{ imageCount }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTicketDetailsInjected } from '@/composables/ticket-details/useTicketDetailsInjected';

const { ctx, files } = useTicketDetailsInjected();

const {
  closeImageViewer,
  previousImage,
  nextImage,
  downloadImage,
  hasPreviousImage,
  hasNextImage,
  imageFiles,
} = files;

const selectedImage = computed(() => ctx.selectedImage.value);
const currentImageIndex = computed(() => ctx.currentImageIndex.value);
const imageCount = computed(() => imageFiles.value.length);
</script>
