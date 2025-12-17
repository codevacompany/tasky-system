<template>
  <div class="p-6">
    <header class="mb-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white m-0">
            Configurações do Cliente
          </h1>
          <h2 class="text-base text-gray-600 dark:text-gray-400 mt-1 m-0">
            {{ client.razaoSocial }}
          </h2>
        </div>
        <div>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            @click="saveSettings"
          >
            <font-awesome-icon icon="save" /> Salvar Alterações
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Informações Básicas -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="m-0 mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Informações Básicas
        </h3>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Razão Social</label
          >
          <Input
            v-model="settings.razaoSocial"
            type="text"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">CNPJ</label>
          <Input
            v-model="settings.cnpj"
            type="text"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">Domínio</label>
          <Input
            v-model="settings.dominio"
            type="text"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div class="mb-0">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Email Principal</label
          >
          <Input
            v-model="settings.emailPrincipal"
            type="email"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <!-- Plano e Limites -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="m-0 mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Plano e Limites
        </h3>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">Plano Atual</label>
          <select
            v-model="settings.plano"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="BASIC">Básico</option>
            <option value="PRO">Profissional</option>
            <option value="ENTERPRISE">Empresarial</option>
            <option value="CUSTOM">Personalizado</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Limite de Usuários</label
          >
          <Input
            v-model="settings.limiteUsuarios"
            type="number"
            min="1"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Limite de Tickets/mês</label
          >
          <Input
            v-model="settings.limiteTickets"
            type="number"
            min="1"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div class="mb-0">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Data de Renovação</label
          >
          <Input
            v-model="settings.dataRenovacao"
            type="date"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <!-- Configurações de Notificação -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="m-0 mb-6 text-lg font-semibold text-gray-900 dark:text-white">Notificações</h3>
        <div class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailNovoTicket"
              class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span class="text-gray-700 dark:text-gray-300"
              >Notificar por email ao receber novo ticket</span
            >
          </label>
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailAtualizacaoTicket"
              class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span class="text-gray-700 dark:text-gray-300"
              >Notificar por email ao atualizar ticket</span
            >
          </label>
        </div>
        <div class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.notificacoes.emailFinalizacaoTicket"
              class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span class="text-gray-700 dark:text-gray-300"
              >Notificar por email ao finalizar ticket</span
            >
          </label>
        </div>
        <div class="mb-0">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Frequência do Relatório</label
          >
          <select
            v-model="settings.notificacoes.frequenciaRelatorio"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="DIARIO">Diário</option>
            <option value="SEMANAL">Semanal</option>
            <option value="MENSAL">Mensal</option>
            <option value="NUNCA">Nunca</option>
          </select>
        </div>
      </div>

      <!-- Personalização -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 class="m-0 mb-6 text-lg font-semibold text-gray-900 dark:text-white">Personalização</h3>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Cor Primária</label
          >
          <Input
            v-model="settings.personalizacao.corPrimaria"
            type="color"
            class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Logo da Empresa</label
          >
          <div class="flex flex-col gap-4 items-center">
            <img
              v-if="settings.personalizacao.logo"
              :src="settings.personalizacao.logo"
              alt="Logo da empresa"
              class="max-w-[200px] max-h-[100px] object-contain"
            />
            <button
              class="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <font-awesome-icon icon="upload" /> Alterar Logo
            </button>
          </div>
        </div>
        <div class="mb-0">
          <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >Mensagem de Boas-vindas</label
          >
          <textarea
            v-model="settings.personalizacao.mensagemBoasVindas"
            rows="3"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y min-h-[80px]"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '@/components/common/Input.vue';

type IntegrationKey = keyof typeof settings.value.integracoes;

// Dados mockados do cliente
const client = ref({
  id: 1,
  razaoSocial: 'Empresa ABC Ltda',
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
    frequenciaRelatorio: 'SEMANAL',
  },
  personalizacao: {
    corPrimaria: '#007BFF',
    logo: '/logos/empresa-abc.png',
    mensagemBoasVindas: 'Bem-vindo ao sistema de gerenciamento detarefas da Empresa ABC!',
  },
  integracoes: {
    slack: true,
    teams: false,
    jira: true,
  },
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
/* All styles have been converted to Tailwind classes */
</style>
