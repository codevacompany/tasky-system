<template>
  <div class="accordion-section">
    <button class="accordion-header" @click="toggle" :aria-expanded="isOpen">
      <font-awesome-icon :icon="icon" class="accordion-icon" v-if="icon" />
      <span>{{ title }}</span>
      <font-awesome-icon icon="chevron-down" class="accordion-chevron" />
    </button>
    <transition name="fade">
      <div v-show="isOpen" class="accordion-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

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

<style scoped>
.accordion-section {
  background: var(--card-bg, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  transition: box-shadow 0.2s;
}

.accordion-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color, #1976d2);
  padding: 1.2rem 0 1.2rem 0;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.accordion-icon {
  font-size: 1.2rem;
}

.accordion-chevron {
  margin-left: auto;
  font-size: 1.1rem;
  color: #b0b0b0;
  transition: transform 0.3s ease;
}

.accordion-header[aria-expanded='true'] .accordion-chevron {
  transform: rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.accordion-content {
  padding-bottom: 1rem;
}
</style>
