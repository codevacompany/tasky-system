# Documentação Técnica

## 📚 Arquitetura do Sistema

### Estrutura de Diretórios

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes Vue reutilizáveis
│   ├── common/     # Componentes comuns
│   ├── tickets/    # Componentes específicos de tickets
│   ├── users/      # Componentes específicos de usuários
│   ├── categories/ # Componentes específicos de categorias
│   ├── departments/# Componentes específicos de setores
│   └── layout/     # Componentes de layout
├── composables/    # Composables Vue
├── models/         # Modelos de dados e interfaces
├── pages/          # Páginas da aplicação
├── router/         # Configuração de rotas
├── services/       # Serviços de API
├── stores/         # Stores Pinia
├── types/          # Definições de tipos TypeScript
├── utils/          # Funções utilitárias
└── views/          # Views da aplicação
```

### Modelos de Dados

#### Ticket
```typescript
interface Ticket {
  id: number;
  name: string;
  priority: TicketPriority;
  description: string;
  department: Department;
  requester: User;
  targetUser: User;
  status: TicketStatus;
  completionDate?: string;
  acceptanceDate?: string;
  category?: Category;
  updates: TicketUpdate[];
  disapprovalReason?: string;
  createdAt: string;
}
```

#### Status do Ticket
```typescript
enum TicketStatus {
  Pending = 'Pendente',
  InProgress = 'Em andamento',
  AwaitingVerification = 'Aguardando verificação',
  Overdue = 'Atrasado',
  Completed = 'Finalizado',
  Returned = 'Devolvido',
  Rejected = 'Reprovado',
}
```

### Serviços

#### TicketService
```typescript
const ticketService = {
  create(data: CreateTicketDto): Promise<AxiosResponse<Ticket>>,
  fetch(): Promise<AxiosResponse<Ticket[]>>,
  getById(id: number): Promise<AxiosResponse<Ticket>>,
  getByDepartment(departmentId: number): Promise<AxiosResponse<Ticket[]>>,
  getByRequester(requesterId: number): Promise<AxiosResponse<Ticket[]>>,
  getByTargetUser(targetUserId: number): Promise<AxiosResponse<Ticket[]>>,
  update(id: number): Promise<AxiosResponse<Ticket>>,
}
```

### Componentes Principais

#### NewTicketModal
- Responsável pela criação de novos tickets
- Permite definir prioridade, setor, usuário alvo e data de conclusão
- Validação de campos obrigatórios

#### TicketTable
- Exibe lista de tickets em formato tabular
- Suporta filtros e busca
- Permite visualização detalhada de tickets

#### TicketDetailsModal
- Exibe detalhes completos do ticket
- Mostra histórico de atualizações
- Permite ações específicas baseadas no status

### Rotas

```typescript
const routes = [
  // Rotas Públicas
  { path: '/login', component: LoginPage },

  // Painel do Usuário
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'meus-tickets', component: TicketsPage },
    ],
  },

  // Painel Administrativo
  {
    path: '/admin',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'relatorios', component: ReportsPage },
      { path: 'usuarios', component: UserList },
      { path: 'setores', component: DepartmentList },
      { path: 'categorias', component: CategoryList },
    ],
  },
];
```

### Gerenciamento de Estado

O sistema utiliza Pinia para gerenciamento de estado, com stores para:
- Autenticação
- Usuários
- Tickets
- Setores
- Categorias

### API

A aplicação se comunica com uma API RESTful, utilizando Axios para as requisições HTTP. Todas as chamadas à API são centralizadas nos serviços correspondentes.

### Segurança

- Autenticação baseada em token JWT
- Proteção de rotas baseada em roles
- Validação de dados no frontend
- Sanitização de inputs

### Performance

- Lazy loading de componentes
- Code splitting
- Caching de dados
- Otimização de assets

### Testes

- Testes unitários com Vitest
- Testes de componentes com Vue Test Utils
- Testes de integração 