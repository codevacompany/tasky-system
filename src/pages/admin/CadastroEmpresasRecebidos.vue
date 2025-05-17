<template>
  <div class="client-management">
    <header class="page-header">
      <div class="header-content">
        <h1>Gestão de Cadastros</h1>
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
      <nav class="menu-tabs">
        <router-link to="/cadastros-empresas" class="menu-tab" :class="{ active: isCadastros }">Cadastros</router-link>
        <router-link to="/admin/clientes" class="menu-tab" :class="{ active: !isCadastros }">Clientes</router-link>
      </nav>
    </header>
    <div class="clients-table-wrapper">
      <table class="clients-table">
        <thead>
          <tr>
            <th>Nome da Empresa</th>
            <th>CNPJ</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="cadastro in filteredCadastros" :key="cadastro.id">
            <tr @click="toggleExpand(cadastro.id)" :class="{ expanded: expandedId === cadastro.id }" style="cursor:pointer;">
              <td>{{ cadastro.nomeEmpresa }}</td>
              <td>{{ cadastro.cnpj }}</td>
              <td>{{ cadastro.emailEmpresa }}</td>
              <td>{{ cadastro.telefoneEmpresa }}</td>
              <td>{{ formatDate(cadastro.dataCadastro) }}</td>
              <td class="actions-cell" @click.stop>
                <button class="action-btn" @click="enviarBoasVindas(cadastro)" title="Enviar e-mail de boas-vindas">
                  <font-awesome-icon icon="envelope-open-text" />
                </button>
                <button class="action-btn" @click="enviarDefinicaoSenha(cadastro)" title="Enviar e-mail para definição de senha">
                  <font-awesome-icon icon="key" />
                </button>
                <button class="action-btn" @click="confirmarCadastro(cadastro)" title="Confirmar cadastro">
                  <font-awesome-icon icon="check-circle" />
                </button>
                <button class="action-btn" @click="rejeitarCadastro(cadastro)" title="Rejeitar cadastro">
                  <font-awesome-icon icon="times-circle" />
                </button>
              </td>
            </tr>
            <tr v-if="expandedId === cadastro.id" class="expand-row">
              <td colspan="6">
                <div class="expand-content">
                  <div class="expand-columns">
                    <div class="expand-col">
                      <h4>Endereço</h4>
                      <div><strong>Rua:</strong> {{ cadastro.rua || '-' }}</div>
                      <div><strong>Número:</strong> {{ cadastro.numero || '-' }}</div>
                      <div><strong>Bairro/Cidade:</strong> {{ cadastro.cidade || '-' }}</div>
                      <div><strong>Estado:</strong> {{ cadastro.estado || '-' }}</div>
                      <div><strong>CEP:</strong> {{ cadastro.cep || '-' }}</div>
                    </div>
                    <div class="expand-col">
                      <h4>Responsável</h4>
                      <div><strong>Nome:</strong> {{ cadastro.nomeResponsavel || '-' }}</div>
                      <div><strong>CPF:</strong> {{ cadastro.cpfResponsavel || '-' }}</div>
                      <div><strong>E-mail:</strong> {{ cadastro.emailResponsavel || '-' }}</div>
                      <div><strong>Telefone:</strong> {{ cadastro.telefoneResponsavel || '-' }}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="filteredCadastros.length === 0">
            <td colspan="6" style="text-align:center; color:#888;">Nenhum cadastro encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRoute } from 'vue-router';

