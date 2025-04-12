<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-icon">
          <font-awesome-icon icon="question-circle" />
        </div>
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
        
        <!-- Campos adicionais para solicitação de correção -->
        <div v-if="isCorrection" class="correction-fields">
          <div class="form-group">
            <label for="reason">Motivo*</label>
            <select 
              id="reason" 
              v-model="correctionData.reason" 
              class="form-control"
              :class="{ 'error': showErrors && !correctionData.reason }"
            >
              <option value="">Selecione um motivo</option>
              <option value="dados_incorretos">Dados Incorretos</option>
              <option value="documentacao_incompleta">Documentação Incompleta</option>
              <option value="informacoes_ausentes">Informações Ausentes</option>
              <option value="erro_procedimento">Erro de Procedimento</option>
              <option value="outros">Outros</option>
            </select>
            <span v-if="showErrors && !correctionData.reason" class="error-message">
              Selecione um motivo
            </span>
          </div>
          
          <div class="form-group">
            <label for="details">Detalhes*</label>
            <textarea 
              id="details" 
              v-model="correctionData.details" 
              class="form-control"
              :class="{ 'error': showErrors && !correctionData.details }"
              placeholder="Descreva os detalhes da correção necessária..."
              rows="4"
            ></textarea>
            <span v-if="showErrors && !correctionData.details" class="error-message">
              Preencha os detalhes
            </span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="action-btn reject" @click="handleCancel">
          <font-awesome-icon icon="times" /> Cancelar
        </button>
        <button class="action-btn approve" @click="handleConfirm">
          <font-awesome-icon icon="check" /> Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  isCorrection?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm', data?: any): void;
  (e: 'cancel'): void;
}>();

const showErrors = ref(false);
const correctionData = ref({
  reason: '',
  details: ''
});

// Resetar dados quando o modal é fechado ou aberto
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    // Quando o modal é fechado
    resetForm();
  } else {
    // Quando o modal é aberto
    showErrors.value = false;
  }
});

const validateForm = (): boolean => {
  if (!props.isCorrection) return true;
  
  const isValid = correctionData.value.reason.trim() !== '' && 
                  correctionData.value.details.trim() !== '';
  
  if (!isValid) {
    showErrors.value = true;
  }
  
  return isValid;
};

const resetForm = () => {
  showErrors.value = false;
  correctionData.value = {
    reason: '',
    details: ''
  };
};

const handleConfirm = () => {
  if (!validateForm()) return;
  
  if (props.isCorrection) {
    emit('confirm', {
      ...correctionData.value,
      details: correctionData.value.details.trim()
    });
  } else {
    emit('confirm');
  }
  resetForm();
};

const handleCancel = () => {
  resetForm();
  emit('cancel');
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
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a2233;
  font-weight: 500;
}

.modal-body {
  padding: 1.5rem 1rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
}

.correction-fields {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.form-control.error {
  border-color: #dc2626;
}

.error-message {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  min-width: 120px;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-btn.approve {
  background-color: #16a34a;
}

.action-btn.approve:hover {
  background-color: #15803d;
}

.action-btn.reject {
  background-color: #64748b;
}

.action-btn.reject:hover {
  background-color: #475569;
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background: #1a2233;
}

:deep(body.dark-mode) .modal-header {
  border-color: #2d3748;
}

:deep(body.dark-mode) .header-icon {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .modal-header h3 {
  color: #e2e8f0;
}

:deep(body.dark-mode) .modal-body p {
  color: #94a3b8;
}

:deep(body.dark-mode) .modal-footer {
  border-color: #2d3748;
}

:deep(body.dark-mode) .form-group label {
  color: #94a3b8;
}

:deep(body.dark-mode) .form-control {
  background: #1e293b;
  border-color: #2d3748;
  color: #e2e8f0;
}

:deep(body.dark-mode) .form-control:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}
</style> 