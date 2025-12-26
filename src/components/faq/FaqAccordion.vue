<template>
  <div
    class="faq-accordion bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-200"
    :class="{ 'shadow-sm': isOpen }"
  >
    <button
      class="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 focus:outline-none"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <span class="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-gray-100">
        <span>{{ question }}</span>
      </span>
      <span
        class="flex items-center justify-center w-7 h-7 text-gray-500 dark:text-gray-400 transition-transform duration-200"
      >
        <font-awesome-icon :icon="isOpen ? 'minus' : 'plus'" class="text-sm" />
      </span>
    </button>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div
          class="px-5 pb-5 pt-0 text-gray-800 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700"
        >
          <div class="pt-4" v-html="answer"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  question: string;
  answer: string;
}>();

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped>
.faq-accordion {
  overflow: hidden;
}
</style>
