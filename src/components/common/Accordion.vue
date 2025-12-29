<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-soft-xs border border-gray-100 dark:border-gray-700 px-6 py-2 transition-shadow duration-200 hover:shadow-md"
  >
    <button
      class="flex items-center gap-3 w-full bg-transparent border-none text-xl font-semibold text-blue-600 dark:text-blue-400 py-5 cursor-pointer text-left transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <font-awesome-icon :icon="icon" class="text-xl" v-if="icon" />
      <span class="flex-1">{{ title }}</span>
      <font-awesome-icon
        icon="chevron-down"
        class="ml-auto text-lg text-gray-400 dark:text-gray-500 transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="isOpen" class="pb-4 overflow-hidden">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  initialOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle']);

const isOpen = ref(props.initialOpen);

function toggle() {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
}
</script>
