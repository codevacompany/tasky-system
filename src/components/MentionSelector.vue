<template>
  <div v-if="show" class="mention-selector" :style="position">
    <div class="mention-list">
      <div
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        class="mention-item"
        :class="{ active: selectedIndex === index }"
        @click="selectUser(user)"
        @mouseover="selectedIndex = index"
      >
        <div class="user-avatar">
          <span class="initials">{{ getInitials(user) }}</span>
        </div>
        <div class="user-info">
          <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
          <span class="user-department">{{ user.department.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { User } from '@/models';

const props = defineProps<{
  show: boolean;
  users: User[];
  searchTerm: string;
  position: { top: string; left: string };
}>();

const emit = defineEmits<{
  (e: 'select', user: User): void;
  (e: 'close'): void;
}>();

const selectedIndex = ref(0);

const filteredUsers = computed(() => {
  if (!props.searchTerm) return props.users;
  const searchTerm = props.searchTerm.toLowerCase();
  return props.users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );
});

const getInitials = (user: User) => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

const selectUser = (user: User) => {
  emit('select', user);
  emit('close');
};

// Navegação com teclado
const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.show) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % filteredUsers.value.length;
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + filteredUsers.value.length) % filteredUsers.value.length;
      break;
    case 'Enter':
      event.preventDefault();
      if (filteredUsers.value[selectedIndex.value]) {
        selectUser(filteredUsers.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      emit('close');
      break;
  }
};

watch(() => props.show, (newValue) => {
  if (newValue) {
    selectedIndex.value = 0;
    window.addEventListener('keydown', handleKeyDown);
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<style scoped>
.mention-selector {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  min-width: 200px;
}

.mention-list {
  padding: 4px;
}

.mention-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mention-item:hover,
.mention-item.active {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.user-department {
  font-size: 0.8rem;
  color: #666;
}
</style> 