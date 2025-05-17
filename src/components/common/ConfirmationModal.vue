<template>
  <BaseModal v-if="isOpen" :isOpen="isOpen" :title="title" @close="handleCancel">
    <div class="confirmation-content">
      <p>{{ message }}</p>

      <!-- Campos adicionais para entrada de dados -->
      <div v-if="hasInput" class="input-fields">
        <div class="form-group">
          <label for="reason">Motivo:</label>
          <select
            v-if="reasonOptions && reasonOptions.length > 0"
            id="reason"
            v-model="inputReason"
            required
            class="select-input"
          >
            <option value="" disabled selected>Selecione um motivo</option>
            <option v-for="option in reasonOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input
            v-else
            type="text"
            id="reason"
            v-model="inputReason"
            placeholder="Informe o motivo"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Descrição:</label>
          <textarea
            id="description"
            v-model="inputDescription"
            placeholder="Descreva os detalhes"
            required
          ></textarea>
        </div>
      </div>

      <div class="confirmation-actions">
        <button class="action-btn reject" @click="handleCancel">
          <font-awesome-icon icon="times" /> Cancelar
        </button>
        <button
          class="action-btn approve"
          @click="handleConfirm"
          :disabled="hasInput && (!inputReason || !inputDescription)"
        >
          <font-awesome-icon icon="check" /> Confirmar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  hasInput?: boolean;
  reasonOptions?: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'confirm', data?: { reason: string; description: string }): void;
  (e: 'cancel'): void;
}>();

const showErrors = ref(false);
const inputReason = ref('');
const inputDescription = ref('');

watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      resetForm();
    } else {
      showErrors.value = false;
    }
  },
);

const validateForm = (): boolean => {
  if (!props.hasInput) return true;

  const isValid = inputReason.value.trim() !== '';

  if (!isValid) {
    showErrors.value = true;
  }

  return isValid;
};

const resetForm = () => {
  showErrors.value = false;
  inputReason.value = '';
  inputDescription.value = '';
};

const handleConfirm = () => {
  if (!validateForm()) return;

  if (props.hasInput) {
    emit('confirm', {
      reason: inputReason.value,
      description: inputDescription.value,
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
.confirmation-content {
  min-width: 500px;
  max-width: 100%;
}

.confirmation-content p {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
}

.input-fields {
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
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: var(--input-bg);
  color: var(--text-color);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
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

.select-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: var(--input-bg);
  color: var(--text-color);
  appearance: auto;
}
</style>
