<template>
  <BaseModal
    title="Nova Tarefa"
    @close="closeModal"
    @cancel="resetForm"
    @confirm="handleSubmit"
    :confirmButtonText="'Criar Tarefa'"
    :cancelButtonText="'Cancelar'"
    :closeOnClickOutside="false"
    :confirmButtonLoading="isLoading"
  >
    <form @submit.prevent="handleSubmit" class="w-full -mt-2.5 -mb-1">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 mb-4">
        <div class="col-span-1 md:col-span-3 flex flex-col gap-1.5">
          <label for="title" class="text-sm text-gray-800 dark:text-gray-200"
            >Assunto: <span class="text-red-500">*</span></label
          >
          <Input id="title" v-model="formData.name" required />
        </div>

        <div class="col-span-1 flex flex-col gap-1.5">
          <label class="text-sm text-gray-800 dark:text-gray-200"
            >Prioridade: <span class="text-red-500">*</span></label
          >
          <Select
            :options="priorityOptions"
            :modelValue="priorityValue"
            @update:modelValue="updatePriority"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 mb-4">
        <TargetUsersSelector
          :departments="departments"
          :allUsers="allUsers"
          v-model:targetUsers="targetUsers"
          class="col-span-3"
        />
        <div class="col-span-1 flex flex-col gap-1.5">
          <label class="text-sm text-gray-800 dark:text-gray-200">É privado?</label>
          <Select
            :options="privateOptions"
            :modelValue="isPrivateValue"
            @update:modelValue="updateIsPrivate"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 mb-4">
        <div class="col-span-3 grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="category" class="text-sm text-gray-800 dark:text-gray-200"
              >Categoria: <span class="text-red-500">*</span></label
            >
            <Select
              :options="categoryOptions"
              :modelValue="selectedCategory?.toString() || ''"
              @update:modelValue="updateSelectedCategory"
            />
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <label for="dueAt" class="text-sm text-gray-800 dark:text-gray-200"
              >Concluir até:</label
            >
            <div class="w-full">
              <DatePicker
                :value="formData.dueAt"
                type="datetime"
                format="DD/MM/YYYY HH:mm"
                value-type="format"
                :lang="pt"
                :placeholder="'Selecione data e hora'"
                :clearable="true"
                :editable="false"
                :disabled-date="disabledDate"
                @change="handleDatePickerChange"
                @input="
                  (val: any) => {
                    console.log('@input event:', val);
                    formData.dueAt = val || null;
                  }
                "
                :input-class="'w-full px-[14px] py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800'"
                :placeholder-class="'text-gray-500 dark:text-gray-400'"
                :time-picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '23:45',
                }"
              />
            </div>
          </div>
        </div>

        <div class="flex items-end gap-2 relative">
          <label
            class="btn btn-primary flex justify-center items-center gap-[5px] rounded cursor-pointer px-4 text-sm"
            style="height: auto; padding-top: 0.625rem; padding-bottom: 0.625rem"
            for="fileUpload"
          >
            <font-awesome-icon icon="paperclip" /> Anexar Arquivos
          </label>
          <button
            v-if="selectedFiles.length > 0"
            type="button"
            @click="clearSelectedFiles"
            class="flex justify-center items-center gap-[5px] rounded cursor-pointer px-4 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            style="height: auto; padding-top: 0.625rem; padding-bottom: 0.625rem"
            title="Limpar arquivos selecionados"
          >
            <font-awesome-icon icon="times" />
          </button>
          <div class="mt-20 sm:mt-0 col-span-1 md:col-span-3 flex flex-col">
            <input class="hidden" type="file" id="fileUpload" multiple @change="handleFileChange" />
            <div v-if="selectedFiles.length" class="absolute top-[74px] left-0">
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="file" class="text-gray-500 text-xs" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ getFileDisplayText() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-1 md:col-span-3 flex flex-col gap-1.5 w-full sm:w-[930px]">
        <label for="description" class="text-sm text-gray-800 dark:text-gray-200"
          >Descrição: <span class="text-red-500">*</span></label
        >
        <div class="quill-wrapper" ref="quillWrapperRef">
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
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
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
import Input from '@/components/common/Input.vue';
import Select from '@/components/common/Select.vue';
import TargetUsersSelector from '@/components/common/TargetUsersSelector.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import pt from 'vue-datepicker-next/locale/pt-br.es';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const router = useRouter();
const ticketsStore = useTicketsStore();
const departments = ref<Department[]>([]);
const availableUsers = ref<User[]>([]);
const allUsers = ref<User[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFiles = ref<File[]>([]);
const isLoading = ref(false);
const quillWrapperRef = ref<HTMLElement | null>(null);
const targetUsers = ref<
  Array<{
    departmentId: number | null;
    userId: number | null;
  }>
>([
  {
    departmentId: null,
    userId: null,
  },
]);

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
  dueAt: null as string | null,
  requesterId: useUserStore().user?.id || null,
  categoryId: null as number | null,
  isPrivate: false,
});

