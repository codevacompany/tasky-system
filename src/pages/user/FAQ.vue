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
      Encontre respostas para as dúvidas mais comuns sobre o uso do Tasky Pro.
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

    <!-- <ChatSupportButton /> -->
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
        question: 'O que é o Tasky Pro?',
        answer:
          'O Tasky Pro é uma plataforma web completa para gestão de tarefas, desenvolvida para facilitar a comunicação, o acompanhamento e a resolução de demandas entre equipes e setores de uma organização. Com o Tasky, você centraliza solicitações, padroniza processos e garante mais agilidade e transparência no dia a dia.',
      },
      {
        question: 'Quais são as principais funcionalidades do Tasky?',
        answer:
          '<ul style="margin:0;padding-left:1.2em;list-style-type:disc;list-style-position:outside;"><li><b>Gestão de tarefas:</b> criação, acompanhamento, histórico e comentários.</li><li><b>Notificações automáticas:</b> mantenha-se informado sobre atualizações e prazos.</li><li><b>Controle de prioridades e prazos:</b> defina o que é mais urgente e acompanhe o andamento.</li><li><b>Permissões e perfis:</b> acesso personalizado para cada usuário.</li><li><b>Relatórios e dashboards:</b> visualize métricas, produtividade e gargalos.</li><li><b>Fluxo de aprovação:</b> tarefas podem passar por etapas de verificação e aprovação.</li></ul>',
      },
      {
        question: 'Como o Tasky Pro pode melhorar o fluxo de trabalho da minha equipe?',
        answer:
          'O Tasky Pro centraliza todas as demandas em um só lugar, reduz retrabalho, evita perda de informações e facilita o acompanhamento de cada etapa da tarefa. Isso aumenta a transparência, melhora a comunicação entre setores e acelera a resolução de tarefas, tornando sua equipe mais produtiva e organizada.',
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
        question: 'Como saio do sistema?',
        answer: 'Clique em "Sair" no menu do seu perfil.',
      },
    ],
  },
  {
    title: 'Tarefas',
    icon: 'ticket',
    faqs: [
      {
        question: 'Como crio uma nova tarefa?',
        answer:
          'Clique em "Nova Tarefa" no menu, preencha os campos obrigatórios e clique em "Criar".',
      },
      {
        question: 'Qual a diferença entre tarefa privada e pública?',
        answer:
          'Uma tarefa privada só pode ser visualizada pelo criador, pelo responsável e pelos administradores. Tarefas públicas podem ser visualizadas por todos os membros do setor relacionado.',
      },
      {
        question: 'Quem pode visualizar minhas tarefas?',
        answer:
          'Tarefas criadas por você podem ser visualizadas por você, pelo responsável atribuído e, se pública, pelos membros do setor. Tarefas privadas são restritas ao criador, responsável e administradores.',
      },
      {
        question: 'O que são tarefas recebidas, criadas e do setor?',
        answer:
          '<b>Recebidas</b>: tarefas atribuídas a você. <br><b>Criadas</b>: tarefas que você abriu. <br><b>Do setor</b>: tarefas do seu setor, visíveis conforme permissões.',
      },
      {
        question: 'Como funciona o fluxo de uma tarefa?',
        answer:
          'A tarefa passa por etapas: Pendente, Em Andamento, Em Verificação, Finalizado ou Rejeitado. Cada etapa tem ações específicas.',
      },
      {
        question: 'Posso anexar arquivos às tarefas?',
        answer:
          'Sim! É possível anexar arquivos de até 10MB nos formatos PDF, DOC, XLS, JPG e PNG.',
      },
      {
        question: 'Como defino a prioridade de uma tarefa?',
        answer: 'Ao criar a tarefa, selecione a prioridade: Baixa, Média ou Alta.',
      },
      {
        question: 'Como aprovo, reprovo ou solicito correção de uma tarefa?',
        answer:
          'Na tela de detalhes da tarefa, utilize os botões de Aprovar, Reprovar ou Corrigir conforme necessário.',
      },
      {
        question: 'Quem pode comentar em uma tarefa?',
        answer:
          'O criador, o responsável e outros membros do setor podem comentar em tarefas públicas enquanto estiverem em andamento.',
      },
      {
        question: 'Como saber se uma tarefa é privada ou pública?',
        answer:
          'Na tela de detalhes da tarefa, há um indicador de privacidade. Tarefas privadas exibem um ícone de cadeado.',
      },
      {
        question: 'Recebo notificações quando alguém comenta em uma tarefa?',
        answer:
          'Sim, todos os envolvidos na tarefa recebem notificações quando um novo comentário é adicionado.',
      },
      {
        question: 'Quais são os status possíveis de uma tarefa?',
        answer:
          '<p>Por padrão, uma tarefa pode ter os seguintes status:</p><b>Pendente</b>: aguardando aceite do responsável.<br><b>Em Andamento</b>: sendo tratada.<br><b>Em Verificação</b>: aguardando aprovação do solicitante.<br><b>Finalizado</b>: tarefa concluída.<br><b>Rejeitado</b>: tarefa recusada pelo solicitante.<br><b>Arquivado</b>: tarefa encerrada e guardada para consulta.',
      },
      {
        question: 'Após quantos dias uma tarefa é arquivada automaticamente?',
        answer:
          'Tarefas com status "Finalizado" são arquivadas automaticamente após 7 dias da data de conclusão. Tarefas com status "Rejeitado" ou "Cancelado" são arquivadas imediatamente.',
      },
      {
        question: 'Os prazos são obrigatórios?',
        answer:
          'Ao criar uma tarefa, o solicitante pode definir um prazo opcionalmente. Se o solicitante definir um prazo, ele não pode ser alterado posteriormente. Se a tarefa não tiver prazo definido pelo solicitante, o responsável que aceitar a tarefa DEVE definir um prazo obrigatoriamente no momento da aceitação. Isso garante que todas as tarefas em andamento tenham uma data estimada de conclusão para melhor controle e acompanhamento.',
      },
      {
        question: 'Como funciona uma tarefa com múltiplos responsáveis ou setores?',
        answer:
          'Ao criar uma tarefa, você pode atribuir múltiplos responsáveis em uma ordem específica. A tarefa será encaminhada sequencialmente: apenas um responsável trabalha por vez. Quando o responsável atual concluir seu trabalho, ele pode usar o botão "Enviar Para Próximo Setor" para passar a tarefa para o próximo responsável na ordem definida. Todos os responsáveis atribuídos podem visualizar a tarefa, mas apenas o responsável atual pode trabalhar nela. Membros dos setores dos responsáveis também podem visualizar tarefas públicas relacionadas aos seus setores.',
      },
      {
        question: 'O que é a visualização Kanban?',
        answer:
          'A visualização Kanban exibe as tarefas em colunas de acordo com o status (Pendente, Em Andamento, etc.), facilitando o acompanhamento do fluxo de trabalho. As tarefas mudam de coluna automaticamente conforme o status é alterado nas telas de detalhes ou ações da tarefa. Não é possível arrastar manualmente entre as colunas.',
      },
      {
        question: 'Como acesso o Kanban?',
        answer:
          'Na página de tarefas, clique no botão de alternância para mudar entre a visualização em tabela e Kanban.',
      },
    ],
  },
  {
    title: 'Funções de Colaboradores',
    icon: 'users',
    faqs: [
      {
        question: 'Quais são as permissões da função "Usuário"?',
        answer:
          '<ul style="margin:0;padding-left:1.2em;list-style-type:disc;list-style-position:outside;"><li>Pode criar e receber tarefas.</li><li>Pode ver tarefas do seu setor.</li><li>Tem acesso a suas estatísticas pessoais na home page.</li></ul>',
      },
      {
        question: 'Quais são as permissões da função "Supervisor"?',
        answer:
          '<ul style="margin:0;padding-left:1.2em;list-style-type:disc;list-style-position:outside;"><li>Pode criar e receber tarefas.</li><li>Pode ver todas as tarefas do seu setor.</li><li>Pode ver as tarefas privadas do seu setor na lista de tarefas mas não pode abri-las.</li><li>Tem acesso a relatórios do seu setor.</li><li>É responsável por revisar tarefas que um colaborador do seu setor criou para si próprio.</li></ul>',
      },
      {
        question: 'Quais são as permissões da função "Administrador"?',
        answer:
          '<ul style="margin:0;padding-left:1.2em;list-style-type:disc;list-style-position:outside;"><li>Pode criar e receber tarefas.</li><li>Pode ver todas as tarefas da empresa, incluindo as tarefas privadas.</li><li>Pode ser escolhido como revisor de tarefas que um colaborador criar para si próprio caso o setor não possua um Supervisor.</li><li>Tem acesso a relatórios gerais, estatísticaspor setor e por colaborador.</li></ul>',
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
          'Você recebe notificações para novas tarefas, atualizações, aprovações, rejeições e solicitações de correção.',
      },
      {
        question: 'Como visualizo minhas notificações?',
        answer: 'Clique no ícone de sino no topo da tela para ver todas as notificações recentes.',
      },
      {
        question: 'Como marco notificações como lidas?',
        answer:
          'Abra o painel de notificações e clique em cada uma para marcar como lida ou clique em "Marcar todas como lidas".',
      },
    ],
  },
  {
    title: 'Relatórios e Analytics',
    icon: 'chart-line',
    faqs: [
      {
        question: 'Como acesso relatórios?',
        answer:
          'No menu superior, clique em "Relatórios" para acessar gráficos e dados analíticos.',
      },
      {
        question: 'Como exporto relatórios?',
        answer:
          'Na tela de relatórios, clique em "Exportar" e escolha o formato desejado (XLSX, CSV).',
      },
      {
        question: 'O que é o % de Desempenho e como é calculado?',
        answer:
          'O % de Desempenho é uma métrica que avalia a performance de colaboradores e setores considerando tanto a taxa de resolução quanto o volume de tarefas. Ele é calculado usando o método estatístico Wilson Score, que ajusta a taxa de resolução (tarefas resolvidas / total de tarefas) considerando a confiabilidade estatística baseada no número de tarefas. Isso significa que um colaborador com 100% de resolução em apenas 1 tarefa terá um desempenho menor que outro com 70% de resolução em 100 tarefas, pois o segundo tem mais dados que comprovam sua performance. O método garante que rankings sejam mais justos e confiáveis, dando maior peso a performances com maior volume de dados.',
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
          'Sim, utilizamos autenticação segura e backups diários para garantir a segurança das informações.',
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
          'Clique no botão "Ajuda" no seu perfil ou envie um email para contato@taskypro.com.br.',
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
