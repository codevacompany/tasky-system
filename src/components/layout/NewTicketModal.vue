<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h3>Criar Novo Ticket</h3>
        <button @click="$emit('close')" class="close-btn">X</button>
      </header>
      <div class="modal-body">
        <div class="ticket-form-container">
        <form id="ticketForm" @submit.prevent="submitTicket">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Assunto:</label>
              <input type="text" id="nome" placeholder="Digite o assunto do ticket" required />
            </div>
            <div class="form-group">
              <label for="prioridade">Prioridade:</label>
              <select id="prioridade" required>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="setorDestino">Setor Destino:</label>
              <select id="setorDestino" required></select>
            </div>
            <div class="form-group">
              <label for="usuarioDestino">Usuário Destino:</label>
              <select id="usuarioDestino" required></select>
            </div>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" placeholder="Descreva o ticket" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="conclusao">Data de Conclusão:</label>
            <input type="datetime-local" id="conclusao" />
          </div>
          <div class="button-group">
            <button type="reset" class="btn-secondary">Limpar</button>
            <button type="submit" class="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: scroll;
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

.ticket-form-container {
  flex: 1;
  min-width: 300px;
  max-width: 1000px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
