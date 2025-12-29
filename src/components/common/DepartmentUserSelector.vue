<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="w-full text-left px-2.5 py-1.5 text-sm border border-inputBorder dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-txt-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownMenuRef"
        class="fixed z-[9999] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-80 overflow-hidden min-w-[280px]"
        :style="dropdownStyle"
      >
        <!-- Department Dropdown -->
        <div class="border-b border-gray-200 dark:border-gray-600">
          <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800">
            <select
              :value="selectedDepartmentId || ''"
              @change="onDepartmentChange"
              class="w-full bg-transparent border-none focus:outline-none text-sm text-txt-primary dark:text-gray-100"
            >
              <option value="" disabled>Selecione um setor</option>
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
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-light/80 dark:text-gray-500 text-sm"
            />
            <Input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar usuários"
              padding="tight"
              class="pl-10 pr-3 text-sm dark:border-gray-600"
            />
          </div>
        </div>

        <!-- Users List -->
        <div v-if="selectedDepartmentId" class="max-h-48 overflow-y-auto mb-2">
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
                <div class="text-sm font-medium text-txt-primary dark:text-gray-100">
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
            Selecione um setor para ver os usuários
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Teleport } from 'vue';
import Input from '@/components/common/Input.vue';
import type { Department, User } from '@/models';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';

interface Props {
  modelValue?: { departmentId: number | null; userId: number | null };
  placeholder?: string;
  excludedDepartmentIds?: number[]; // Excluded departments (already have users assigned)
  excludedUserIds?: number[]; // Excluded users (already assigned to the ticket)
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
const dropdownMenuRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchTerm = ref('');
const departments = ref<Department[]>([]);
const users = ref<User[]>([]);
const isLoadingUsers = ref(false);
const dropdownStyle = ref<{ top: string; left: string; width: string }>({
  top: '0px',
  left: '0px',
  width: '280px',
});

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
  let filtered = users.value;

  // Filter out excluded users
  if (props.excludedUserIds && props.excludedUserIds.length > 0) {
    filtered = filtered.filter((user) => !props.excludedUserIds!.includes(user.id));
  }

  // Filter by search term if present
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
        (user.email && user.email.toLowerCase().includes(term)),
    );
  }

  return filtered;
});

const availableDepartments = computed(() => {
  if (!props.excludedDepartmentIds?.length) return departments.value;

  return departments.value.filter((dept) => !props.excludedDepartmentIds?.includes(dept.id));
});

const updateDropdownPosition = () => {
  if (!dropdownRef.value || !isOpen.value) return;

  nextTick(() => {
    const rect = dropdownRef.value!.getBoundingClientRect();
    const buttonWidth = rect.width;

    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${Math.max(280, buttonWidth)}px`,
    };
  });
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updateDropdownPosition();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  searchTerm.value = '';
};

const onDepartmentChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value === '' ? null : Number(target.value);
  selectedDepartmentId.value = value;
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
    toast.error('Erro ao carregar setores');
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
  const target = event.target as Node;
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(target) &&
    dropdownMenuRef.value &&
    !dropdownMenuRef.value.contains(target)
  ) {
    closeDropdown();
  }
};

const handleScroll = () => {
  if (isOpen.value) {
    updateDropdownPosition();
  }
};

const handleResize = () => {
  if (isOpen.value) {
    updateDropdownPosition();
  }
};

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedDepartmentId.value = newValue.departmentId || null;
      selectedUserId.value = newValue.userId || null;

      if (newValue.departmentId && !users.value.length) {
        loadUsers(newValue.departmentId);
      }
    } else {
      // Reset to null when modelValue is cleared
      selectedDepartmentId.value = null;
      selectedUserId.value = null;
      users.value = [];
    }
  },
  { immediate: true },
);

watch(isOpen, (newValue) => {
  if (newValue) {
    updateDropdownPosition();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
  } else {
    window.removeEventListener('scroll', handleScroll, true);
    window.removeEventListener('resize', handleResize);
  }
});

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
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
