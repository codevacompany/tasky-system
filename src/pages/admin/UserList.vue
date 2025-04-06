<template>
  <section id="colaboradoresSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Colaboradores</h1>
      <button id="newColaboradorBtn" class="btn btn-primary" @click="openModal">
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
          <tr v-if="isLoading">
            <td colspan="5" class="loading-cell">
              <div class="loading-wrapper">
                <LoadingSpinner :size="28" />
              </div>
            </td>
          </tr>
          <tr v-else v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.department?.name || 'N/A' }}</td>
            <td>{{ user.isAdmin ? 'Sim' : 'Não' }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <NewUserModal :isOpen="isModalOpen" @close="closeModal" @userCreated="loadUsers" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService } from '@/services/userService';
import type { User } from '@/models';
import NewUserModal from '@/components/users/NewUserModal.vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const users = ref<User[]>([]);
const isModalOpen = ref(false);
const isLoading = ref(false);

const loadUsers = async () => {
  isLoading.value = true;
  try {
    const response = await userService.fetch();
    users.value = response.data;
  } catch {
    toast.error('Erro ao carregar usuários. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(loadUsers);
</script>

<style scoped>
.loading-cell {
  margin: 2rem 0;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

h1,
h3 {
  color: black;
}

.header-action-btn {
  gap: 5px;
}
</style>
