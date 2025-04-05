<template>
  <section id="setoresSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Setores</h1>
      <button id="newSetorBtn" class="header-action-btn" @click="openModal">
        <font-awesome-icon icon="plus" />
        <p>Novo Setor</p>
      </button>
    </div>

    <div class="table-container">
      <table class="data-table" id="setoresTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <NewDepartmentModal :isOpen="isModalOpen" @close="closeModal" @departmentCreated="loadDepartments" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { departmentService } from '@/services/departmentService';
import type { Department } from '@/models';
import NewDepartmentModal from '@/components/departments/NewDepartmentModal.vue';
import { toast } from 'vue3-toastify';

const departments = ref<Department[]>([]);
const isModalOpen = ref(false);

const loadDepartments = async () => {
  try {
    const response = await departmentService.fetch();
    departments.value = response.data;
  } catch {
    toast.error('Erro ao carregar setores. Tente novamente.');
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(loadDepartments);
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
