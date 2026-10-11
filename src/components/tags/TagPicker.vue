<template>
  <div>
    <div class="max-h-64 overflow-y-auto py-1">
      <template v-if="!searchQuery">
        <template v-if="suggestedAvailable.length">
          <p class="px-3 pt-2.5 pb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
            Sugeridas
          </p>
          <button
            v-for="tag in suggestedAvailable"
            :key="`s-${tag.uuid}`"
            type="button"
            class="tag-picker-option group relative w-full flex items-center min-w-0 px-2 py-1.5 text-left rounded-none hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
            :title="tag.name"
            @click="$emit('select', tag)"
          >
            <span
              class="inline-flex items-center min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border"
              :style="pillStyle(tag)"
            >
              <span class="min-w-0 truncate leading-4">{{ tag.name }}</span>
            </span>
          </button>
        </template>

        <template v-if="catalogOthers.length">
          <p
            class="px-3 pt-2.5 pb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300"
            :class="{ 'border-t border-gray-100 dark:border-gray-700 mt-1': suggestedAvailable.length }"
          >
            Todas as tags
          </p>
          <button
            v-for="tag in catalogOthers"
            :key="`a-${tag.uuid}`"
            type="button"
            class="tag-picker-option group relative w-full flex items-center min-w-0 gap-1 px-2 py-1.5 text-left rounded-none hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
            :title="tag.name"
            @click="$emit('select', tag)"
          >
            <span
              class="inline-flex items-center min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border"
              :style="pillStyle(tag)"
            >
              <span class="min-w-0 truncate leading-4">{{ tag.name }}</span>
            </span>
          </button>
        </template>

        <p
          v-if="!suggestedAvailable.length && !catalogOthers.length"
          class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          {{ emptyCatalogMessage }}
        </p>
      </template>

      <template v-else>
        <p class="px-3 pt-2.5 pb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
          Resultados
        </p>
        <button
          v-for="tag in searchResults"
          :key="tag.uuid"
          type="button"
          class="tag-picker-option group relative w-full flex items-center min-w-0 gap-1 px-2 py-1.5 text-left rounded-none hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors disabled:opacity-50"
          :disabled="isApplied(tag)"
          :title="tag.name"
          @click="!isApplied(tag) && $emit('select', tag)"
        >
          <span
            class="inline-flex items-center min-h-6 min-w-0 max-w-full rounded-md px-2 py-0.5 text-xs font-medium leading-4 border"
            :style="pillStyle(tag)"
          >
            <span class="min-w-0 truncate leading-4">{{ tag.name }}</span>
          </span>
          <span v-if="isApplied(tag)" class="ml-auto shrink-0 pr-1 text-xs text-gray-400">Já aplicada</span>
        </button>
        <p
          v-if="!searchResults.length"
          class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          Nenhuma tag encontrada
        </p>
      </template>
    </div>

    <div
      v-if="canCreateTag"
      class="border-t border-gray-100 dark:border-gray-700 px-2 py-1.5"
    >
      <button
        type="button"
        class="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 rounded hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
        @click="openCreateModal"
      >
        <font-awesome-icon icon="plus" class="w-3 h-3" />
        Criar tag
      </button>
    </div>

    <NewTagModal
      v-if="showCreateModal"
      :lock-to-department-id="createLockDepartmentId"
      @close="showCreateModal = false"
      @tag-created="onTagCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import NewTagModal from '@/components/tags/NewTagModal.vue';
import { useRoles } from '@/composables';
import type { Tag } from '@/models';
import { tagService } from '@/services/tagService';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useUserStore } from '@/stores/user';
import { getTagChipColors } from '@/utils/tagStyle';

const props = defineProps<{
  ticketCustomId: string;
  appliedTagUuids: string[];
  search?: string;
}>();

const emit = defineEmits<{
  select: [tag: Tag];
  'update:loading': [value: boolean];
  'update:creating': [value: boolean];
  contentChange: [];
}>();

