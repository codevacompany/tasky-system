<template>
  <div class="client-management">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1>Gestão de Clientes</h1>
        <div class="header-actions">
          <div class="search-box">
            <font-awesome-icon icon="search" class="search-icon" />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Buscar por nome, CNPJ ou plano..."
            />
          </div>
          <button class="btn btn-primary" @click="showNewClientModal = true">
            <font-awesome-icon icon="plus" /> Novo Cliente
          </button>
        </div>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="building" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Clientes Ativos</span>
            <span class="stat-value">{{ stats.clientesAtivos }}</span>
            <span class="stat-trend positive">
              <font-awesome-icon icon="arrow-up" /> 12% este mês
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="users" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Total de Usuários</span>
            <span class="stat-value">{{ stats.totalUsuarios }}</span>
            <span class="stat-trend positive">
              <font-awesome-icon icon="arrow-up" /> 8% este mês
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="inbox" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Tickets no Mês</span>
            <span class="stat-value">{{ stats.ticketsMes }}</span>
            <span class="stat-trend negative">
              <font-awesome-icon icon="arrow-down" /> 5% este mês
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="chart-line" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Faturamento Mensal</span>
            <span class="stat-value">{{ formatCurrency(stats.faturamentoMensal) }}</span>
            <span class="stat-trend positive">
              <font-awesome-icon icon="arrow-up" /> 15% este mês
            </span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="SUSPENSO">Suspenso</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        <select v-model="planFilter" class="filter-select">
          <option value="">Todos os Planos</option>
          <option value="BASICO">Básico</option>
          <option value="PROFISSIONAL">Profissional</option>
          <option value="EMPRESARIAL">Empresarial</option>
          <option value="PERSONALIZADO">Personalizado</option>
        </select>

        <select v-model="pagamentoFilter" class="filter-select">
          <option value="">Status Pagamento</option>
          <option value="EM_DIA">Em dia</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="PENDENTE">Pendente</option>
        </select>

        <div class="date-filter">
          <input
            type="date"
            v-model="dateFilter.start"
            class="filter-date"
            placeholder="Data inicial"
          />
          <span>até</span>
          <input
            type="date"
            v-model="dateFilter.end"
            class="filter-date"
            placeholder="Data final"
          />
        </div>
      </div>

      <!-- Ações em Massa -->
      <div class="bulk-actions" v-if="selectedClients.length > 0">
        <span class="selected-count">{{ selectedClients.length }} clientes selecionados</span>
        <div class="action-buttons">
          <button class="btn btn-secondary" @click="toggleSelectedStatus">
            <font-awesome-icon icon="toggle-on" /> Alterar Status
          </button>
          <button class="btn btn-secondary" @click="showChangePlanModal">
            <font-awesome-icon icon="layer-group" /> Alterar Plano
          </button>
          <button class="btn btn-secondary" @click="exportSelected">
            <font-awesome-icon icon="file-export" /> Exportar
          </button>
        </div>
      </div>
    </header>

    <!-- Lista de Clientes -->
    <div class="clients-table-wrapper">
      <table class="clients-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input type="checkbox" :checked="isAllSelected" @change="toggleAllSelection" />
            </th>
            <th @click="sortBy('razaoSocial')">
              Cliente
              <font-awesome-icon
                :icon="getSortIcon('razaoSocial')"
                v-if="sortField === 'razaoSocial'"
              />
            </th>
            <th @click="sortBy('cnpj')">
              CNPJ
              <font-awesome-icon :icon="getSortIcon('cnpj')" v-if="sortField === 'cnpj'" />
            </th>
            <th @click="sortBy('plano')">
              Plano
              <font-awesome-icon :icon="getSortIcon('plano')" v-if="sortField === 'plano'" />
            </th>
            <th @click="sortBy('status')">
              Status
              <font-awesome-icon :icon="getSortIcon('status')" v-if="sortField === 'status'" />
            </th>
            <th @click="sortBy('usuariosAtivos')">
              Usuários
              <font-awesome-icon
                :icon="getSortIcon('usuariosAtivos')"
                v-if="sortField === 'usuariosAtivos'"
              />
            </th>
            <th @click="sortBy('ticketsMes')">
              Tickets/Mês
              <font-awesome-icon
                :icon="getSortIcon('ticketsMes')"
                v-if="sortField === 'ticketsMes'"
              />
            </th>
            <th @click="sortBy('proximaFatura')">
              Próx. Fatura
              <font-awesome-icon
                :icon="getSortIcon('proximaFatura')"
                v-if="sortField === 'proximaFatura'"
              />
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="client in sortedClients" :key="client.id">
            <!-- Linha principal do cliente -->
            <tr
              :class="{ expanded: expandedClient === client.id }"
              @click="toggleClientExpansion(client.id)"
            >
              <td class="checkbox-column" @click.stop>
                <input
                  type="checkbox"
                  :checked="isSelected(client)"
                  @change="toggleSelection(client)"
                />
              </td>
              <td class="client-info">
                <img :src="client.logo || '/default-logo.png'" alt="Logo" class="client-logo" />
                <div>
                  <span class="client-name">{{ client.razaoSocial }}</span>
                  <span class="client-domain">{{ client.dominio }}</span>
                </div>
              </td>
              <td>{{ formatCNPJ(client.cnpj) }}</td>
              <td>
                <span :class="['plan-badge', client.plano.toLowerCase()]">
                  {{ client.plano }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', client.status.toLowerCase()]">
                  {{ client.status }}
                </span>
              </td>
              <td>
                <div class="usage-info">
                  {{ client.usuariosAtivos }}/{{ client.limiteUsuarios }}
                  <div class="progress-bar">
                    <div
                      class="progress"
                      :style="{
                        width: `${(client.usuariosAtivos / client.limiteUsuarios) * 100}%`,
                      }"
                      :class="{ warning: client.usuariosAtivos / client.limiteUsuarios > 0.8 }"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="usage-info">
                  {{ client.ticketsMes }}/{{ client.limiteTickets }}
                  <div class="progress-bar">
                    <div
                      class="progress"
                      :style="{ width: `${(client.ticketsMes / client.limiteTickets) * 100}%` }"
                      :class="{ warning: client.ticketsMes / client.limiteTickets > 0.8 }"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="payment-info">
                  <span>{{ formatDate(client.proximaFatura) }}</span>
                  <span :class="['payment-status', client.statusPagamento]">
                    {{ client.statusPagamento }}
                  </span>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon" title="Editar" @click.stop="editClient(client)">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button class="btn-icon" title="Usuários" @click.stop="manageUsers(client)">
                    <font-awesome-icon icon="users" />
                  </button>
                  <button
                    class="btn-icon"
                    title="Configurações"
                    @click.stop="manageSettings(client)"
                  >
                    <font-awesome-icon icon="cog" />
                  </button>
                  <button class="btn-icon" title="Mais opções" @click.stop="showOptions(client)">
                    <font-awesome-icon icon="ellipsis-v" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Linha expandida com detalhes dos usuários -->
            <tr v-if="expandedClient === client.id" class="expanded-row">
              <td colspan="9">
                <div class="users-table-wrapper">
                  <table class="users-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Departamento</th>
                        <th>Perfil</th>
                        <th>Status</th>
                        <th>Último Acesso</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in client.users" :key="user.id">
                        <td class="user-info">
                          <div class="user-avatar">{{ getUserInitials(user) }}</div>
                          <span>{{ user.firstName }} {{ user.lastName }}</span>
                        </td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.departamento }}</td>
                        <td>
                          <span :class="['profile-badge', user.perfil.toLowerCase()]">
                            {{ user.perfil }}
                          </span>
                        </td>
                        <td>
                          <span :class="['status-badge', user.status.toLowerCase()]">
                            {{ user.status }}
                          </span>
                        </td>
                        <td>{{ formatDateTime(user.ultimoAcesso) }}</td>
                        <td>
                          <div class="actions">
                            <button class="btn-icon" title="Editar" @click="editUser(user)">
                              <font-awesome-icon icon="edit" />
                            </button>
                            <button
                              class="btn-icon"
                              title="Alterar Status"
                              @click="toggleUserStatus(user)"
                            >
                              <font-awesome-icon
                                :icon="user.status === 'ATIVO' ? 'ban' : 'check'"
                              />
                            </button>
                            <button
                              class="btn-icon"
                              title="Resetar Senha"
                              @click="resetPassword(user)"
                            >
                              <font-awesome-icon icon="key" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="pagination">
      <button class="btn btn-icon" :disabled="currentPage === 1" @click="currentPage--">
        <font-awesome-icon icon="chevron-left" />
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button class="btn btn-icon" :disabled="currentPage === totalPages" @click="currentPage++">
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>

    <!-- Modal Novo Cliente -->
    <div v-if="showNewClientModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Novo Cliente</h2>
          <button class="btn-icon" @click="showNewClientModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewClient">
            <div class="form-group">
              <label>Razão Social</label>
              <input type="text" v-model="newClient.razaoSocial" required />
            </div>
            <div class="form-group">
              <label>CNPJ</label>
              <input type="text" v-model="newClient.cnpj" required />
            </div>
            <div class="form-group">
              <label>Plano</label>
              <select v-model="newClient.plano" required>
                <option value="BASICO">Básico</option>
                <option value="PROFISSIONAL">Profissional</option>
                <option value="EMPRESARIAL">Empresarial</option>
                <option value="PERSONALIZADO">Personalizado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Domínio</label>
              <input type="text" v-model="newClient.dominio" required />
            </div>
            <div class="form-group">
              <label>E-mail do Administrador</label>
              <input type="email" v-model="newClient.adminEmail" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showNewClientModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="saveNewClient">Criar Cliente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getUserInitials } from '@/utils/generic-helper';

