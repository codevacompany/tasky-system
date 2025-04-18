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
            <label for="title">Assunto: <span class="required">*</span></label>
            <input type="text" id="title" v-model="formData.name" required />
          </div>

          <div class="form-group">
            <label>É privado?</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="formData.isPrivate" :value="true" name="isPrivate" />
                Sim
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.isPrivate" :value="false" name="isPrivate" />
                Não
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="targetDepartment">Setor Destino: <span class="required">*</span></label>
            <select
              id="targetDepartment"
              v-model="selectedDepartment"
              required
              @change="updateUsersList"
            >
              <option :value="null">Selecione um setor</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="targetUser">Usuário Destino:</label>
            <select id="targetUser" v-model="selectedUser" :disabled="!selectedDepartment">
              <option :value="null">Selecione um setor primeiro</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.firstName }} {{ user.lastName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="category">Categoria: <span class="required">*</span></label>
            <select id="category" v-model="selectedCategory" required>
              <option :value="null">Selecione uma categoria</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Prioridade: <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.Low"
                  name="priority"
                  required
                />
                {{ formatSnakeToNaturalCase(TicketPriority.Low) }}
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.Medium"
                  name="priority"
                />
                {{ formatSnakeToNaturalCase(TicketPriority.Medium) }}
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.High"
                  name="priority"
                />
                {{ formatSnakeToNaturalCase(TicketPriority.High) }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="dueAt">Concluir até:</label>
            <input type="datetime-local" id="dueAt" v-model="formData.dueAt" />
          </div>

          <div class="form-group full-width">
            <label for="description">Descrição: <span class="required">*</span></label>
            <textarea id="description" v-model="formData.description" required rows="4"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="resetForm">Limpar</button>
          <button type="submit" class="btn btn-primary">Criar Ticket</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'vue3-toastify';
import { TicketPriority, type Category, type Department, type User } from '@/models';
import { useUserStore } from '@/stores/user';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const departments = ref<Department[]>([]);
const availableUsers = ref<User[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);

const formData = ref({
  name: '',
  priority: TicketPriority.Low,
  description: '',
  departmentId: null as number | null,
  targetUserId: null as number | null,
  dueAt: '',
  requesterId: useUserStore().user?.id || null,
  categoryId: null as number | null,
  isPrivate: false,
});

// Carregar departamentos
const loadDepartments = async () => {
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    toast.error('Erro ao carregar departamentos');
  }
};

// Carregar categorias
const loadCategories = async () => {
  try {
    const { data } = await categoryService.fetch({ limit: 100 });
    categories.value = data.items;
  } catch {
    toast.error('Erro ao carregar categorias');
  }
};

const updateUsersList = async () => {
  if (!selectedDepartment.value) {
    availableUsers.value = [];
    selectedUser.value = null;
    return;
  }
  try {
    const response = await userService.getByDepartment(selectedDepartment.value);
    availableUsers.value = response.data;
  } catch {
    toast.error('Erro ao carregar usuários. Tente novamente.');
    availableUsers.value = [];
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    priority: TicketPriority.Low,
    description: '',
    departmentId: null,
    targetUserId: null,
    dueAt: '',
    requesterId: useUserStore().user!.id,
    categoryId: null,
    isPrivate: false,
  };
  selectedDepartment.value = null;
  selectedUser.value = null;
  availableUsers.value = [];
  selectedCategory.value = null;
};

onMounted(() => {
  loadDepartments();
  loadCategories();
});

const validateForm = () => {
  if (!formData.value.name.trim()) {
    toast.error('O campo Assunto é obrigatório');
    return false;
  }
  if (!selectedCategory.value) {
    toast.error('O campo Categoria é obrigatório');
    return false;
  }
  if (!selectedDepartment.value) {
    toast.error('O campo Setor Destino é obrigatório');
    return false;
  }
  if (!selectedUser.value) {
    toast.error('O campo Usuário Destino é obrigatório');
    return false;
  }
  if (!formData.value.priority) {
    toast.error('O campo Prioridade é obrigatório');
    return false;
  }
  if (!formData.value.description.trim()) {
    toast.error('O campo Descrição é obrigatório');
    return false;
  }
  return true;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  formData.value.departmentId = selectedDepartment.value;
  formData.value.targetUserId = selectedUser.value;
  formData.value.categoryId = selectedCategory.value;

  try {
    await ticketService.create(formData.value);
    toast.success('Ticket criado com sucesso!');
    emit('ticketCreated');
    closeModal();
  } catch {
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

.form-group:has([type='datetime-local']) {
  grid-column: span 1;
}

/* Ajustes específicos para o novo layout */
.form-grid > .form-group:nth-child(1) {
  /* Assunto */
  grid-column: span 2;
}

.form-grid > .form-group:nth-child(2) {
  /* É privado */
  grid-column: span 1;
}

.form-grid > .form-group:nth-child(3), /* Setor Destino */
.form-grid > .form-group:nth-child(4), /* Usuário Destino */
.form-grid > .form-group:nth-child(5) {
  /* Categoria */
  grid-column: span 1;
}

.form-grid > .form-group:nth-child(6), /* Prioridade */
.form-grid > .form-group:nth-child(7) {
  /* Concluir até */
  grid-column: span 1;
}

.form-grid > .form-group:last-child {
  /* Descrição */
  grid-column: 1 / -1;
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

input[type='radio'] {
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

/* Remove file input styles */
.file-input-wrapper,
.file-input,
.file-input-button,
.file-name {
  display: none;
}
</style>
