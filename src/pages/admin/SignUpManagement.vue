<template>
  <div class="p-6">
    <header class="mb-8">
      <div class="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h1 class="text-2xl font-semibold text-txt-primary dark:text-white">Gestão de Cadastros</h1>
        </div>
        <div class="flex items-center">
          <div class="relative min-w-[300px] max-w-[400px]">
            <font-awesome-icon
              icon="search"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-txt-light/80 dark:text-gray-500"
            />
            <Input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, CNPJ ou e-mail"
              padding="tight"
              class="w-full pr-4 pl-10 text-sm bg-white dark:bg-gray-800 text-txt-primary dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </div>
      </div>
    </header>

    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-soft-xs border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
      >
        <div
          class="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p>Carregando...</p>
      </div>

      <div
        v-if="error"
        class="flex flex-col items-center justify-center py-12 text-red-600 dark:text-red-400"
      >
        <p class="mb-4">{{ error }}</p>
        <button
          @click="fetchSignups"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>

      <div v-if="!isLoading && !error" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                Nome da Empresa
              </th>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                CNPJ
              </th>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                E-mail
              </th>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                Telefone
              </th>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                Data Cadastro
              </th>
              <th
                class="px-4 py-3 text-center text-sm font-semibold text-txt-primary dark:text-gray-100 whitespace-nowrap"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="signup in filteredSignups" :key="signup.id">
              <tr
                @click="toggleExpand(signup.id)"
                :class="[
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                  { 'bg-blue-50 dark:bg-blue-900/20': expandedId === signup.id },
                ]"
              >
                <td class="px-4 py-4 text-txt-primary dark:text-gray-100">{{ signup.companyName || '-' }}</td>
                <td class="px-4 py-4 text-txt-primary dark:text-gray-100">{{ signup.cnpj || '-' }}</td>
                <td class="px-4 py-4 text-txt-primary dark:text-gray-100">
                  {{ signup.contactEmail || '-' }}
                </td>
                <td class="px-4 py-4 text-txt-primary dark:text-gray-100">
                  {{ signup.contactPhone || '-' }}
                </td>
                <td class="px-4 py-4">
                  <span
                    :class="[
                      'inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium',
                      {
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200':
                          signup.status === SignUpStatus.PENDING,
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                          signup.status === SignUpStatus.COMPLETED,
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                          signup.status === SignUpStatus.REJECTED,
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                          signup.status === SignUpStatus.APPROVED,
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': false, // removed unused status
                      },
                    ]"
                  >
                    {{ formatStatus(signup.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-txt-primary dark:text-gray-100">
                  {{ formatDate(signup.createdAt) }}
                </td>
                <td class="px-4 py-4" @click.stop>
                  <div class="flex items-center justify-center gap-2">
                    <button
                      v-if="signup.status !== SignUpStatus.COMPLETED"
                      class="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      @click="openEditModal(signup)"
                      title="Editar cadastro"
                    >
                      <font-awesome-icon icon="pen" />
                    </button>
                    <template v-if="signup.status === SignUpStatus.PENDING">
                      <button
                        class="w-8 h-8 rounded flex items-center justify-center transition-colors"
                        :class="
                          canApproveSignup(signup)
                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400'
                            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-60'
                        "
                        :disabled="!canApproveSignup(signup)"
                        @click="canApproveSignup(signup) && approveSignup(signup)"
                        :title="
                          canApproveSignup(signup)
                            ? 'Confirmar cadastro'
                            : 'Informe o CNPJ e complete os dados da empresa antes de aprovar'
                        "
                      >
                        <font-awesome-icon icon="check-circle" />
                      </button>
                      <button
                        class="w-8 h-8 rounded flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        @click="rejectSignup(signup)"
                        title="Rejeitar cadastro"
                      >
                        <font-awesome-icon icon="times-circle" />
                      </button>
                    </template>
                    <template v-else>
                      <template v-if="signup.status === SignUpStatus.APPROVED">
                        <button
                          class="w-8 h-8 rounded flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                          @click="resendEmail(signup)"
                          title="Reenviar e-mail"
                        >
                          <font-awesome-icon icon="envelope" />
                        </button>
                      </template>
                      <span
                        v-else
                        class="w-8 h-8 flex items-center justify-center opacity-70"
                        :class="{
                          'text-green-600': signup.status === SignUpStatus.COMPLETED,
                          'text-red-600': signup.status === SignUpStatus.REJECTED,
                        }"
                        :title="`Cadastro ${formatStatus(signup.status).toLowerCase()}`"
                      >
                        <font-awesome-icon :icon="getStatusIcon(signup.status)" />
                      </span>
                    </template>
                  </div>
                </td>
              </tr>
              <tr v-if="expandedId === signup.id" class="bg-gray-50 dark:bg-gray-800">
                <td colspan="7" class="px-4 py-0">
                  <div class="py-4 text-txt-primary dark:text-gray-100">
                    <div class="flex flex-wrap gap-10">
                      <div class="min-w-[180px] flex-1">
                        <h4 class="text-base font-bold text-blue-600 dark:text-blue-400 mb-2 mt-0">
                          Endereço
                        </h4>
                        <div class="mb-1"><strong>Rua:</strong> {{ signup.street || '-' }}</div>
                        <div class="mb-1"><strong>Número:</strong> {{ signup.number || '-' }}</div>
                        <div class="mb-1">
                          <strong>Bairro/Cidade:</strong> {{ signup.city || '-' }}
                        </div>
                        <div class="mb-1"><strong>Estado:</strong> {{ signup.state || '-' }}</div>
                        <div class="mb-1"><strong>CEP:</strong> {{ signup.cep || '-' }}</div>
                      </div>
                      <div class="min-w-[180px] flex-1">
                        <h4 class="text-base font-bold text-blue-600 dark:text-blue-400 mb-2 mt-0">
                          Responsável
                        </h4>
                        <div class="mb-1">
                          <strong>Nome:</strong> {{ signup.contactName || '-' }}
                        </div>
                        <div class="mb-1"><strong>CPF:</strong> {{ signup.contactCpf || '-' }}</div>
                        <div class="mb-1">
                          <strong>E-mail:</strong> {{ signup.contactEmail || '-' }}
                        </div>
                        <div class="mb-1">
                          <strong>Telefone:</strong> {{ signup.contactPhone || '-' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredSignups.length === 0 && !isLoading">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Nenhum cadastro encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div
        v-if="pagination.totalPages > 1"
        class="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          :disabled="pagination.currentPage === 1"
          @click="changePage(pagination.currentPage - 1)"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>

        <span class="text-sm text-gray-600 dark:text-gray-400">
          Página {{ pagination.currentPage }} de {{ pagination.totalPages }} ({{
            pagination.totalItems
          }}
          registros)
        </span>

        <button
          class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="changePage(pagination.currentPage + 1)"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showEditModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4"
    @click.self="closeEditModal"
  >
    <div class="w-full max-w-xl rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-txt-primary dark:text-gray-100">Editar cadastro</h3>
        <button
          class="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          @click="closeEditModal"
          :disabled="isSavingEdit"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <form class="p-5 space-y-4" @submit.prevent="saveEdit">
        <div>
          <label class="block text-sm font-medium text-txt-primary dark:text-gray-100 mb-1">
            Nome do responsável
          </label>
          <Input v-model="editForm.contactName" type="text" required class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-txt-primary dark:text-gray-100 mb-1">
            E-mail do responsável
          </label>
          <Input v-model="editForm.contactEmail" type="email" required class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-txt-primary dark:text-gray-100 mb-1">
            Telefone do responsável
          </label>
          <Input
            v-model="editForm.contactPhone"
            type="tel"
            required
            maxlength="15"
            @input="editForm.contactPhone = maskPhone(editForm.contactPhone)"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-txt-primary dark:text-gray-100 mb-1">
            CNPJ (opcional)
          </label>
          <Input
            v-model="editForm.cnpj"
            type="text"
            maxlength="18"
            @input="editForm.cnpj = maskCNPJ(editForm.cnpj)"
            class="w-full"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Se informado, os dados da empresa serão atualizados automaticamente a partir do CNPJ.
          </p>
        </div>
        <div class="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="closeEditModal"
            :disabled="isSavingEdit"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            :disabled="isSavingEdit"
          >
            {{ isSavingEdit ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { toast } from 'vue3-toastify';
import { signupService } from '@/services/signupService';
import { SignUpStatus } from '@/models/SignUp';
import type { CompanySignUp } from '@/models/SignUp';
import Input from '@/components/common/Input.vue';
import { maskCNPJ, maskPhone, validateCNPJ } from '@/utils/form-helpers';

const searchTerm = ref('');
const signups = ref<CompanySignUp[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
let autoRefreshInterval: number | null = null;
const showEditModal = ref(false);
const isSavingEdit = ref(false);
const editingSignupId = ref<number | null>(null);
const editForm = reactive({
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  cnpj: '',
});

// Fetch signups from API
async function fetchSignups() {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await signupService.getSignups({
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage,
    });

    const data = response.data;
    signups.value = data.items;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching signups:', err);
  } finally {
    isLoading.value = false;
  }
}

function startAutoRefresh() {
  autoRefreshInterval = setInterval(() => {
    fetchSignups();
  }, 60000) as unknown as number;
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
}

const filteredSignups = computed(() => {
  if (!searchTerm.value) return signups.value;
  const term = searchTerm.value.toLowerCase();
  return signups.value.filter(
    (signup) =>
      (signup.companyName || '').toLowerCase().includes(term) ||
      signup.cnpj?.toLowerCase().includes(term) ||
      false ||
      (signup.email || '').toLowerCase().includes(term) ||
      signup.contactEmail.toLowerCase().includes(term),
  );
});

function formatDate(date: Date) {
  if (!date) return '';
  const d = new Date(date);
  return (
    d.toLocaleDateString('pt-BR') +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatStatus(status: string) {
  switch (status) {
    case SignUpStatus.PENDING:
      return 'PENDENTE';
    case SignUpStatus.APPROVED:
      return 'APROVADO';
    case SignUpStatus.REJECTED:
      return 'REJEITADO';
    case SignUpStatus.COMPLETED:
      return 'COMPLETO';
    default:
      return status.toUpperCase();
  }
}

function canApproveSignup(signup: CompanySignUp): boolean {
  const cnpjDigits = (signup.cnpj || '').replace(/\D/g, '');
  const hasCnpj = cnpjDigits.length === 14;
  const hasCompany = (signup.companyName || '').trim().length > 0;
  return hasCnpj && hasCompany;
}

function getStatusIcon(status: string) {
  switch (status) {
    case SignUpStatus.COMPLETED:
      return 'check-circle';
    case SignUpStatus.REJECTED:
      return 'times-circle';
    case SignUpStatus.APPROVED:
      return 'envelope';
    default:
      return 'info-circle';
  }
}

async function approveSignup(signup: CompanySignUp) {
  try {
    await signupService.approveSignup(signup.id);
    toast.success(`Cadastro de ${signup.companyName || signup.contactName} confirmado!`);
    fetchSignups(); // Refresh the list
  } catch (err) {
    console.error('Error confirming signup:', err);
    const errorMessage = (err as any)?.response?.data?.message || 'Erro ao confirmar cadastro';
    toast.error(errorMessage);
  }
}

async function rejectSignup(signup: CompanySignUp) {
  try {
    await signupService.rejectSignup(signup.id);
    toast.success(`Cadastro de ${signup.companyName || signup.contactName} rejeitado.`);
    fetchSignups(); // Refresh the list
  } catch (err) {
    console.error('Error rejecting signup:', err);
    toast.error('Erro ao rejeitar cadastro');
  }
}

async function resendEmail(signup: CompanySignUp) {
  try {
    await signupService.resendEmail(signup.id);
    toast.success(`E-mail reenviado para ${signup.contactEmail}`);
  } catch (err) {
    console.error('Error resending email:', err);
    toast.error('Erro ao reenviar e-mail');
  }
}

function openEditModal(signup: CompanySignUp) {
  editingSignupId.value = signup.id;
  editForm.contactName = signup.contactName || '';
  editForm.contactEmail = signup.contactEmail || '';
  editForm.contactPhone = signup.contactPhone || '';
  editForm.cnpj = signup.cnpj || '';
  showEditModal.value = true;
}

function closeEditModal() {
  if (isSavingEdit.value) return;
  showEditModal.value = false;
  editingSignupId.value = null;
}

async function saveEdit() {
  if (!editingSignupId.value) return;

  if (editForm.cnpj && !validateCNPJ(editForm.cnpj)) {
    toast.error('CNPJ inválido');
    return;
  }

  isSavingEdit.value = true;
  try {
    await signupService.updateSignup(editingSignupId.value, {
      contactName: editForm.contactName.trim(),
      contactEmail: editForm.contactEmail.trim(),
      contactPhone: editForm.contactPhone.replace(/[^\d]/g, ''),
      cnpj: editForm.cnpj.replace(/[^\d]/g, ''),
    });
    
    toast.success('Cadastro atualizado com sucesso');
    isSavingEdit.value = false;

    closeEditModal();
    await fetchSignups();
  } catch (err) {
    const errorMessage = (err as any)?.response?.data?.message || 'Erro ao atualizar cadastro';
    toast.error(errorMessage);
  } finally {
    isSavingEdit.value = false;
  }
}

const expandedId = ref<number | null>(null);
function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id;
}

function changePage(page: number) {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.currentPage = page;
  fetchSignups();
}

onMounted(() => {
  fetchSignups();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>
