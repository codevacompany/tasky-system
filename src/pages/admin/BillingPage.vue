<template>
  <div class="p-4 md:p-6 md:pt-0 max-w-[1500px]">
    <header
      class="mb-8 flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div>
        <h1 class="text-2xl font-bold text-txt-primary dark:text-white m-0">Plano e Faturamento</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 m-0">
          Gerencie sua assinatura, veja detalhes do plano e histórico de cobranças.
        </p>
      </div>
      <button
        v-if="!hasTrial && currentSubscription?.hasSubscription"
        @click="handleManageSubscription"
        :disabled="isLoadingPortal"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
      >
        <font-awesome-icon icon="external-link-alt" class="text-xs" />
        Portal de Cobrança do Stripe
      </button>
    </header>

    <!-- Current Subscription Section Skeleton -->
    <div
      v-if="isLoadingSubscription"
      class="mb-8 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center gap-2 mb-4">
        <div class="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
        <div class="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-shimmer"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Left Column Skeleton -->
        <div>
          <div class="flex items-baseline gap-2 mb-4">
            <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
          <div class="space-y-2">
            <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
        </div>

        <!-- Middle Column Skeleton -->
        <div class="pl-4">
          <div class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3 skeleton-shimmer"></div>
          <ul class="space-y-2">
            <li v-for="i in 4" :key="i" class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
              <div class="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            </li>
          </ul>
        </div>

        <!-- Right Column Skeleton -->
        <div class="flex flex-col items-center justify-center">
          <div
            class="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-shimmer mb-3"
          ></div>
          <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
        </div>
      </div>

      <div
        class="mt-6 mx-auto w-[300px] h-10 bg-gray-200 dark:bg-gray-700 rounded-md skeleton-shimmer"
      ></div>
    </div>

    <!-- Current Subscription Section -->
    <div
      v-else-if="currentSubscription?.hasSubscription && currentSubscription.subscription"
      class="mb-8 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center gap-2 mb-4">
        <h2 class="text-lg font-semibold text-txt-primary dark:text-white">
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Left Column: Price and Trial Info -->
        <div>
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-3xl font-bold text-txt-primary dark:text-white">
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

        <!-- Middle Column: Features List -->
        <div class="pl-4">
          <h3 class="text-sm font-medium text-txt-primary dark:text-white mb-3">
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

        <!-- Right Column: Circular Progress -->
        <div
          v-if="currentSubscription.subscription.maxUsers"
          class="flex flex-col items-center justify-center"
        >
          <div class="relative w-32 h-32">
            <svg class="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                class="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                :class="
                  currentSubscription.billing?.exceedsLimit
                    ? 'text-orange-500'
                    : 'text-blue-600 dark:text-blue-500'
                "
                :stroke-dasharray="getCircleDashArray()"
                :stroke-dashoffset="getCircleDashOffset()"
                class="transition-all duration-300"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-2xl font-bold text-txt-primary dark:text-white">
                {{ currentSubscription.userStats.totalUsers }}
              </span>
              <span class="text-xs text-gray-600 dark:text-gray-400">
                /{{ currentSubscription.subscription.maxUsers }}
              </span>
            </div>
          </div>
          <p class="text-sm font-medium text-txt-primary dark:text-white mt-3">Usuários</p>
          <div v-if="currentSubscription.billing?.exceedsLimit" class="mt-2">
            <span class="text-xs text-orange-600 dark:text-orange-400">
              ⚠️ Limite excedido: +{{ currentSubscription.billing.additionalUsers }} usuário{{
                currentSubscription.billing.additionalUsers > 1 ? 's' : ''
              }}
            </span>
          </div>
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
    <div>
      <div class="mb-6">
        <!-- Header Skeleton -->
        <div v-if="isLoadingPlans || isLoadingSubscription" class="mb-4">
          <div class="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 skeleton-shimmer"></div>
          <div class="space-y-2">
            <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
        </div>
        <!-- Header Content -->
        <div v-else class="mb-4">
          <h2 class="text-xl font-semibold text-txt-primary dark:text-white mb-2">
            Atualizar plano
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Nossos planos são criados para se adequar ao tamanho do seu projeto. Pague uma taxa fixa
            por um plano definido, mais um pouco extra se ultrapassar. Atualize para o próximo nível
            conforme seu projeto cresce.
          </p>
          <div class="flex items-center gap-3">
            <span
              :class="
                !isYearlyBilling
                  ? 'text-txt-primary dark:text-white font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              "
            >
              Mensal
            </span>
            <Switch v-model="isYearlyBilling" />
            <span
              :class="
                isYearlyBilling
                  ? 'text-txt-primary dark:text-white font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              "
            >
              Anual
            </span>
          </div>
        </div>
      </div>

      <!-- Skeleton Loading State -->
      <div
        v-if="isLoadingPlans || isLoadingSubscription"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col"
        >
          <!-- Title skeleton -->
          <div class="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"></div>

          <!-- Price skeleton -->
          <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"></div>

          <!-- Button skeleton -->
          <div class="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6 skeleton-shimmer"></div>

          <!-- Features skeleton -->
          <div class="mb-4">
            <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-3 skeleton-shimmer"></div>
            <ul class="space-y-2">
              <li v-for="i in 4" :key="i" class="flex items-start gap-2">
                <div
                  class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-0.5 skeleton-shimmer"
                ></div>
                <div class="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Plans Cards (only show when fully loaded) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="plan in availablePlans"
          :key="plan.slug"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col"
        >
          <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-2">
            {{ plan.name }}
          </h3>

          <div v-if="plan.slug === 'customizado'" class="mb-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="leading-relaxed">
                Simule o custo mensal baseado no número de usuários da sua equipe.
              </p>
            </div>
          </div>
          <div v-else class="mb-4">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-txt-primary dark:text-white">
                R$
                {{
                  isYearlyBilling && plan.priceYearly
                    ? (Number(plan.priceYearly) / 12).toFixed(0)
                    : Number(plan.priceMonthly).toFixed(0)
                }}
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                / {{ isYearlyBilling ? 'mês' : 'mês' }}
              </span>
            </div>
            <div v-if="isYearlyBilling && plan.priceYearly" class="mt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                R$ {{ Number(plan.priceYearly).toFixed(0) }} cobrado anualmente
              </span>
            </div>
          </div>

          <button
            v-if="plan.slug === 'customizado'"
            class="btn btn-primary w-full py-2 px-4 text-sm font-medium rounded-md transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSimulateCustomPlan"
          >
            Simular
          </button>
          <button
            v-else
            class="w-full py-2 px-4 text-sm font-medium rounded-md transition-colors mb-6 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-txt-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="
              (isCurrentPlan(plan.slug) && !hasTrial) ||
              isSubscribing ||
              isPlanInsufficientForCurrentUsers(plan)
            "
            :title="
              isPlanInsufficientForCurrentUsers(plan)
                ? `Você possui mais usuários do que este plano suporta.`
                : ''
            "
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
    <SubscriptionExpiredModal
      :is-open="showTrialExpiredModal"
      @close="showTrialExpiredModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Switch from '@/components/common/Switch.vue';
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

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user);

