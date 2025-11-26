<template>
  <div class="p-6 max-w-[1600px] mx-auto">
    <header class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Gerenciar Assinaturas</h1>
      <button
        v-if="!hasTrial && currentSubscription?.hasSubscription"
        @click="handleManageSubscription"
        :disabled="isLoadingPortal"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
      >
        Ver faturas anteriores
      </button>
    </header>

    <!-- Current Subscription Section -->
    <div
      v-if="currentSubscription?.hasSubscription && currentSubscription.subscription"
      class="mb-8 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center gap-2 mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ currentSubscription.subscription.planName }}
        </h2>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="
            currentSubscription.subscription.trialEndDate
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          "
        >
          {{ currentSubscription.subscription.trialEndDate ? 'Trial' : 'Plano atual' }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Left Column: Price and Trial Info -->
        <div>
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">
              R$ {{ currentSubscription.billing?.basePlanCost.toFixed(0) || '0' }}
            </span>
            <span class="text-gray-600 dark:text-gray-400">/ mês</span>
          </div>

          <div v-if="currentSubscription.subscription.trialEndDate">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Trial termina em {{ formatDate(currentSubscription.subscription.trialEndDate) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Após o trial, o acesso será suspenso até a escolha de um plano.
            </p>
          </div>
        </div>

        <!-- Right Column: Features List -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            O que está incluído:
          </h3>
          <ul class="space-y-2">
            <li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
              <span
                >Até {{ currentSubscription.subscription.maxUsers || '∞' }} usuário{{
                  currentSubscription.subscription.maxUsers ? 's' : ''
                }}{{ !currentSubscription.subscription.maxUsers ? ' (ilimitado)' : '' }}</span
              >
            </li>
            <li
              v-for="feature in getPlanFeatures(
                availablePlans.find((p) => p.slug === currentSubscription.subscription.planSlug) ||
                  ({} as SubscriptionPlan),
              ).features"
              :key="feature"
              class="flex items-center text-sm text-gray-700 dark:text-gray-300"
            >
              <font-awesome-icon icon="check" class="text-green-500 mr-2 text-xs" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Usage Bar -->
      <div
        v-if="currentSubscription.subscription.maxUsers"
        class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Usuários</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ currentSubscription.userStats.totalUsers }}/{{
              currentSubscription.subscription.maxUsers
            }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="currentSubscription.billing?.exceedsLimit ? 'bg-orange-500' : 'bg-blue-600'"
            :style="{ width: getUsagePercentage() + '%' }"
          ></div>
        </div>
        <div v-if="currentSubscription.billing?.exceedsLimit" class="mt-2">
          <span class="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Limite excedido: +{{ currentSubscription.billing.additionalUsers }} usuário{{
              currentSubscription.billing.additionalUsers > 1 ? 's' : ''
            }}
          </span>
        </div>
      </div>

      <button
        v-if="!hasTrial"
        @click="handleManageSubscription"
        :disabled="isLoadingPortal"
        class="mt-6 mx-auto w-[300px] px-3 py-3 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-600"
      >
        <span v-if="isLoadingPortal">Carregando...</span>
        <span v-else>Gerenciar Assinatura</span>
      </button>
    </div>

    <!-- Upgrade Plans Section -->
    <div v-if="!isLoadingPlans">
      <div class="mb-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Atualizar plano</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Nossos planos são criados para se adequar ao tamanho do seu projeto. Pague uma taxa fixa
            por um plano definido, mais um pouco extra se ultrapassar. Atualize para o próximo nível
            conforme seu projeto cresce.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="plan in availablePlans"
          :key="plan.slug"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ plan.name }}</h3>

          <div v-if="plan.slug === 'customizado'" class="mb-4">
            <div class="flex items-baseline gap-2 mb-2">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">R$ 399</span>
              <span class="text-gray-600 dark:text-gray-400">/ mês</span>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p>+ R$ 15,00 por usuário adicional (a partir do 31º usuário)</p>
            </div>
          </div>
          <div v-else class="mb-4">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">
                R$ {{ Number(plan.priceMonthly).toFixed(0) }}
              </span>
              <span class="text-gray-600 dark:text-gray-400">/ mês</span>
            </div>
          </div>

          <button
            class="w-full py-2 px-4 text-sm font-medium rounded-md transition-colors mb-6 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="(isCurrentPlan(plan.slug) && !hasTrial) || isSubscribing"
            @click="handleSubscription(plan.slug)"
          >
            {{ getButtonText(plan.slug) }}
          </button>

          <div class="mb-4">
            <h4
              class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3"
            >
              Incluído
            </h4>
            <ul class="space-y-2">
              <li class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <font-awesome-icon
                  icon="check"
                  class="text-green-500 mr-2 text-xs mt-0.5 flex-shrink-0"
                />
                <span>{{ getPlanFeatures(plan).users }}</span>
              </li>
              <li
                v-for="feature in getPlanFeatures(plan).features"
                :key="feature"
                class="flex items-start text-sm text-gray-700 dark:text-gray-300"
              >
                <font-awesome-icon
                  icon="check"
                  class="text-green-500 mr-2 text-xs mt-0.5 flex-shrink-0"
                />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State for Plans -->
    <div v-if="isLoadingPlans" class="flex justify-center items-center py-8">
      <LoadingSpinner />
    </div>

    <!-- TODO: Implementar histórico de pagamentos -->
    <!-- <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Histórico de Pagamentos
        </h2> -->

    <!-- Loading State -->
    <!-- <div v-if="isLoading" class="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div> -->

    <!-- Empty State -->
    <!-- <div v-else-if="payments.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Nenhum pagamento encontrado.</p>
        </div> -->

    <!-- Payment History Table -->
    <!-- <div v-else class="overflow-x-auto">
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
    </div> -->

    <SubscriptionExpiredModal
      :is-open="showTrialExpiredModal"
      @close="showTrialExpiredModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { subscriptionService } from '@/services/subscriptionService';