type SortableClientField =
  | 'razaoSocial'
  | 'cnpj'
  | 'plano'
  | 'status'
  | 'dominio'
  | 'usuariosAtivos'
  | 'limiteUsuarios'
  | 'ticketsMes'
  | 'limiteTickets'
  | 'proximaFatura'
  | 'statusPagamento';

// Estados
const searchTerm = ref('');
const statusFilter = ref('');
const planFilter = ref('');
const currentPage = ref(1);
const showNewClientModal = ref(false);
const expandedClient = ref<number | null>(null);
const selectedClients = ref<number[]>([]);
const sortField = ref<SortableClientField>('razaoSocial');
const sortOrder = ref<'asc' | 'desc'>('asc');
const pagamentoFilter = ref('');
const dateFilter = ref({
  start: '',
  end: '',
});

// Novo cliente
const newClient = ref({
  razaoSocial: '',
  cnpj: '',
  plano: 'BASICO',
  dominio: '',
  adminEmail: '',
});

// Dados mockados para exemplo
const clients = ref([
  {
    id: 1,
    razaoSocial: 'Empresa ABC Ltda',
    cnpj: '12345678901234',
    plano: 'PROFISSIONAL',
    status: 'ATIVO',
    dominio: 'empresa-abc.tasksystem.com',
    usuariosAtivos: 15,
    limiteUsuarios: 20,
    ticketsMes: 80,
    limiteTickets: 100,
    proximaFatura: '2024-04-15',
    statusPagamento: 'EM_DIA',
    logo: '/logos/abc.png',
    users: [
      {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@empresa-abc.com',
        departamento: 'TI',
        perfil: 'ADMIN',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-15T14:30:00',
      },
      {
        id: 2,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@empresa-abc.com',
        departamento: 'Suporte',
        perfil: 'NORMAL',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-15T16:45:00',
      },
    ],
  },
  {
    id: 2,
    razaoSocial: 'Tech Solutions Brasil',
    cnpj: '98765432101234',
    plano: 'EMPRESARIAL',
    status: 'ATIVO',
    dominio: 'techsolutions.tasksystem.com',
    usuariosAtivos: 45,
    limiteUsuarios: 50,
    ticketsMes: 180,
    limiteTickets: 200,
    proximaFatura: '2024-04-10',
    statusPagamento: 'ATRASADO',
    logo: '/logos/tech.png',
    users: [
      {
        id: 3,
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@techsolutions.com',
        departamento: 'Diretoria',
        perfil: 'ADMIN',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-16T09:15:00',
      },
      {
        id: 4,
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@techsolutions.com',
        departamento: 'RH',
        perfil: 'NORMAL',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-16T11:20:00',
      },
      {
        id: 5,
        firstName: 'Lucas',
        lastName: 'Mendes',
        email: 'lucas.mendes@techsolutions.com',
        departamento: 'Suporte',
        perfil: 'NORMAL',
        status: 'SUSPENSO',
        ultimoAcesso: '2024-03-14T16:30:00',
      },
    ],
  },
  {
    id: 3,
    razaoSocial: 'Indústrias XYZ S.A.',
    cnpj: '45678912301234',
    plano: 'BASICO',
    status: 'SUSPENSO',
    dominio: 'xyz.tasksystem.com',
    usuariosAtivos: 8,
    limiteUsuarios: 10,
    ticketsMes: 45,
    limiteTickets: 50,
    proximaFatura: '2024-04-05',
    statusPagamento: 'PENDENTE',
    logo: '/logos/xyz.png',
    users: [
      {
        id: 6,
        firstName: 'Roberto',
        lastName: 'Almeida',
        email: 'roberto.almeida@xyz.com',
        departamento: 'Operações',
        perfil: 'ADMIN',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-15T08:45:00',
      },
      {
        id: 7,
        firstName: 'Carla',
        lastName: 'Santos',
        email: 'carla.santos@xyz.com',
        departamento: 'Financeiro',
        perfil: 'NORMAL',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-15T10:30:00',
      },
      {
        id: 8,
        firstName: 'Fernando',
        lastName: 'Lima',
        email: 'fernando.lima@xyz.com',
        departamento: 'Produção',
        perfil: 'NORMAL',
        status: 'SUSPENSO',
        ultimoAcesso: '2024-03-13T14:20:00',
      },
      {
        id: 9,
        firstName: 'Patricia',
        lastName: 'Silva',
        email: 'patricia.silva@xyz.com',
        departamento: 'Qualidade',
        perfil: 'NORMAL',
        status: 'ATIVO',
        ultimoAcesso: '2024-03-16T09:10:00',
      },
    ],
  },
]);

