<template>
  <BaseModal
    title="Novo Ticket"
    @close="closeModal"
    @cancel="resetForm"
    @confirm="handleSubmit"
    :confirmButtonText="'Criar Ticket'"
    :cancelButtonText="'Limpar'"
  >
    <form @submit.prevent="handleSubmit" class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
        <div class="col-span-1 md:col-span-2 flex flex-col gap-1.5">
          <label for="title" class="text-sm text-gray-800 dark:text-gray-200"
            >Assunto: <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="title"
            v-model="formData.name"
            required
            class="w-full px-[14px] py-2.5 border border-gray-200 rounded text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label class="text-sm text-gray-800 dark:text-gray-200">É privado?</label>
          <div class="flex sm:flex-row gap-2 sm:gap-4 pt-1" :key="privateRadioKey">
            <label
              class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formData.isPrivate"
                :value="true"
                name="isPrivate"
                class="cursor-pointer w-4"
              />
              Sim
            </label>
            <label
              class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formData.isPrivate"
                :value="false"
                name="isPrivate"
                class="cursor-pointer w-4"
              />
              Não
            </label>
          </div>
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label for="targetDepartment" class="text-sm text-gray-800 dark:text-gray-200"
            >Setor Destino: <span class="text-red-500">*</span></label
          >
          <Select
            :options="departmentOptions"
            :modelValue="selectedDepartment?.toString() || ''"
            @update:modelValue="updateSelectedDepartment"
          />
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label for="targetUser" class="text-sm text-gray-800 dark:text-gray-200"
            >Usuário Destino:</label
          >
          <Select
            :options="userOptions"
            :modelValue="selectedUser?.toString() || ''"
            @update:modelValue="updateSelectedUser"
            :disabled="!selectedDepartment"
          />
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label for="category" class="text-sm text-gray-800 dark:text-gray-200"
            >Categoria: <span class="text-red-500">*</span></label
          >
          <Select
            :options="categoryOptions"
            :modelValue="selectedCategory?.toString() || ''"
            @update:modelValue="updateSelectedCategory"
          />
        </div>

        <div class="col-span-1 md:col-span-2 flex flex-col gap-1.5">
          <label class="text-sm text-gray-800 dark:text-gray-200"
            >Prioridade: <span class="text-red-500">*</span></label
          >
          <div class="flex sm:flex-row gap-2 sm:gap-4 pt-1">
            <label
              class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formData.priority"
                :value="TicketPriority.Low"
                name="priority"
                required
                class="cursor-pointer w-4"
              />
              {{ formatSnakeToNaturalCase(TicketPriority.Low) }}
            </label>
            <label
              class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formData.priority"
                :value="TicketPriority.Medium"
                name="priority"
                class="cursor-pointer w-4"
              />
              {{ formatSnakeToNaturalCase(TicketPriority.Medium) }}
            </label>
            <label
              class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formData.priority"
                :value="TicketPriority.High"
                name="priority"
                class="cursor-pointer w-4"
              />
              {{ formatSnakeToNaturalCase(TicketPriority.High) }}
            </label>
          </div>
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label for="dueAt" class="text-sm text-gray-800 dark:text-gray-200">Concluir até:</label>
          <input
            type="datetime-local"
            id="dueAt"
            v-model="formData.dueAt"
            class="w-full px-[14px] py-2.5 border border-gray-200 rounded text-sm text-gray-800 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div class="col-span-1 md:col-span-3 flex flex-col gap-1.5">
          <label for="description" class="text-sm text-gray-800 dark:text-gray-200"
            >Descrição: <span class="text-red-500">*</span></label
          >
          <div class="quill-wrapper">
            <QuillEditor
              v-model:content="formData.description"
              contentType="html"
              theme="snow"
              :options="editorOptions"
            />
          </div>
          <textarea
            class="hidden"
            id="description"
            v-model="formData.description"
            required
            rows="4"
          ></textarea>
        </div>
        <div class="mt-20 sm:mt-0 col-span-1 md:col-span-3 flex flex-col gap-1.5">
          <div class="flex">
            <label
              class="primary-gradient text-white flex justify-center items-center gap-[5px] rounded cursor-pointer mb-1.5 py-2 px-4 text-sm"
              for="fileUpload"
            >
              <font-awesome-icon icon="paperclip" /> Anexar Arquivos
            </label>
          </div>

          <input class="hidden" type="file" id="fileUpload" multiple @change="handleFileChange" />
          <ul v-if="selectedFiles.length" class="space-y-1">
            <li v-for="(file, i) in selectedFiles" :key="i" class="flex items-center gap-2">
              <font-awesome-icon icon="file" class="text-gray-500 text-xs" />
              <p class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { ticketService } from '@/services/ticketService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'vue3-toastify';
