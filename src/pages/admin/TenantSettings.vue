<template>
  <div class="p-4 md:p-6 md:pt-0 max-w-[1500px]">
    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="space-y-8">
      <!-- Header Skeleton -->
      <div
        class="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft-sm border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div class="space-y-2">
          <div class="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          <div class="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
        </div>
        <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
      </div>

      <!-- Sections Skeleton -->
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
        >
          <div class="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="j in 4" :key="j" class="space-y-2">
            <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div
        class="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 mb-8"
      >
        <div>
          <h2 class="text-2xl font-bold text-txt-primary dark:text-white m-0">Dados Gerais</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 m-0">
            Informações de identificação e endereço da sua empresa.
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-6 py-2.5 btn-primary text-white rounded-[5px] text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving || isLoading"
          @click="saveSettings"
        >
          <font-awesome-icon v-if="isSaving" icon="spinner" spin />
          <font-awesome-icon v-else icon="save" />
          {{ isSaving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>

      <div class="space-y-8">
        <!-- Seção: Identificação -->
        <section
          id="identificacao"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
        >
          <div
            class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <h3
              class="m-0 text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2"
            >
              <font-awesome-icon icon="id-card" class="text-blue-500" />
              Identificação da Empresa
            </h3>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Razão Social</label
              >
              <Input v-model="tenant.name" class="w-full" placeholder="Nome completo da empresa" />
            </div>
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >E-mail Principal</label
              >
              <Input
                v-model="tenant.email"
                type="email"
                class="w-full"
                placeholder="contato@empresa.com.br"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >CNPJ</label
              >
              <Input
                v-model="tenant.cnpj"
                class="w-full"
                placeholder="00.000.000/0000-00"
                v-maska="'##.###.###/####-##'"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Telefone</label
              >
              <Input
                v-model="tenant.phoneNumber"
                class="w-full"
                placeholder="(00) 00000-0000"
                v-maska="'(##) #####-####'"
              />
            </div>
          </div>
        </section>

        <!-- Seção: Faturamento -->
        <section
          id="faturamento"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
        >
          <div
            class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <h3
              class="m-0 text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2"
            >
              Dados de Faturamento
            </h3>
          </div>
          <div class="p-8 space-y-6">
            <div>
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >E-mail do Faturamento</label
              >
              <Input
                v-model="tenant.billingEmail"
                type="email"
                class="w-full border-blue-200 dark:border-blue-900/30 focus:border-blue-500"
                placeholder="financeiro@empresa.com.br"
              />
              <p class="mt-2 text-xs text-primary dark:text-primary font-medium">
                <font-awesome-icon icon="info-circle" class="mr-1" />
                As notas fiscais e comprovantes de pagamento serão enviados para este e-mail.
              </p>
            </div>
          </div>
        </section>

        <!-- Seção: Endereço -->
        <section
          id="endereco"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
        >
          <div
            class="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <h3
              class="m-0 text-lg font-bold text-txt-primary dark:text-white flex items-center gap-2"
            >
              <font-awesome-icon icon="map-marker-alt" class="text-blue-500" />
              Endereço Fiscal
            </h3>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-6 gap-6">
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >CEP</label
              >
              <div class="relative">
                <Input
                  v-model="tenant.cep"
                  class="w-full"
                  placeholder="00000-000"
                  v-maska="'#####-###'"
                  @blur="handleCepBlur"
                />
                <font-awesome-icon
                  v-if="isSearchingCep"
                  icon="spinner"
                  spin
                  class="absolute right-3 top-3 text-blue-500"
                />
              </div>
            </div>
            <div class="md:col-span-3">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Cidade</label
              >
              <Input v-model="tenant.city" class="w-full" />
            </div>
            <div class="md:col-span-1">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >UF</label
              >
              <Input v-model="tenant.state" class="w-full" placeholder="SP" v-maska="'@@'" />
            </div>
            <div class="md:col-span-4">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Logradouro</label
              >
              <Input v-model="tenant.street" class="w-full" />
            </div>
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Número</label
              >
              <Input v-model="tenant.number" class="w-full" />
            </div>
            <div class="md:col-span-3">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Bairro</label
              >
              <Input v-model="tenant.neighborhood" class="w-full" />
            </div>
            <div class="md:col-span-3">
              <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >Complemento</label
              >
              <Input v-model="tenant.complement" class="w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { tenantService } from '@/services/tenantService';
import Input from '@/components/common/Input.vue';
import { toast } from 'vue3-toastify';
import axios from 'axios';

const isLoading = ref(true);
const isSaving = ref(false);
const isSearchingCep = ref(false);
const activeSection = ref('identificacao');

const tenant = ref<any>({
  name: '',
  cnpj: '',
  email: '',
  billingEmail: '',
  phoneNumber: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
});

const sections = [
  { id: 'identificacao', label: 'Identificação', icon: 'id-card' },
  { id: 'faturamento', label: 'Faturamento', icon: 'envelope-open-text' },
  { id: 'endereco', label: 'Endereço', icon: 'map-marker-alt' },
];

const fetchTenantData = async () => {
  try {
    isLoading.value = true;
    const response = await tenantService.getMe();
    tenant.value = { ...tenant.value, ...response.data };
  } catch (error) {
    console.error('Erro ao buscar dados do tenant:', error);
    toast.error('Erro ao carregar dados da empresa.');
  } finally {
    isLoading.value = false;
  }
};

const saveSettings = async () => {
  try {
    isSaving.value = true;

    // Extract fields
    const fields = [
      'name',
      'customKey',
      'email',
      'billingEmail',
      'cnpj',
      'phoneNumber',
      'cep',
      'state',
      'city',
      'neighborhood',
      'street',
      'number',
      'complement',
    ];

    const updateData: any = {};
    fields.forEach((field) => {
      if (tenant.value[field] !== undefined && tenant.value[field] !== '') {
        updateData[field] = tenant.value[field];
      }
    });

    await tenantService.updateMe(updateData);
    toast.success('Configurações salvas com sucesso!');
  } catch (error: any) {
    console.error('Erro ao salvar dados do tenant:', error);
    toast.error(error.response?.data?.message || 'Erro ao salvar alterações.');
  } finally {
    isSaving.value = false;
  }
};

const handleCepBlur = async () => {
  const cep = tenant.value.cep?.replace(/\D/g, '');
  if (cep && cep.length === 8) {
    try {
      isSearchingCep.value = true;
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data && !response.data.erro) {
        tenant.value.street = response.data.logradouro;
        tenant.value.neighborhood = response.data.bairro;
        tenant.value.city = response.data.localidade;
        tenant.value.state = response.data.uf;
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      isSearchingCep.value = false;
    }
  }
};

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    activeSection.value = id;
  }
};

const handleScroll = () => {
  const scrollPosition = window.scrollY + 150;

  for (const section of sections) {
    const element = document.getElementById(section.id);
    if (element) {
      const top = element.offsetTop;
      const height = element.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = section.id;
        break;
      }
    }
  }
};

onMounted(() => {
  fetchTenantData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.shadow-soft-sm {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 1px 2px rgba(0, 0, 0, 0.03);
}

.tracking-tight {
  letter-spacing: -0.025em;
}

section {
  scroll-margin-top: 100px;
}
</style>
