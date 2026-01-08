<template>
  <BaseModal
    :title="title"
    @close="handleCancel"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    :confirmButtonText="'Confirmar'"
    :cancelButtonText="'Cancelar'"
    :showFooter="false"
    :isFullScreenMobile="isFullScreenMobile"
  >
    <div class="confirmation-content">
      <p>{{ message }}</p>

      <!-- Campos adicionais para entrada de dados -->
      <div v-if="hasInput" class="input-fields">
        <div v-if="showUserSelector && targetUsers && targetUsers.length > 0" class="form-group">
          <label for="targetUser">Enviar para:</label>
          <select id="targetUser" v-model="selectedTargetUserId" class="select-input">
            <option :value="null" disabled selected>Selecione o usuário</option>
            <option v-for="user in targetUsers" :key="user.userId" :value="user.userId">
              {{ user.userName }} {{ user.departmentName ? `(${user.departmentName})` : '' }}
            </option>
          </select>
        </div>
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
          <Input
            v-else
            id="reason"
            v-model="inputReason"
            type="text"
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
        <button class="action-btn reject" @click="handleCancel" :disabled="loading">
          <font-awesome-icon icon="times" /> Cancelar
        </button>
        <button
          class="action-btn approve"
          @click="handleConfirm"
          :disabled="(hasInput && (!inputReason || !inputDescription)) || loading"
        >
          <LoadingSpinner v-if="loading" :size="16" class="spinner" />
          <font-awesome-icon v-if="!loading" icon="check" />
          <span v-if="!loading">Confirmar</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import Input from './Input.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    message: string;
    hasInput?: boolean;
    reasonOptions?: { value: string; label: string }[];
    showUserSelector?: boolean;
    targetUsers?: Array<{
      userId: number;
      userName: string;
      order: number;
      departmentName?: string;
    }>;
    loading?: boolean;
    isFullScreenMobile?: boolean;
  }>(),
  {
    title: 'Ação Necessária',
    message: '',
    hasInput: false,
    reasonOptions: () => [],
    showUserSelector: false,
    targetUsers: () => [],
    loading: false,
    isFullScreenMobile: false,
  },
);

const emit = defineEmits<{
  (e: 'confirm', data?: { reason: string; description: string; targetUserId?: number }): void;
  (e: 'cancel'): void;
}>();

const showErrors = ref(false);
const inputReason = ref('');
const inputDescription = ref('');
const selectedTargetUserId = ref<number | null>(null);

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
  selectedTargetUserId.value = null;
};

const handleConfirm = () => {
  if (!validateForm()) return;

  if (props.loading) return;

  if (props.hasInput) {
    emit('confirm', {
      reason: inputReason.value,
      description: inputDescription.value,
      ...(props.showUserSelector && selectedTargetUserId.value
        ? { targetUserId: selectedTargetUserId.value }
        : {}),
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
  width: 100%;
  min-width: 0;
}

@media (min-width: 640px) {
  .confirmation-content {
    min-width: 450px;
  }
}

.confirmation-content p {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 0.9375rem;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .confirmation-content p {
    font-size: 1rem;
  }
}

.input-fields {
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .input-fields {
    margin-top: 1.5rem;
  }
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
  min-height: 80px;
  resize: vertical;
}

@media (min-width: 640px) {
  .form-group textarea {
    min-height: 100px;
  }
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
}

@media (min-width: 480px) {
  .confirmation-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  width: 100%;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  position: relative;
}

@media (min-width: 480px) {
  .action-btn {
    width: auto;
    min-width: 120px;
    padding: 0.75rem 1.25rem;
  }
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn .spinner {
  opacity: 1 !important;
  border-top-color: white !important;
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