import { TicketPriority, type Category, type Department, type User } from '@/models';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import { awsService } from '@/services/awsService';
import BaseModal from '@/components/common/BaseModal.vue';
import Select from '@/components/common/Select.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const ticketsStore = useTicketsStore();
const departments = ref<Department[]>([]);
const availableUsers = ref<User[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFiles = ref<File[]>([]);
const privateRadioKey = ref(0);

// Computed properties for Select component options
const departmentOptions = computed(() => [
  { value: '', label: 'Selecione um setor' },
  ...departments.value.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  })),
]);

const formData = ref({
  name: '',
  priority: TicketPriority.Low,
  description: '',
  departmentId: null as number | null,
  targetUserId: null as number | null,
  dueAt: '',
  requesterId: useUserStore().user?.id || null,
  categoryId: null as number | null,
  isPrivate: false,
});

const currentUserId = useUserStore().user?.id;

const userOptions = computed(() => {
  let users = availableUsers.value;
  if (formData.value.isPrivate && currentUserId) {
    users = users.filter((user) => user.id !== currentUserId);
  }
  return [
    {
      value: '',
      label: selectedDepartment.value ? 'Selecione um usuário' : 'Selecione um setor primeiro',
    },
    ...users.map((user) => ({
      value: user.id.toString(),
      label: `${user.firstName} ${user.lastName}`,
    })),
  ];
});

watch(
  () => formData.value.isPrivate,
  (isPrivate, wasPrivate) => {
    if (isPrivate && selectedUser.value && Number(selectedUser.value) === currentUserId) {
      formData.value.isPrivate = false;
      selectedUser.value = null;
      toast.warning('Você não pode criar um ticket privado para si mesmo.');
      privateRadioKey.value++;
    }
  },
);

const categoryOptions = computed(() => [
  { value: '', label: 'Selecione uma categoria' },
  ...categories.value.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  })),
]);

const editorOptions = {
  modules: {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: 'Adicione uma descrição aqui...',
};

// Update handlers for Select components
const updateSelectedDepartment = (value: string) => {
  selectedDepartment.value = value ? parseInt(value) : null;
  selectedUser.value = null; // Reset user selection when department changes
  updateUsersList();
};

const updateSelectedUser = (value: string) => {
  selectedUser.value = value ? parseInt(value) : null;
};

const updateSelectedCategory = (value: string) => {
  selectedCategory.value = value ? parseInt(value) : null;
};

const loadDepartments = async () => {
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    toast.error('Erro ao carregar departamentos');
  }
};

const loadCategories = async () => {
  try {
    const { data } = await categoryService.fetch({ limit: 100 });
    categories.value = data.items;
  } catch {
    toast.error('Erro ao carregar categorias');
  }
};

const updateUsersList = async () => {
  if (!selectedDepartment.value) {
    availableUsers.value = [];
    selectedUser.value = null;
    return;
  }
  try {
    const response = await userService.getByDepartment(selectedDepartment.value, {
      limit: 100,
    });
    availableUsers.value = response.data.items;
  } catch {
    toast.error('Erro ao carregar usuários. Tente novamente.');
    availableUsers.value = [];
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input?.files) {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(input.files)];
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    priority: TicketPriority.Low,
    description: '',
    departmentId: null,
    targetUserId: null,
    dueAt: '',
    requesterId: useUserStore().user!.id,
    categoryId: null,
    isPrivate: false,
  };
  selectedDepartment.value = null;
  selectedUser.value = null;
  availableUsers.value = [];
  selectedCategory.value = null;
  selectedFiles.value = [];
};

onMounted(() => {
  loadDepartments();
  loadCategories();
});

