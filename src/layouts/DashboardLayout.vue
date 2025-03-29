<template>
  <div>
    <div class="admin-layout">
      <header class="main-header" id="mainHeader" style="display: none">
        <div class="header-logo">
          <img src="./images/tasky.png" alt="Tasky Logo" class="logo" id="headerLogo" />
        </div>

        <div class="header-nav">
          <nav class="main-nav">
            <ul>
              <li>
                <a href="#dashboard" class="active" data-section="dashboard"
                  ><i class="fas fa-tachometer-alt"></i> Dashboard</a
                >
              </li>
              <li>
                <a href="#tickets" data-section="tickets"
                  ><i class="fas fa-ticket-alt"></i> Tickets</a
                >
              </li>
              <li class="admin-only">
                <a href="#relatorios" class="admin-menu-item" data-section="relatorios"
                  ><i class="fas fa-chart-bar"></i> Relatórios</a
                >
              </li>
              <li class="admin-only">
                <a href="#colaboradores" class="admin-menu-item" data-section="colaboradores"
                  ><i class="fas fa-users"></i> Usuários</a
                >
              </li>
              <li class="admin-only">
                <a href="#setores" class="admin-menu-item" data-section="setores"
                  ><i class="fas fa-building"></i> Setores</a
                >
              </li>
              <li class="admin-only">
                <a href="#categorias" class="admin-menu-item" data-section="categorias"
                  ><i class="fas fa-tag"></i> Categorias</a
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="header-actions">
          <button id="newTicketButton" class="header-action-btn">
            <i class="fas fa-plus"></i>
            <span class="btn-text">Novo Ticket</span>
          </button>

          <div class="notification-icon" id="notificationButton">
            <i class="far fa-bell"></i>
            <span class="notification-badge" id="notificationBadge">0</span>
          </div>

          <div class="theme-toggle" id="darkModeToggle">
            <i class="fas fa-moon"></i>
          </div>

          <div class="user-profile" id="profileButton">
            <img
              src="./images/user-placeholder.jpg"
              alt="Perfil"
              class="user-avatar"
              id="userAvatar"
            />
            <span class="user-name" id="userName">Usuário</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  height: 65px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-nav {
  flex: 1;
  margin-left: 1rem;
}

/* Ajustes de cores para o header */
.main-nav ul li a {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #1a2233;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.main-nav ul li a:hover,
.main-nav ul li a.active {
  background-color: #1a2233;
  color: #f8f9fa;
}
</style>
