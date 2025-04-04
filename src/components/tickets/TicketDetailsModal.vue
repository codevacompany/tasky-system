<template>
  <BaseModal :isOpen="isOpen" title="Detalhes do Ticket" @close="closeModal">
    <div class="modal-body">
      <div class="ticket-details">
        <h3>{{ ticket?.name }}</h3>
        <p>
          <strong>Solicitante:</strong> {{ ticket?.requester.firstName }}
          {{ ticket?.requester.lastName }}
        </p>
        <p><strong>Setor:</strong> {{ ticket?.department.name }}</p>
        <p><strong>Prioridade:</strong> {{ ticket?.priority }}</p>
        <p><strong>Status:</strong> {{ ticket?.status }}</p>
        <p><strong>Data de Criação:</strong> {{ formatDate(ticket?.createdAt) }}</p>
        <p><strong>Data de Conclusão:</strong> {{ formatDate(ticket?.completionDate) }}</p>
        <p><strong>Descrição:</strong> {{ ticket?.description }}</p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import type { Ticket } from '@/models';

defineProps({
  isOpen: Boolean,
  ticket: Object as () => Ticket,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '—');
</script>

<style scoped>
.ticket-details {
  padding: 1rem;
}

.ticket-details h3 {
  margin-bottom: 1rem;
}

.ticket-details p {
  margin: 0.5rem 0;
}
</style>