import { useUserStore } from '@/stores/user';
import { authService } from '@/services/authService';
import SubscriptionExpiredModal from '@/components/common/SubscriptionExpiredModal.vue';

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
  stripePriceIdMonthly?: string | null;
  stripePriceIdYearly?: string | null;
  stripePriceIdPerUser?: string | null;
}

const userStore = useUserStore();
const user = computed(() => userStore.user);

const payments = ref<Payment[]>([]);
const isLoading = ref(true);
const isLoadingPlans = ref(true);
const isSubscribing = ref(false);
const isLoadingPortal = ref(false);
const availablePlans = ref<SubscriptionPlan[]>([]);
const currentSubscription = ref<any>(null);
const showTrialExpiredModal = ref(false);

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

    // Filter active plans and sort them with 'customizado' plan last
    const activePlans = plans.filter((plan) => plan.isActive);
    const sortedPlans = activePlans.sort((a, b) => {
      // 'customizado' plan should always come last
      if (a.slug === 'customizado') return 1;
      if (b.slug === 'customizado') return -1;

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

  // Handle Stripe Checkout redirects
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    toast.success('Assinatura realizada com sucesso!');
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
    await loadCurrentSubscription();
    try {
      await authService.whoami();
    } catch (whoamiError) {
      console.error('Error refreshing permissions:', whoamiError);
    }
  } else if (urlParams.get('canceled') === 'true') {
    toast.info('Assinatura cancelada. Você pode tentar novamente quando quiser.');
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (userStore.hasActiveSubscription === false) {
    showTrialExpiredModal.value = true;
  }
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
  // No longer used - headers are now neutral gray
  return '';
};

const getPlanButtonClass = (slug: string) => {
  // If current plan and has trial, show normal button (not disabled)
  if (isCurrentPlan(slug) && hasTrial.value) {
    return 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600';
  }

  // If current plan and no trial, show disabled style
  if (isCurrentPlan(slug)) {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed';
  }

  // Default neutral button style
  return 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600';
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
    customizado: {
      users: 'Sem limite máximo de usuários',
      features: ['Acesso a todas as funcionalidades'],
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

const isInActiveTrial = computed(() => {
  if (!currentSubscription.value?.hasSubscription || !currentSubscription.value.subscription) {
    return false;
  }

  const trialEndDate = currentSubscription.value.subscription.trialEndDate;
  if (!trialEndDate) {
    return false;
  }

  const now = new Date();
  const trialEnd = new Date(trialEndDate);
  return trialEnd > now;
});

const hasTrial = computed(() => {
  return (
    currentSubscription.value?.hasSubscription &&
    currentSubscription.value.subscription?.trialEndDate !== null &&
    currentSubscription.value.subscription?.trialEndDate !== undefined
  );
});

const hasActiveSubscription = computed(() => {
  return currentSubscription.value?.hasSubscription && !hasTrial.value;
});

const getButtonText = (slug: string) => {
  // If current plan and has trial, show "Selecionar plano" (not disabled)
  if (isCurrentPlan(slug) && hasTrial.value) {
    return 'Selecionar plano';
  }

  // If current plan and no trial, show disabled "Plano atual"
  if (isCurrentPlan(slug) && !hasTrial.value) {
    return 'Plano atual';
  }

  // If there's an active subscription (not trial) and it's not the current plan, show "Atualizar plano"
  if (hasActiveSubscription.value && !isCurrentPlan(slug)) {
    return 'Atualizar plano';
  }

  return 'Selecionar plano';
};

const handleSubscription = async (slug: string) => {
  const plan = availablePlans.value.find((p) => p.slug === slug);
  if (!plan) return;

  if (slug === 'customizado') {
    // Redirecionar para formulário de contato ou abrir modal específico
    window.location.href = 'mailto:comercial@tasky.com.br?subject=Interesse em Usuários Adicionais';
    return;
  }

  // If there's an active subscription (not trial), redirect to customer portal
  if (hasActiveSubscription.value) {
    if (!user.value?.tenantId) {
      toast.error('Erro ao identificar o tenant');
      return;
    }

    try {
      isSubscribing.value = true;
      const returnUrl = `${window.location.origin}/assinaturas`;
      const { url } = await subscriptionService.createCustomerPortalSession(
        user.value.tenantId,
        returnUrl,
      );

      window.open(url, '_blank');
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao abrir portal de gerenciamento';
      toast.error(errorMessage);
    } finally {
      isSubscribing.value = false;
    }
    return;
  }

  // Otherwise, proceed with checkout for new subscriptions
  try {
    isSubscribing.value = true;
    const response = (await subscriptionService.subscribe(plan.slug)) as {
      checkoutUrl: string;
      sessionId: string;
    };

    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error: any) {
    console.error('Subscription error:', error);

    if (error.response?.status === 403) {
      toast.error('Você não tem permissão para realizar assinaturas.');
    } else {
      toast.error('Erro ao realizar assinatura. Tente novamente.');
    }
    isSubscribing.value = false;
  }
};

const handleManageSubscription = async () => {
  if (!user.value?.tenantId) {
    toast.error('Erro ao identificar o tenant');
    return;
  }

  try {
    isLoadingPortal.value = true;
    const returnUrl = `${window.location.origin}/admin/billing`;
    const { url } = await subscriptionService.createCustomerPortalSession(
      user.value.tenantId,
      returnUrl,
    );

    window.open(url, '_blank');
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    const errorMessage = error.response?.data?.message || 'Erro ao abrir portal de gerenciamento';
    toast.error(errorMessage);
  } finally {
    isLoadingPortal.value = false;
  }
};
</script>
