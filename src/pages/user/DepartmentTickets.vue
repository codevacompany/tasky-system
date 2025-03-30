<template>
  <div id="ticketsCreatedSection">
    <TitleCard
      title="Tickets do Setor"
      subtitle="Visualize e gerencie os tickets do seu setor"
      icon="building"
    />

    <!-- <div class="tickets-summary">
      <div class="summary-item">
        <i class="fas fa-ticket-alt"></i>
        <div class="summary-info">
          <span class="stat-number">0</span>
          <span class="stat-label">Total</span>
        </div>
      </div>
      <div class="summary-item">
        <i class="fas fa-clock"></i>
        <div class="summary-info">
          <span class="stat-number">0</span>
          <span class="stat-label">Pendentes</span>
        </div>
      </div>
      <div class="summary-item">
        <i class="fas fa-sync-alt"></i>
        <div class="summary-info">
          <span class="stat-number">0</span>
          <span class="stat-label">Em Andamento</span>
        </div>
      </div>
      <div class="summary-item">
        <i class="fas fa-check-circle"></i>
        <div class="summary-info">
          <span class="stat-number">0</span>
          <span class="stat-label">Resolvidos</span>
        </div>
      </div>
    </div> -->

    <div class="table-container">
      <table id="ticketsRecebidosTable">
        <thead>
          <tr>
            <th><i class="fas fa-hashtag"></i>ID</th>
            <th><i class="fas fa-ticket-alt"></i>Assunto</th>
            <th><i class="fas fa-exclamation-circle"></i>Prioridade</th>
            <th><i class="fas fa-tag"></i>Status</th>
            <th><i class="fas fa-user"></i>Solicitante</th>
            <th><i class="fas fa-calendar-alt"></i>Criação</th>
            <th><i class="fas fa-calendar-check"></i>Conclusão</th>
            <th><i class="fas fa-clock"></i>Prazo</th>
            <th><i class="fas fa-cog"></i>Ações</th>
          </tr>
          <!-- <tr>
            <td colspan="7" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Nenhum ticket encontrado</p>
            </td>
          </tr> -->
          <tr>
            <td class="col-id">14</td>
            <td class="col-titulo titulo-col">Negociar aumento dos devs</td>
            <td class="col-prioridade">
              <span class="priority-flag alta">Alta</span>
            </td>
            <td class="col-status">
              <span class="status-flag em_andamento">Em Andamento</span>
            </td>
            <td class="col-solicitante">Junior<br /><small>RH</small></td>
            <td class="col-criacao">25/03/2025 21:49</td>
            <td class="col-conclusao">01/04/2025 07:30</td>
            <td class="col-prazo">4d</td>
            <td class="col-acoes">Revisar</td>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleCard from '@/components/common/TitleCard.vue';

// function getTicketRowHTML(ticket) {
//   const departmentName = ticket.department ? ticket.department.name : '-'
//   const requesterName = ticket.requester ? ticket.requester.firstName : ticket.solicitante || '-'
//   const isAccepted = ticket.status === 'Em andamento' || ticket.status === 'Finalizado'
//   const currentSection = document.querySelector('.user-section[style*="display: block"]')?.id

//   let actionButton = ''

//   // Se for seção de tickets recebidos
//   if (currentSection === 'ticketsRecebidosSection') {
//     if (isAccepted) {
//       actionButton = `<button class="action-btn revisar" onclick="chamadosSystem.showTicketDetails(${ticket.id})">
//           Revisar
//         </button>`
//     } else {
//       actionButton = `<button class="action-btn aceitar" onclick="chamadosSystem.aceitarTicket(${ticket.id})">
//           Aceitar
//         </button>`
//     }
//   }
//   // Se for seção de tickets criados ou do setor
//   else if (currentSection === 'ticketsCriadosSection' || currentSection === 'ticketsSetorSection') {
//     actionButton = `<button class="action-btn revisar" onclick="chamadosSystem.showTicketDetails(${ticket.id})">
//         Revisar
//       </button>`
//   }

//   return `
//       <tr>
//         <td class="col-id">${ticket.id}</td>
//         <td class="col-titulo titulo-col">${ticket.title || ticket.name}</td>
//         <td class="col-prioridade">
//           <span class="priority-flag ${ticket.priority.toLowerCase()}">${ticket.priority}</span>
//         </td>
//         <td class="col-status">
//           <span class="status-flag ${ticket.status.toLowerCase().replace(' ', '_')}">${ticket.status}</span>
//         </td>
//         <td class="col-solicitante">${requesterName}<br/><small>${departmentName}</small></td>
//         <td class="col-criacao">${this.formatarData(ticket.createdAt)}</td>
//         <td class="col-conclusao">${ticket.completionDate ? this.formatarData(ticket.completionDate) : '-'}</td>
//         <td class="col-prazo">${this.formatarPrazo(ticket.deadline || ticket.completionDate)}</td>
//         <td class="col-acoes">
//           ${actionButton}
//         </td>
//       </tr>
//     `
// }
</script>

<style scoped>
#ticketsCreatedSection {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.tickets-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-item {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-item i {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
}

.summary-item:nth-child(1) i {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.summary-item:nth-child(2) i {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.summary-item:nth-child(3) i {
  background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
}

.summary-item:nth-child(4) i {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
  padding: 0;
}

#ticketsRecebidosTable,
#ticketsCriadosTable,
#ticketsSetor {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  margin: 0;
  background: white;
}

#ticketsRecebidosTable th,
#ticketsCriadosTable th,
#ticketsSetor th {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 500;
  text-align: center;
  padding: 1rem;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
}

#ticketsRecebidosTable td,
#ticketsCriadosTable td,
#ticketsSetor td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  background: white;
  text-align: center;
  vertical-align: middle;
}

#ticketsRecebidosTable tr:hover td,
#ticketsCriadosTable tr:hover td,
#ticketsSetor tr:hover td {
  background: #f8fafc;
}

/* Larguras das colunas */
.col-id {
  width: 5%;
  text-align: center;
}

.col-titulo {
  width: 25%;
  text-align: left;
}

.col-prioridade {
  width: 10%;
  text-align: center;
}

.col-status {
  width: 8%;
  text-align: center;
}

.col-solicitante {
  width: 10%;
  text-align: center;
}

.col-criacao {
  width: 12%;
  text-align: center;
}

.col-conclusao {
  width: 12%;
  text-align: center;
}

.col-prazo {
  width: 8%;
  text-align: center;
}

.col-acoes {
  width: 85px;
  max-width: 85px;
  text-align: center;
  padding: 4px;
}

.priority-flag,
.status-flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 10px;
  width: fit-content;
  margin: 0 auto;
}

.priority-flag.alta {
  color: #ef4444;
  background: #fee2e2;
}

.priority-flag.media {
  color: #f59e0b;
  background: #fef3c7;
}

.priority-flag.baixa {
  color: #10b981;
  background: #dcfce7;
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

@media (max-width: 1024px) {
  .table-container {
    margin: 1rem -1rem;
    border-radius: 0;
  }

  #ticketsRecebidosTable th,
  #ticketsCriadosTable th,
  #ticketsSetor th,
  #ticketsRecebidosTable td,
  #ticketsCriadosTable td,
  #ticketsSetor td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
    padding: 0.5rem;
    margin: 5px;
  }

  #ticketsRecebidosTable,
  #ticketsCriadosTable,
  #ticketsSetor {
    min-width: 900px;
  }
}

@media (max-width: 1024px) {
  .tickets-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-container {
    padding: 1rem;
    margin: 10px;
    padding: 10px;
  }
}
</style>