// Separate ref for DatePicker (Date object)
const dueAtDate = ref<Date | null>(null);

// Handle DatePicker change event
const handleDatePickerChange = (value: any) => {
  // Ensure we set the value
  if (value) {
    formData.value.dueAt = value;
    dueAtDate.value = parseDateTime(value);
  } else {
    formData.value.dueAt = null;
    dueAtDate.value = null;
  }
};

// Watch formData.dueAt to sync with dueAtDate
watch(
  () => formData.value.dueAt,
  (newValue) => {
    if (newValue) {
      const parsed = parseDateTime(newValue);
      if (parsed) {
        dueAtDate.value = parsed;
      }
    } else {
      dueAtDate.value = null;
    }
  },
);

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
      toast.warning('Você não pode criar uma tarefa privada para si mesmo.');
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

const priorityOptions = computed(() => [
  { value: TicketPriority.Low, label: formatSnakeToNaturalCase(TicketPriority.Low) },
  { value: TicketPriority.Medium, label: formatSnakeToNaturalCase(TicketPriority.Medium) },
  { value: TicketPriority.High, label: formatSnakeToNaturalCase(TicketPriority.High) },
]);

const priorityValue = computed(() => {
  return formData.value.priority;
});

const updatePriority = (value: string) => {
  formData.value.priority = value as TicketPriority;
};

const privateOptions = computed(() => [
  { value: 'false', label: 'Não' },
  { value: 'true', label: 'Sim' },
]);

const isPrivateValue = computed(() => {
  return formData.value.isPrivate.toString();
});

const updateIsPrivate = (value: string) => {
  formData.value.isPrivate = value === 'true';
};

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
  placeholder: 'Adicione uma descrição',
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

const parseDateTime = (dateString: string): Date | null => {
  if (!dateString) return null;
  try {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
  } catch {
    return null;
  }
};

const disabledDate = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  // Disable weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }

  // Disable past dates
  if (dateToCheck < today) {
    return true;
  }

  return false;
};

