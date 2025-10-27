
<template>
  <div class="card-container">
    <div class="plus-icon">
      <font-awesome-icon :icon="icon" size="3x" />
    </div>
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  title: string
  subtitle: string
  icon: string
}>()
</script>

<style scoped>
.card-container i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.card-container h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-container p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.card-container {
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

@media (max-width: 768px) {
  .card-container {
    padding: 1.5rem;
  }
}
</style>
