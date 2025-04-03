<script setup lang="ts">
import type { Column, Task } from '@/types/kanban';
import { ref } from 'vue';

const props = defineProps<{
  column: Column;
}>();

const emit = defineEmits<{
  (e: 'taskMoved', task: Task, fromColumn: string, toColumn: string): void;
}>();

const isDraggingOver = ref(false);

function handleDragStart(e: DragEvent, task: Task) {
  if (!e.dataTransfer) return;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData(
    'application/json',
    JSON.stringify({
      task,
      fromColumn: props.column.id,
    }),
  );
}

function handleDragOver(e: DragEvent) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  isDraggingOver.value = true;
  return false;
}

function handleDragEnter() {
  isDraggingOver.value = true;
}

function handleDragLeave() {
  isDraggingOver.value = false;
}

function handleDrop(e: DragEvent) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  isDraggingOver.value = false;

  const data = e.dataTransfer?.getData('application/json');
  if (!data) return;

  const { task, fromColumn } = JSON.parse(data);
  if (fromColumn !== props.column.id) {
    emit('taskMoved', task, fromColumn, props.column.id);
  }
}
</script>

<template>
  <div
    class="column"
    :class="{ 'drag-over': isDraggingOver }"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <h2 class="column-title">{{ column.title }}</h2>
    <div class="task-list">
      <template v-for="task in column.tasks" :key="task.id">
        <div class="task-card" draggable="true" @dragstart="handleDragStart($event, task)">
          <TaskCard :task="task" />
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.column {
  width: 300px;
  padding: 16px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  min-height: 500px;
}

.column.drag-over {
  border: 2px dashed #3498db;
  background-color: #e0f7ff;
}

.column-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card {
  padding: 12px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: grab;
}

.drag-ghost {
  opacity: 0.5;
  border: 2px dashed #d1d5db; /* Equivalent to Tailwind's border-gray-400 */
}
</style>