const loadDepartments = async () => {
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    toast.error('Erro ao carregar setores');
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

const loadAllUsers = async () => {
  try {
    const { data } = await userService.fetch({ limit: 100 });
    allUsers.value = data.items;
  } catch {
    toast.error('Erro ao carregar usuários');
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

const getFileDisplayText = () => {
  if (selectedFiles.value.length === 0) return '';

  const firstName = selectedFiles.value[0].name;
  const maxLength = 22; // Maximum characters before truncation

  let displayName = firstName;
  if (displayName.length > maxLength) {
    displayName = displayName.substring(0, maxLength) + '...';
  }

  if (selectedFiles.value.length === 1) {
    return displayName;
  }

  const additionalCount = selectedFiles.value.length - 1;
  return `${displayName} e +${additionalCount}`;
};

const clearSelectedFiles = () => {
  selectedFiles.value = [];
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    priority: TicketPriority.Low,
    description: '',
    departmentId: null,
    dueAt: null as string | null,
    requesterId: useUserStore().user!.id,
    categoryId: null,
    isPrivate: false,
  };
  dueAtDate.value = null;
  selectedDepartment.value = null;
  selectedUser.value = null;
  availableUsers.value = [];
  selectedCategory.value = null;
  selectedFiles.value = [];
  isLoading.value = false;
  targetUsers.value = [
    {
      departmentId: null,
      userId: null,
    },
  ];
};

let quillObserver: MutationObserver | null = null;

const moveQuillDropdownToBody = (dropdown: HTMLElement) => {
  // Don't move if already moved
  if (dropdown.dataset.movedToBody === 'true') {
    return;
  }

  // Get the position of the dropdown relative to viewport before moving
  const rect = dropdown.getBoundingClientRect();

  // Find the parent picker to maintain alignment
  const picker = dropdown.closest('.ql-picker');
  const pickerRect = picker ? picker.getBoundingClientRect() : rect;

  // Move to body
  document.body.appendChild(dropdown);
  dropdown.dataset.movedToBody = 'true';

  // Set fixed positioning
  dropdown.style.position = 'fixed';
  dropdown.style.top = `${pickerRect.bottom + 4}px`;
  dropdown.style.left = `${pickerRect.left}px`;
  dropdown.style.zIndex = '10001';

  // Update position when scrolling or resizing
  const updatePosition = () => {
    if (!document.body.contains(dropdown)) {
      return;
    }

    const currentPicker = document.querySelector('.ql-picker.ql-expanded');
    if (currentPicker) {
      const currentPickerRect = currentPicker.getBoundingClientRect();
      dropdown.style.top = `${currentPickerRect.bottom + 4}px`;
      dropdown.style.left = `${currentPickerRect.left}px`;
    }
  };

  // Listen for scroll and resize events
  const scrollHandler = () => updatePosition();
  const resizeHandler = () => updatePosition();

  window.addEventListener('scroll', scrollHandler, true);
  window.addEventListener('resize', resizeHandler);

  // Clean up when dropdown is removed
  const cleanupObserver = new MutationObserver(() => {
    if (!document.body.contains(dropdown)) {
      window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('resize', resizeHandler);
      cleanupObserver.disconnect();
      delete dropdown.dataset.movedToBody;
    }
  });
  cleanupObserver.observe(document.body, { childList: true, subtree: true });
};

onMounted(() => {
  loadDepartments();
  loadCategories();
  loadAllUsers();

  // Set up MutationObserver to detect Quill dropdowns
  nextTick(() => {
    if (quillWrapperRef.value) {
      quillObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Check if it's a Quill picker options dropdown
              let pickerOptions: HTMLElement | null = null;

              if (node.classList && node.classList.contains('ql-picker-options')) {
                pickerOptions = node;
              } else {
                const found = node.querySelector('.ql-picker-options');
                if (found instanceof HTMLElement) {
                  pickerOptions = found;
                }
              }

              if (pickerOptions) {
                moveQuillDropdownToBody(pickerOptions);
              }
            }
          });
        });
      });

      quillObserver.observe(quillWrapperRef.value, {
        childList: true,
        subtree: true,
      });
    }
  });
});

onUnmounted(() => {
  if (quillObserver) {
    quillObserver.disconnect();
  }

  // Clean up any remaining dropdowns in body
  const remainingDropdowns = document.body.querySelectorAll('.ql-picker-options');
  remainingDropdowns.forEach((dropdown) => {
    if (dropdown.parentElement === document.body) {
      document.body.removeChild(dropdown);
    }
  });
});

const validateForm = () => {
  if (
    formData.value.isPrivate &&
    selectedUser.value &&
    Number(selectedUser.value) === currentUserId
  ) {
    toast.error('Você não pode criar uma tarefa privada para si mesmo.');
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
  const hasValidTargetUsers = targetUsers.value.some((tu) => tu.userId !== null);
  if (!hasValidTargetUsers) {
    toast.error('Selecione pelo menos um usuário destino');
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
    try {
      const { data } = await awsService.getSignedUrl(file.name);

      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      const fileUrl = data.url.split('?')[0];
      uploadedUrls.push(fileUrl);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', file.name, error);
      throw error;
    }
  }

  return uploadedUrls;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.value.description, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));

    for (const img of images) {
      const base64 = img.src;

      if (!base64.startsWith('data:image/')) continue;

      try {
        const blob = await fetch(base64).then((res) => res.blob());
        const ext = blob.type.split('/')[1];
        // Generate a filename for inline images since we don't have the original name
        const fileName = `image_${Date.now()}.${ext}`;

        const { data } = await awsService.getSignedUrl(fileName);
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
        isLoading.value = false;
        return;
      }
    }

    formData.value.description = doc.body.innerHTML;

    formData.value.categoryId = selectedCategory.value;

    // Extract target user IDs from targetUsers array
    const targetUserIds = targetUsers.value
      .filter((tu) => tu.userId !== null)
      .map((tu) => tu.userId!);

    if (targetUserIds.length === 0) {
      toast.error('Selecione pelo menos um usuário destino');
      isLoading.value = false;
      return;
    }

    const fileUrls = await uploadFilesToS3();

    // Convert Date object to ISO string
    const dueAtISO = dueAtDate.value ? dueAtDate.value.toISOString() : undefined;

    const ticketData = {
      name: formData.value.name,
      priority: formData.value.priority,
      description: formData.value.description,
      requesterId: formData.value.requesterId!,
      dueAt: dueAtISO,
      categoryId: selectedCategory.value ?? null,
      isPrivate: formData.value.isPrivate,
      files: fileUrls,
      targetUserIds,
    };

    await ticketService.create(ticketData);
    await Promise.all([ticketsStore.fetchMyTickets(), ticketsStore.fetchReceivedTickets(), ticketsStore.fetchDepartmentTickets()]);

    toast.success('Tarefa criada com sucesso!');
    emit('ticketCreated');
    closeModal();
    // router.push('/minhas-tarefas?tab=criadas');
  } catch {
    toast.error('Erro ao criar tarefa');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Ensure DatePicker takes full width */
:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input-wrapper) {
  width: 100%;
}

