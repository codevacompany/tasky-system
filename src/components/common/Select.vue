<template>
  <div class="relative w-full">
    <select
      :value="modelValue"
      @change="updateValue"
      :class="[
        'appearance-none bg-white w-full px-3 py-2 pr-10 text-sm font-medium rounded-md border transition-colors cursor-pointer',
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10',
        'hover:border-gray-300',
        'text-gray-700 border-gray-200',
      ]"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500"
    >
      <font-awesome-icon icon="chevron-down" class="text-xs" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

defineOptions({
  inheritAttrs: false,
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>