// Estatísticas mockadas
const stats = ref({
  clientesAtivos: 145,
  totalUsuarios: 2890,
  ticketsMes: 1234,
  faturamentoMensal: 89500.0,
});

// Computed properties
const filteredClients = computed(() => {
  return clients.value.filter((client) => {
    const matchSearch =
      !searchTerm.value ||
      client.razaoSocial.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.cnpj.includes(searchTerm.value) ||
      client.plano.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchStatus = !statusFilter.value || client.status === statusFilter.value;
    const matchPlan = !planFilter.value || client.plano === planFilter.value;

    return matchSearch && matchStatus && matchPlan;
  });
});

const totalPages = computed(() => Math.ceil(filteredClients.value.length / 10));

const isAllSelected = computed(() => {
  return (
    filteredClients.value.length > 0 &&
    selectedClients.value.length === filteredClients.value.length
  );
});

const sortedClients = computed(() => {
  return [...filteredClients.value].sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

// Métodos
const toggleClientExpansion = (clientId: number) => {
  expandedClient.value = expandedClient.value === clientId ? null : clientId;
};

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('pt-BR');
};

const editClient = (client: any) => {
  // Implementar edição do cliente
  console.log('Editar cliente:', client);
};

const manageUsers = (client: any) => {
  // Implementar gestão de usuários
  console.log('Gerenciar usuários:', client);
};

const manageSettings = (client: any) => {
  // Implementar configurações
  console.log('Configurações:', client);
};

const showOptions = (client: any) => {
  // Implementar menu de opções
  console.log('Opções:', client);
};

const editUser = (user: any) => {
  // Implementar edição de usuário
  console.log('Editar usuário:', user);
};

const toggleUserStatus = (user: any) => {
  // Implementar alteração de status
  console.log('Alternar status do usuário:', user);
};

const resetPassword = (user: any) => {
  // Implementar reset de senha
  console.log('Resetar senha do usuário:', user);
};

const saveNewClient = () => {
  // Implementar salvamento do novo cliente
  console.log('Novo cliente:', newClient.value);
  showNewClientModal.value = false;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const toggleSelection = (client: any) => {
  const index = selectedClients.value.indexOf(client.id);
  if (index === -1) {
    selectedClients.value.push(client.id);
  } else {
    selectedClients.value.splice(index, 1);
  }
};

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedClients.value = [];
  } else {
    selectedClients.value = filteredClients.value.map((client) => client.id);
  }
};