/* Override button height to match input height */
#newTicketModal label.btn.btn-primary[for='fileUpload'] {
  height: auto !important;
  padding-top: 0.625rem !important;
  padding-bottom: 0.625rem !important;
}

#newTicketModal button[title='Limpar arquivos selecionados'] {
  height: auto !important;
  padding-top: 0.625rem !important;
  padding-bottom: 0.625rem !important;
}

.quill-wrapper {
  border: 1px solid #d7dee8;
  border-radius: 6px;
  overflow: hidden;
}

:deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 6px 6px 0 0 !important;
  padding: 10px 12px;
}

:deep(.ql-container) {
  border: none !important;
  border-radius: 0 0 6px 6px !important;
  min-height: 110px;
}

:deep(.ql-editor) {
  min-height: 110px;
  padding: 14px;
}

/* Ensure Quill dropdowns appear above modal footer */
:deep(.ql-picker-options) {
  z-index: 10001 !important;
}

:deep(.ql-snow .ql-picker) {
  z-index: 10001;
}

.dark #newTicketModal .quill-wrapper {
  border-color: #485063;
}
</style>

<style>
.dark #newTicketModal div.overflow-y-auto {
  scrollbar-color: #4b5563 transparent;
}

.dark #newTicketModal div.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563 !important;
}

.dark #newTicketModal div.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280 !important;
}
/* Mobile responsive Quill editor */
@media (max-width: 640px) {
  .quill-wrapper {
    margin-bottom: 30px;
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
.dark #newTicketModal .ql-toolbar {
  border-color: #2f3542;
  border-bottom-color: #485063 !important;
  background: #1f2937;
}

.dark #newTicketModal .ql-container {
  border-color: #2f3542;
  background: #1f2937;
}

.dark #newTicketModal .ql-editor {
  color: #f9fafb;
  background: #1f2937;
}

.dark #newTicketModal .ql-editor.ql-blank::before {
  color: rgba(255, 255, 255, 0.85) !important;
  opacity: 1 !important;
}

.dark #newTicketModal .ql-toolbar button:hover {
  color: #e5e7eb;
}

.dark #newTicketModal .ql-toolbar button.ql-active {
  color: #60a5fa;
}

.dark #newTicketModal .ql-snow .ql-stroke {
  stroke: #9ca3af;
}

.dark #newTicketModal .ql-snow .ql-fill {
  fill: #9ca3af;
}

.dark #newTicketModal .ql-snow .ql-picker-label {
  color: #9ca3af;
}

.dark #newTicketModal .ql-snow .ql-picker-options {
  background: #1f2937;
  border-color: #374151;
}

.dark #newTicketModal .ql-snow .ql-picker-item {
  color: #e5e7eb;
}

.dark #newTicketModal .ql-snow .ql-picker-item:hover {
  background: #374151;
}

/* Calendar icon in dark mode - in non-scoped style for better targeting */
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper i,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper i *,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper svg,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper svg *,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper path,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper .mx-icon-calendar,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper .mx-icon-calendar *,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper i,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper i *,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper svg,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper svg *,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper path,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper .mx-icon-calendar,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper .mx-icon-calendar * {
  color: #9ca3af !important;
  fill: #9ca3af !important;
  stroke: #9ca3af !important;
}

/* Target icon by position (last child) */
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper > *:last-child,
body.dark-mode #newTicketModal .mx-datepicker .mx-input-wrapper > *:last-child *,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper > *:last-child,
.dark #newTicketModal .mx-datepicker .mx-input-wrapper > *:last-child * {
  color: #9ca3af !important;
  fill: #9ca3af !important;
  stroke: #9ca3af !important;
}
</style>
