<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Gerenciamento de Assinaturas
      </h1>
    </header>

    <!-- Cards de Planos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Plano Básico -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="bg-blue-600 p-4">
          <h2 class="text-lg font-semibold text-white">Plano Básico</h2>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="mb-6">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">R$ 29,90</span>
            <span class="text-gray-500 dark:text-gray-400">/mês</span>
          </div>
          <ul class="space-y-3 mb-6 flex-1">
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              100 tickets/mês
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              5 usuários
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Suporte básico
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Relatórios simples
            </li>
          </ul>
          <button 
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mt-auto"
            @click="handleSubscription('basic')"
          >
            ASSINAR PLANO
          </button>
        </div>
      </div>

      <!-- Plano Profissional -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col relative">
        <div class="bg-green-600 p-4">
          <h2 class="text-lg font-semibold text-white">Plano Profissional</h2>
        </div>
        <div class="absolute top-12 right-4 z-10">
          <div class="bg-yellow-500 text-gray-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border border-yellow-400">
            Maior procura
          </div>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="mb-6">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">R$ 99,90</span>
            <span class="text-gray-500 dark:text-gray-400">/mês</span>
          </div>
          <ul class="space-y-3 mb-6 flex-1">
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              100 tickets/mês
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              20 usuários
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Suporte prioritário
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Relatórios avançados
            </li>
          </ul>
          <button 
            class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors mt-auto"
            @click="handleSubscription('professional')"
          >
            ASSINAR PLANO
          </button>
        </div>
      </div>

      <!-- Plano Empresarial -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="bg-gray-900 p-4">
          <h2 class="text-lg font-semibold text-white">Plano Empresarial</h2>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="mb-6">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">R$ 199,90</span>
            <span class="text-gray-500 dark:text-gray-400">/mês</span>
          </div>
          <ul class="space-y-3 mb-6 flex-1">
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Tickets ilimitados
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Usuários ilimitados
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Suporte 24/7
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              API e integrações
            </li>
          </ul>
          <button 
            class="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors mt-auto"
            @click="handleSubscription('enterprise')"
          >
            ASSINAR PLANO
          </button>
        </div>
      </div>

      <!-- Plano Personalizado -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="bg-purple-600 p-4">
          <h2 class="text-lg font-semibold text-white">Plano Personalizado</h2>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="mb-6 text-center">
            <div class="flex justify-center mb-2">
              <font-awesome-icon 
                icon="handshake" 
                class="text-5xl text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <ul class="space-y-3 mb-6 flex-1">
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Recursos personalizados
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Integrações sob demanda
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              SLA personalizado
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2" />
              Suporte dedicado
            </li>
          </ul>
          <button 
            class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors mt-auto"
            @click="handleSubscription('custom')"
          >
            FALE CONOSCO
          </button>
        </div>
      </div>
    </div>

    <!-- Histórico de Pagamentos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Histórico de Pagamentos
        </h2>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>

        <!-- Empty State -->
        <div v-else-if="payments.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            Nenhum pagamento encontrado.
          </p>
        </div>

        <!-- Payment History Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plano
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Comprovante
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="payment in payments" :key="payment.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center">
                  {{ formatDate(payment.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center">
                  {{ payment.plan }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center">
                  R$ {{ payment.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="payment.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <button 
                    v-if="payment.status === 'Pago'"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center mx-auto"
                    @click="downloadInvoice(payment.id)">
                    <font-awesome-icon icon="download" class="mr-1" />
                    DOWNLOAD
                  </button>
                  <span v-else class="text-gray-400 dark:text-gray-500">
                    Indisponível
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Assinatura -->
    <BaseModal
      :is-open="showSubscriptionModal"
      @close="showSubscriptionModal = false"
      title="Confirmar Assinatura"
      :show-footer="false"
    >
      <div class="space-y-4">
        <div v-if="selectedPlan" class="space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            Você está prestes a assinar o {{ selectedPlan.name }}.
          </p>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-700 dark:text-gray-300">
              <span v-if="selectedPlan.price !== null">
                Valor mensal: <span class="font-semibold">R$ {{ selectedPlan.price.toFixed(2) }}</span>
              </span>
              <span v-else>
                Valor a ser definido após contato
              </span>
            </p>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Ao confirmar, você concorda com os termos de serviço e política de privacidade.
          </p>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            @click="showSubscriptionModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            @click="confirmSubscription"
          >
            Confirmar Assinatura
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { subscriptionService } from '@/services/subscriptionService';

interface Payment {
  id: number;
  date: Date;
  plan: string;
  amount: number;
  status: string;
}

interface Plan {
  id: string;
  name: string;
  price: number | null;
}

const showSubscriptionModal = ref(false);
const selectedPlan = ref<Plan | null>(null);
const payments = ref<Payment[]>([]);
const isLoading = ref(true);

// Mock data para histórico de pagamentos
const mockPayments = [
  {
    id: 1,
    date: new Date('2024-02-29'),
    plan: 'Plano Profissional',
    amount: 99.90,
    status: 'Pago',
  },
  {
    id: 2,
    date: new Date('2024-01-31'),
    plan: 'Plano Profissional',
    amount: 99.90,
    status: 'Suspenso',
  },
];

// Carregar histórico de pagamentos
const loadPaymentHistory = async () => {
  try {
    // Temporariamente usando dados mockados
    // const history = await subscriptionService.getPaymentHistory();
    // payments.value = history;
    payments.value = mockPayments;
  } catch (error) {
    console.error('Error loading payment history:', error);
    toast.error('Erro ao carregar histórico de pagamentos');
  } finally {
    isLoading.value = false;
  }
};

// Carregar dados ao montar o componente
onMounted(async () => {
  await loadPaymentHistory();
});

const plans = {
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    price: 29.90
  },
  professional: {
    id: 'professional',
    name: 'Plano Profissional',
    price: 99.90
  },
  enterprise: {
    id: 'enterprise',
    name: 'Plano Empresarial',
    price: 199.90
  },
  custom: {
    id: 'custom',
    name: 'Plano Personalizado',
    price: null
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const handleSubscription = (planId: keyof typeof plans) => {
  selectedPlan.value = plans[planId];
  if (planId === 'custom') {
    // Redirecionar para formulário de contato ou abrir modal específico
    window.location.href = 'mailto:comercial@tasky.com.br?subject=Interesse no Plano Personalizado';
  } else {
    showSubscriptionModal.value = true;
  }
};

const confirmSubscription = async () => {
  if (!selectedPlan.value) return;
  
  try {
    // Temporariamente mockado
    // await subscriptionService.subscribe(selectedPlan.value.id);
    toast.success(`Assinatura do ${selectedPlan.value.name} realizada com sucesso!`);
    showSubscriptionModal.value = false;
    
    // Adicionar novo pagamento ao histórico apenas se o preço não for null
    if (selectedPlan.value.price !== null) {
      payments.value.unshift({
        id: Date.now(),
        date: new Date(),
        plan: selectedPlan.value.name,
        amount: selectedPlan.value.price,
        status: 'Pago'
      });
    }
  } catch (error) {
    toast.error('Erro ao realizar assinatura. Tente novamente.');
    console.error('Subscription error:', error);
  }
};

const downloadInvoice = async (id: number) => {
  try {
    // Temporariamente mockado
    // const blob = await subscriptionService.downloadInvoice(id);
    toast.success('Download do comprovante iniciado!');
    // Simular download
    const mockPdf = new Blob(['Comprovante mockado'], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(mockPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatura-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    toast.error('Erro ao baixar comprovante. Tente novamente.');
    console.error('Download error:', error);
  }
};
</script> 