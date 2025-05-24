<template>
  <div class="client-users">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Gestão de Cadastros</h1>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <font-awesome-icon icon="search" class="search-icon" />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Buscar por nome, CNPJ ou e-mail..."
            />
          </div>
        </div>
      </div>
    </header>
    <div class="users-table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>Nome da Empresa</th>
            <th>CNPJ</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="signup in filteredSignups" :key="signup.id">
            <tr
              @click="toggleExpand(signup.id)"
              :class="{ expanded: expandedId === signup.id }"
              style="cursor: pointer"
            >
              <td>{{ signup.companyName }}</td>
              <td>{{ signup.cnpj || '-' }}</td>
              <td>{{ signup.email }}</td>
              <td>{{ signup.phoneNumber || '-' }}</td>
              <td>
                <span class="status-badge" :class="`status-${signup.status}`">
                  {{ formatStatus(signup.status) }}
                </span>
              </td>
              <td>{{ formatDate(signup.createdAt) }}</td>
              <td class="actions-cell" @click.stop>
                <template v-if="signup.status === 'pendente'">
                  <button
                    class="action-button"
                    @click="approveSignup(signup)"
                    title="Confirmar cadastro"
                  >
                    <font-awesome-icon icon="check-circle" />
                  </button>
                  <button
                    class="action-button"
                    @click="rejectSignup(signup)"
                    title="Rejeitar cadastro"
                  >
                    <font-awesome-icon icon="times-circle" />
                  </button>
                </template>
                <template v-else>
                  <span
                    class="action-completed"
                    :title="`Cadastro ${formatStatus(signup.status).toLowerCase()}`"
                  >
                    <font-awesome-icon :icon="getStatusIcon(signup.status)" />
                  </span>
                </template>
              </td>
            </tr>
            <tr v-if="expandedId === signup.id" class="expand-row">
              <td colspan="6">
                <div class="expand-content">
                  <div class="expand-columns">
                    <div class="expand-col">
                      <h4>Endereço</h4>
                      <div><strong>Rua:</strong> {{ signup.street || '-' }}</div>
                      <div><strong>Número:</strong> {{ signup.number || '-' }}</div>
                      <div><strong>Bairro/Cidade:</strong> {{ signup.city || '-' }}</div>
                      <div><strong>Estado:</strong> {{ signup.state || '-' }}</div>
                      <div><strong>CEP:</strong> {{ signup.cep || '-' }}</div>
                    </div>
                    <div class="expand-col">
                      <h4>Responsável</h4>
                      <div><strong>Nome:</strong> {{ signup.contactName || '-' }}</div>
                      <div><strong>CPF:</strong> {{ signup.contactCpf || '-' }}</div>
                      <div><strong>E-mail:</strong> {{ signup.contactEmail || '-' }}</div>
                      <div><strong>Telefone:</strong> {{ signup.contactPhone || '-' }}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="filteredSignups.length === 0">
            <td colspan="6" style="text-align: center; color: #888">Nenhum cadastro encontrado.</td>
          </tr>
        </tbody>
      </table>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <p>Carregando...</p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchSignups" class="btn-retry">Tentar novamente</button>
      </div>

      <!-- Pagination controls -->
      <div class="pagination-controls" v-if="pagination.totalPages > 1">
        <button
          class="pagination-btn"
          :disabled="pagination.currentPage === 1"
          @click="changePage(pagination.currentPage - 1)"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>

        <span class="pagination-info">
          Página {{ pagination.currentPage }} de {{ pagination.totalPages }} ({{
            pagination.totalItems
          }}
          registros)
        </span>

        <button
          class="pagination-btn"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="changePage(pagination.currentPage + 1)"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { toast } from 'vue3-toastify';
import { signupService } from '@/services/signupService';
import { SignUpStatus } from '@/models/SignUp';
import type { CompanySignUp } from '@/models/SignUp';

const searchTerm = ref('');
const signups = ref<CompanySignUp[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
let autoRefreshInterval: number | null = null;

// Fetch signups from API
async function fetchSignups() {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await signupService.getSignups({
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage,
    });

    const data = response.data;
    signups.value = data.items;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching signups:', err);
  } finally {
    isLoading.value = false;
  }
}

function startAutoRefresh() {
  autoRefreshInterval = setInterval(() => {
    fetchSignups();
  }, 60000);
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
}

const filteredSignups = computed(() => {
  if (!searchTerm.value) return signups.value;
  const term = searchTerm.value.toLowerCase();
  return signups.value.filter(
    (signup) =>
      signup.companyName.toLowerCase().includes(term) ||
      signup.cnpj?.toLowerCase().includes(term) ||
      false ||
      signup.email.toLowerCase().includes(term) ||
      signup.contactEmail.toLowerCase().includes(term),
  );
});

