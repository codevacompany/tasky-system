<template>
  <header>
    <div class="header-left">
      <img src="/images/tasky.png" alt="Logo" class="logo" />
    </div>
    <div class="header-actions">
      <div class="notification">
        <i class="fas fa-bell"></i>
        <span class="badge">0</span>
      </div>
      <button class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sair</span>
      </button>
    </div>
  </header>
</template>

<template>
  <nav id="adminMenu" class="admin-menu">
    <h3 class="admin-greeting">Olá, Administrador!</h3>
    <ul>
      <li @click="$emit('section-changed', 'Inicio')">🏠 Início</li>
      <li @click="toggleSubmenu">👥 Cadastros</li>
      <ul v-if="submenuOpen">
        <li @click="$emit('section-changed', 'NovoColaborador')">➕ Novo Colaborador</li>
        <li @click="$emit('section-changed', 'Colaboradores')">👤 Colaboradores</li>
      </ul>
      <li @click="$emit('section-changed', 'Relatorios')">📊 Relatórios</li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  setup() {
    const submenuOpen = ref(false);
    const toggleSubmenu = () => (submenuOpen.value = !submenuOpen.value);
    return { submenuOpen, toggleSubmenu };
  },
};
</script>
