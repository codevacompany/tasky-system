<template>
  <section class="section-content active faq-page">
    <div class="faq-header-row">
      <h1>FAQ - Central de Ajuda</h1>
      <div class="faq-search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Digite sua dúvida, palavra-chave ou termo..."
          class="faq-search-input"
        />
        <font-awesome-icon icon="search" class="faq-search-icon" />
      </div>
    </div>
    <p class="faq-subtitle">Encontre respostas para as dúvidas mais comuns sobre o uso do Tasky System.</p>

    <div class="faq-sections">
      <div v-for="(section, idx) in filteredSections" :key="section.title" class="faq-section">
        <button class="faq-section-header" @click="toggleSection(idx)">
          <font-awesome-icon :icon="section.icon" class="faq-section-icon" v-if="section.icon" />
          <span>{{ section.title }}</span>
          <font-awesome-icon :icon="openSections[idx] ? 'chevron-up' : 'chevron-down'" class="faq-chevron" />
        </button>
        <transition name="fade">
          <div v-show="openSections[idx]" class="faq-list">
            <div
              class="faq-item"
              v-for="faq in section.faqs"
              :key="faq.question"
            >
              <div class="faq-question">
                <font-awesome-icon icon="question-circle" class="faq-icon" />
                <span>{{ faq.question }}</span>
              </div>
              <div class="faq-answer">
                <span v-html="faq.answer"></span>
              </div>
            </div>
            <div v-if="section.faqs.length === 0" class="faq-empty">
              <font-awesome-icon icon="info-circle" /> Nenhuma resposta encontrada para sua busca.
            </div>
          </div>
        </transition>
      </div>
      <div v-if="filteredSections.every(section => section.faqs.length === 0)" class="faq-empty">
        <font-awesome-icon icon="info-circle" /> Nenhuma resposta encontrada para sua busca.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const sections = ref([
  {
    title: 'Sobre o Sistema',
    icon: 'info-circle',
    faqs: [
      {
        question: 'O que é o Tasky System?',
        answer: 'O Tasky System é uma plataforma web completa para gestão de tickets, desenvolvida para facilitar a comunicação, o acompanhamento e a resolução de demandas entre equipes e setores de uma organização. Com o Tasky, você centraliza solicitações, padroniza processos e garante mais agilidade e transparência no dia a dia.'
      },
      {
        question: 'Quais são as principais funcionalidades do Tasky?',
        answer: '<ul style="margin:0;padding-left:1.2em;"><li><b>Gestão de tickets:</b> criação, acompanhamento, histórico e comentários.</li><li><b>Notificações automáticas:</b> mantenha-se informado sobre atualizações e prazos.</li><li><b>Controle de prioridades e prazos:</b> defina o que é mais urgente e acompanhe o andamento.</li><li><b>Permissões e perfis:</b> acesso personalizado para cada usuário ou setor.</li><li><b>Relatórios e dashboards:</b> visualize métricas, produtividade e gargalos.</li><li><b>Fluxo de aprovação:</b> tickets podem passar por etapas de verificação e aprovação.</li><li><b>Responsividade:</b> acesso fácil em qualquer dispositivo.</li></ul>'
      },
      {
        question: 'Como o Tasky System pode melhorar o fluxo de trabalho da minha equipe?',
        answer: 'O Tasky System centraliza todas as demandas em um só lugar, reduz retrabalho, evita perda de informações e facilita o acompanhamento de cada etapa do ticket. Isso aumenta a transparência, melhora a comunicação entre setores e acelera a resolução de tarefas, tornando sua equipe mais produtiva e organizada.'
      },
      {
        question: 'Quais navegadores e dispositivos são suportados?',
        answer: 'O sistema funciona nos principais navegadores modernos (Chrome, Firefox, Edge, Safari) e é responsivo para uso em computadores, tablets e celulares.'
      },
    ]
  },
  {
    title: 'Acesso e Conta',
    icon: 'user-circle',
    faqs: [
      {
        question: 'Como faço login no sistema?',
        answer: 'Acesse a página de login, informe seu e-mail e senha cadastrados e clique em Entrar.'
      },
      {
        question: 'Esqueci minha senha, como recuperar?',
        answer: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções para redefinir.'
      },
      {
        question: 'Como altero meus dados pessoais?',
        answer: 'Clique no seu perfil no canto superior direito, acesse "Meu Perfil" e edite suas informações.'
      },
      {
        question: 'Como faço logout?',
        answer: 'Clique em "Sair" no menu do seu perfil.'
      },
    ]
  },
  {
    title: 'Tickets',
    icon: 'ticket',
    faqs: [
      {
        question: 'Como crio um novo ticket?',
        answer: 'Clique em "Novo Ticket" no menu, preencha os campos obrigatórios e clique em "Criar".'
      },
      {
        question: 'Qual a diferença entre ticket privado e público?',
        answer: 'Um ticket privado só pode ser visualizado pelo criador, pelo responsável e pelos administradores. Tickets públicos podem ser visualizados por todos os membros do setor ou equipe relacionados.'
      },
      {
        question: 'Quem pode visualizar meus tickets?',
        answer: 'Tickets criados por você podem ser visualizados por você, pelo responsável atribuído e, se público, pelos membros do setor. Tickets privados são restritos ao criador, responsável e administradores.'
      },
      {
        question: 'O que são tickets recebidos, criados e do setor?',
        answer: '<b>Recebidos</b>: tickets atribuídos a você. <br><b>Criados</b>: tickets que você abriu. <br><b>Do setor</b>: tickets do seu departamento, visíveis conforme permissões.'
      },
      {
        question: 'Como funciona o fluxo de um ticket?',
        answer: 'O ticket passa por etapas: Pendente, Em Andamento, Em Verificação, Finalizado ou Rejeitado. Cada etapa tem ações específicas.'
      },
      {
        question: 'Posso anexar arquivos aos tickets?',
        answer: 'Sim! É possível anexar arquivos de até 10MB nos formatos PDF, DOC, XLS, JPG e PNG.'
      },
      {
        question: 'Como defino a prioridade de um ticket?',
        answer: 'Ao criar o ticket, selecione a prioridade: Baixa, Média, Alta ou Urgente. Cada uma tem um prazo padrão.'
      },
      {
        question: 'Como aprovo, rejeito ou solicito correção de um ticket?',
        answer: 'Na tela de detalhes do ticket, utilize os botões de Aprovar, Rejeitar ou Corrigir conforme necessário.'
      },
      {
        question: 'Como vejo o histórico e comentários de um ticket?',
        answer: 'Abra o ticket e acesse a aba de histórico para visualizar todas as ações realizadas e comentários registrados.'
      },
      {
        question: 'Quem pode comentar em um ticket?',
        answer: 'O criador, o responsável e, dependendo das permissões, outros membros do setor podem comentar em tickets públicos.'
      },
      {
        question: 'Como saber se um ticket é privado ou público?',
        answer: 'Na tela de detalhes do ticket, há um indicador de privacidade. Tickets privados exibem um ícone de cadeado.'
      },
      {
        question: 'Como funcionam os comentários em tickets?',
        answer: 'Você pode comentar em tickets para registrar informações, dúvidas ou atualizações. O criador, o responsável e, em tickets públicos, membros do setor podem comentar. Todos os comentários ficam registrados no histórico do ticket.'
      },
      {
        question: 'Recebo notificações quando alguém comenta em um ticket?',
        answer: 'Sim, todos os envolvidos no ticket recebem notificações quando um novo comentário é adicionado.'
      },
      {
        question: 'Quais são os status possíveis de um ticket?',
        answer: '<b>Pendente</b>: aguardando aceite do responsável.<br><b>Em Andamento</b>: sendo tratado.<br><b>Em Verificação</b>: aguardando aprovação do solicitante.<br><b>Finalizado</b>: ticket concluído.<br><b>Rejeitado</b>: ticket recusado pelo solicitante.<br><b>Arquivado</b>: ticket encerrado e guardado para consulta.'
      },
      {
        question: 'O que é a visualização Kanban?',
        answer: 'A visualização Kanban exibe os tickets em colunas de acordo com o status (Pendente, Em Andamento, etc.), facilitando o acompanhamento do fluxo de trabalho. Os tickets mudam de coluna automaticamente conforme o status é alterado nas telas de detalhes ou ações do ticket. Não é possível arrastar manualmente entre as colunas.'
      },
      {
        question: 'Como acesso o Kanban?',
        answer: 'Na página de tickets, clique no botão de alternância para mudar entre a visualização em tabela e Kanban.'
      },
    ]
  },
  {
    title: 'Notificações',
    icon: 'bell',
    faqs: [
      {
        question: 'Quais tipos de notificações existem?',
        answer: 'Você recebe notificações para novos tickets, atualizações, aprovações, rejeições e solicitações de correção.'
      },
      {
        question: 'Como visualizo minhas notificações?',
        answer: 'Clique no ícone de sino no topo da tela para ver todas as notificações recentes.'
      },
      {
        question: 'Como marco notificações como lidas?',
        answer: 'Abra o painel de notificações e clique em cada uma para marcar como lida.'
      },
    ]
  },
  {
    title: 'Relatórios e Analytics',
    icon: 'chart-line',
    faqs: [
      {
        question: 'Como acesso relatórios?',
        answer: 'No menu lateral, clique em "Relatórios" para acessar gráficos e dados analíticos.'
      },
      {
        question: 'Como exporto relatórios?',
        answer: 'Na tela de relatórios, clique em "Exportar" e escolha o formato desejado (PDF, XLS, CSV).'
      },
    ]
  },
  {
    title: 'Segurança e Privacidade',
    icon: 'lock',
    faqs: [
      {
        question: 'Meus dados estão seguros?',
        answer: 'Sim, utilizamos criptografia, autenticação segura e backups diários para garantir a segurança das informações.'
      },
      {
        question: 'Quem tem acesso aos meus dados?',
        answer: 'Apenas usuários autorizados da sua organização, conforme as permissões definidas pelo administrador.'
      },
    ]
  },
  {
    title: 'Suporte e Contato',
    icon: 'envelope',
    faqs: [
      {
        question: 'Como entro em contato com o suporte?',
        answer: 'Clique no botão "Ajuda" no seu perfil ou envie um email para o suporte informado no rodapé do sistema.'
      },
      {
        question: 'Existe documentação para usuários?',
        answer: 'Sim, além desta FAQ, há um manual do usuário disponível na seção de documentação.'
      },
    ]
  },
]);

