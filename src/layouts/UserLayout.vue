<template>
  <div>
    <AppHeader />
    <div class="admin-layout">
      <nav id="adminMenu" class="admin-menu">
        <h3 id="adminGreeting" class="admin-greeting">Olá, Usuário!</h3>
        <ul>
          <router-link to="/">
            <li class="menu-item active" data-section="inicio">
              <font-awesome-icon icon="plus-circle" />
              <span>Novo Ticket</span>
            </li>
          </router-link>
          <!-- Cadastros Menu with Click Event -->
          <li class="menu-item" data-section="toggleSubmenu" @click="toggleSubmenu">
            <font-awesome-icon icon="users" />
            <span>Meus Tickets</span>
            <font-awesome-icon icon="chevron-down" :class="{ rotate: submenuOpen }" />
          </li>
          <!-- Smooth expanding submenu -->
          <transition name="submenu-expand">
            <ul v-if="submenuOpen" class="submenu">
              <router-link to="/meus-tickets/recebidos">
                <li data-section="cadastroColaboradores">
                  <font-awesome-icon icon="user-plus" />
                  <span>Recebidos</span>
                </li>
              </router-link>
              <router-link to="/meus-tickets/criados">
                <li data-section="colaboradores">
                  <font-awesome-icon icon="users" />
                  <span>Criados</span>
                </li>
              </router-link>
            </ul>
          </transition>

          <router-link to="/tickets-do-setor">
            <li class="menu-item" data-section="relatorios">
              <font-awesome-icon icon="chart-line" />
              <span>Tickets do Setor</span>
            </li>
          </router-link>
        </ul>
      </nav>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'

// Track submenu state
const submenuOpen = ref(false)

// Toggle submenu visibility
const toggleSubmenu = () => {
  submenuOpen.value = !submenuOpen.value
}
</script>

<style scoped>
svg {
  color: white; /* This will work */
}

.content {
  padding: 40px 40px;
  width: calc(100vw - 250px);
}

.admin-layout {
  display: flex;
  padding: 80px 0px 0px 250px;
}

/* Sidebar */
.admin-menu {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 80px;
  left: 0;
  flex-shrink: 0;
  background: #1e2a3a;
  padding: 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* Admin greeting */
.admin-greeting {
  color: #fff;
  padding: 25px;
  font-size: 16px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
}

/* Menu Items */
.admin-menu ul {
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.admin-menu .menu-item {
  width: 100%;
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.admin-menu .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.admin-menu .menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Submenu */
.submenu {
  padding-left: 20px;
}

.submenu li {
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 10px 15px;
  color: rgba(255, 255, 255, 0.8);
}

.submenu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.submenu li.active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Smooth expand animation */
.submenu-expand-enter-active,
.submenu-expand-leave-active {
  transition:
    max-height 0.1s ease-out,
    opacity 0.1s ease-out;
  overflow: hidden;
}

.submenu-expand-enter-from,
.submenu-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-expand-enter-to,
.submenu-expand-leave-from {
  max-height: 200px; /* Adjust as needed */
  opacity: 1;
}

/* Chevron rotation */
.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* Icons */
.admin-menu li i {
  margin-right: 12px;
  color: #fff;
  width: 20px;
  text-align: center;
}
</style>