const payments = ref<Payment[]>([]);
const isLoading = ref(true);
const isLoadingPlans = ref(true);
const isLoadingSubscription = ref(true);
const isSubscribing = ref(false);
const isLoadingPortal = ref(false);
const availablePlans = ref<SubscriptionPlan[]>([]);
const currentSubscription = ref<any>(null);
const showTrialExpiredModal = ref(false);
const isYearlyBilling = ref(true);

// Mock data para histórico de pagamentos (será removido quando integrar com backend)
const mockPayments = [
  {
    id: 1,
    date: new Date('2024-02-29'),
    plan: 'Plano Essencial',
    amount: 199.0,
    status: 'Pago',
  },
  {
    id: 2,
    date: new Date('2024-01-31'),
    plan: 'Plano Essencial',
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
      const order = ['basico', 'essencial', 'avancado'];
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
    isLoadingSubscription.value = true;
    if (user.value?.tenantId) {
      currentSubscription.value = await subscriptionService.getCurrentSubscription(
        user.value.tenantId,
      );
    }
  } catch (error) {
    console.error('Error loading current subscription:', error);
    toast.error('Erro ao carregar assinatura atual');
  } finally {
    isLoadingSubscription.value = false;
  }
};

// Carregar dados ao montar o componente
onMounted(async () => {
  await Promise.all([loadPlans(), loadCurrentSubscription()]);

  // Handle Stripe Checkout redirects
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    toast.success('Assinatura realizada com sucesso');
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

const getCircleDashArray = () => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  return circumference;
};

const getCircleDashOffset = () => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const percentage = getUsagePercentage();
  return circumference * (1 - percentage / 100);
};

const getPlanFeatures = (plan: SubscriptionPlan) => {
  const features: { [key: string]: { users: string; features: string[] } } = {
    basico: {
      users: 'Até 5 usuários',
      features: ['Funcionalidades básicas de tickets', 'Dashboard simples', 'Notificações in-app'],
    },
    essencial: {
      users: 'Até 15 usuários',
      features: [
        'Todas as funcionalidades do Básico',
        'Analytics básicos',
        'Notificações por email',
      ],
    },
    avancado: {
      users: 'Até 30 usuários',
      features: [
        'Todas as funcionalidades do Essencial',
        'Analytics avançados',
        'Exportação de relatórios',
        'Supervisores por setor',
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

const handleSimulateCustomPlan = () => {
  router.push('/admin/configuracoes/assinaturas/simular-plano-customizado');
};

const isPlanInsufficientForCurrentUsers = (plan: SubscriptionPlan) => {
  if (!plan.maxUsers || plan.slug === 'customizado') {
    return false;
  }

  const currentUsers = currentSubscription.value?.userStats?.totalUsers || 0;
  return currentUsers > plan.maxUsers;
};

const handleSubscription = async (slug: string) => {
  const plan = availablePlans.value.find((p) => p.slug === slug);
  if (!plan) return;

  if (slug === 'customizado') {
    handleSimulateCustomPlan();
    return;
  }

  if (isPlanInsufficientForCurrentUsers(plan)) {
    toast.error(
      `Este plano suporta apenas ${plan.maxUsers} usuários. Você possui ${currentSubscription.value?.userStats?.totalUsers} usuários ativos.`,
    );
    return;
  }

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

  try {
    isSubscribing.value = true;
    const billingInterval = isYearlyBilling.value ? 'yearly' : 'monthly';
    const response = (await subscriptionService.subscribe(plan.slug, {
      billingInterval,
    })) as {
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

<style scoped></style>
