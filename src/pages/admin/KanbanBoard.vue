<script setup lang="ts">
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { Column, Task } from '@/types/kanban';

const columns = ref<Column[]>([
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: uuidv4(),
        title: 'Design new landing page',
        description: 'Create wireframes and mockups for the new landing page',
      },
      {
        id: uuidv4(),
        title: 'Implement authentication',
        description: 'Add user login and registration functionality',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: uuidv4(),
        title: 'Fix navigation bug',
        description: 'Mobile menu not closing properly on click',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: uuidv4(),
        title: 'Setup project structure',
        description: 'Initialize repository and configure build tools',
      },
    ],
  },
]);

function handleTaskMoved(task: Task, fromColumnId: string, toColumnId: string) {
  const fromColumn = columns.value.find((col) => col.id === fromColumnId);
  const toColumn = columns.value.find((col) => col.id === toColumnId);

  if (!fromColumn || !toColumn) return;

  const taskIndex = fromColumn.tasks.findIndex((t) => t.id === task.id);
  if (taskIndex === -1) return;

  fromColumn.tasks.splice(taskIndex, 1);
  toColumn.tasks.push(task);
}
</script>

<template>
  <div class="kanban-board">
    <h1 class="title">Kanban Board</h1>
    <div class="columns">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @task-moved="handleTaskMoved"
      />
    </div>
  </div>
</template>

<style>
.kanban-board {
  min-height: 100vh;
  background-color: #e5e7eb;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

.columns {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
</style>
