<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h3>Criar Novo Ticket</h3>
        <button @click="$emit('close')" class="close-btn">X</button>
      </header>
      <div class="modal-body">
        <form id="newTicketForm" @submit.prevent="submitTicket">
          <div class="form-group">
            <label for="ticketTitle">Título</label>
            <input type="text" id="ticketTitle" v-model="ticket.title" required />
          </div>

          <div class="form-group">
            <label for="ticketDepartment">Departamento</label>
            <select id="ticketDepartment" v-model="ticket.department" required>
              <option value="">Selecione...</option>
              <option value="sales">Vendas</option>
              <option value="support">Suporte</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div class="form-group">
            <label for="ticketCategory">Categoria</label>
            <select id="ticketCategory" v-model="ticket.category" required>
              <option value="">Selecione...</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="question">Question</option>
            </select>
          </div>

          <div class="form-group">
            <label for="ticketPriority">Prioridade</label>
            <select id="ticketPriority" v-model="ticket.priority" required>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div class="form-group">
            <label for="ticketDeadline">Prazo</label>
            <input type="date" id="ticketDeadline" v-model="ticket.deadline" />
          </div>

          <div class="form-group">
            <label for="ticketDescription">Descrição</label>
            <textarea id="ticketDescription" v-model="ticket.description" rows="5" required></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Criar Ticket</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const ticket = ref({
  title: '',
  department: '',
  category: '',
  priority: 'medium',
  deadline: '',
  description: '',
});

const submitTicket = () => {
  console.log('Ticket criado:', ticket.value);

  // Reset form and close modal
  ticket.value = {
    title: '',
    department: '',
    category: '',
    priority: 'medium',
    deadline: '',
    description: '',
  };

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
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>


<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}
</style>
