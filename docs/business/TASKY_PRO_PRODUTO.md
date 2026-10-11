# Tasky Pro — Documentação do Produto

> **Nome do produto:** Tasky Pro  
> **Anteriormente:** Tasky System  
> **Tipo:** SaaS B2B de gestão de tarefas internas  
> **Público:** empresas brasileiras (cadastro com CNPJ)

---

## 1. O que é o Tasky Pro

O **Tasky Pro** é uma plataforma de **gestão inteligente de tarefas** para equipes internas. Ele organiza a criação, a delegação, o acompanhamento e a verificação do trabalho do dia a dia — com responsabilidades claras, prazos, histórico e indicadores de desempenho.

Diferente de uma lista de afazeres genérica, o Tasky Pro modela um **fluxo de accountability**:

1. Alguém **cria** a tarefa e define um ou mais responsáveis  
2. O responsável **aceita** e executa  
3. A tarefa vai para **verificação**  
4. Um **revisor** aprova, pede correção, reprova ou cancela  

Assim, o time sabe o que está pendente, o que está em andamento e o que já foi concluído com qualidade.

O produto oferece **14 dias de teste gratuito** (sem cartão) e é organizado por **empresa (tenant)**, com usuários, setores e categorias próprios.

---

## 2. Para quem é

| Perfil | Papel no produto | Uso típico |
|---|---|---|
| **Administrador** | Dono / admin da empresa | Configura usuários, setores, categorias, assinatura; vê tarefas gerais e relatórios |
| **Supervisor** | Líder de setor | Acompanha tarefas do setor, atua como revisor e consulta relatórios do departamento |
| **Usuário (colaborador)** | Executor | Recebe e cria tarefas, comenta, anexa arquivos e acompanha seu desempenho na Home |
| **Administrador global** | Operação Tasky | Gerencia clientes (empresas) e cadastros na plataforma |

---

## 3. Conceitos principais

### Tarefa
Unidade central do produto. Possui assunto, descrição rica, prioridade, responsáveis, categoria opcional, prazo opcional, anexos, checklist (subtarefas) e histórico de atividade.

### Prefixo da empresa (`customKey`)
No cadastro, a empresa define um prefixo de 2–3 letras. Toda tarefa recebe um ID legível no formato **`PREFIXO-número`** (ex.: `TS-042`), facilitando referência em conversas e relatórios.

### Responsável e revisor
- **Responsável(is):** quem executa (até 3 por tarefa, em ordem).  
- **Revisor:** quem valida o trabalho (pode ser o solicitante ou o supervisor do setor).

### Status do fluxo
A tarefa passa por estados como **Pendente**, **Em andamento**, **Aguardando verificação**, **Finalizado**, **Reprovado**, **Cancelado**, entre outros. O quadro Kanban reflete essas colunas.

### Setor (departamento)
Usuários pertencem a setores. Supervisores enxergam o trabalho do seu time; relatórios podem ser filtrados por setor.

### Rascunho
Tarefa **ainda não publicada**. Fica só com quem criou até a publicação — sem aparecer nos quadros da equipe nem gerar notificação. Útil para preparar o trabalho antes de delegar.

### Tag
Etiqueta do **catálogo da empresa** aplicada em várias tarefas (0..N). Complementa o status e a categoria sem mudar o fluxo do Kanban. Pode ter **escopo de sugestão** por setor (só ordena o picker; não restringe uso). Quem vê os detalhes da tarefa pode adicionar ou remover; a ação fica no histórico. Spec completa: `docs/TAGS_FEATURE_PLAN.md` (raiz do monorepo).

---

## 4. Principais funcionalidades

### 4.1 Início (Home)
Painel pessoal com visão rápida do trabalho:

- Contadores por status e indicadores individuais  
- Widgets **Precisa da sua ação** e **Atrasados**  
- Listas de **últimas tarefas recebidas** e **últimas tarefas criadas**  
- Score de desempenho (quando há volume suficiente de tarefas)

### 4.2 Tarefas
Centro operacional do produto:

