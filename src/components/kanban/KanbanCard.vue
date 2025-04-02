<script setup lang="ts">
import type { Task } from '@/types/kanban';

defineProps<{ task: Task }>();
</script>

<template>
  <div class="task-card">
    <h3 class="task-title">{{ task.title }}</h3>
    <p class="task-description">{{ task.description }}</p>
  </div>
</template>

<style>
.task-card {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.task-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.task-description {
  font-size: 14px;
  color: #555;
}
</style>