const { isAdmin, isSupervisor } = useRoles();
const userStore = useUserStore();
const userPreferencesStore = useUserPreferencesStore();
const showCreateModal = ref(false);

const canCreateTag = computed(() => {
  if (isAdmin.value) return true;
  if (isSupervisor.value) return Boolean(userStore.user?.departmentId);
  return false;
});
const createLockDepartmentId = computed(() =>
  isSupervisor.value && !isAdmin.value
    ? userStore.user?.departmentId ?? undefined
    : undefined,
);

const openCreateModal = (e?: Event) => {
  e?.stopPropagation();
  showCreateModal.value = true;
  emit('update:creating', true);
};

watch(showCreateModal, (value) => {
  emit('update:creating', value);
});

const catalogTags = ref<Tag[]>([]);
const suggestedSeed = ref<Tag[]>([]);
const searchResults = ref<Tag[]>([]);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const searchQuery = computed(() => (props.search || '').trim());
const appliedSet = computed(() => new Set(props.appliedTagUuids));

const isApplied = (tag: Tag) => appliedSet.value.has(tag.uuid);

const availableTags = computed(() =>
  catalogTags.value.filter((t) => !appliedSet.value.has(t.uuid)),
);

const suggestedAvailable = computed(() => {
  const availableIds = new Set(availableTags.value.map((t) => t.uuid));
  return suggestedSeed.value.filter((t) => availableIds.has(t.uuid));
});

const catalogOthers = computed(() => {
  const suggestedIds = new Set(suggestedAvailable.value.map((t) => t.uuid));
  return availableTags.value.filter((t) => !suggestedIds.has(t.uuid));
});

const emptyCatalogMessage = computed(() => {
  if (catalogTags.value.length === 0) return 'Nenhuma tag cadastrada';
  if (props.appliedTagUuids.length > 0) return 'Todas as tags já foram aplicadas';
  return 'Nenhuma tag disponível';
});

const pillStyle = (tag: Tag) =>
  getTagChipColors(tag.color, userPreferencesStore.isDarkMode);

const loadInitial = async () => {
  emit('update:loading', true);
  try {
    const [suggestedRes, allRes] = await Promise.all([
      tagService.getSuggested({
        ticketCustomId: props.ticketCustomId,
        limit: 12,
      }),
      tagService.fetch({ activeOnly: true, limit: 100 }),
    ]);
    suggestedSeed.value = suggestedRes.data;
    catalogTags.value = allRes.data.items;
  } catch {
    suggestedSeed.value = [];
    catalogTags.value = [];
  } finally {
    emit('update:loading', false);
    emit('contentChange');
  }
};

const onTagCreated = async (tag?: Tag) => {
  showCreateModal.value = false;
  await loadInitial();
  if (tag && !isApplied(tag)) {
    emit('select', tag);
  }
};

const runSearch = async (q: string) => {
  try {
    const { data } = await tagService.fetch({ q, activeOnly: true, limit: 30 });
    searchResults.value = data.items;
  } catch {
    searchResults.value = [];
  } finally {
    emit('contentChange');
  }
};

watch(
  () => props.search,
  (value) => {
    if (searchTimer) clearTimeout(searchTimer);
    const trimmed = (value || '').trim();
    if (!trimmed) {
      searchResults.value = [];
      emit('contentChange');
      return;
    }
    searchTimer = setTimeout(() => runSearch(trimmed), 250);
  },
);

watch(
  () => props.appliedTagUuids.slice(),
  () => emit('contentChange'),
);

onMounted(loadInitial);

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<style scoped>
button.tag-picker-option {
  border-radius: 0 !important;
}

button.tag-picker-option::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 0;
  background: transparent;
}

button.tag-picker-option:hover::before,
button.tag-picker-option:focus-visible::before {
  background: var(--primary-color, #5564db);
}
</style>
