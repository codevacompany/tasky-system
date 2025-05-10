<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" id="newTicketModal" @click.self="close">
      <LoadingSpinner v-if="isLoading" :size="50" :color="'white'" />
      <div v-else class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
          <button class="close-btn" @click="close">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

defineProps({
  isOpen: Boolean,
  title: { type: String, default: 'Modal Title' },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: auto;
  max-width: 80%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--secondary-dark);
  color: white;
}

.modal-header h2 {
  font-size: 1.15rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  opacity: 0.8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(90vh - 72px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