const searchTerm = ref('');
const openSections = ref<boolean[]>([]);

const filteredSections = computed(() => {
  return sections.value.map(section => {
    let faqs = section.faqs;
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      faqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
      );
    }
    return { ...section, faqs };
  });
});

function toggleSection(idx: number) {
  openSections.value[idx] = !openSections.value[idx];
}

// Inicializa todas as seções fechadas
watch(filteredSections, (newVal) => {
  openSections.value = newVal.map(() => false);
}, { immediate: true });
</script>

<style scoped>
.faq-page {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
.faq-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 1.5rem;
}
.faq-header-row h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a2233;
  margin: 0;
}
.faq-subtitle {
  font-size: 1.05rem;
  color: #4b5563;
  margin-bottom: 1.2rem;
  margin-left: 2px;
}
.faq-search-box {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
}
.faq-search-input {
  width: 100%;
  padding: 0.7rem 2.2rem 0.7rem 1rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  background: #f9f9fb;
  transition: border 0.2s;
}
.faq-search-input:focus {
  border-color: #1976d2;
}
.faq-search-icon {
  position: absolute;
  right: 12px;
  color: #b0b0b0;
  font-size: 1.1rem;
}

.faq-sections {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.faq-section {
  background: var(--card-bg, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  transition: box-shadow 0.2s;
}
.faq-section-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color, #1976d2);
  padding: 1.2rem 0 1.2rem 0;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.faq-section-header:hover {
  background: #f5f8fd;
}
.faq-section-icon {
  font-size: 1.2rem;
}
.faq-chevron {
  margin-left: auto;
  font-size: 1.1rem;
  color: #b0b0b0;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;
}

.faq-item {
  background: none;
  border-radius: 8px;
  box-shadow: none;
  padding: 0 0 0.5rem 0;
  transition: box-shadow 0.2s;
  border-bottom: 1px solid #f0f0f0;
}
.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--primary-color, #1976d2);
  margin-bottom: 0.3rem;
  gap: 8px;
}

.faq-icon {
  color: var(--primary-color, #1976d2);
  font-size: 1.1rem;
}

.faq-answer {
  font-size: 1rem;
  color: var(--text-color, #333);
  line-height: 1.6;
}

.faq-empty {
  text-align: center;
  color: #888;
  margin-top: 2rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
</style> 