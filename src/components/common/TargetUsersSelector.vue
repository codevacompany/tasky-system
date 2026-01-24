<template>
  <div class="flex flex-col space-y-4">
    <div
      v-for="(targetUser, index) in localTargetUsers"
      :key="index"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
    >
      <div class="col-span-1 flex flex-col gap-1.5">
        <label :for="`targetDepartment-${index}`" class="text-sm text-gray-800 dark:text-gray-200">
          Setor Destino: <span v-if="index === 0" class="text-red-500">*</span>
        </label>
        <Select
          :id="`targetDepartment-${index}`"
          :options="getDepartmentOptions(index)"
          :modelValue="targetUser.departmentId?.toString() || ''"
          @update:modelValue="(value) => updateDepartment(index, value)"
        />
      </div>

      <div class="col-span-1 flex flex-col gap-1.5 relative">
        <label :for="`targetUser-${index}`" class="text-sm text-gray-800 dark:text-gray-200">
          Usuário Destino: <span v-if="index === 0" class="text-red-500">*</span>
        </label>
        <Select
          :id="`targetUser-${index}`"
          :options="getUserOptionsForDepartment(index)"
          :modelValue="targetUser.userId?.toString() || ''"
          @update:modelValue="(value) => updateUser(index, value)"
          :disabled="!targetUser.departmentId"
        />
        <button
          v-if="localTargetUsers.length > 1"
          type="button"
          @click="removeTargetUser(index)"
          class="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors absolute right-1 top-1 bg-red-500 rounded-full"
          title="Remover usuário"
        >
          <font-awesome-icon icon="times" class="text-[10px] text-white" />
        </button>
      </div>
    </div>

    <div v-if="localTargetUsers.length < 3" class="flex justify-end -mt-3.5">
      <button
        type="button"
        @click="addTargetUser"
        class="py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
      >
        <font-awesome-icon icon="plus" class="mr-2" /> Adicionar outro
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Select from '@/components/common/Select.vue';
import { type Department, type User } from '@/models';

interface TargetUser {
  departmentId: number | null;
  userId: number | null;
}

interface Props {
  departments: Department[];
  allUsers: User[];
  targetUsers?: TargetUser[];
  isPrivate?: boolean;
  currentUserId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  targetUsers: () => [
    {
      departmentId: null,
      userId: null,
    },
  ],
  isPrivate: false,
  currentUserId: null,
});

const emit = defineEmits<{
  'update:targetUsers': [targetUsers: TargetUser[]];
}>();

const localTargetUsers = ref<TargetUser[]>([...props.targetUsers]);

const getDepartmentOptions = (index: number) => {
  return [
    { value: '', label: 'Selecione um setor' },
    ...props.departments.map((dept) => ({
      value: dept.id.toString(),
      label: dept.name,
    })),
  ];
};

const getUserOptionsForDepartment = (index: number) => {
  const targetUser = localTargetUsers.value[index];
  if (!targetUser.departmentId) {
    return [{ value: '', label: 'Selecione um setor primeiro' }];
  }

  const selectedUserIds = localTargetUsers.value
    .map((tu, idx) => (idx !== index ? tu.userId : null))
    .filter((id) => id !== null);

  let usersInDepartment = props.allUsers.filter(
    (user) =>
      user.department?.id === targetUser.departmentId &&
      (!selectedUserIds.includes(user.id) || targetUser.userId === user.id),
  );

  // Filter out current user if creating a private ticket
  if (props.isPrivate && props.currentUserId) {
    usersInDepartment = usersInDepartment.filter((user) => user.id !== props.currentUserId);
  }

  return [
    { value: '', label: 'Selecione um usuário' },
    ...usersInDepartment.map((user) => ({
      value: user.id.toString(),
      label: `${user.firstName} ${user.lastName}`,
    })),
  ];
};

const updateDepartment = (index: number, value: string) => {
  localTargetUsers.value[index].departmentId = value ? parseInt(value) : null;
  localTargetUsers.value[index].userId = null; // Reset user when department changes
  emit('update:targetUsers', localTargetUsers.value);
};

const updateUser = (index: number, value: string) => {
  localTargetUsers.value[index].userId = value ? parseInt(value) : null;
  emit('update:targetUsers', localTargetUsers.value);
};

const addTargetUser = () => {
  if (localTargetUsers.value.length < 3) {
    localTargetUsers.value.push({
      departmentId: null,
      userId: null,
    });
    emit('update:targetUsers', localTargetUsers.value);
  }
};

const removeTargetUser = (index: number) => {
  if (localTargetUsers.value.length > 1) {
    localTargetUsers.value.splice(index, 1);
    emit('update:targetUsers', localTargetUsers.value);
  }
};

// Watch for external changes to targetUsers
watch(
  () => props.targetUsers,
  (newValue) => {
    if (newValue) {
      localTargetUsers.value = [...newValue];
    }
  },
  { deep: true },
);

defineExpose({
  targetUsers: localTargetUsers,
});
</script>
