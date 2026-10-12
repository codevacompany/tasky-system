<template>
  <BaseModal
    title="Limite de usuários atingido"
    :showFooter="true"
    confirmButtonText="Ver planos"
    cancelButtonText="Fechar"
    @confirm="goToPlans"
    @cancel="close"
    @close="close"
  >
    <div class="w-full sm:min-w-[420px] max-w-[480px] space-y-3">
      <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
        Seu plano atual permite até
        <span class="font-semibold text-txt-primary dark:text-white">{{ maxUsersLabel }}</span>
        usuários ativos
        <template v-if="currentUsers != null">
          e você já possui
          <span class="font-semibold text-txt-primary dark:text-white">{{ currentUsers }}</span
          >.
        </template>
        <template v-else>.</template>
      </p>
      <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
        Para cadastrar mais colaboradores, faça o upgrade do plano na página de assinaturas.
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '@/components/common/BaseModal.vue';

const props = defineProps<{
  maxUsers?: number | null;
  currentUsers?: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();

const maxUsersLabel = computed(() =>
  props.maxUsers != null ? String(props.maxUsers) : 'o limite',
);

const close = () => emit('close');

const goToPlans = () => {
  emit('close');
  router.push('/admin/configuracoes/assinaturas');
};
</script>
