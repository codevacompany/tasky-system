<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-container">
      <div class="modal-close" @click="close">
        <font-awesome-icon icon="times" />
      </div>

      <div class="welcome-content">
        <div class="welcome-image">
          <img src="@/assets/images/landing/management-drawing.png" alt="Task Management" />
        </div>

        <h2 class="welcome-title">Bem-vindo ao Tasky System!</h2>

        <p class="welcome-message">
          Vamos começar! Você e sua equipe podem usar o Tasky System gratuitamente por 14 dias.
          Explore nosso guia ou comece agora mesmo a organizar suas tarefas.
        </p>

        <div class="welcome-actions">
          <button class="btn btn-secondary" @click="close">Ver Dashboard</button>
          <button class="btn btn-primary" @click="openGuide">Abrir Guia</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useUserStore } from '@/stores/user';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'openGuide']);

const userStore = useUserStore();

const close = () => {
  userStore.setIsNewUser(false);
  emit('close');
};

const openGuide = () => {
  userStore.setIsNewUser(false);
  emit('openGuide');
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 90%;
  max-width: 550px;
  position: relative;
  animation: slideUp 0.4s ease;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f5f5f5;
  color: #333;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 2rem 2.5rem 2rem;
}

.welcome-image {
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-image img {
  width: 100%;
  height: auto;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.welcome-message {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  max-width: 450px;
  color: var(--text-color);
}

.welcome-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary-color);
  padding: 1.4rem 1.2rem;
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: var(--text-color);
  border: 1px solid #e0e0e0;
  padding: 1.4rem 1.2rem;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
