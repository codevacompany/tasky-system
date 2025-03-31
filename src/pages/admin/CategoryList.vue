<template>
  <section id="categoriasSection" class="section-content admin-section">
    <div class="section-header">
      <h1>Categorias</h1>
      <button id="newCategoriaBtn" class="header-action-btn">
        <font-awesome-icon icon="plus" />
        <p>Nova Categoria</p>
      </button>
    </div>

    <div class="table-container">
      <table class="data-table" id="categoriasTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/models';

const categories = ref<Category[]>([]);

const loadCategories = async () => {
  try {
    const response = await categoryService.fetch();
    categories.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
  }
};

onMounted(loadCategories);
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
