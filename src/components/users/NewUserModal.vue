<template>
  <BaseModal :isOpen="isOpen" title="Novo Colaborador" @close="closeModal">
    <div class="modal-body">
      <div class="ticket-form-container">
        <form id="cadastroColaboradorForm" class="form-grid" @submit.prevent="createUser">
          <div class="form-group">
            <label for="nomeColaborador">Nome</label>
            <input
              type="text"
              id="nomeColaborador"
              v-model="userData.firstName"
              placeholder="Digite o nome do colaborador"
              required
            />
          </div>

          <div class="form-group">
            <label for="sobrenomeColaborador">Sobrenome</label>
            <input
              type="text"
              id="sobrenomeColaborador"
              v-model="userData.lastName"
              placeholder="Digite o sobrenome"
            />
          </div>

          <div class="form-group">
            <label for="emailColaborador">E-mail</label>
            <input
              type="email"
              id="emailColaborador"
              v-model="userData.email"
              placeholder="Digite o e-mail"
              required
            />
          </div>

          <div class="form-group">
            <label for="setorColaborador">Setor</label>
            <select id="setorColaborador" v-model="userData.departmentId" required>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="senhaColaborador">Senha</label>
            <input
              type="password"
              id="senhaColaborador"
              v-model="userData.password"
              placeholder="Digite a senha"
              required
            />
          </div>

          <div class="form-group">
            <label for="isAdminColaborador">Administrador</label>
            <select id="isAdminColaborador" v-model="userData.isAdmin" required>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { departmentService } from '@/services/departmentService';
import BaseModal from '../common/BaseModal.vue';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'userCreated']);

const userData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  departmentId: null as number | null,
  isAdmin: false,
});

const departments = ref<{ id: number; name: string }[]>([]);
const selectedDepartment = ref<number | null>(null);

const fetchDepartments = async () => {
  try {
    const response = await departmentService.fetch();
    departments.value = response.data;
  } catch {
    toast.error('Erro ao carregar setores.');
  }
};

const resetForm = () => {
  userData.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    departmentId: null,
    isAdmin: false,
  };
  selectedDepartment.value = null;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const createUser = async () => {
  try {
    await userService.create(userData.value);
    emit('userCreated');
    toast.success('Colaborador criado com sucesso!');
    closeModal();
  } catch {
    toast.error('Algo deu errado. Tente novamente.');
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

.user-form-container {
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
