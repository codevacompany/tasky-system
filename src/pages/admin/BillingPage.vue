<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Gerenciamento de Assinaturas
      </h1>
    </header>

    <div class="flex justify-center mb-8">
      <div class="flex gap-7 max-w-6xl w-full">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-[280px]"
        >
          <div class="bg-blue-600 p-3">
            <h2 class="text-base font-semibold text-white">Plano Iniciante</h2>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="mb-4">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">R$ 99</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">/mês</span>
            </div>
            <ul class="space-y-2 mb-4 flex-1">
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Até 5 usuários
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Funcionalidades básicas de tickets
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Dashboard simples
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Notificações in-app
              </li>
            </ul>
            <div class="mb-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                Ideal para microempresas e startups
              </p>
            </div>
            <button
              class="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors mt-auto"
              @click="handleSubscription('iniciante')"
            >
              ASSINAR PLANO
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col relative w-[280px]"
        >
          <div class="bg-green-600 p-3">
            <h2 class="text-base font-semibold text-white">Plano Crescer</h2>
          </div>
          <div class="absolute top-9 right-3 z-10">
            <div
              class="bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-400"
            >
              Maior procura
            </div>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="mb-4">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">R$ 199</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">/mês</span>
            </div>
            <ul class="space-y-2 mb-4 flex-1">
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Até 15 usuários
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Todas as funcionalidades do iniciante
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Analytics básicos
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Notificações por email
              </li>
            </ul>
            <div class="mb-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                Ideal para pequenas empresas em crescimento
              </p>
            </div>
            <button
              class="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors mt-auto"
              @click="handleSubscription('crescer')"
            >
              ASSINAR PLANO
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-[280px]"
        >
          <div class="bg-gray-900 p-3">
            <h2 class="text-base font-semibold text-white">Plano Profissional</h2>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="mb-4">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">R$ 399</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">/mês</span>
            </div>
            <ul class="space-y-2 mb-4 flex-1">
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Até 30 usuários
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Todas as funcionalidades
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Analytics avançados
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Exportação de relatórios
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Supervisores por departamento
              </li>
            </ul>
            <div class="mb-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                Ideal para empresas médias
              </p>
            </div>
            <button
              class="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors mt-auto"
              @click="handleSubscription('profissional')"
            >
              ASSINAR PLANO
            </button>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-[280px]"
        >
          <div class="bg-purple-600 p-3">
            <h2 class="text-base font-semibold text-white">Usuários Adicionais</h2>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="mb-4">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">R$ 15</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">/usuário/mês</span>
            </div>
            <ul class="space-y-2 mb-4 flex-1">
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Aplicável a partir do 31º usuário
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Sem limite máximo de usuários
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Acesso a todas as funcionalidades
              </li>
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                Escalabilidade ilimitada
              </li>
            </ul>
            <div class="mb-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                Para empresas em expansão
              </p>
            </div>
            <button
              class="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors mt-auto"
              @click="handleSubscription('adicional')"
            >
              SAIBA MAIS
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Histórico de Pagamentos -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
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
          <p class="text-gray-500 dark:text-gray-400">Nenhum pagamento encontrado.</p>
        </div>

        <!-- Payment History Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Data
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Plano
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Comprovante
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="payment in payments" :key="payment.id">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                >
                  {{ formatDate(payment.date) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                >
                  {{ payment.plan }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 text-center"
                >
                  R$ {{ payment.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="
                      payment.status === 'Pago'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <button
                    v-if="payment.status === 'Pago'"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center mx-auto"
                    @click="downloadInvoice(payment.id)"
                  >
                    <font-awesome-icon icon="download" class="mr-1" />
                    DOWNLOAD
                  </button>
                  <span v-else class="text-gray-400 dark:text-gray-500"> Indisponível </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Assinatura -->
    <BaseModal
      v-if="showSubscriptionModal"
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
                Valor mensal:
                <span class="font-semibold">R$ {{ selectedPlan.price.toFixed(2) }}</span>
              </span>
              <span v-else> Valor a ser definido após contato </span>
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
    plan: 'Plano Crescer',
    amount: 199.00,
    status: 'Pago',
  },
  {
    id: 2,
    date: new Date('2024-01-31'),
    plan: 'Plano Crescer',
    amount: 199.00,
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
  iniciante: {
    id: 'iniciante',
    name: 'Plano Iniciante',
    price: 99.0,
  },
  crescer: {
    id: 'crescer',
    name: 'Plano Crescer',
    price: 199.0,
  },
  profissional: {
    id: 'profissional',
    name: 'Plano Profissional',
    price: 399.0,
  },
  adicional: {
    id: 'adicional',
    name: 'Usuários Adicionais',
    price: 15.0,
  },
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const handleSubscription = (planId: keyof typeof plans) => {
  selectedPlan.value = plans[planId];
  if (planId === 'adicional') {
    // Redirecionar para formulário de contato ou abrir modal específico
    window.location.href = 'mailto:comercial@tasky.com.br?subject=Interesse em Usuários Adicionais';
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
        status: 'Pago',
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
