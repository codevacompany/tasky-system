<template>
  <div class="relative inline-block text-left" ref="triggerRef">
    <button
      @click.stop="toggleMenu"
      class="w-8 h-8 rounded-md flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200"
      :class="{
        'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 shadow-sm': isOpen,
      }"
      title="Ações"
    >
      <font-awesome-icon icon="ellipsis-h" />
    </button>

    <teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-[80]" @click="closeMenu"></div>
      <div
        v-if="isOpen"
        class="fixed z-[100] min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in zoom-in duration-100"
        :style="dropdownStyle"
      >
        <slot :close="closeMenu"></slot>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const coords = ref({ top: 0, left: 0, bottom: 0, right: 0 });

const toggleMenu = () => {
  if (isOpen.value) {
    closeMenu();
  } else {
    if (triggerRef.value) {
      coords.value = triggerRef.value.getBoundingClientRect();
      isOpen.value = true;
    }
  }
};

const closeMenu = () => {
  isOpen.value = false;
};

const dropdownStyle = computed(() => {
  const { bottom, right, top } = coords.value;
  const menuWidth = 200;
  const margin = 8;

  // Align right edge of menu with right edge of trigger
  const left = right - menuWidth;

  // Check space below
  const spaceBelow = window.innerHeight - bottom;
  const estimatedHeight = 160;

  if (spaceBelow < estimatedHeight) {
    return {
      bottom: `${window.innerHeight - top + margin}px`,
      left: `${left}px`,
    };
  }

  return {
    top: `${bottom + margin}px`,
    left: `${left}px`,
  };
});

onUnmounted(() => {
  isOpen.value = false;
});
</script>

<style scoped>
.animate-in {
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.fade-in {
  animation-name: fadeIn;
}

.zoom-in {
  animation-name: zoomIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
</style>
