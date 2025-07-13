<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Gerenciamento de Assinaturas
      </h1>
    </header>

    <!-- Current Subscription Section -->
    <div
      v-if="currentSubscription?.hasSubscription && currentSubscription.subscription"
      class="mt-6 mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div
        class="px-6 py-4 bg-gray-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="star" class="text-white text-lg" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Assinatura Atual</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Sua assinatura ativa no momento</p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <h4
              class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Plano
            </h4>
            <p class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentSubscription.subscription.planName }}
            </p>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(currentSubscription.subscription.status)"
              >
                {{ getStatusLabel(currentSubscription.subscription.status) }}
              </span>
            </div>

            <div
              v-if="currentSubscription.billing"
              class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Cobrança Mensal
              </h5>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Plano base:</span>
                  <span class="font-medium text-gray-900 dark:text-white"
                    >R$ {{ currentSubscription.billing.basePlanCost.toFixed(2) }}</span
                  >
                </div>
                <div
                  v-if="currentSubscription.billing.additionalUsers > 0"
                  class="flex justify-between"
                >
                  <span class="text-gray-600 dark:text-gray-400"
                    >{{ currentSubscription.billing.additionalUsers }} usuário{{
                      currentSubscription.billing.additionalUsers > 1 ? 's' : ''
                    }}
                    adicional{{
                      currentSubscription.billing.additionalUsers > 1 ? 'is' : ''
                    }}:</span
                  >
                  <span class="font-medium text-gray-900 dark:text-white"
                    >R$ {{ currentSubscription.billing.additionalUsersCost.toFixed(2) }}</span
                  >
                </div>
                <div
                  class="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-1"
                >
                  <span class="font-medium text-gray-900 dark:text-white">Total:</span>
                  <span class="font-bold text-blue-600 dark:text-blue-400"
                    >R$ {{ currentSubscription.billing.totalCost.toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Usage Stats -->
          <div class="space-y-2">
            <h4
              class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Uso
            </h4>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Usuários</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ currentSubscription.userStats.totalUsers }}/{{
                      currentSubscription.subscription.maxUsers || '∞'
                    }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="
                      currentSubscription.billing?.exceedsLimit ? 'bg-orange-500' : 'bg-blue-600'
                    "
                    :style="{ width: getUsagePercentage() + '%' }"
                  ></div>
                </div>
                <div v-if="currentSubscription.billing?.exceedsLimit" class="mt-1">
                  <span class="text-xs text-orange-600 dark:text-orange-400">
                    ⚠️ Limite excedido: +{{ currentSubscription.billing.additionalUsers }} usuário{{
                      currentSubscription.billing.additionalUsers > 1 ? 's' : ''
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trial/Billing Info -->
          <div class="space-y-2">
            <h4
              class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ currentSubscription.subscription.trialEndDate ? 'Trial' : 'Próximo ciclo' }}
            </h4>
            <div v-if="currentSubscription.subscription.trialEndDate" class="space-y-1">
              <p class="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Termina em {{ formatDate(currentSubscription.subscription.trialEndDate) }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Após o trial, será cobrado mensalmente
              </p>
            </div>
            <div v-else class="space-y-1">
              <p class="text-sm text-gray-900 dark:text-white font-medium">
                {{
                  currentSubscription.subscription.endDate
                    ? formatDate(currentSubscription.subscription.endDate)
                    : 'Ativo'
                }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Renovação automática</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State for Plans -->
    <div v-if="isLoadingPlans" class="flex justify-center items-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else class="flex justify-center mb-8">
      <div class="flex gap-7 max-w-6xl w-full">
        <div
          v-for="plan in availablePlans"
          :key="plan.slug"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-[280px]"
          :class="getPlanCardClass(plan.slug)"
        >
          <div class="p-3" :class="getPlanHeaderClass(plan.slug)">
            <h2 class="text-base font-semibold text-white">{{ plan.name }}</h2>
          </div>
          <div v-if="plan.slug === 'crescer'" class="absolute top-9 right-3 z-10">
            <div
              class="bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-400"
            >
              Maior procura
            </div>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <div class="mb-4">
              <div v-if="plan.slug === 'adicional'" class="space-y-1">
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">R$ 399</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">/mês</span>
                </div>
                <div>
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">+ R$ 15</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">/usuário adicional</span>
                </div>
              </div>
              <div v-else>
                <span class="text-2xl font-bold text-gray-900 dark:text-white"
                  >R$ {{ Number(plan.priceMonthly).toFixed(0) }}</span
                >
                <span class="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </div>
            </div>
            <ul class="space-y-2 mb-4 flex-1">
              <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                {{ getPlanFeatures(plan).users }}
              </li>
              <li
                v-for="feature in getPlanFeatures(plan).features"
                :key="feature"
                class="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
                {{ feature }}
              </li>
            </ul>
            <div class="mb-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                {{ plan.description }}
              </p>
            </div>
            <button
              class="w-full py-2 px-3 text-white text-sm font-medium rounded-md transition-colors mt-auto"
              :class="getPlanButtonClass(plan.slug)"
              :disabled="isCurrentPlan(plan.slug) || isSubscribing"
              @click="handleSubscription(plan.slug)"
            >
              {{ getButtonText(plan.slug) }}
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
              Valor mensal:
              <span class="font-semibold"
                >R$ {{ Number(selectedPlan.priceMonthly).toFixed(2) }}</span
              >
            </p>
            <p v-if="selectedPlan.maxUsers" class="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Limite de usuários: {{ selectedPlan.maxUsers }}
            </p>
            <p v-else class="text-gray-600 dark:text-gray-400 text-sm mt-2">Usuários ilimitados</p>
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
            :disabled="isSubscribing"
            @click="confirmSubscription"
          >
            {{ isSubscribing ? 'Processando...' : 'Confirmar Assinatura' }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import BaseModal from '@/components/common/BaseModal.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { subscriptionService } from '@/services/subscriptionService';
import { useUserStore } from '@/stores/user';
import { authService } from '@/services/authService';

interface Payment {
  id: number;
  date: Date;
  plan: string;
  amount: number;
  status: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  maxUsers: number | null;
  priceMonthly: string | number;
  priceYearly: string | number | null;
  description: string;
  isActive: boolean;
}

const userStore = useUserStore();
const user = computed(() => userStore.user);

const showSubscriptionModal = ref(false);
const selectedPlan = ref<SubscriptionPlan | null>(null);
const payments = ref<Payment[]>([]);
const isLoading = ref(true);
const isLoadingPlans = ref(true);
const isSubscribing = ref(false);
const availablePlans = ref<SubscriptionPlan[]>([]);
const currentSubscription = ref<any>(null);

// Mock data para histórico de pagamentos (será removido quando integrar com backend)
const mockPayments = [
  {
    id: 1,
    date: new Date('2024-02-29'),
    plan: 'Plano Crescer',
    amount: 199.0,
    status: 'Pago',
  },
  {
    id: 2,
    date: new Date('2024-01-31'),
    plan: 'Plano Crescer',
    amount: 199.0,
    status: 'Suspenso',
  },
];

// Carregar planos disponíveis
const loadPlans = async () => {
  try {
    isLoadingPlans.value = true;
    const plans = await subscriptionService.getPlans();

    // Filter active plans and sort them with 'adicional' plan last
    const activePlans = plans.filter((plan) => plan.isActive);
    const sortedPlans = activePlans.sort((a, b) => {
      // 'adicional' plan should always come last
      if (a.slug === 'adicional') return 1;
      if (b.slug === 'adicional') return -1;

      // For other plans, maintain their original order
      const order = ['iniciante', 'crescer', 'profissional'];
      const aIndex = order.indexOf(a.slug);
      const bIndex = order.indexOf(b.slug);

      // If both plans are in the order array, sort by index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // If only one plan is in the order array, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // If neither plan is in the order array, maintain original order
      return 0;
    });

    availablePlans.value = sortedPlans;
  } catch (error) {
    console.error('Error loading plans:', error);
    toast.error('Erro ao carregar planos disponíveis');
  } finally {
    isLoadingPlans.value = false;
  }
};

// Carregar assinatura atual
const loadCurrentSubscription = async () => {
  try {
    if (user.value?.tenantId) {
      currentSubscription.value = await subscriptionService.getCurrentSubscription(
        user.value.tenantId,
      );
    }
  } catch (error) {
    console.error('Error loading current subscription:', error);
    toast.error('Erro ao carregar assinatura atual');
  }
};

// Carregar histórico de pagamentos
const loadPaymentHistory = async () => {
  try {
    // Temporariamente usando dados mockados até implementar endpoints de pagamento
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
  await Promise.all([loadPlans(), loadCurrentSubscription(), loadPaymentHistory()]);
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    trial: 'Trial',
    active: 'Ativo',
    suspended: 'Suspenso',
    cancelled: 'Cancelado',
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const statusMap: { [key: string]: string } = {
    trial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
};

const getUsagePercentage = () => {
  if (
    !currentSubscription.value?.userStats?.totalUsers ||
    !currentSubscription.value?.subscription?.maxUsers
  ) {
    return 0;
  }
  const percentage =
    (currentSubscription.value.userStats.totalUsers /
      currentSubscription.value.subscription.maxUsers) *
    100;
  return Math.min(percentage, 100); // Ensure it doesn't exceed 100%
};

const getPlanCardClass = (slug: string) => {
  if (slug === 'crescer') return 'relative';
  return '';
};

const getPlanHeaderClass = (slug: string) => {
  const classMap: { [key: string]: string } = {
    iniciante: 'bg-blue-600',
    crescer: 'bg-green-600',
    profissional: 'bg-gray-900',
    adicional: 'bg-purple-600',
  };
  return classMap[slug] || 'bg-gray-600';
};

const getPlanButtonClass = (slug: string) => {
  if (isCurrentPlan(slug)) {
    return 'bg-gray-400 cursor-not-allowed';
  }

  const classMap: { [key: string]: string } = {
    iniciante: 'bg-blue-600 hover:bg-blue-700',
    crescer: 'bg-green-600 hover:bg-green-700',
    profissional: 'bg-gray-900 hover:bg-gray-800',
    adicional: 'bg-purple-600 hover:bg-purple-700',
  };
  return classMap[slug] || 'bg-gray-600 hover:bg-gray-700';
};

const getPlanFeatures = (plan: SubscriptionPlan) => {
  const features: { [key: string]: { users: string; features: string[] } } = {
    iniciante: {
      users: 'Até 5 usuários',
      features: ['Funcionalidades básicas de tickets', 'Dashboard simples', 'Notificações in-app'],
    },
    crescer: {
      users: 'Até 15 usuários',
      features: [
        'Todas as funcionalidades do iniciante',
        'Analytics básicos',
        'Notificações por email',
      ],
    },
    profissional: {
      users: 'Até 30 usuários',
      features: [
        'Todas as funcionalidades do Crescer',
        'Analytics avançados',
        'Exportação de relatórios',
        'Supervisores por departamento',
      ],
    },
    adicional: {
      users: 'Aplicável a partir do 31º usuário',
      features: [
        'Sem limite máximo de usuários',
        'Acesso a todas as funcionalidades',
        'Escalabilidade ilimitada',
      ],
    },
  };

  return features[plan.slug] || { users: `Até ${plan.maxUsers || '∞'} usuários`, features: [] };
};

const isCurrentPlan = (slug: string) => {
  return (
    currentSubscription.value?.hasSubscription &&
    currentSubscription.value.subscription?.planSlug === slug
  );
};

const getButtonText = (slug: string) => {
  if (isCurrentPlan(slug)) {
    return 'PLANO ATUAL';
  }

  if (slug === 'adicional') {
    return 'SAIBA MAIS';
  }

  return 'ASSINAR PLANO';
};

const handleSubscription = (slug: string) => {
  const plan = availablePlans.value.find((p) => p.slug === slug);
  if (!plan) return;

  selectedPlan.value = plan;

  if (slug === 'adicional') {
    // Redirecionar para formulário de contato ou abrir modal específico
    window.location.href = 'mailto:comercial@tasky.com.br?subject=Interesse em Usuários Adicionais';
  } else {
    showSubscriptionModal.value = true;
  }
};

const confirmSubscription = async () => {
  if (!selectedPlan.value) return;

  try {
    isSubscribing.value = true;
    await subscriptionService.subscribe(selectedPlan.value.slug);
    toast.success(`Assinatura do ${selectedPlan.value.name} realizada com sucesso!`);
    showSubscriptionModal.value = false;

    await loadCurrentSubscription();

    try {
      await authService.whoami();
    } catch (whoamiError) {
      console.error('Error refreshing permissions:', whoamiError);
      toast.warning(
        'Assinatura realizada, mas houve um problema ao atualizar as permissões. Faça logout e login novamente.',
      );
    }
  } catch (error: any) {
    console.error('Subscription error:', error);

    if (error.response?.status === 403) {
      toast.error('Você não tem permissão para realizar assinaturas.');
    } else {
      toast.error('Erro ao realizar assinatura. Tente novamente.');
    }
  } finally {
    isSubscribing.value = false;
  }
};

const downloadInvoice = async (id: number) => {
  try {
    // Temporariamente mockado até implementar endpoint de download
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
