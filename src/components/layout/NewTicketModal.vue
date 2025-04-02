<template>
  <BaseModal :isOpen="isOpen" title="Criar Novo Ticket" @close="closeModal">
    <div class="modal-body">
      <div class="ticket-form-container">
        <form id="ticketForm" @submit.prevent="submitTicket">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Assunto:</label>
              <input
                v-model="ticketData.name"
                type="text"
                id="nome"
                placeholder="Digite o assunto do ticket"
                required
              />
            </div>
            <div class="form-group">
              <label for="prioridade">Prioridade:</label>
              <select v-model="ticketData.priority" id="prioridade" required>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="setorDestino">Setor Destino:</label>
              <select
                v-model="selectedDepartment"
                id="setorDestino"
                @change="updateUsersList"
                required
              >
                <option :value="null" disabled selected>Selecione um setor</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="usuarioDestino">Usuário Destino:</label>
              <select
                v-model="selectedUser"
                id="usuarioDestino"
                :disabled="!selectedDepartment"
                required
              >
                <option :value="null" disabled selected>Selecione um usuário</option>
                <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea
              v-model="ticketData.description"
              id="descricao"
              placeholder="Descreva o ticket"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="conclusao">Data de Conclusão:</label>
            <input v-model="ticketData.completionDate" type="datetime-local" id="conclusao" />
          </div>
          <div class="button-group">
            <button type="reset" @click="resetForm" class="btn-secondary">Limpar</button>
            <button type="submit" class="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import { TicketPriority, type User } from '@/models';
import BaseModal from '../common/BaseModal.vue';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const ticketData = ref({
  name: '',
  priority: TicketPriority.Low,
  description: '',
  departmentId: null as number | null,
  targetUserId: null as number | null,
  completionDate: '',
  requesterId: useUserStore().user!.id,
});

const departments = ref<{ id: number; name: string }[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const availableUsers = ref<User[]>([]);

const fetchDepartments = async () => {
  try {
    const response = await departmentService.fetch();
    departments.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar setores:', error);
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
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    availableUsers.value = [];
  }
};

const resetForm = () => {
  ticketData.value = {
    name: '',
    priority: TicketPriority.Low,
    description: '',
    departmentId: null,
    targetUserId: null,
    completionDate: '',
    requesterId: useUserStore().user!.id,
  };
  selectedDepartment.value = null;
  selectedUser.value = null;
  availableUsers.value = [];
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const submitTicket = async () => {
  if (!selectedDepartment.value || !selectedUser.value) {
    console.error('Departamento e Usuário são obrigatórios');
    return;
  }

  ticketData.value.departmentId = selectedDepartment.value;
  ticketData.value.targetUserId = selectedUser.value;

  try {
    await ticketService.create(ticketData.value);
    closeModal();
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
  }
};

onMounted(fetchDepartments);
</script>

<style scoped>
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