// Exemplo de dados mockados (substitua por fetch da API futuramente)
const cadastros = ref([
  {
    id: 1,
    nomeEmpresa: 'Empresa Exemplo',
    cnpj: '12.345.678/0001-99',
    emailEmpresa: 'empresa@email.com',
    telefoneEmpresa: '(11) 91234-5678',
    cidade: 'São Paulo',
    rua: 'Rua das Flores',
    numero: '123',
    estado: 'SP',
    cep: '12345-678',
    nomeResponsavel: 'João Silva',
    cpfResponsavel: '123.456.789-00',
    emailResponsavel: 'joao@email.com',
    telefoneResponsavel: '(11) 99876-5432',
    dataCadastro: new Date(),
  },
  {
    id: 2,
    nomeEmpresa: 'Tech Solutions',
    cnpj: '98.765.432/0001-11',
    emailEmpresa: 'contato@techsolutions.com',
    telefoneEmpresa: '(21) 98765-4321',
    cidade: 'Rio de Janeiro',
    rua: 'Av. Atlântica',
    numero: '456',
    estado: 'RJ',
    cep: '23456-789',
    nomeResponsavel: 'Maria Oliveira',
    cpfResponsavel: '987.654.321-00',
    emailResponsavel: 'maria@techsolutions.com',
    telefoneResponsavel: '(21) 91234-5678',
    dataCadastro: new Date(),
  },
  {
    id: 3,
    nomeEmpresa: 'Alfa Serviços',
    cnpj: '11.222.333/0001-44',
    emailEmpresa: 'alfa@servicos.com',
    telefoneEmpresa: '(31) 91234-0000',
    cidade: 'Belo Horizonte',
    rua: 'Rua Central',
    numero: '789',
    estado: 'MG',
    cep: '34567-890',
    nomeResponsavel: 'Carlos Souza',
    cpfResponsavel: '321.654.987-00',
    emailResponsavel: 'carlos@alfa.com',
    telefoneResponsavel: '(31) 99876-1111',
    dataCadastro: new Date(),
  },
]);

const searchTerm = ref('');

const filteredCadastros = computed(() => {
  if (!searchTerm.value) return cadastros.value;
  const term = searchTerm.value.toLowerCase();
  return cadastros.value.filter(cadastro =>
    cadastro.nomeEmpresa.toLowerCase().includes(term) ||
    cadastro.cnpj.toLowerCase().includes(term) ||
    cadastro.emailEmpresa.toLowerCase().includes(term)
  );
});

function formatDate(date: Date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function enviarBoasVindas(cadastro) {
  alert(`E-mail de boas-vindas enviado para ${cadastro.emailEmpresa}`);
}
function enviarDefinicaoSenha(cadastro) {
  alert(`E-mail para definição de senha enviado para ${cadastro.emailEmpresa}`);
}
function confirmarCadastro(cadastro) {
  alert(`Cadastro de ${cadastro.nomeEmpresa} confirmado!`);
}
function rejeitarCadastro(cadastro) {
  alert(`Cadastro de ${cadastro.nomeEmpresa} rejeitado.`);
}

const expandedId = ref<number|null>(null);
function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

const route = useRoute();
const isCadastros = computed(() => route.path.includes('/cadastros-empresas'));
</script>

<style scoped>
.client-management {
  padding: 2.5rem 2rem;
}
.page-header {
  margin-bottom: 2rem;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: #a0aec0;
  font-size: 1.1rem;
}
.search-box input {
  padding: 0.7rem 0.7rem 0.7rem 2.2rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  width: 260px;
  background: #f9fafb;
}
.clients-table-wrapper {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 1.5rem 1rem;
}
.clients-table {
  width: 100%;
  border-collapse: collapse;
}
.clients-table th, .clients-table td {
  padding: 0.7rem 0.5rem;
  text-align: center;
  font-size: 1rem;
}
.clients-table th {
  color: #3b3b3b;
  font-weight: 600;
  background: #f6f9ff;
}
.clients-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
}
.clients-table tbody tr:last-child {
  border-bottom: none;
}
.actions-cell {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  align-items: center;
}
.action-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  transition: background 0.15s;
}
.action-btn:hover {
  background: #f0f4ff;
  color: #174ea6;
}
.expand-row td {
  background: #f6f9ff;
  padding-top: 0;
  padding-bottom: 0.7rem;
}
.expand-content {
  padding: 1.1rem 0.5rem 1.1rem 0.5rem;
  font-size: 1rem;
  color: #333;
  text-align: center;
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
  color: #2563eb;
  margin-bottom: 0.5rem;
  margin-top: 0;
}
.expand-col div {
  margin-bottom: 0.3rem;
}
tr.expanded {
  background: #f0f4ff;
}
.menu-tabs {
  display: flex;
  gap: 2.5rem;
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}
.menu-tab {
  font-size: 1.08rem;
  font-weight: 600;
  color: #64748b;
  padding: 0.6rem 0;
  text-decoration: none;
  border-bottom: 2.5px solid transparent;
  transition: color 0.2s, border-bottom 0.2s;
}
.menu-tab.active {
  color: #2563eb;
  border-bottom: 2.5px solid #2563eb;
}
</style> 