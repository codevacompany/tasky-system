<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="w-full text-left px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :class="{ 'ring-2 ring-blue-500': isOpen }"
    >
      <div class="flex items-center justify-between">
        <span class="truncate">
          {{ displayText }}
        </span>
        <font-awesome-icon
          :icon="isOpen ? 'chevron-up' : 'chevron-down'"
          class="text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0"
        />
      </div>
    </button>

    <div
      v-if="isOpen"
      class="min-w-[280px] absolute top-[45px] left-[-80px] z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-80 overflow-hidden"
    >
      <!-- Department Dropdown -->
      <div class="border-b border-gray-200 dark:border-gray-600">
        <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800">
          <select
            v-model="selectedDepartmentId"
            @change="onDepartmentChange"
            class="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecione um departamento</option>
            <option
              v-for="department in availableDepartments"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Search Input -->
      <div v-if="selectedDepartmentId" class="p-3 border-b border-gray-200 dark:border-gray-600">
        <div class="relative">
          <font-awesome-icon
            icon="search"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"
          />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar usuários..."
            class="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Users List -->
      <div v-if="selectedDepartmentId" class="max-h-48 overflow-y-auto">
        <div v-if="isLoadingUsers" class="p-4 text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">Carregando usuários...</div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="p-4 text-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">Nenhum usuário encontrado</div>
        </div>
        <div v-else>
          <button
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center gap-3"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedUserId === user.id }"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ user.firstName }} {{ user.lastName }}
              </div>
              <div v-if="user.email" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user.email }}
              </div>
            </div>
            <div v-if="!user.isActive" class="flex items-center gap-1">
              <font-awesome-icon
                icon="exclamation-triangle"
                class="text-orange-500 text-xs"
                title="Usuário desativado"
              />
              <span class="text-orange-500 text-xs">Desativado</span>
            </div>
          </button>
        </div>
      </div>

      <!-- No Department Selected Message -->
      <div v-else class="p-4 text-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Selecione um departamento para ver os usuários
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Department, User } from '@/models';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';

interface Props {
  modelValue?: { departmentId: number | null; userId: number | null };
  placeholder?: string;
  excludedDepartmentIds?: number[]; // Excluded departments (already have users assigned)
}

interface Emits {
  (e: 'update:modelValue', value: { departmentId: number | null; userId: number | null }): void;
  (e: 'change', value: { department: Department | null; user: User | null }): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecionar responsável...',
});

const emit = defineEmits<Emits>();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchTerm = ref('');
const departments = ref<Department[]>([]);
const users = ref<User[]>([]);
const isLoadingUsers = ref(false);

const selectedDepartmentId = ref<number | null>(props.modelValue?.departmentId || null);
const selectedUserId = ref<number | null>(props.modelValue?.userId || null);

const selectedDepartment = computed(
  () => departments.value.find((d) => d.id === selectedDepartmentId.value) || null,
);

const selectedUser = computed(() => users.value.find((u) => u.id === selectedUserId.value) || null);

const displayText = computed(() => {
  if (selectedUser.value && selectedDepartment.value) {
    return `${selectedUser.value.firstName} ${selectedUser.value.lastName} (${selectedDepartment.value.name})`;
  }
  if (selectedDepartment.value) {
    return `${selectedDepartment.value.name} - Selecione um usuário`;
  }
  return props.placeholder;
});

const filteredUsers = computed(() => {
  if (!searchTerm.value) return users.value;

  const term = searchTerm.value.toLowerCase();
  return users.value.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      (user.email && user.email.toLowerCase().includes(term)),
  );
});

const availableDepartments = computed(() => {
  if (!props.excludedDepartmentIds?.length) return departments.value;

  return departments.value.filter((dept) => !props.excludedDepartmentIds?.includes(dept.id));
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
  searchTerm.value = '';
};

const onDepartmentChange = async () => {
  selectedUserId.value = null;
  users.value = [];

  if (selectedDepartmentId.value) {
    await loadUsers(selectedDepartmentId.value);
  }

  emitChange();
};

const selectUser = (user: User) => {
  selectedUserId.value = user.id;
  closeDropdown();
  emitChange();
};

const emitChange = () => {
  const value = {
    departmentId: selectedDepartmentId.value,
    userId: selectedUserId.value,
  };

  emit('update:modelValue', value);
  emit('change', {
    department: selectedDepartment.value,
    user: selectedUser.value,
  });
};

const loadDepartments = async () => {
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    toast.error('Erro ao carregar departamentos');
  }
};

const loadUsers = async (departmentId: number) => {
  isLoadingUsers.value = true;
  try {
    const response = await userService.getByDepartment(departmentId, { limit: 100 });
    users.value = response.data.items;
  } catch {
    toast.error('Erro ao carregar usuários');
    users.value = [];
  } finally {
    isLoadingUsers.value = false;
  }
};

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedDepartmentId.value = newValue.departmentId;
      selectedUserId.value = newValue.userId;

      if (newValue.departmentId && !users.value.length) {
        loadUsers(newValue.departmentId);
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  loadDepartments();
  document.addEventListener('click', handleClickOutside);

  // Load users if department is already selected
  if (selectedDepartmentId.value) {
    loadUsers(selectedDepartmentId.value);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
