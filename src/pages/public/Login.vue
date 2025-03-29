<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
  // Simulating a login action
  router.push('/user'); // Redirect to user home page
};
</script>

<template>
  <div class="greetings">
    <h1 class="green">Login</h1>
    <h3>You’ve successfully created a project</h3>
    <button @click="login">Login</button>
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #2c7a62;
}
</style>
