<template>
  <div class="p-6 max-w-4xl mx-auto">
    <header class="mb-8">
      <button
        @click="router.back()"
        class="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-txt-primary dark:hover:text-gray-200 transition-colors flex items-center gap-2"
      >
        <font-awesome-icon icon="chevron-left" />
        Voltar
      </button>
      <h1 class="text-2xl font-semibold text-txt-primary dark:text-white">
        Simular Plano Customizado
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Informe o número de usuários para calcular o valor do plano customizado
      </p>
    </header>

    <div
      class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="mb-6 flex items-center gap-3">
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
        <span
          v-if="isYearlyBilling"
          class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        >
          20% OFF
        </span>
      </div>
      <div class="mb-6">
        <label
          for="userCount"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Número de usuários
        </label>
        <Input
          id="userCount"
          v-model.number="userCount"
          type="number"
          min="1"
          placeholder="Digite o número de usuários"
          class="w-full"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          O plano customizado inclui 30 usuários base. Usuários adicionais (a partir do 31º) custam
          R$ 15,00 cada.
        </p>
      </div>

      <div
        v-if="userCount > 0"
        class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
      >
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resumo do cálculo</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Plano base (até 30 usuários):</span>
            <span class="font-medium">
              R$ {{ basePlanPrice.toFixed(2) }}{{ isYearlyBilling ? '/mês' : '' }}
            </span>
          </div>
          <div
            v-if="additionalUsers > 0"
            class="flex justify-between text-gray-600 dark:text-gray-400"
          >
            <span>
              Usuários adicionais ({{ additionalUsers }} usuário{{
                additionalUsers > 1 ? 's' : ''
              }}):
            </span>
            <span class="font-medium">
              R$ {{ additionalUsersCost.toFixed(2) }}{{ isYearlyBilling ? '/mês' : '' }}
            </span>
          </div>
          <div
            v-if="isYearlyBilling && yearlyTotal"
            class="flex justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <span></span>
            <span>R$ {{ yearlyTotal.toFixed(2) }} cobrado anualmente</span>
          </div>
          <div
            class="flex justify-between text-lg font-semibold text-txt-primary dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600"
          >
            <span>Total mensal:</span>
            <span class="font-semibold dark:hidden" style="color: #00143b">
              R$ {{ totalMonthlyPrice.toFixed(2) }}
            </span>
            <span class="font-semibold hidden dark:inline" style="color: rgb(51, 78, 194)">
              R$ {{ totalMonthlyPrice.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          @click="router.back()"
          class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-txt-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          @click="handleSubscribe"
          :disabled="!userCount || userCount < 1 || isSubscribing"
          class="btn btn-primary flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubscribing">Processando...</span>
          <span v-else>{{ subscriptionButtonText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import Input from '@/components/common/Input.vue';
import Switch from '@/components/common/Switch.vue';
import { subscriptionService } from '@/services/subscriptionService';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const userCount = ref<number>(30);
const isSubscribing = ref(false);
const currentSubscription = ref<any>(null);
const isYearlyBilling = ref<boolean>(true); // Default to annual

// Price calculation constants
const BASE_PRICE_MONTHLY = 399;
const BASE_PRICE_YEARLY_MONTHLY = 317; // R$ 317/month for annual billing
const BASE_USERS = 30;
const ADDITIONAL_USER_PRICE = 15; // Same price regardless of billing period

const additionalUsers = computed(() => {
  if (!userCount.value || userCount.value <= BASE_USERS) return 0;
  return userCount.value - BASE_USERS;
});

const basePlanPrice = computed(() => {
  return isYearlyBilling.value ? BASE_PRICE_YEARLY_MONTHLY : BASE_PRICE_MONTHLY;
});

const additionalUsersCost = computed(() => {
  return additionalUsers.value * ADDITIONAL_USER_PRICE;
});

const totalMonthlyPrice = computed(() => {
  return basePlanPrice.value + additionalUsersCost.value;
});

const yearlyTotal = computed(() => {
  if (!isYearlyBilling.value) return null;
  return basePlanPrice.value * 12 + additionalUsersCost.value * 12;
});

const hasActiveSubscription = computed(() => {
  return currentSubscription.value?.hasSubscription && !hasTrial.value;
});

const hasTrial = computed(() => {
  return (
    currentSubscription.value?.hasSubscription &&
    currentSubscription.value.subscription?.trialEndDate !== null &&
    currentSubscription.value.subscription?.trialEndDate !== undefined
  );
});

const subscriptionButtonText = computed(() => {
  if (hasActiveSubscription.value) {
    return 'Atualizar plano';
  }
  return 'Assinar plano';
});

const loadCurrentSubscription = async () => {
  try {
    if (userStore.user?.tenantId) {
      currentSubscription.value = await subscriptionService.getCurrentSubscription(
        userStore.user.tenantId,
      );
    }
  } catch (error) {
    console.error('Error loading current subscription:', error);
  }
};

const handleSubscribe = async () => {
  if (!userCount.value || userCount.value < 1) {
    toast.error('Por favor, informe um número válido de usuários');
    return;
  }

  // For custom plan, we need to handle it differently
  // Since it's a custom plan, we might need to contact support or use a different flow
  // For now, let's redirect to customer portal if there's an active subscription
  if (hasActiveSubscription.value) {
    if (!userStore.user?.tenantId) {
      toast.error('Erro ao identificar o tenant');
      return;
    }

    try {
      isSubscribing.value = true;
      const returnUrl = `${window.location.origin}/assinaturas`;
      const { url } = await subscriptionService.createCustomerPortalSession(
        userStore.user.tenantId,
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

  // For new subscriptions, we might need a different approach for custom plans
  // Since custom plans typically require manual setup, we'll redirect to contact
  toast.info(
    'Para assinar o plano customizado, entre em contato com nossa equipe comercial. Os valores calculados serão enviados por email.',
  );

  const billingPeriod = isYearlyBilling.value ? 'anual' : 'mensal';
  const priceDisplay =
    isYearlyBilling.value && yearlyTotal.value
      ? `R$ ${totalMonthlyPrice.value.toFixed(2)}/mês (R$ ${yearlyTotal.value.toFixed(2)}/ano)`
      : `R$ ${totalMonthlyPrice.value.toFixed(2)}/mês`;

  const subject = encodeURIComponent(
    `Interesse em Plano Customizado - ${userCount.value} usuários - ${priceDisplay}`,
  );
  const body = encodeURIComponent(
    `Olá,\n\nTenho interesse em assinar o Plano Customizado com as seguintes informações:\n\n` +
      `- Número de usuários: ${userCount.value}\n` +
      `- Forma de cobrança: ${billingPeriod}\n` +
      `- Valor calculado: ${priceDisplay}\n` +
      `- Usuários adicionais: ${additionalUsers.value}\n\n` +
      `Aguardo retorno para prosseguir com a assinatura.\n\nAtenciosamente`,
  );

  window.location.href = `mailto:comercial@tasky.com.br?subject=${subject}&body=${body}`;
};

onMounted(async () => {
  await loadCurrentSubscription();
});
</script>
