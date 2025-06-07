<template>
  <div class="p-6 max-w-sm mx-auto bg-white dark:bg-green-800 rounded shadow-card flex items-center space-x-4">
    <div class="w-full">
      <div class="text-xl font-medium text-text">Tailwind Colors</div>
      <p class="text-text-light mb-4">These are our brand colors in Tailwind!</p>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="p-4 bg-blue-300 dark:bg-blue-100 text-black rounded">Primary</div>
        <div class="p-4 bg-primary-dark text-white rounded">Primary Dark</div>
        <div class="p-4 bg-success text-white rounded">Success</div>
        <div class="p-4 bg-danger text-white rounded">Danger</div>
        <div class="p-4 bg-warning text-white rounded">Warning</div>
        <div class="p-4 bg-info text-white rounded">Info</div>
        <div class="p-4 bg-secondary-dark text-white rounded">Secondary Dark</div>
        <div class="p-4 bg-bg-body rounded">Body Background</div>
      </div>

      <div class="flex space-x-2">
        <button class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          Primary Button
        </button>
        <button class="px-4 py-2 bg-success text-white rounded hover:shadow-card-hover">
          Success Button
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this test component
</script>
