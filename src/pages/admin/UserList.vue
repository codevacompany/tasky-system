<template>
  <section id="colaboradoresSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Colaboradores</h1>
      <button id="newColaboradorBtn" class="header-action-btn">
        <font-awesome-icon icon="plus" />
        <p>Novo Colaborador</p>
      </button>
    </div>

    <div class="table-container">
      <table class="data-table" id="colaboradoresTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Setor</th>
            <th>Ativo</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.department?.name || 'N/A' }}</td>
            <td>{{ user.isAdmin ? 'Sim' : 'Não' }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService } from '@/services/userService';
import type { User } from '@/models';

const users = ref<User[]>([]);

const loadUsers = async () => {
  try {
    const response = await userService.fetch();
    users.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
};

onMounted(loadUsers);
</script>

<style scoped>
h1,
h3 {
  color: black;
}

.header-action-btn {
  gap: 5px;
}
</style>
