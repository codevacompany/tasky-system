<template>
  <div class="client-settings">
    <header class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Configurações do Cliente</h1>
          <h2>{{ client.razaoSocial }}</h2>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="saveSettings">
            <font-awesome-icon icon="save" /> Salvar Alterações
          </button>
        </div>
      </div>
    </header>

    <div class="settings-grid">
      <!-- Informações Básicas -->
      <div class="settings-card">
        <h3>Informações Básicas</h3>
        <div class="form-group">
          <label>Razão Social</label>
          <input type="text" v-model="settings.razaoSocial" />
        </div>
        <div class="form-group">
          <label>CNPJ</label>
          <input type="text" v-model="settings.cnpj" />
        </div>
        <div class="form-group">
          <label>Domínio</label>
          <input type="text" v-model="settings.dominio" />
        </div>
        <div class="form-group">
          <label>Email Principal</label>
          <input type="email" v-model="settings.emailPrincipal" />
        </div>
      </div>

      <!-- Plano e Limites -->
      <div class="settings-card">
        <h3>Plano e Limites</h3>
        <div class="form-group">
          <label>Plano Atual</label>
          <select v-model="settings.plano">
            <option value="BASIC">Básico</option>
            <option value="PRO">Profissional</option>
            <option value="ENTERPRISE">Empresarial</option>
            <option value="CUSTOM">Personalizado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Limite de Usuários</label>
          <input type="number" v-model="settings.limiteUsuarios" min="1" />
        </div>
        <div class="form-group">
          <label>Limite de Tickets/mês</label>
          <input type="number" v-model="settings.limiteTickets" min="1" />
        </div>
        <div class="form-group">
          <label>Data de Renovação</label>
          <input type="date" v-model="settings.dataRenovacao" />
        </div>
      </div>

      <!-- Configurações de Notificação -->
      <div class="settings-card">
        <h3>Notificações</h3>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailNovoTicket"
            />
            Notificar por email ao receber novo ticket
          </label>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailAtualizacaoTicket"
            />
            Notificar por email ao atualizar ticket
          </label>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailFinalizacaoTicket"
            />
            Notificar por email ao finalizar ticket
          </label>
        </div>
        <div class="form-group">
          <label>Frequência do Relatório</label>
          <select v-model="settings.notificacoes.frequenciaRelatorio">
            <option value="DIARIO">Diário</option>
            <option value="SEMANAL">Semanal</option>
            <option value="MENSAL">Mensal</option>
            <option value="NUNCA">Nunca</option>
          </select>
        </div>
      </div>

      <!-- Personalização -->
      <div class="settings-card">
        <h3>Personalização</h3>
        <div class="form-group">
          <label>Cor Primária</label>
          <input type="color" v-model="settings.personalizacao.corPrimaria" />
        </div>
        <div class="form-group">
          <label>Logo da Empresa</label>
          <div class="logo-upload">
            <img
              v-if="settings.personalizacao.logo"
              :src="settings.personalizacao.logo"
              alt="Logo da empresa"
            />
            <button class="btn btn-secondary">
              <font-awesome-icon icon="upload" /> Alterar Logo
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Mensagem de Boas-vindas</label>
          <textarea
            v-model="settings.personalizacao.mensagemBoasVindas"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Integrações -->
      <div class="settings-card">
        <h3>Integrações</h3>
        <div class="integration-list">
          <div class="integration-item">
            <div class="integration-info">
              <img src="@/assets/images/icons/slack.svg" alt="Slack" />
              <div>
                <h4>Slack</h4>
                <p>Receba notificações no Slack</p>
              </div>
            </div>
            <button
              class="btn"
              :class="settings.integracoes.slack ? 'btn-danger' : 'btn-primary'"
              @click="toggleIntegration('slack')"
            >
              {{ settings.integracoes.slack ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>

          <div class="integration-item">
            <div class="integration-info">
              <img src="@/assets/images/icons/teams.svg" alt="Microsoft Teams" />
              <div>
                <h4>Microsoft Teams</h4>
                <p>Integre com seus canais do Teams</p>
              </div>
            </div>
            <button
              class="btn"
              :class="settings.integracoes.teams ? 'btn-danger' : 'btn-primary'"
              @click="toggleIntegration('teams')"
            >
              {{ settings.integracoes.teams ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>

          <div class="integration-item">
            <div class="integration-info">
              <img src="@/assets/images/icons/jira.svg" alt="Jira" />
              <div>
                <h4>Jira</h4>
                <p>Sincronize tickets com o Jira</p>
              </div>
            </div>
            <button
              class="btn"
              :class="settings.integracoes.jira ? 'btn-danger' : 'btn-primary'"
              @click="toggleIntegration('jira')"
            >
              {{ settings.integracoes.jira ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type IntegrationKey = keyof typeof settings.value.integracoes;

// Dados mockados do cliente
const client = ref({
  id: 1,
  razaoSocial: 'Empresa ABC Ltda'
});

// Configurações do cliente
const settings = ref({
  razaoSocial: 'Empresa ABC Ltda',
  cnpj: '12.345.678/0001-90',
  dominio: 'empresaabc.com.br',
  emailPrincipal: 'contato@empresaabc.com.br',
  plano: 'PRO',
  limiteUsuarios: 20,
  limiteTickets: 1000,
  dataRenovacao: '2024-12-31',
  notificacoes: {
    emailNovoTicket: true,
    emailAtualizacaoTicket: true,
    emailFinalizacaoTicket: true,
    frequenciaRelatorio: 'SEMANAL'
  },
  personalizacao: {
    corPrimaria: '#007BFF',
    logo: '/logos/empresa-abc.png',
    mensagemBoasVindas: 'Bem-vindo ao sistema de tickets da Empresa ABC!'
  },
  integracoes: {
    slack: true,
    teams: false,
    jira: true
  }
});

// Métodos
const saveSettings = () => {
  console.log('Salvando configurações:', settings.value);
};

const toggleIntegration = (integration: IntegrationKey) => {
  settings.value.integracoes[integration] = !settings.value.integracoes[integration];
};
</script>

<style scoped>
.client-settings {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--input-bg);
  color: var(--text-color);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.logo-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.logo-upload img {
  max-width: 200px;
  max-height: 100px;
  object-fit: contain;
}

.integration-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.integration-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 4px;
}

.integration-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.integration-info img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.integration-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.integration-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-light);
}

/* Dark mode */
:deep(body.dark-mode) .settings-card {
  background-color: var(--card-bg-dark);
}

:deep(body.dark-mode) .integration-item {
  background-color: var(--background-dark);
}

:deep(body.dark-mode) .form-group input,
:deep(body.dark-mode) .form-group select,
:deep(body.dark-mode) .form-group textarea {
  background-color: var(--input-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}
</style>
