<template>
  <div
    ref="rootRef"
    class="flex-1 min-w-0 relative"
    :data-inline-meta-dropdown="dropdownKey"
    @click.stop
  >
    <div
      role="button"
      tabindex="0"
      class="w-full text-left rounded-md transition-colors"
      :class="
        open
          ? [
              'flex items-center gap-1 border border-primary bg-white dark:bg-gray-800 px-2 py-1 shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]',
              wrapChips ? 'flex-wrap' : '',
            ]
          : 'px-1.5 py-0.5 -mx-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50'
      "
      @click="requestOpen"
      @keydown.enter.prevent="requestOpen"
    >
      <slot name="value" :open="open" />

      <template v-if="open">
        <input
          ref="searchInputRef"
          :value="search"
          type="text"
          :placeholder="placeholder"
          class="meta-inline-search flex-1 min-w-[6rem] !w-auto !border-0 !p-0 !m-0 !rounded-none !bg-transparent !shadow-none text-sm leading-5 text-txt-primary dark:text-gray-100 placeholder:text-gray-400 outline-none focus:!border-0 focus:!shadow-none"
          @click.stop
          @input="onSearchInput"
          @keydown.escape.stop="close"
        />
        <LoadingSpinner v-if="loading" :size="12" class="shrink-0" />
        <font-awesome-icon
          v-else
          icon="chevron-down"
          class="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0"
        />
      </template>

      <slot v-else name="empty" />
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        class="fixed z-[1100] min-w-[200px] max-w-[260px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        :data-inline-meta-picker="dropdownKey"
        :style="panelStyle"
        :class="{
          'invisible pointer-events-none': loading || !isPositioned || hidePanel,
        }"
      >
        <slot name="panel" :reposition="updatePosition" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    loading?: boolean;
    search?: string;
    placeholder?: string;
    /** Unique key for outside-click selectors (e.g. "tags", "category"). */
    dropdownKey: string;
    /** Extra selectors that should not close the picker (e.g. [data-tag-create-modal]). */
    ignoreOutsideSelectors?: string[];
    /** Allow chips to wrap (tags). */
    wrapChips?: boolean;
    /** Hide panel without closing (e.g. while create-tag modal is open). */
    hidePanel?: boolean;
  }>(),
  {
    loading: false,
    search: '',
    placeholder: 'Selecionar',
    ignoreOutsideSelectors: () => [],
    wrapChips: false,
    hidePanel: false,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:search': [value: string];
  open: [];
  close: [];
}>();

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const isPositioned = ref(false);
const panelStyle = ref<Record<string, string>>({ top: '0px', left: '0px', width: '220px' });
let ignoreOutsideClick = false;
let rootResizeObserver: ResizeObserver | null = null;

const updatePosition = () => {
  const anchor = rootRef.value;
  if (!anchor) return;

  const rect = anchor.getBoundingClientRect();
  const width = Math.min(220, Math.max(200, rect.width));
  const gap = 4;
  const margin = 8;
  let left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - width - margin);
  }
  if (left < margin) left = margin;

  const panelHeight = panelRef.value?.offsetHeight ?? 160;
  const spaceBelow = window.innerHeight - margin - (rect.bottom + gap);
  const spaceAbove = rect.top - gap - margin;
  const placeAbove = spaceBelow < panelHeight && spaceAbove > spaceBelow;

  const top = placeAbove
    ? Math.max(margin, rect.top - panelHeight - gap)
    : rect.bottom + gap;

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
  };
  isPositioned.value = true;
};

const focusSearch = async () => {
  await nextTick();
  searchInputRef.value?.focus();
};

const requestOpen = async () => {
  if (props.open) {
    focusSearch();
    return;
  }
  ignoreOutsideClick = true;
  isPositioned.value = false;
  emit('update:open', true);
  emit('open');
  await focusSearch();
  window.setTimeout(() => {
    ignoreOutsideClick = false;
  }, 0);
};

const close = () => {
  emit('update:open', false);
  emit('update:search', '');
  emit('close');
  isPositioned.value = false;
  ignoreOutsideClick = false;
};

const onSearchInput = (e: Event) => {
  emit('update:search', (e.target as HTMLInputElement).value);
};

const onDocumentClick = (e: MouseEvent) => {
  if (!props.open || ignoreOutsideClick) return;
  const target = e.target as Element | null;
  if (!target?.closest) return;

  const key = props.dropdownKey;
  if (
    target.closest(`[data-inline-meta-dropdown="${key}"]`) ||
    target.closest(`[data-inline-meta-picker="${key}"]`)
  ) {
    return;
  }
  for (const selector of props.ignoreOutsideSelectors) {
    if (target.closest(selector)) return;
  }
  close();
};

watch(
  () => [props.open, props.loading] as const,
  async ([open, loading]) => {
    if (open && !loading) {
      await nextTick();
      updatePosition();
      requestAnimationFrame(updatePosition);
      focusSearch();
    }
  },
);

watch(
  () => props.search,
  async () => {
    if (!props.open || props.loading) return;
    await nextTick();
    updatePosition();
  },
);

watch(
  () => props.hidePanel,
  async (hidden) => {
    if (!hidden && props.open && !props.loading) {
      await nextTick();
      updatePosition();
    }
  },
);

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    rootResizeObserver = new ResizeObserver(() => {
      if (props.open && !props.loading) updatePosition();
    });
    rootResizeObserver.observe(rootRef.value);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  rootResizeObserver?.disconnect();
});

defineExpose({
  updatePosition,
  focusSearch,
  close,
  rootRef,
});
</script>

<style scoped>
:deep(input.meta-inline-search) {
  width: auto;
  min-width: 6rem;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

:deep(input.meta-inline-search:focus) {
  border: none;
  box-shadow: none;
  outline: none;
}
</style>