const isSelected = (client: any) => {
  return selectedClients.value.includes(client.id);
};

const sortBy = (field: SortableClientField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field: string) => {
  return sortOrder.value === 'asc' ? 'sort-up' : 'sort-down';
};

const toggleSelectedStatus = () => {
  // Implementar alteração de status em massa
  console.log('Alterando status dos clientes:', selectedClients.value);
};

const showChangePlanModal = () => {
  // Implementar modal de alteração de plano em massa
  console.log('Abrindo modal de alteração de plano para:', selectedClients.value);
};

const exportSelected = () => {
  // Implementar exportação dos dados
  console.log('Exportando dados dos clientes:', selectedClients.value);
};
</script>

<style scoped>
.client-management {
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.search-box {
  position: relative;
  min-width: 300px;
  max-width: 400px;
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

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: nowrap;
  width: 100%;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
}

.clients-table-wrapper {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
}

.clients-table th,
.clients-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.clients-table th:nth-child(2),
.clients-table td:nth-child(2) {
  text-align: left;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  justify-content: flex-start;
}

.client-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: contain;
}

.client-name {
  display: block;
  font-weight: 500;
}

.client-domain {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
}

.plan-badge,
.status-badge,
.profile-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 auto;
}

.plan-badge.basico {
  background: #e3f2fd;
  color: #1976d2;
}
.plan-badge.profissional {
  background: #e8f5e9;
  color: #388e3c;
}
.plan-badge.empresarial {
  background: #fff3e0;
  color: #f57c00;
}
.plan-badge.personalizado {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-badge.ativo {
  background: #e8f5e9;
  color: #388e3c;
}
.status-badge.suspenso {
  background: #fff3e0;
  color: #f57c00;
}
.status-badge.cancelado {
  background: #ffebee;
  color: #d32f2f;
}

.profile-badge.admin {
  background: #e3f2fd;
  color: #1976d2;
}
.profile-badge.normal {
  background: #fff3e0;
  color: #f57c00;
}

.usage-info {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.progress-bar {
  width: 100px;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin: 0.25rem auto 0;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress.warning {
  background: var(--warning-color);
}

.payment-info {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.payment-status {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
  text-align: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--hover-bg);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

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
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem;
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
  font-size: 0.9rem;
}

/* Estilos para a expansão */
.expand-icon {
  color: var(--text-light);
  transition: transform 0.3s ease;
}

tr.expanded .expand-icon {
  transform: rotate(90deg);
}

.expanded-row {
  background: var(--background-light);
}

.users-table-wrapper {
  padding: 1rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--card-bg);
  border-radius: 4px;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.users-table th:first-child,
.users-table td:first-child,
.users-table th:nth-child(2),
.users-table td:nth-child(2) {
  text-align: left;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  justify-content: flex-start;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Dark mode */
:deep(body.dark-mode) .clients-table th {
  background: var(--background-dark);
}

:deep(body.dark-mode) .expanded-row {
  background: var(--background-dark);
}

:deep(body.dark-mode) .users-table {
  background: var(--card-bg-dark);
}

:deep(body.dark-mode) .users-table th {
  background: var(--background-dark);
}

/* Novos estilos */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.25rem 0;
}

.stat-trend {
  display: block;
  font-size: 0.85rem;
}

.stat-trend.positive {
  color: var(--success-color);
}

.stat-trend.negative {
  color: var(--danger-color);
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex: 2;
}

.filter-date {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
}

.bulk-actions {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-count {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.checkbox-column {
  width: 40px;
  text-align: center;
}

th {
  cursor: pointer;
  user-select: none;
}

th:hover {
  background: var(--hover-bg);
}

/* Dark mode */
:deep(body.dark-mode) .stat-card {
  background: var(--card-bg-dark);
}

:deep(body.dark-mode) .bulk-actions {
  background: var(--background-dark);
}
</style>
