<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" id="newTicketModal" @click.self="close" >
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
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

defineProps({
  isOpen: Boolean,
  title: { type: String, default: 'Modal Title' },
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
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
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
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-light);
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
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--danger-color);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
