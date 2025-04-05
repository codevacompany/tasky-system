<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Novo Ticket</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="ticket-form">
        <div class="form-grid">
          <div class="form-group span-2">
            <label for="assunto">Assunto: <span class="required">*</span></label>
              <input
                type="text"
              id="assunto"
              v-model="formData.assunto"
                required
              />
            </div>

            <div class="form-group">
            <label>Prioridade: <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="formData.prioridade" value="Baixa" name="prioridade" required>
                Baixa
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.prioridade" value="Média" name="prioridade">
                Média
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.prioridade" value="Alta" name="prioridade">
                Alta
              </label>
            </div>
          </div>

            <div class="form-group">
            <label for="setorDestino">Setor Destino: <span class="required">*</span></label>
            <select id="setorDestino" v-model="formData.setorDestino" required>
              <option value="">Selecione um setor</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Comercial">Comercial</option>
              </select>
            </div>

            <div class="form-group">
            <label for="usuarioDestino">Usuário Destino: <span class="required">*</span></label>
            <select id="usuarioDestino" v-model="formData.usuarioDestino" required>
              <option value="">Selecione um setor primeiro</option>
              </select>
            </div>

          <div class="form-group">
            <label for="categoria">Categoria: <span class="required">*</span></label>
            <select id="categoria" v-model="formData.categoria" required>
              <option value="">Selecione uma categoria</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>

          <div class="form-group">
            <label for="anexo">Anexar arquivo:</label>
            <div class="file-input-wrapper">
              <input
                type="file"
                id="anexo"
                @change="handleFileChange"
                class="file-input"
              />
              <button type="button" class="file-input-button" @click="triggerFileInput">
                Escolher arquivo
              </button>
              <span class="file-name" v-if="selectedFileName">{{ selectedFileName }}</span>
            </div>
          </div>

          <div class="form-group span-2">
            <label for="dataConclusao">Concluir até:</label>
            <input
              type="datetime-local"
              id="dataConclusao"
              v-model="formData.dataConclusao"
            />
          </div>

          <div class="form-group full-width">
            <label for="descricao">Descrição: <span class="required">*</span></label>
            <textarea
              id="descricao"
              v-model="formData.descricao"
              required
              rows="4"
            ></textarea>
          </div>
          </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Limpar
          </button>
          <button type="submit" class="btn btn-primary">
            Criar Ticket
          </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ticketService } from '@/services/ticketService';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const selectedFileName = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const formData = ref({
  assunto: '',
  categoria: '',
  setorDestino: '',
  usuarioDestino: '',
  prioridade: 'Baixa',
  dataConclusao: '',
  descricao: '',
  anexo: null as File | null
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    formData.value.anexo = input.files[0];
    selectedFileName.value = input.files[0].name;
  }
};

const triggerFileInput = () => {
  const input = document.querySelector('#anexo') as HTMLInputElement;
  if (input) {
    input.click();
  }
};

const validateForm = () => {
  if (!formData.value.assunto.trim()) {
    toast.error('O campo Assunto é obrigatório');
    return false;
  }
  if (!formData.value.categoria) {
    toast.error('O campo Categoria é obrigatório');
    return false;
  }
  if (!formData.value.setorDestino) {
    toast.error('O campo Setor Destino é obrigatório');
    return false;
  }
  if (!formData.value.usuarioDestino) {
    toast.error('O campo Usuário Destino é obrigatório');
    return false;
  }
  if (!formData.value.prioridade) {
    toast.error('O campo Prioridade é obrigatório');
    return false;
  }
  if (!formData.value.descricao.trim()) {
    toast.error('O campo Descrição é obrigatório');
    return false;
  }
  return true;
};

const resetForm = () => {
  formData.value = {
    assunto: '',
    categoria: '',
    setorDestino: '',
    usuarioDestino: '',
    prioridade: 'Baixa',
    dataConclusao: '',
    descricao: '',
    anexo: null
  };
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    await ticketService.create(formData.value);
    toast.success('Ticket criado com sucesso!');
    emit('ticketCreated');
    closeModal();
  } catch (error) {
    toast.error('Erro ao criar ticket');
  }
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
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #1a2233;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.ticket-form {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group:has(.radio-group) {
  grid-column: span 1;
}

.form-group:has([type="datetime-local"]) {
  grid-column: span 1;
}

.radio-group {
  display: flex;
  gap: 16px;
  padding-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #1a2233;
  cursor: pointer;
}

label {
  font-size: 14px;
  color: #1a2233;
}

input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

input,
select,
textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  color: #1a2233;
  background: #fff;
  width: 100%;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

textarea {
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background: #141b2a;
}

:deep(body.dark-mode) .modal-header {
  background: #1a2233;
}

:deep(body.dark-mode) label {
  color: #e2e8f0;
}

:deep(body.dark-mode) .radio-label {
  color: #e2e8f0;
}

:deep(body.dark-mode) input,
:deep(body.dark-mode) select,
:deep(body.dark-mode) textarea {
  background: #1a2233;
  border-color: #2d3748;
  color: #e2e8f0;
}

:deep(body.dark-mode) input:focus,
:deep(body.dark-mode) select:focus,
:deep(body.dark-mode) textarea:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

:deep(body.dark-mode) .form-actions {
  border-top-color: #2d3748;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-input {
  display: none;
}

.file-input-button {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #1a2233;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.file-input-button:hover {
  background-color: #e2e8f0;
}

.file-name {
  font-size: 14px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* Dark mode additions */
:deep(body.dark-mode) .file-input-button {
  background-color: #1a2233;
  border-color: #2d3748;
  color: #e2e8f0;
}

:deep(body.dark-mode) .file-input-button:hover {
  background-color: #2d3748;
}

:deep(body.dark-mode) .file-name {
  color: #94a3b8;
}
</style>
