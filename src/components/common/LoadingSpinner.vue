<template>
  <div
    class="spinner"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderWidth: size / 9 + 'px',
    }"
  ></div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  size: {
    type: Number,
    default: 30,
  },
});
</script>

<style scoped>
.spinner {
  display: inline-block;
  border: solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