- **Nova Tarefa:** formulário em etapas com descrição rica, prioridade, responsáveis, categoria, prazo, privacidade, revisor, checklist e anexos  
- **Visões:** tabela ou **Kanban**  
- **Abas:** Recebidas, Criadas por mim, Tarefas do setor; administradores também veem **Tarefas gerais**  
- **Detalhes da tarefa:** aceitar, enviar para verificação, aprovar/reprovar/corrigir, comentar com @menções, gerenciar anexos, checklist e **tags**  
- **Rascunhos:** salvar sem publicar; listar em *Tarefas em rascunho*; publicar ou excluir depois  
- **Arquivadas:** histórico de tarefas arquivadas  
- **Busca rápida** (atalho Ctrl+K)  
- Tarefas **privadas** com visibilidade restrita

### 4.3 Comunicação e anexos
- Comentários no histórico da tarefa (texto rico e menções)  
- Upload de arquivos vinculados à tarefa  
- Checklist / subtarefas com progresso visível

### 4.4 Notificações
- Sino in-app em tempo real  
- Preferências de notificação in-app e por e-mail  
- Opção de som para novos eventos

As notificações de atribuição/fluxo só ocorrem quando a tarefa está **publicada** (rascunhos não disparam alerta para a equipe).

### 4.5 Relatórios
Disponível para **Administrador** e **Supervisor**:

- Visão geral, em andamento, setores, colaboradores e tendências  
- Drill-down por setor e por colaborador  
- Exportação em **Excel** e **CSV**  
- Métricas como tempo de aceite e tempo de resolução

### 4.6 Administração da empresa
Para administradores do tenant:

- **Usuários** (ativar/desativar, papéis, setores)  
- **Setores**  
- **Categorias** de tarefa  
- **Tags** (catálogo da empresa, cor e sugestão por setor)  
- **Configurações da empresa** (dados cadastrais / faturamento)  
- **Assinatura** (plano, trial, limites de usuários, upgrade)

### 4.7 Cadastro e onboarding
- Formulário público com dados do responsável e **CNPJ**  
- Conclusão do cadastro: senha + prefixo da empresa  
- Aceite de termos e política de privacidade  
- Tutorial de boas-vindas  
- Trial de **14 dias**

---

## 5. Fluxo típico do dia a dia

```text
Criar tarefa (ou salvar rascunho → publicar)
        │
        ▼
Responsável recebe / aceita
        │
        ▼
Executa (comentários, anexos, checklist)
        │
        ▼
Envia para verificação
        │
        ▼
Revisor aprova ──► Finalizado
     ou pede correção / reprova / cancela
```

---

## 6. Diferenciais do produto

1. **Fluxo com verificação** — não basta “marcar como feito”; há etapa de revisão.  
2. **IDs com prefixo da empresa** — referência clara entre times (`TS-001`).  
3. **Organização por setor** — supervisores acompanham o departamento sem misturar tudo.  
4. **Rascunhos** — preparar a tarefa sem notificar ninguém até publicar.  
5. **Múltiplos responsáveis** — até três pessoas na mesma tarefa, com ordem.  
6. **Relatórios e desempenho** — aceite, resolução e visão por colaborador/setor.  
7. **Privacidade por tarefa** — controle extra de quem vê o conteúdo.

---

## 7. O que o produto não é (hoje)

Para evitar expectativa errada:

- Não é um chat geral da empresa (a colaboração acontece **na tarefa**)  
- Não é um construtor livre de fluxos customizados (o fluxo padrão de status é o eixo do produto)  
- Rascunhos ainda não têm publicação agendada, compartilhamento em equipe nem calendário de planejamento (ver `DRAFT_TICKETS_NEXT_STEPS.md`)  
- Exportação de relatórios é Excel/CSV; não há PDF de relatórios na aplicação

---

## 8. Estrutura técnica (referência)

| Parte | Repositório / pasta | Função |
|---|---|---|
| Aplicação web | `tasky-system` | Interface Vue (usuário e admin) |
| API | `tasky-api` | Backend NestJS + Postgres |
| Site institucional | `tasky-landing` | Marketing e páginas legais |

---

## 9. Documentos relacionados

- [`DRAFT_TICKETS_NEXT_STEPS.md`](./DRAFT_TICKETS_NEXT_STEPS.md) — evolução futura dos rascunhos  
- `tasky-system/docs/user/README.md` — documentação voltada ao usuário (se disponível)  
- `tasky-system/docs/business/README.md` — notas de negócio  
- Site: [taskypro.com.br](https://taskypro.com.br/)
