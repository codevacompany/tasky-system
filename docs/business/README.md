# Documentação de Negócio

## 📋 Fluxos de Trabalho

### 🎟️ Criação do Ticket

1. **Ação**: Solicitante cria o ticket
2. **Condições**:
   - Solicitante pode ou não definir data de conclusão (prazo)
   - Se definido, o prazo não pode ser alterado
   - Se o solicitante definiu a data de conclusão, ela é registrada como data prevista
3. **Status Inicial**: PENDENTE
4. **Destino**: Ticket vai para a Caixa de Entrada do Receptor

### 📥 Recepção do Ticket

1. **Ação**: Receptor visualiza ticket e clica em ACEITAR
2. **Condições**:
   - Se ticket já tem prazo definido → prazo começa a contar
   - Se não tem prazo definido → receptor deve definir o prazo ao aceitar
3. **Ações**:
   - Registrar data prevista
   - Status muda para: EM ANDAMENTO
   - Botão muda para: ENVIAR PARA VERIFICAÇÃO

### 📤 Envio para Verificação

1. **Ação**: Receptor clica em ENVIAR PARA VERIFICAÇÃO
2. **Resultados**:
   - Status muda para: EM VERIFICAÇÃO
   - Botão some
   - Ícone de ampulheta aparece → aguardando verificação do solicitante

### 🔍 Verificação pelo Solicitante

1. **Ação**: Solicitante vê o botão VERIFICAR nos tickets criados por ele
2. **Interface**:
   - Ao clicar, abre-se o modal do ticket com dois botões:
     - APROVAR
     - REJEITAR

### ✅ Aprovação

1. **Ação**: Solicitante clica em APROVAR
2. **Resultados**:
   - Registra data de conclusão
   - Envia notificação ao receptor
   - Ícone de ampulheta é substituído por ícone de aprovação

### ❌ Rejeição

1. **Ação**: Solicitante clica em REJEITAR
2. **Condição**: Solicitante precisa preencher um motivo da rejeição
3. **Resultados**:
   - Motivo é registrado nas atualizações do ticket
   - Ticket volta a ficar disponível para o receptor
   - Ampulheta some e botão REVISAR aparece
4. **Ao clicar em REVISAR**:
   - Status volta para EM ANDAMENTO
   - Botão ENVIAR PARA VERIFICAÇÃO aparece novamente

## 📊 Regras de Negócio

### Prioridades

- **Baixa**: Tickets sem urgência, prazo flexível
- **Média**: Tickets com prazo definido, mas sem urgência crítica
- **Alta**: Tickets urgentes, com prazo curto

### Prazos

- Prazos podem ser definidos pelo solicitante ou receptor
- Uma vez definido, o prazo não pode ser alterado
- Tickets sem prazo definido devem ter prazo definido na aceitação

### Permissões

- **Solicitante**:
  - Criar tickets
  - Verificar tickets criados
  - Aprovar/rejeitar tickets
  - Visualizar histórico

- **Receptor**:
  - Aceitar tickets
  - Definir prazos
  - Enviar para verificação
  - Revisar tickets rejeitados

### Notificações

- Notificações são enviadas para:
  - Criação de ticket
  - Aceitação de ticket
  - Envio para verificação
  - Aprovação/rejeição
  - Revisão de ticket

## 📈 Métricas e SLAs

### Tempo de Resposta

- **Alta Prioridade**: 24 horas
- **Média Prioridade**: 48 horas
- **Baixa Prioridade**: 72 horas

### Taxa de Resolução

- Meta: 90% dos tickets resolvidos dentro do prazo
- Monitoramento diário de tickets atrasados

### Satisfação do Usuário

- Pesquisa de satisfação após resolução
- Meta: 85% de satisfação 