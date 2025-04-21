<template>
  <div class="modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Novo Ticket</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="ticket-form">
        <div class="form-grid">
          <div class="form-group span-2">
            <label for="title">Assunto: <span class="required">*</span></label>
            <input type="text" id="title" v-model="formData.name" required />
          </div>

          <div class="form-group">
            <label>É privado?</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="formData.isPrivate" :value="true" name="isPrivate" />
                Sim
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.isPrivate" :value="false" name="isPrivate" />
                Não
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="targetDepartment">Setor Destino: <span class="required">*</span></label>
            <select
              id="targetDepartment"
              v-model="selectedDepartment"
              required
              @change="updateUsersList"
            >
              <option :value="null">Selecione um setor</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="targetUser">Usuário Destino:</label>
            <select id="targetUser" v-model="selectedUser" :disabled="!selectedDepartment">
              <option :value="null">Selecione um setor primeiro</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.firstName }} {{ user.lastName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="category">Categoria: <span class="required">*</span></label>
            <select id="category" v-model="selectedCategory" required>
              <option :value="null">Selecione uma categoria</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Prioridade: <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.Low"
                  name="priority"
                  required
                />
                {{ formatSnakeToNaturalCase(TicketPriority.Low) }}
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.Medium"
                  name="priority"
                />
                {{ formatSnakeToNaturalCase(TicketPriority.Medium) }}
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.priority"
                  :value="TicketPriority.High"
                  name="priority"
                />
                {{ formatSnakeToNaturalCase(TicketPriority.High) }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="dueAt">Concluir até:</label>
            <input type="datetime-local" id="dueAt" v-model="formData.dueAt" />
          </div>

          <div class="form-group full-width">
            <label for="description">Descrição: <span class="required">*</span></label>
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
          <div class="form-group full-width">
            <label class="file-upload-label" for="fileUpload">
              <font-awesome-icon icon="paperclip" /> Anexar Arquivos</label
            >
            <input class="hidden" type="file" id="fileUpload" multiple @change="handleFileChange" />
            <ul v-if="selectedFiles.length">
              <li v-for="(file, i) in selectedFiles" :key="i" style="display: flex; margin-bottom: 4px;">
                <font-awesome-icon icon="file" style="margin-right: 5px" />
                <p style="font-size: 14px;">{{ file.name }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="resetForm">Limpar</button>
          <button type="submit" class="btn btn-primary">Criar Ticket</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ticketService } from '@/services/ticketService';
import { departmentService } from '@/services/departmentService';
import { userService } from '@/services/userService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'vue3-toastify';
import { TicketPriority, type Category, type Department, type User } from '@/models';
import { useUserStore } from '@/stores/user';
import { formatSnakeToNaturalCase } from '@/utils/generic-helper';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import { awsService } from '@/services/awsService';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'ticketCreated'): void;
}>();

const departments = ref<Department[]>([]);
const availableUsers = ref<User[]>([]);
const selectedDepartment = ref<number | null>(null);
const selectedUser = ref<number | null>(null);
const categories = ref<Category[]>([]);
const selectedCategory = ref<number | null>(null);
const selectedFiles = ref<File[]>([]);

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

// Carregar departamentos
const loadDepartments = async () => {
  try {
    const { data } = await departmentService.fetch({ limit: 100 });
    departments.value = data.items;
  } catch {
    toast.error('Erro ao carregar departamentos');
  }
};

// Carregar categorias
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
    const response = await userService.getByDepartment(selectedDepartment.value);
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

    await ticketService.create({ ...formData.value, files: fileUrls });
    toast.success('Ticket criado com sucesso!');
    emit('ticketCreated');
    closeModal();
  } catch {
    toast.error('Erro ao criar ticket');
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #1a2233;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.ticket-form {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group:has(.radio-group) {
  grid-column: span 1;
}

.form-group:has([type='datetime-local']) {
  grid-column: span 1;
}

/* Ajustes específicos para o novo layout */
.form-grid > .form-group:nth-child(1) {
  /* Assunto */
  grid-column: span 2;
}

.form-grid > .form-group:nth-child(2) {
  /* É privado */
  grid-column: span 1;
}

.form-grid > .form-group:nth-child(3), /* Setor Destino */
.form-grid > .form-group:nth-child(4), /* Usuário Destino */
.form-grid > .form-group:nth-child(5) {
  /* Categoria */
  grid-column: span 1;
}

.form-grid > .form-group:nth-child(6), /* Prioridade */
.form-grid > .form-group:nth-child(7) {
  /* Concluir até */
  grid-column: span 1;
}

.form-grid > .form-group:last-child {
  /* Descrição */
  grid-column: 1 / -1;
}

.radio-group {
  display: flex;
  gap: 16px;
  padding-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #1a2233;
  cursor: pointer;
}

label {
  font-size: 14px;
  color: #1a2233;
}

input[type='radio'] {
  margin: 0;
  cursor: pointer;
}

input,
select,
textarea {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  color: #1a2233;
  background: #fff;
  width: 100%;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

textarea {
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.quill-wrapper {
  margin-bottom: 50px;
}

.hidden {
  display: none;
}

.file-upload-label {
  width: 150px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background-color: #02153b;
  border-radius: 5px;
  color: white;
  margin-bottom: 6px;
}

/* Dark mode */
:deep(body.dark-mode) .modal-content {
  background: #141b2a;
}

:deep(body.dark-mode) .modal-header {
  background: #1a2233;
}

:deep(body.dark-mode) label {
  color: #e2e8f0;
}

:deep(body.dark-mode) .radio-label {
  color: #e2e8f0;
}

:deep(body.dark-mode) input,
:deep(body.dark-mode) select,
:deep(body.dark-mode) textarea {
  background: #1a2233;
  border-color: #2d3748;
  color: #e2e8f0;
}

:deep(body.dark-mode) input:focus,
:deep(body.dark-mode) select:focus,
:deep(body.dark-mode) textarea:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

:deep(body.dark-mode) .form-actions {
  border-top-color: #2d3748;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

/* Remove file input styles */
.file-input-wrapper,
.file-input,
.file-input-button,
.file-name {
  display: none;
}
</style>
