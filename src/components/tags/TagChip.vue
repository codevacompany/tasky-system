<template>
  <span
    class="inline-flex items-center min-w-0 max-w-full rounded-md font-medium border"
    :class="sizeClasses"
    :style="chipStyle"
    :title="tag.name"
  >
    <span class="min-w-0 truncate" :class="textLeadingClass">{{ tag.name }}</span>
    <button
      v-if="removable"
      type="button"
      class="shrink-0 inline-flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
      :class="removeButtonClasses"
      :aria-label="`Remover tag ${tag.name}`"
      @click.stop="$emit('remove', tag)"
    >
      <font-awesome-icon icon="times" :class="removeIconClasses" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tag } from '@/models';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { getTagChipColors } from '@/utils/tagStyle';

const props = withDefaults(
  defineProps<{
    tag: Tag;
    removable?: boolean;
    /** `sm` for compact card chips */
    size?: 'md' | 'sm';
  }>(),
  { size: 'md' },
);

defineEmits<{
  remove: [tag: Tag];
}>();

const userPreferencesStore = useUserPreferencesStore();

const sizeClasses = computed(() =>
  props.size === 'sm'
    ? 'gap-0.5 min-h-0 px-1.5 py-0.5 text-[11px] leading-tight'
    : 'gap-1 min-h-6 px-2 py-0.5 text-xs leading-4',
);

const textLeadingClass = computed(() => (props.size === 'sm' ? 'leading-tight' : 'leading-4'));

const removeButtonClasses = computed(() =>
  props.size === 'sm' ? 'w-3 h-3 -mr-0.5' : 'w-3.5 h-3.5 -mr-0.5',
);

const removeIconClasses = computed(() => (props.size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'));

const chipStyle = computed(() =>
  getTagChipColors(props.tag.color, userPreferencesStore.isDarkMode),
);
</script>