const validateForm = () => {
  if (
    formData.value.isPrivate &&
    selectedUser.value &&
    Number(selectedUser.value) === currentUserId
  ) {
    toast.error('Você não pode criar um ticket privado para si mesmo.');
    return false;
  }
  if (!formData.value.name.trim()) {
    toast.error('O campo Assunto é obrigatório');
    return false;
  }
  if (!selectedCategory.value) {
    toast.error('O campo Categoria é obrigatório');
    return false;
  }
  if (!selectedDepartment.value) {
    toast.error('O campo Setor Destino é obrigatório');
    return false;
  }
  if (!selectedUser.value) {
    toast.error('O campo Usuário Destino é obrigatório');
    return false;
  }
  if (!formData.value.priority) {
    toast.error('O campo Prioridade é obrigatório');
    return false;
  }
  if (!formData.value.description.trim()) {
    toast.error('O campo Descrição é obrigatório');
    return false;
  }
  return true;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const uploadFilesToS3 = async () => {
  const uploadedUrls: string[] = [];

  for (const file of selectedFiles.value) {
    const ext = file.name.split('.').pop();

    if (ext) {
      const { data } = await awsService.getSignedUrl(ext);

      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      const fileUrl = data.url.split('?')[0];
      uploadedUrls.push(fileUrl);
    }
  }

  return uploadedUrls;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(formData.value.description, 'text/html');
  const images = Array.from(doc.querySelectorAll('img'));

  for (const img of images) {
    const base64 = img.src;

    if (!base64.startsWith('data:image/')) continue;

    try {
      const blob = await fetch(base64).then((res) => res.blob());
      const ext = blob.type.split('/')[1];

      const { data } = await awsService.getSignedUrl(ext);
      const signedUrl = data.url;

      await axios.put(signedUrl, blob, {
        headers: {
          'Content-Type': blob.type,
        },
      });

      img.src = signedUrl.split('?')[0];
    } catch (err) {
      toast.error('Erro ao fazer upload de imagem');
      console.error(err);
      return;
    }
  }

  formData.value.description = doc.body.innerHTML;

  formData.value.departmentId = selectedDepartment.value;
  formData.value.targetUserId = selectedUser.value;
  formData.value.categoryId = selectedCategory.value;

  try {
    const fileUrls = await uploadFilesToS3();
    
    const ticketData = {
      ...formData.value,
      dueAt: formData.value.dueAt || undefined,
      files: fileUrls,
    };

    await ticketService.create(ticketData);
    await Promise.all([ticketsStore.fetchMyTickets(), ticketsStore.fetchDepartmentTickets()]);

    toast.success('Ticket criado com sucesso!');
    emit('ticketCreated');
    closeModal();
  } catch {
    toast.error('Erro ao criar ticket');
  }
};
</script>

<style scoped>
.quill-wrapper {
  margin-bottom: 50px;
}

/* Mobile responsive Quill editor */
@media (max-width: 640px) {
  .quill-wrapper {
    margin-bottom: 30px;
  }

  :deep(.ql-toolbar) {
    border-radius: 4px 4px 0 0;
    padding: 8px;
  }

  :deep(.ql-container) {
    border-radius: 0 0 4px 4px;
    font-size: 14px;
  }

  :deep(.ql-editor) {
    min-height: 120px;
    padding: 12px;
  }

  :deep(.ql-toolbar .ql-formats) {
    margin-right: 8px;
  }

  :deep(.ql-toolbar button) {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
}

/* Dark mode styles for Quill editor */
:deep(.dark) .ql-toolbar {
  border-color: #374151;
  background: #1f2937;
}

:deep(.dark) .ql-container {
  border-color: #374151;
  background: #1f2937;
}

:deep(.dark) .ql-editor {
  color: #e5e7eb;
  background: #1f2937;
}

:deep(.dark) .ql-toolbar button:hover {
  color: #e5e7eb;
}

:deep(.dark) .ql-toolbar button.ql-active {
  color: #60a5fa;
}

:deep(.dark) .ql-snow .ql-stroke {
  stroke: #9ca3af;
}

:deep(.dark) .ql-snow .ql-fill {
  fill: #9ca3af;
}

:deep(.dark) .ql-snow .ql-picker-label {
  color: #9ca3af;
}

:deep(.dark) .ql-snow .ql-picker-options {
  background: #1f2937;
  border-color: #374151;
}

:deep(.dark) .ql-snow .ql-picker-item {
  color: #e5e7eb;
}

:deep(.dark) .ql-snow .ql-picker-item:hover {
  background: #374151;
}
</style>
