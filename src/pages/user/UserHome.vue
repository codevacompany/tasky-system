<!-- <script setup lang="ts"></script> -->

<template>
  <div id="novoTicketSection" class="user-section">
    <div class="welcome-card">
      <div class="plus-icon">
        <font-awesome-icon icon="plus-circle" size="3x"/>
      </div>
      <h2>Novo Ticket</h2>
      <p>Crie um novo ticket de suporte para sua solicitação</p>
    </div>

    <div class="novo-ticket-container">
      <div class="ticket-form-container">
        <form id="ticketForm">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Assunto:</label>
              <input type="text" id="nome" placeholder="Digite o assunto do ticket" required />
            </div>
            <div class="form-group">
              <label for="prioridade">Prioridade:</label>
              <select id="prioridade" required>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="setorDestino">Setor Destino:</label>
              <select id="setorDestino" required></select>
            </div>
            <div class="form-group">
              <label for="usuarioDestino">Usuário Destino:</label>
              <select id="usuarioDestino" required></select>
            </div>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" placeholder="Descreva o ticket" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="conclusao">Data de Conclusão:</label>
            <input type="datetime-local" id="conclusao" />
          </div>
          <div class="button-group">
            <button type="reset" class="btn-secondary">Limpar</button>
            <button type="submit" class="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
      <div class="ultimos-tickets-container">
        <div class="ultimos-tickets-header">
          <h2>Últimos Tickets Criados</h2>
        </div>
        <div class="ultimos-tickets-list">
          <!-- <div class="empty-state">
            <i class="fas fa-ticket-alt"></i>
            <p>Nenhum ticket criado ainda</p>
          </div> -->
          <!-- Os tickets serão inseridos aqui dinamicamente -->
          <!-- <div class="ticket-item" data-ticket-id="${ticket.id}">
            <div class="ticket-content">
              <div class="ticket-title">${ticket.name.toUpperCase()}</div>
              <div class="ticket-info">
                <span class="${prazoClass}"
                  >${targetUserName} → ${departmentName} | ${tempoRestante.text}</span
                >
              </div>
            </div>
            <div class="ticket-status">
              <span class="status-flag ${status.toLowerCase().replace(' ', '_')}">${status}</span>
            </div>
          </div> -->

          <div class="ticket-item" data-ticket-id="${ticket.id}">
            <div class="ticket-content">
              <div class="ticket-title">Teste</div>
              <div class="ticket-info">
                <span class="prazo-ok">Isaac Silva → Diretoria | 1d</span>
              </div>
            </div>
            <div class="ticket-status">
              <span class="status-flag em_andamento">Em andamento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// function criarTicketHTML(ticket) {
//   const tempoRestante = this.calcularTempoRestante(ticket.completionDate)
//   const targetUserName = ticket.targetUser ? ticket.targetUser.firstName : 'Não atribuído'
//   const departmentName = ticket.department ? ticket.department.name : 'Não definido'
//   const status = ticket.status || 'Pendente'
//   const prazoClass = tempoRestante.text === 'Atrasado' ? 'prazo-atrasado' : 'prazo-ok'

//   return `
//     <div class="ticket-item" data-ticket-id="${ticket.id}">
//       <div class="ticket-content">
//         <div class="ticket-title">${ticket.name.toUpperCase()}</div>
//         <div class="ticket-info">
//           <span class="${prazoClass}">${targetUserName} → ${departmentName} | ${tempoRestante.text}</span>
//         </div>
//       </div>
//       <div class="ticket-status">
//         <span class="status-flag ${status.toLowerCase().replace(' ', '_')}">${status}</span>
//       </div>
//     </div>
//   `
// }
</script>

<style scoped>
.plus-circle {
  color: #ebf0f4;
  font-size: 140px;
}

#novoTicketSection,
#meusTicketsSection {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

#novoTicketSection .card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 0;
  width: 100%;
  min-height: 200px;
}

#novoTicketSection .card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #2c3e50;
}

#novoTicketSection .card-header i {
  color: #2c3e50;
  font-size: 1.8rem;
}

#novoTicketSection .card-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.welcome-card {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 200px;
  max-width: 1400px;
}

.welcome-card i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.welcome-card h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.welcome-card p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.novo-ticket-container {
  display: flex;
  gap: 10px;
  padding: 20px;
  width: 100%;
}

.ticket-form-container {
  flex: 1;
  min-width: 300px;
  max-width: 1000px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.ultimos-tickets-container {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.ultimos-tickets-header {
  padding: 10px;
  border-bottom: 1px solid #e1e8ed;
}

.ultimos-tickets-header h2 {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.ultimos-tickets-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.ticket-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.ticket-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ticket-content {
  flex: 1;
  min-width: 0;
  padding-right: 8px;
  text-align: left;
}

.ticket-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-info {
  font-size: 0.75rem;
  color: #6c757d;
}

.ticket-info span {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ticket-info span.prazo-atrasado {
  color: #ef4444;
}

.ticket-info span.prazo-ok {
  color: #10b981;
}

.ticket-status {
  margin-left: 8px;
}

.status-flag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-flag.pendente {
  color: #f59e0b;
  background: #fef3c7;
}

.status-flag.em_andamento {
  color: #3b82f6;
  background: #eff6ff;
}

.status-flag.finalizado {
  color: #10b981;
  background: #dcfce7;
}

/* Estilos para prazo */
.prazo-col {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.prazo-atrasado {
  color: #ef4444;
}

.prazo-proximo {
  color: #f59e0b;
}

.prazo-ok {
  color: #10b981;
}

/* Limitar a quantidade de cartões visíveis */
.ultimos-tickets-list .ticket-item:nth-child(n + 6) {
  display: none;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .novo-ticket-container {
    grid-template-columns: 1fr;
  }

  .ultimos-tickets-container {
    max-width: 1200px;
  }
}
</style>
