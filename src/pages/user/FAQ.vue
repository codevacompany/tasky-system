<template>
  <section class="w-full mx-auto py-8 px-4 sm:py-6 sm:px-6">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">FAQ</h1>
      <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
        Encontre respostas para as dúvidas mais comuns sobre o uso do Tasky Pro.
      </p>
    </div>

    <!-- Search -->
    <div class="flex items-center relative w-full max-w-md mx-auto mb-10">
      <Input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar pergunta..."
        class="w-full py-3 pr-12 pl-4 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent"
      />
      <font-awesome-icon
        icon="search"
        class="absolute right-4 text-gray-400 dark:text-gray-500 text-lg pointer-events-none"
      />
    </div>

    <!-- Main container using grid to ensure absolute centering of FAQ -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,768px)_1fr] gap-x-12 px-4 sm:px-6">
      <!-- Sidebar Column (hidden on mobile/tablet) -->
      <aside class="hidden lg:block relative">
        <div
          class="sticky top-24 w-56 ml-auto bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
          style="max-height: calc(100vh - 120px); overflow-y: auto"
        >
          <nav>
            <h3
              class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-3"
            >
              Seções
            </h3>
            <ul class="space-y-1">
              <li v-for="section in sections" :key="section.slug">
                <a
                  :href="'#' + section.slug"
                  class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-150"
                  :class="
                    activeSection === section.slug
                      ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  "
                  @click.prevent="scrollToSection(section.slug)"
                >
                  <font-awesome-icon
                    :icon="section.icon"
                    class="w-4 text-gray-400 dark:text-gray-500"
                  />
                  <span class="truncate">{{ section.title }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- FAQ Content Column (Always Centered) -->
      <div class="space-y-10 w-full mx-auto">
        <div
          v-for="section in filteredSections"
          :key="section.title"
          :id="section.slug"
          v-show="section.faqs.length > 0"
        >
          <!-- Section Title -->
          <div class="flex items-center gap-3 mb-4">
            <font-awesome-icon
              :icon="section.icon"
              class="text-gray-400 dark:text-gray-500 text-base"
            />
            <h2 class="text-xl font-semibold text-secondary dark:text-gray-100">
              {{ section.title }}
            </h2>
          </div>

          <!-- Questions -->
          <div class="space-y-3">
            <FaqAccordion
              v-for="faq in section.faqs"
              :key="faq.question"
              :question="faq.question"
              :answer="faq.answer"
            />
          </div>
        </div>

        <!-- No results -->
        <div
          v-if="filteredSections.every((section) => section.faqs.length === 0)"
          class="text-center text-gray-500 dark:text-gray-400 py-12 text-base flex flex-col items-center gap-3"
        >
          <font-awesome-icon icon="search" class="text-3xl text-gray-300 dark:text-gray-600" />
          <span>Nenhuma resposta encontrada para "{{ searchTerm }}"</span>
        </div>
      </div>

      <!-- Right Spacer Column (Important for keeping FAQ centered) -->
      <div class="hidden lg:block"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import FaqAccordion from '@/components/faq/FaqAccordion.vue';
import Input from '@/components/common/Input.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const sections = ref([
  {
    title: 'Sobre o Sistema',
    slug: 'sobre-o-sistema',
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
    slug: 'acesso-e-conta',
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
    slug: 'tarefas',
    icon: 'tasks',
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
    slug: 'funcoes-de-colaboradores',
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
          '<ul style="margin:0;padding-left:1.2em;list-style-type:disc;list-style-position:outside;"><li>Pode criar e receber tarefas.</li><li>Pode ver todas as tarefas da empresa, incluindo as tarefas privadas.</li><li>Pode ser escolhido como revisor de tarefas que um colaborador criar para si próprio caso o setor não possua um Supervisor.</li><li>Tem acesso a relatórios gerais, estatísticas por setor e por colaborador.</li></ul>',
      },
    ],
  },
  {
    title: 'Notificações',
    slug: 'notificacoes',
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
    slug: 'relatorios-e-analytics',
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
    ],
  },
  {
    title: 'Métricas de Desempenho',
    slug: 'metricas-de-desempenho',
    icon: 'star',
    faqs: [
      {
        question: 'Como é calculado o meu Score de Desempenho?',
        answer:
          'O Score de Desempenho é uma métrica composta equilibrada que avalia quatro pilares fundamentais: <br>1. <b>Entrega no Prazo (40%)</b>: Baseado no cumprimento dos prazos finais.<br>2. <b>Qualidade da Entrega (30%)</b>: Avalia se as tarefas são aceitas sem precisar retornar para ajustes.<br>3. <b>Aprovação do Trabalho (15%)</b>: Percentual de tarefas finalizadas com sucesso.<br>4. <b>Verificação no Prazo (15%)</b>: Para revisores, mede a agilidade na análise de tarefas em até 24h úteis.',
      },
      {
        question: 'O que acontece se eu retirar uma tarefa da verificação?',
        answer:
          'Se você enviou uma tarefa para verificação e depois a moveu de volta para "Em Andamento" (retração), o que contará para sua métrica de "Entrega no Prazo" será a data do seu último envio definitivo para a verificação.',
      },
      {
        question: 'Como funciona o prazo de 24 horas para verificação?',
        answer:
          'O sistema monitora o tempo entre a entrada da tarefa no status "Aguardando Verificação" e a conclusão da análise pelo revisor. Para manter um score alto, essa análise deve ser feita em até 24 horas úteis. O tempo é pausado em finais de semana.',
      },
      {
        question: 'Qual a diferença entre Tempo de Aceite e Tempo de Resolução?',
        answer:
          '<b>Tempo de Aceite</b>: Tempo desde a criação/atribuição da tarefa até o momento em que você a aceita (status "Em Andamento").<br><b>Tempo de Resolução</b>: Tempo líquido em que você trabalhou efetivamente na tarefa (status "Em Andamento"). Ciclos em que a tarefa está aguardando verificação por outra pessoa não contam contra seu tempo de resolução, assim como o tempo que outro colaborador está trabalhando em uma tarefa em grupo também não contam para você.',
      },
      {
        question: 'Uma tarefa devolvida afeta meu score?',
        answer:
          'Sim. Tarefas que retornam para correção impactam o índice de <b>Qualidade da Entrega</b> (com peso de 30% no score final). Isso incentiva que o trabalho seja entregue revisado e completo na primeira tentativa, reduzindo ciclos de retrabalho.',
      },
      {
        question: 'Os tempos de aceite e resolução afetam meu score?',
        answer:
          'Não. Os tempos de aceite e resolução servem apenas para fins de análise e como critério de desempate entre colaboradores ou setores.',
      },
      {
        question: 'Preciso ter os menores tempos de aceite e resolução possíveis?',
        answer:
          'Não necessariamente. É mais importante que você entregue tarefas com qualidade e no prazo. Não aceite tarefas que ainda não pode começar a fazer pois isso impactará no seu tempo de resolução, já que o tempo começa a contar a partir do momento em que aceita a tarefa. Também não se preocupe em terminar tarefas rápido demais, pois o mais importante é que a entrega seja feita com qualidade e esteja dentro do prazo.',
      },
      {
        question: 'Por que meu score parece baixo se eu fiz tudo certo?',
        answer:
          'Se você tem poucas tarefas concluídas, o sistema aplica o <b>Wilson Score</b>. Este método estatístico é "cauteloso" com volumes pequenos de dados para evitar que uma única tarefa bem-sucedida dê 100% de pontuação. Conforme você aumenta seu volume de entregas mantendo a qualidade, o score subirá de forma consistente e estável.',
      },
    ],
  },
  {
    title: 'Segurança e Privacidade',
    slug: 'seguranca-e-privacidade',
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
    slug: 'suporte-e-contato',
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
const activeSection = ref('');

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

const scrollToSection = (slug: string) => {
  const el = document.getElementById(slug);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    activeSection.value = slug;
  }
};

const updateActiveSection = () => {
  const scrollPosition = window.scrollY + 150;
  for (const section of sections.value) {
    const el = document.getElementById(section.slug);
    if (el) {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollPosition >= top && scrollPosition < bottom) {
        activeSection.value = section.slug;
        return;
      }
    }
  }
};

onMounted(() => {
  if (route.hash) {
    const slug = route.hash.replace('#', '');
    activeSection.value = slug;
    const el = document.querySelector(route.hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  } else if (sections.value.length > 0) {
    activeSection.value = sections.value[0].slug;
  }

  window.addEventListener('scroll', updateActiveSection);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection);
});
</script>
