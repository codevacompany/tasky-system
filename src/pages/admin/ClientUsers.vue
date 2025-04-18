<template>
  <div class="client-users">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Usuários do Cliente</h1>
          <h2>{{ client.razaoSocial }}</h2>
        </div>
        <div class="header-actions">
          <span class="usage-badge">
            {{ client.usuariosAtivos }}/{{ client.limiteUsuarios }} usuários
          </span>
          <button 
            class="btn btn-primary" 
            @click="showNewUserModal = true"
            :disabled="client.usuariosAtivos >= client.limiteUsuarios"
          >
            <font-awesome-icon icon="plus" /> Novo Usuário
          </button>
        </div>
      </div>
      <div class="filters">
        <div class="search-box">
          <font-awesome-icon icon="search" class="search-icon" />
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar por nome, email ou perfil..." 
          />
        </div>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
        <select v-model="roleFilter" class="filter-select">
          <option value="">Todos os Perfis</option>
          <option value="ADMIN">Administrador</option>
          <option value="GESTOR">Gestor</option>
          <option value="USUARIO">Usuário</option>
        </select>
      </div>
    </header>

    <!-- Lista de Usuários -->
    <div class="users-table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Status</th>
            <th>Último Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="user-info">
              <div class="user-avatar">
                {{ getInitials(user.nome) }}
              </div>
              <div class="user-details">
                <span class="user-name">{{ user.nome }}</span>
                <span class="user-department">{{ user.departamento }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.perfil.toLowerCase()]">
                {{ user.perfil }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', user.status.toLowerCase()]">
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="last-access">
                <span>{{ formatDate(user.ultimoAcesso) }}</span>
                <span class="time">{{ formatTime(user.ultimoAcesso) }}</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button class="btn-icon" title="Editar" @click="editUser(user)">
                  <font-awesome-icon icon="edit" />
                </button>
                <button 
                  class="btn-icon" 
                  :title="user.status === 'ATIVO' ? 'Desativar' : 'Ativar'"
                  @click="toggleUserStatus(user)"
                >
                  <font-awesome-icon :icon="user.status === 'ATIVO' ? 'ban' : 'check'" />
                </button>
                <button class="btn-icon" title="Redefinir Senha" @click="resetPassword(user)">
                  <font-awesome-icon icon="key" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Usuário -->
    <div v-if="showNewUserModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Novo Usuário</h2>
          <button class="btn-icon" @click="showNewUserModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewUser">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" v-model="newUser.nome" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newUser.email" required />
            </div>
            <div class="form-group">
              <label>Departamento</label>
              <input type="text" v-model="newUser.departamento" required />
            </div>
            <div class="form-group">
              <label>Perfil</label>
              <select v-model="newUser.perfil" required>
                <option value="ADMIN">Administrador</option>
                <option value="GESTOR">Gestor</option>
                <option value="USUARIO">Usuário</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showNewUserModal = false">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="saveNewUser">
            Criar Usuário
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Estados
const searchTerm = ref('');
const statusFilter = ref('');
const roleFilter = ref('');
const showNewUserModal = ref(false);

// Novo usuário
const newUser = ref({
  nome: '',
  email: '',
  departamento: '',
  perfil: 'USUARIO'
});

// Dados mockados
const client = ref({
  id: 1,
  razaoSocial: 'Empresa ABC Ltda',
  usuariosAtivos: 15,
  limiteUsuarios: 20
});

const users = ref([
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    departamento: 'TI',
    perfil: 'ADMIN',
    status: 'ATIVO',
    ultimoAcesso: '2024-03-20T14:30:00'
  },
  // Adicione mais usuários mockados aqui
]);

// Computed properties
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchSearch = !searchTerm.value || 
      user.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.perfil.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    const matchStatus = !statusFilter.value || user.status === statusFilter.value;
    const matchRole = !roleFilter.value || user.perfil === roleFilter.value;

    return matchSearch && matchStatus && matchRole;
  });
});

// Métodos
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const editUser = (user: any) => {
  console.log('Editar usuário:', user);
};

const toggleUserStatus = (user: any) => {
  console.log('Alternar status do usuário:', user);
};

const resetPassword = (user: any) => {
  console.log('Redefinir senha do usuário:', user);
};

const saveNewUser = () => {
  console.log('Salvar novo usuário:', newUser.value);
  showNewUserModal.value = false;
};
</script>

<style scoped>
.client-users {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.header-title h2 {
  font-size: 1rem;
  color: var(--text-light);
  margin: 0.25rem 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usage-badge {
  padding: 0.5rem 1rem;
  background: var(--background-light);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--text-medium);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 150px;
}

.users-table-wrapper {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: var(--background-light);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-medium);
  white-space: nowrap;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
}

.user-department {
  font-size: 0.8rem;
  color: var(--text-light);
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary-color);
}

.role-badge.gestor {
  background: rgba(var(--warning-rgb), 0.1);
  color: var(--warning-color);
}

.role-badge.usuario {
  background: rgba(var(--info-rgb), 0.1);
  color: var(--info-color);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.ativo {
  background: rgba(var(--success-rgb), 0.1);
  color: var(--success-color);
}

.status-badge.inativo {
  background: rgba(var(--danger-rgb), 0.1);
  color: var(--danger-color);
}

.last-access {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.last-access .time {
  font-size: 0.8rem;
  color: var(--text-light);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-medium);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--background-light);
  color: var(--primary-color);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

/* Dark mode */
:deep(body.dark-mode) .users-table {
  background-color: var(--card-bg-dark);
}

:deep(body.dark-mode) .users-table th {
  background-color: var(--background-dark);
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .users-table td {
  border-color: var(--border-color-dark);
}

:deep(body.dark-mode) .modal-content {
  background-color: var(--card-bg-dark);
}

:deep(body.dark-mode) .modal-header,
:deep(body.dark-mode) .modal-footer {
  border-color: var(--border-color-dark);
}

:deep(body.dark-mode) .form-group input,
:deep(body.dark-mode) .form-group select {
  background-color: var(--input-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .usage-badge {
  background-color: var(--background-dark);
  color: var(--text-color-dark);
}
</style> 