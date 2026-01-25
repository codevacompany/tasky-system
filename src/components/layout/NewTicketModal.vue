<template>
  <BaseModal
    :hasCustomHeader="true"
    @close="closeModal"
    :closeOnClickOutside="false"
    :confirmButtonLoading="isLoading"
    :isFullScreenMobile="true"
  >
    <template #custom-header>
      <div class="primary-gradient flex items-center justify-between p-3 sm:p-4 text-white">
        <h2
          class="text-base sm:text-lg font-semibold max-w-[680px] truncate"
          :title="currentStep === 1 ? 'Nova Tarefa' : `Nova Tarefa - ${formData.name}`"
        >
          {{ currentStep === 1 ? 'Nova Tarefa' : `Nova Tarefa - ${formData.name}` }}
        </h2>
        <button
          class="bg-transparent border-none text-white opacity-80 text-lg sm:text-xl cursor-pointer p-1 sm:p-2 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
          @click="closeModal"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </template>
    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 mt-2 sm:mt-1 px-2">
      <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 flex-1 sm:flex-none">
        <div
          :class="[
            'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors z-10',
            currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white',
          ]"
        >
          <font-awesome-icon v-if="currentStep === 2" icon="check" class="text-[10px] sm:text-xs" />
          <span v-else>1</span>
        </div>
        <span
          :class="[
            'text-[10px] sm:text-sm font-medium text-center whitespace-nowrap',
            currentStep === 1
              ? 'text-txt-primary dark:text-white'
              : 'text-gray-500 dark:text-gray-400',
          ]"
          >Informações Básicas</span
        >
      </div>

      <div class="w-8 sm:w-16 h-px bg-gray-200 dark:bg-gray-700 mt-3.5 sm:mt-0"></div>

      <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 flex-1 sm:flex-none">
        <div
          :class="[
            'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors z-10',
            currentStep === 2
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400',
          ]"
        >
          2
        </div>
        <span
          :class="[
            'text-[10px] sm:text-sm font-medium text-center whitespace-nowrap',
            currentStep === 2
              ? 'text-txt-primary dark:text-white'
              : 'text-gray-500 dark:text-gray-400',
          ]"
          >Detalhes Adicionais</span
        >
      </div>
    </div>
    <form
      @submit.prevent="handleSubmit"
      class="w-full md:min-w-[748px] min-h-[320px] -mt-1 sm:-mt-2.5"
    >
      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 1" class="space-y-5">
        <!-- Assunto -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
          <FormField
            label="Assunto:"
            htmlFor="title"
            :required="true"
            class="col-span-1 md:col-span-4"
          >
            <Input
              id="title"
              v-model="formData.name"
              placeholder="Digite o assunto da tarefa"
              required
            />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-4 md:gap-5">
          <FormField label="Prioridade:" :required="true" class="col-span-1">
            <Select
              :options="priorityOptions"
              :modelValue="priorityValue"
              @update:modelValue="updatePriority"
            />
          </FormField>

          <FormField
            label="É privado?"
            class="col-span-1"
            tooltip="Tarefas privadas só podem ser visualizadas pelos usuários envolvidos e por administradores. Supervisores podem ver as tarefas privadas no quadro ou na lista mas não podem ver os detalhes da tarefa."
            tooltipWidth="320px"
          >
            <Select
              :options="privateOptions"
              :modelValue="isPrivateValue"
              @update:modelValue="updateIsPrivate"
              :disabled="isPrivateDisabled"
            />
          </FormField>
        </div>

        <TargetUsersSelector
          :departments="departments"
          :allUsers="allUsers"
          v-model:targetUsers="targetUsers"
          :isPrivate="formData.isPrivate"
          :currentUserId="currentUserId"
          class="col-span-2"
        />
        <!-- Reviewer Selector (Only for Admins and Supervisors) -->
        <FormField
          v-if="isAdminOrSupervisor"
          label="Revisor:"
          :optional="true"
          tooltip="Se nenhum revisor for selecionado, você será automaticamente definido como revisor da tarefa."
          tooltipWidth="280px"
        >
          <Select
            :options="reviewerOptions"
            :modelValue="reviewerValue"
            @update:modelValue="updateReviewer"
          />
        </FormField>
      </div>

      <!-- Step 2: Additional Details -->
      <div v-if="currentStep === 2" class="mt-4 sm:mt-8 flex flex-col gap-5">
        <!-- Descrição -->
        <FormField label="Descrição:" htmlFor="description" :required="true" class="w-full">
          <div class="quill-wrapper" ref="quillWrapperRef">
            <QuillEditor
              v-model:content="formData.description"
              contentType="html"
              theme="snow"
              :options="editorOptions"
            />
          </div>
        </FormField>

        <!-- Categoria and Concluir até -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Categoria:" htmlFor="category" :required="true">
            <Select
              :options="categoryOptions"
              :modelValue="selectedCategory?.toString() || ''"
              @update:modelValue="updateSelectedCategory"
            />
          </FormField>

          <FormField
            label="Concluir até:"
            htmlFor="dueAt"
            tooltip="Se nenhuma data de conclusão for definida, o usuário destinatário será obrigado a definir uma antes de aceitar a tarefa."
            tooltipWidth="300px"
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
          </FormField>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
          <button
            class="w-full sm:w-auto py-[10px] px-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
            type="button"
            @click="handleSubtasksClick"
          >
            <font-awesome-icon icon="tasks" class="mr-2" /> Adicionar Subtarefas
          </button>

          <!-- Anexar Arquivos Button -->
          <input class="hidden" type="file" id="fileUpload" multiple @change="handleFileChange" />
          <label
            class="w-full sm:w-auto py-[10px] px-5 border border-dashed border-gray-300 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors hover:cursor-pointer flex items-center justify-center sm:justify-start"
            for="fileUpload"
          >
            <font-awesome-icon icon="paperclip" class="mr-2" /> Anexar Arquivos
          </label>
        </div>

        <!-- Anexar Arquivos -->
        <div v-if="selectedFiles.length > 0" class="mb-4 mt-4 col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-txt-primary dark:text-gray-100 flex items-center gap-2">
              <font-awesome-icon icon="paperclip" class="text-primary dark:text-blue-400" />
              Anexos
              <span
                class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ selectedFiles.length }}
              </span>
            </h3>
          </div>

          <div class="flex gap-3">
            <div v-for="(file, index) in selectedFiles" :key="index" class="relative group">
              <!-- Image Preview Card -->
              <div
                v-if="isImageFile(file)"
                class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] w-[140px] flex items-center justify-center"
              >
                <img
                  :src="getFilePreviewUrl(file)"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
                >
                  <div class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ truncateFileName(file.name) }}
                  </div>
                </div>
                <button
                  @click.stop="removeFileByIndex(index)"
                  class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remover arquivo"
                >
                  <font-awesome-icon icon="times" class="text-xs" />
                </button>
              </div>
              <!-- Non-Image File Card -->
              <div
                v-else
                class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] w-[140px] flex items-center justify-center"
              >
                <div class="text-primary dark:text-blue-400">
                  <font-awesome-icon icon="file" size="3x" />
                </div>
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
                >
                  <div class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ truncateFileName(file.name) }}
                  </div>
                </div>
                <button
                  @click.stop="removeFileByIndex(index)"
                  class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remover arquivo"
                >
                  <font-awesome-icon icon="times" class="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Subtarefas (Checklist) -->
        <div
          v-if="showChecklist"
          ref="checklistSectionRef"
          class="col-span-2 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-txt-primary dark:text-gray-100 flex items-center gap-2">
              <font-awesome-icon icon="tasks" class="text-primary dark:text-blue-400" />
              Subtarefas
              <span
                v-if="checklistItems.length > 0"
                class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ checklistItems.length }}
              </span>
            </h3>
          </div>

          <!-- Checklist Items -->
          <div v-if="checklistItems.length > 0" class="space-y-2 mb-4">
            <div
              v-for="(item, index) in checklistItems"
              :key="index"
              class="group flex items-start gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
            >
              <div
                class="mt-1 w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
              ></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-txt-primary dark:text-gray-100">
                  {{ item.title }}
                </div>
              </div>
              <button
                type="button"
                @click="removeChecklistItem(index)"
                class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Excluir item"
              >
                <font-awesome-icon icon="times" class="text-xs" />
              </button>
            </div>
          </div>

          <!-- Add Item Form -->
          <div
            v-if="showAddChecklist"
            class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
          >
            <Input
              v-model="newItemTitle"
              type="text"
              placeholder="O que precisa ser feito?"
              class="mb-3"
              @keyup.enter="addChecklistItem"
              @keyup.escape="cancelAddChecklist"
              ref="itemInputRef"
            />
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="addChecklistItem"
                class="px-4 py-2 btn btn-primary hover:opacity-95 text-white text-sm font-medium rounded transition-colors"
              >
                Adicionar
              </button>
              <button
                type="button"
                @click="cancelAddChecklist"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          <!-- Empty State Add Button -->
          <button
            v-if="!showAddChecklist"
            @click="startAddChecklist"
            type="button"
            class="w-full px-4 py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg transition-all flex items-center justify-center gap-2 group"
          >
            <font-awesome-icon
              icon="plus"
              class="text-xs group-hover:scale-110 transition-transform"
            />
            Adicionar uma subtarefa
          </button>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[5px] text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleCancel"
        :disabled="isLoading"
      >
        {{ currentStep === 1 ? 'Cancelar' : 'Voltar' }}
      </button>
      <button
        ref="confirmButtonRef"
        type="button"
        class="w-full sm:w-auto min-w-20 px-4 py-2 bg-secondary hover:opacity-95 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        @click="handleConfirm"
        :disabled="isLoading"
      >
        <LoadingSpinner v-if="isLoading" :size="16" :color="'white'" />
        <span v-else>{{ currentStep === 1 ? 'Próximo' : 'Criar Tarefa' }}</span>
      </button>
    </template>
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
import { TicketPriority, type Category, type Department, type User, RoleName } from '@/models';
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
import FormField from '@/components/common/FormField.vue';
import TargetUsersSelector from '@/components/common/TargetUsersSelector.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import pt from 'vue-datepicker-next/locale/pt-br.es';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const router = useRouter();
const ticketsStore = useTicketsStore();
const departments = ref<Department[]>([]);
const availableUsers = ref<User[]>([]);
const allUsers = ref<User[]>([]);
const reviewerUsers = ref<User[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFiles = ref<File[]>([]);
const isLoading = ref(false);
const quillWrapperRef = ref<HTMLElement | null>(null);

// Checklist state
const checklistItems = ref<{ title: string }[]>([]);
const newItemTitle = ref('');
const showChecklist = ref(false);
const showAddChecklist = ref(false);
const itemInputRef = ref<InstanceType<typeof Input> | null>(null);
const checklistSectionRef = ref<HTMLElement | null>(null);

const handleSubtasksClick = async () => {
  showChecklist.value = true;
  startAddChecklist();
  await nextTick();
  if (checklistSectionRef.value) {
    checklistSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const addChecklistItem = () => {
  const title = newItemTitle.value.trim();
  if (title) {
    checklistItems.value.push({ title });
    newItemTitle.value = '';
    showAddChecklist.value = false;
  }
};

const removeChecklistItem = (index: number) => {
  checklistItems.value.splice(index, 1);
};

const startAddChecklist = async () => {
  showAddChecklist.value = true;
  newItemTitle.value = '';
  await nextTick();
  if (itemInputRef.value && typeof (itemInputRef.value as any).focus === 'function') {
    (itemInputRef.value as any).focus();
  }
};

const cancelAddChecklist = () => {
  showAddChecklist.value = false;
  newItemTitle.value = '';
};

// Step management
const currentStep = ref(1);
const maxSteps = 2;
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
  reviewerId: null as number | null,
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

// Watch targetUsers to automatically set isPrivate to false if current user is selected
watch(
  () => targetUsers.value,
  (newTargetUsers) => {
    const hasCurrentUserAsTarget = newTargetUsers.some((tu) => tu.userId === currentUserId);
    if (hasCurrentUserAsTarget && formData.value.isPrivate) {
      formData.value.isPrivate = false;
      toast.info('Tarefa privada desabilitada: você está selecionado como destinatário.');
    }
  },
  { deep: true },
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

const isPrivateDisabled = computed(() => {
  // Disable if current user is selected as a target
  return targetUsers.value.some((tu) => tu.userId === currentUserId);
});

const updateIsPrivate = (value: string) => {
  // Prevent setting to true if current user is a target
  if (value === 'true' && isPrivateDisabled.value) {
    toast.warning('Você não pode criar uma tarefa privada para si mesmo.');
    return;
  }
  formData.value.isPrivate = value === 'true';
};

const editorOptions = computed(() => {
  const isMobile = window.innerWidth < 640;
  return {
    modules: {
      toolbar: isMobile
        ? [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
          ]
        : [
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
});

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

// Reviewer-related computed properties
const isAdminOrSupervisor = computed(() => {
  const user = useUserStore().user;
  return user?.role?.name === RoleName.TenantAdmin || user?.role?.name === RoleName.Supervisor;
});

const reviewerOptions = computed(() => [
  { value: '', label: 'Selecione um revisor' },
  ...reviewerUsers.value.map((user) => ({
    value: user.id.toString(),
    label: `${user.firstName} ${user.lastName}`,
  })),
]);

const reviewerValue = computed(() => {
  return formData.value.reviewerId?.toString() || '';
});

const updateReviewer = (value: string) => {
  formData.value.reviewerId = value ? parseInt(value) : null;
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

const loadReviewers = async () => {
  try {
    const { data } = await userService.fetch({ limit: 100 });
    // Filter only admins and supervisors
    reviewerUsers.value = data.items.filter(
      (user) => user.role?.name === RoleName.TenantAdmin || user.role?.name === RoleName.Supervisor,
    );
  } catch {
    toast.error('Erro ao carregar revisores');
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

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

const truncateFileName = (fileName: string, maxLength: number = 15): string => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split('.').pop() || '';
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
  return `${truncatedName}...${extension}`;
};

const removeFileByIndex = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const handleCancel = () => {
  if (currentStep.value === 1) {
    closeModal();
  } else {
    goToPreviousStep();
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
    reviewerId: null,
  };
  dueAtDate.value = null;
  selectedDepartment.value = null;
  selectedUser.value = null;
  availableUsers.value = [];
  selectedCategory.value = null;
  selectedFiles.value = [];
  checklistItems.value = [];
  isLoading.value = false;
  currentStep.value = 1;
  targetUsers.value = [
    {
      departmentId: null,
      userId: null,
    },
  ];
};

const goToNextStep = () => {
  if (currentStep.value < maxSteps) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const validateStep1 = (): boolean => {
  if (!formData.value.name.trim()) {
    toast.error('O campo Assunto é obrigatório');
    return false;
  }

  if (!targetUsers.value.some((tu) => tu.userId !== null)) {
    toast.error('Selecione pelo menos um usuário destino');
    return false;
  }

  if (!formData.value.priority) {
    toast.error('O campo Prioridade é obrigatório');
    return false;
  }

  return true;
};

const handleConfirm = () => {
  if (currentStep.value === 1) {
    if (validateStep1()) {
      goToNextStep();
    }
  } else {
    handleSubmit();
  }
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
  loadReviewers();

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
  const uploadedFiles: Array<{ url: string; name: string; mimeType: string; size: number }> = [];

  for (const file of selectedFiles.value) {
    try {
      const { data } = await awsService.getSignedUrl(file.name);

      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      const fileUrl = data.url.split('?')[0];
      uploadedFiles.push({
        url: fileUrl,
        name: file.name,
        mimeType: file.type,
        size: file.size,
      });
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', file.name, error);
      throw error;
    }
  }

  return uploadedFiles;
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
      reviewerId: formData.value.reviewerId,
      files: fileUrls,
      targetUserIds,
      checklistItems: checklistItems.value,
    };

    await ticketService.create(ticketData);

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
  min-height: 10px;
}

:deep(.ql-editor) {
  min-height: 125px;
  padding: 14px;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal !important;
  color: #9ca3af !important;
  font-size: 0.875rem !important;
  left: 14px !important;
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
  color: #9ca3af !important;
  font-style: normal !important;
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

/* Quill Editor Mobile Optimizations */
:deep(.ql-toolbar.ql-snow) {
  border-color: #e5e7eb;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #f9fafb;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dark :deep(.ql-toolbar.ql-snow) {
  border-color: #374151;
  background-color: #1f2937;
}

:deep(.ql-container.ql-snow) {
  border-color: #e5e7eb;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  min-height: 150px;
  font-family: inherit;
}

.dark :deep(.ql-container.ql-snow) {
  border-color: #374151;
}

:deep(.ql-editor) {
  font-size: 14px;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
}

@media (max-width: 640px) {
  :deep(.ql-toolbar.ql-snow) {
    padding: 4px;
  }

  :deep(.ql-formats) {
    margin-right: 8px !important;
  }
}
</style>