function formatDate(date: Date) {
  if (!date) return '';
  const d = new Date(date);
  return (
    d.toLocaleDateString('pt-BR') +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatStatus(status: string) {
  switch (status) {
    case SignUpStatus.PENDING:
      return 'PENDENTE';
    case SignUpStatus.APPROVED:
      return 'APROVADO';
    case SignUpStatus.REJECTED:
      return 'REJEITADO';
    case SignUpStatus.COMPLETED:
      return 'COMPLETO';
    default:
      return status.toUpperCase();
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case SignUpStatus.COMPLETED:
      return 'check-circle';
    case SignUpStatus.REJECTED:
      return 'times-circle';
    case SignUpStatus.APPROVED:
      return 'envelope';
    default:
      return 'info-circle';
  }
}

async function approveSignup(signup: CompanySignUp) {
  try {
    await signupService.approveSignup(signup.id);
    toast.success(`Cadastro de ${signup.companyName} confirmado!`);
    fetchSignups(); // Refresh the list
  } catch (err) {
    console.error('Error confirming signup:', err);
    toast.error('Erro ao confirmar cadastro');
  }
}

async function rejectSignup(signup: CompanySignUp) {
  try {
    await signupService.rejectSignup(signup.id);
    toast.success(`Cadastro de ${signup.companyName} rejeitado.`);
    fetchSignups(); // Refresh the list
  } catch (err) {
    console.error('Error rejecting signup:', err);
    toast.error('Erro ao rejeitar cadastro');
  }
}

const expandedId = ref<number | null>(null);
function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

function changePage(page: number) {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.currentPage = page;
  fetchSignups();
}

onMounted(() => {
  fetchSignups();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  border-bottom: 1px solid var(--border-color);
}
.users-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}
.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
.action-button {
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
.action-button:hover {
  background: var(--background-light);
  color: var(--primary-color);
}
.expand-row td {
  background: var(--background-light);
  padding-top: 0;
  padding-bottom: 0.7rem;
}
.expand-content {
  padding: 1.1rem 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
}
.expand-columns {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
}
.expand-col {
  min-width: 180px;
  flex: 1;
}
.expand-col h4 {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  margin-top: 0;
}
.expand-col div {
  margin-bottom: 0.3rem;
}
tr.expanded {
  background: var(--background-light);
}

/* Dark mode */
:deep(body.dark-mode) .users-table {
  background-color: var(--card-bg-dark);
}

:deep(body.dark-mode) .users-table th {
  background-color: var(--background-dark);
  color: var(--text-color-dark);
  border-bottom-color: var(--border-color-dark);
}

:deep(body.dark-mode) .users-table td {
  border-color: var(--border-color-dark);
}

:deep(body.dark-mode) .expand-row td {
  background-color: var(--background-dark);
}

:deep(body.dark-mode) .expand-content {
  color: var(--text-color-dark);
}

:deep(body.dark-mode) .expand-col h4 {
  color: var(--primary-color);
}

:deep(body.dark-mode) tr.expanded {
  background-color: var(--background-dark);
}

.users-table tbody tr {
  transition: background-color 0.2s;
}

.users-table tbody tr:hover {
  background-color: var(--background-hover);
}

:deep(body.dark-mode) .users-table tbody tr:hover {
  background-color: var(--background-dark-hover);
}

/* Pagination controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  padding: 0.5rem;
}

.pagination-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--background-light);
  color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 0.9rem;
  color: var(--text-medium);
}

/* Loading state */
.loading-state {
  padding: 2rem;
  text-align: center;
  color: var(--text-medium);
}

/* Error state */
.error-state {
  padding: 2rem;
  text-align: center;
  color: #e53935;
}

.btn-retry {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: var(--primary-dark);
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 auto;
}

.status-pendente {
  background: #fff3e0;
  color: #f57c00;
}

.status-active {
  background: #e8f5e9;
  color: #388e3c;
}

.status-rejeitado {
  background: #ffebee;
  color: #d32f2f;
}

.status-aprovado {
  background: #e3f2fd;
  color: #1976d2;
}

.status-completo {
  background: #f3e5f5;
  color: #7b1fa2;
}

/* Action indicators for completed status */
.action-completed {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-light);
  opacity: 0.7;
}

.action-completed[title*='completo'] svg,
.action-completed[title*='ativo'] svg {
  color: #388e3c;
}

.action-completed[title*='rejeitado'] svg {
  color: #d32f2f;
}

.action-completed[title*='confirmado'] svg {
  color: #1976d2;
}
</style>
