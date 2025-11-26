<template>
  <section class="max-w-4xl mx-auto py-4 px-4 sm:py-7 sm:px-2">
    <!-- Mobile-first responsive header -->
    <div
      class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:mb-2"
    >
      <h1
        class="text-2xl sm:text-[28px] font-semibold text-gray-900 dark:text-white text-center sm:text-left"
      >
        FAQ - Central de Ajuda
      </h1>
      <!-- Search input - full width on mobile, constrained on larger screens -->
      <div class="flex items-center relative w-full sm:min-w-[280px] sm:max-w-[400px] sm:w-auto">
        <Input
          v-model="searchTerm"
          type="text"
          placeholder="Digite sua dúvida"
          class="w-full py-2 pr-10 sm:pr-12 pl-3 sm:pl-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
        />
        <font-awesome-icon
          icon="search"
          class="absolute right-2.5 sm:right-3 text-gray-400 dark:text-gray-500 text-base sm:text-lg pointer-events-none"
        />
      </div>
    </div>

    <p
      class="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 ml-0.5 text-center sm:text-left"
    >
      Encontre respostas para as dúvidas mais comuns sobre o uso do Tasky System.
    </p>

    <div class="flex flex-col gap-3 sm:gap-5">
      <Accordion
        v-for="(section, idx) in filteredSections"
        :key="section.title"
        :title="section.title"
        :icon="section.icon"
        @toggle="(isOpen) => handleAccordionToggle(idx, isOpen)"
      >
        <div class="flex flex-col gap-4 sm:gap-6">
          <FaqItem
            v-for="faq in section.faqs"
            :key="faq.question"
            :question="faq.question"
            :answer="faq.answer"
          />
          <div
            v-if="section.faqs.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 mt-6 sm:mt-8 text-base sm:text-lg flex flex-col sm:flex-row items-center gap-2 justify-center"
          >
            <font-awesome-icon icon="info-circle" />
            <span>Nenhuma resposta encontrada para sua busca.</span>
          </div>
        </div>
      </Accordion>
      <div
        v-if="filteredSections.every((section) => section.faqs.length === 0)"
        class="text-center text-gray-500 dark:text-gray-400 mt-6 sm:mt-8 text-base sm:text-lg flex flex-col sm:flex-row items-center gap-2 justify-center"
      >
        <font-awesome-icon icon="info-circle" />
        <span>Nenhuma resposta encontrada para sua busca.</span>
      </div>
    </div>

    <ChatSupportButton />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Accordion from '@/components/common/Accordion.vue';
import FaqItem from '@/components/faq/FaqItem.vue';
import ChatSupportButton from '@/components/faq/ChatSupportButton.vue';
import Input from '@/components/common/Input.vue';

