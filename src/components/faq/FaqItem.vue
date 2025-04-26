<template>
  <div class="faq-item">
    <div class="faq-question">
      <font-awesome-icon icon="question-circle" class="faq-icon" />
      <span>{{ question }}</span>
    </div>
    <div class="faq-answer">
      <span v-html="answer"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.faq-item {
  background: none;
  border-radius: 8px;
  box-shadow: none;
  padding: 0 0 0.5rem 0;
  transition: box-shadow 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--primary-color, #1976d2);
  margin-bottom: 0.3rem;
  gap: 8px;
}

.faq-icon {
  color: var(--primary-color, #1976d2);
  font-size: 1.1rem;
}

.faq-answer {
  font-size: 1rem;
  color: var(--text-color, #333);
  line-height: 1.6;
}
</style>
