<template>
  <div class="relative w-full" ref="selectContainer">
    <!-- Select Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      :class="[
        'appearance-none w-full px-[14px] pr-10 text-sm font-medium rounded-[5px] border border-inputBorder transition-colors cursor-pointer relative text-left',
        props.compact ? 'py-1.5' : 'py-2.5',
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10',
        'hover:border-gray-300',
        disabled
          ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
          : 'bg-white dark:bg-gray-800',
        'text-gray-800 dark:text-white border-gray-200 dark:border-gray-700',
        isOpen && 'border-blue-500 ring-2 ring-blue-500/10',
      ]"
    >
      <span class="truncate block text-left pr-6">
        {{ selectedLabel || placeholder }}
      </span>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400"
      >
        <font-awesome-icon
          icon="chevron-down"
          class="text-xs transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen && !disabled"
          :class="[
            'fixed z-[10000] bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-lg overflow-auto',
            isOpeningUpwards ? 'origin-bottom' : 'origin-top',
            props.dropdownMaxHeight &&
            (props.dropdownMaxHeight.startsWith('max-h-') || props.dropdownMaxHeight.includes('['))
              ? props.dropdownMaxHeight
              : props.dropdownMaxHeight || 'max-h-[200px]',
          ]"
          ref="dropdownMenu"
          :style="{
            ...dropdownStyle,
            ...(props.dropdownMaxHeight &&
            !props.dropdownMaxHeight.startsWith('max-h-') &&
            !props.dropdownMaxHeight.includes('[')
              ? { maxHeight: props.dropdownMaxHeight }
              : {}),
          }"
        >
          <div class="px-1.5 py-1 flex flex-col gap-1">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              @click="selectOption(option.value)"
              :class="[
                'w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between rounded',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'text-gray-800 dark:text-gray-200',
                isSelected(option.value)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : '',
              ]"
            >
              <span>{{ option.label }}</span>
              <font-awesome-icon
                v-if="isSelected(option.value)"
                icon="check"
                class="text-xs text-blue-600 dark:text-blue-400"
              />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps<{
  options: { value: string; label: string }[];
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  dropdownMaxHeight?: string; // Tailwind class like 'max-h-40' or custom value like '200px'
  compact?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

defineOptions({
  inheritAttrs: false,
});

const isOpen = ref(false);
const selectContainer = ref<HTMLElement | null>(null);
const dropdownMenu = ref<HTMLElement | null>(null);
const dropdownStyle = ref<{ top: string; left: string; width: string }>({
  top: '0px',
  left: '0px',
  width: '0px',
});
const isOpeningUpwards = ref(false);

const selectedLabel = computed(() => {
  const selectedOption = props.options.find((opt) => opt.value === props.modelValue);
  return selectedOption?.label || '';
});

const isSelected = (value: string) => {
  return props.modelValue === value;
};

const updateDropdownPosition = async () => {
  if (!selectContainer.value || !isOpen.value) return;

  await nextTick();
  const rect = selectContainer.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const padding = 4;

  let top = rect.bottom + padding;

  if (dropdownMenu.value) {
    const dropdownHeight = dropdownMenu.value.offsetHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight + padding && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - padding;
      isOpeningUpwards.value = true;
    } else {
      isOpeningUpwards.value = false;
    }
  } else {
    isOpeningUpwards.value = false;
  }

  dropdownStyle.value = {
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
};

const toggleDropdown = async () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      await updateDropdownPosition();
    }
  }
};

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    selectContainer.value &&
    !selectContainer.value.contains(event.target as Node) &&
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

const handleScroll = () => {
  if (isOpen.value) {
    updateDropdownPosition();
  }
};

const handleResize = () => {
  if (isOpen.value) {
    updateDropdownPosition();
  }
};

watch(isOpen, async (newValue) => {
  if (newValue) {
    await updateDropdownPosition();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
  } else {
    window.removeEventListener('scroll', handleScroll, true);
    window.removeEventListener('resize', handleResize);
  }
});

onMounted(() => {
  // Use capture phase so we receive clicks before modal's @click.stop prevents propagation
  document.addEventListener('click', handleClickOutside, true);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleResize);
});
</script>