const sections = ref([
  {
    title: 'Sobre o Sistema',
    icon: 'info-circle',
    faqs: [
      {
        question: 'O que é o Tasky System?',
        answer:
          'O Tasky System é uma plataforma web completa para gestão de tickets, desenvolvida para facilitar a comunicação, o acompanhamento e a resolução de demandas entre equipes e setores de uma organização. Com o Tasky, você centraliza solicitações, padroniza processos e garante mais agilidade e transparência no dia a dia.',
      },
      {
        question: 'Quais são as principais funcionalidades do Tasky?',
        answer:
          '<ul style="margin:0;padding-left:1.2em;"><li><b>Gestão de tickets:</b> criação, acompanhamento, histórico e comentários.</li><li><b>Notificações automáticas:</b> mantenha-se informado sobre atualizações e prazos.</li><li><b>Controle de prioridades e prazos:</b> defina o que é mais urgente e acompanhe o andamento.</li><li><b>Permissões e perfis:</b> acesso personalizado para cada usuário ou setor.</li><li><b>Relatórios e dashboards:</b> visualize métricas, produtividade e gargalos.</li><li><b>Fluxo de aprovação:</b> tickets podem passar por etapas de verificação e aprovação.</li><li><b>Responsividade:</b> acesso fácil em qualquer dispositivo.</li></ul>',
      },
      {
        question: 'Como o Tasky System pode melhorar o fluxo de trabalho da minha equipe?',
        answer:
          'O Tasky System centraliza todas as demandas em um só lugar, reduz retrabalho, evita perda de informações e facilita o acompanhamento de cada etapa do ticket. Isso aumenta a transparência, melhora a comunicação entre setores e acelera a resolução de tarefas, tornando sua equipe mais produtiva e organizada.',
      },
      {
        question: 'Quais navegadores e dispositivos são suportados?',
        answer:
          'O sistema funciona nos principais navegadores modernos (Chrome, Firefox, Edge, Safari) e é responsivo para uso em computadores, tablets e celulares.',
      },
    ],
  },
  {
    title: 'Acesso e Conta',
    icon: 'user-circle',
    faqs: [
      {
        question: 'Como faço login no sistema?',
        answer:
          'Acesse a página de login, informe seu e-mail e senha cadastrados e clique em Entrar.',
      },
      {
        question: 'Esqueci minha senha, como recuperar?',
        answer:
          'Clique em "Esqueci minha senha" na tela de login e siga as instruções para redefinir.',
      },
      {
        question: 'Como altero meus dados pessoais?',
        answer:
          'Clique no seu perfil no canto superior direito, acesse "Meu Perfil" e edite suas informações.',
      },
      {
        question: 'Como faço logout?',
        answer: 'Clique em "Sair" no menu do seu perfil.',
      },
    ],
  },
  {
    title: 'Tickets',
    icon: 'ticket',
    faqs: [
      {
        question: 'Como crio um novo ticket?',
        answer:
          'Clique em "Novo Ticket" no menu, preencha os campos obrigatórios e clique em "Criar".',
      },
      {
        question: 'Qual a diferença entre ticket privado e público?',
        answer:
          'Um ticket privado só pode ser visualizado pelo criador, pelo responsável e pelos administradores. Tickets públicos podem ser visualizados por todos os membros do setor ou equipe relacionados.',
      },
      {
        question: 'Quem pode visualizar meus tickets?',
        answer:
          'Tickets criados por você podem ser visualizados por você, pelo responsável atribuído e, se público, pelos membros do setor. Tickets privados são restritos ao criador, responsável e administradores.',
      },
      {
        question: 'O que são tickets recebidos, criados e do setor?',
        answer:
          '<b>Recebidos</b>: tickets atribuídos a você. <br><b>Criados</b>: tickets que você abriu. <br><b>Do setor</b>: tickets do seu departamento, visíveis conforme permissões.',
      },
      {
        question: 'Como funciona o fluxo de um ticket?',
        answer:
          'O ticket passa por etapas: Pendente, Em Andamento, Em Verificação, Finalizado ou Rejeitado. Cada etapa tem ações específicas.',
      },
      {
        question: 'Posso anexar arquivos aos tickets?',
        answer:
          'Sim! É possível anexar arquivos de até 10MB nos formatos PDF, DOC, XLS, JPG e PNG.',
      },
      {
        question: 'Como defino a prioridade de um ticket?',
        answer:
          'Ao criar o ticket, selecione a prioridade: Baixa, Média, Alta ou Urgente. Cada uma tem um prazo padrão.',
      },
      {
        question: 'Como aprovo, rejeito ou solicito correção de um ticket?',
        answer:
          'Na tela de detalhes do ticket, utilize os botões de Aprovar, Rejeitar ou Corrigir conforme necessário.',
      },
      {
        question: 'Como vejo o histórico e comentários de um ticket?',
        answer:
          'Abra o ticket e acesse a aba de histórico para visualizar todas as ações realizadas e comentários registrados.',
      },
      {
        question: 'Quem pode comentar em um ticket?',
        answer:
          'O criador, o responsável e, dependendo das permissões, outros membros do setor podem comentar em tickets públicos.',
      },
      {
        question: 'Como saber se um ticket é privado ou público?',
        answer:
          'Na tela de detalhes do ticket, há um indicador de privacidade. Tickets privados exibem um ícone de cadeado.',
      },
      {
        question: 'Como funcionam os comentários em tickets?',
        answer:
          'Você pode comentar em tickets para registrar informações, dúvidas ou atualizações. O criador, o responsável e, em tickets públicos, membros do setor podem comentar. Todos os comentários ficam registrados no histórico do ticket.',
      },
      {
        question: 'Recebo notificações quando alguém comenta em um ticket?',
        answer:
          'Sim, todos os envolvidos no ticket recebem notificações quando um novo comentário é adicionado.',
      },
      {
        question: 'Quais são os status possíveis de um ticket?',
        answer:
          '<b>Pendente</b>: aguardando aceite do responsável.<br><b>Em Andamento</b>: sendo tratado.<br><b>Em Verificação</b>: aguardando aprovação do solicitante.<br><b>Finalizado</b>: ticket concluído.<br><b>Rejeitado</b>: ticket recusado pelo solicitante.<br><b>Arquivado</b>: ticket encerrado e guardado para consulta.',
      },
      {
        question: 'O que é a visualização Kanban?',
        answer:
          'A visualização Kanban exibe os tickets em colunas de acordo com o status (Pendente, Em Andamento, etc.), facilitando o acompanhamento do fluxo de trabalho. Os tickets mudam de coluna automaticamente conforme o status é alterado nas telas de detalhes ou ações do ticket. Não é possível arrastar manualmente entre as colunas.',
      },
      {
        question: 'Como acesso o Kanban?',
        answer:
          'Na página de tickets, clique no botão de alternância para mudar entre a visualização em tabela e Kanban.',
      },
    ],
  },
  {
    title: 'Notificações',
    icon: 'bell',
    faqs: [
      {
        question: 'Quais tipos de notificações existem?',
        answer:
          'Você recebe notificações para novos tickets, atualizações, aprovações, rejeições e solicitações de correção.',
      },
      {
        question: 'Como visualizo minhas notificações?',
        answer: 'Clique no ícone de sino no topo da tela para ver todas as notificações recentes.',
      },
      {
        question: 'Como marco notificações como lidas?',
        answer: 'Abra o painel de notificações e clique em cada uma para marcar como lida.',
      },
    ],
  },
  {
    title: 'Relatórios e Analytics',
    icon: 'chart-line',
    faqs: [
      {
        question: 'Como acesso relatórios?',
        answer: 'No menu lateral, clique em "Relatórios" para acessar gráficos e dados analíticos.',
      },
      {
        question: 'Como exporto relatórios?',
        answer:
          'Na tela de relatórios, clique em "Exportar" e escolha o formato desejado (PDF, XLS, CSV).',
      },
    ],
  },
  {
    title: 'Segurança e Privacidade',
    icon: 'lock',
    faqs: [
      {
        question: 'Meus dados estão seguros?',
        answer:
          'Sim, utilizamos criptografia, autenticação segura e backups diários para garantir a segurança das informações.',
      },
      {
        question: 'Quem tem acesso aos meus dados?',
        answer:
          'Apenas usuários autorizados da sua organização, conforme as permissões definidas pelo administrador.',
      },
    ],
  },
  {
    title: 'Suporte e Contato',
    icon: 'envelope',
    faqs: [
      {
        question: 'Como entro em contato com o suporte?',
        answer:
          'Clique no botão "Ajuda" no seu perfil ou envie um email para o suporte informado no rodapé do sistema.',
      },
      {
        question: 'Existe documentação para usuários?',
        answer: 'Sim, além desta FAQ, há um manual do usuário disponível na seção de documentação.',
      },
    ],
  },
]);

const searchTerm = ref('');
const openSections = ref<boolean[]>([]);

const filteredSections = computed(() => {
  return sections.value.map((section) => {
    let faqs = section.faqs;
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      faqs = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term),
      );
    }
    return { ...section, faqs };
  });
});

function handleAccordionToggle(idx: number, isOpen: boolean) {
  openSections.value[idx] = isOpen;
}

// Initialize all sections as closed
watch(
  filteredSections,
  (newVal) => {
    openSections.value = newVal.map(() => false);
  },
  { immediate: true },
);
</script>
