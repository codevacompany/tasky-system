<template>
  <section id="tagsSection">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-soft-xs mb-6"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-txt-primary dark:text-white tracking-tight">
            {{ sectorMode ? 'Tags do Setor' : 'Gestão de Tags' }}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              sectorMode
                ? 'Tags sugeridas para o seu setor. Você só pode editar as que criou.'
                : 'Várias por tarefa. Escopo por setor só define sugestões no picker.'
            }}
          </p>
        </div>
        <Button
          variant="primary"
          type="button"
          class="shrink-0 rounded-md"
          @click="isModalOpen = true"
        >
          <font-awesome-icon icon="plus" />
          <span>Nova Tag</span>
        </Button>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft-xs mb-6"
    >
      <div class="w-full sm:w-1/3 min-w-0">
        <label for="searchTags" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Buscar
        </label>
        <div class="relative">
          <font-awesome-icon
            icon="search"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none"
          />
          <Input
            id="searchTags"
            v-model="searchTerm"
            type="text"
            placeholder="Buscar tags"
            padding="normal"
            class="pl-10 pr-4 w-full text-sm border-gray-200 dark:border-gray-600 rounded-[5px] dark:bg-gray-700/50"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-xs overflow-hidden"
    >
      <DataTable
        :data="tags"
        :headers="headers"
        :is-loading="isLoading"
        :pagination="pagination"
        :clickable="true"
        :show-actions="true"
        :show-delete-button="false"
        min-width="640px"
        row-key="id"
        @page-change="handlePageChange"
        @row-click="onRowClick"
      >
        <template #column-name="{ item }">
          <div class="flex items-center gap-3">
            <span
              class="w-8 h-8 rounded-lg shrink-0 border border-black/5"
              :style="{ backgroundColor: item.color }"
            />
            <span class="font-semibold text-txt-primary dark:text-gray-100">{{ item.name }}</span>
          </div>
        </template>

        <template #column-isActive="{ item }">
          <span
            class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
            :class="
              item.isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            "
          >
            {{ item.isActive ? 'Ativa' : 'Inativa' }}
          </span>
        </template>

        <template #actions="{ item }">
          <ActionDropdown v-if="canMutate(item)" v-slot="{ close }">
            <button
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              @click.stop="
                openEditModal(item);
                close();
              "
            >
              <font-awesome-icon icon="edit" class="w-4" />
              <span>Editar</span>
            </button>
            <div class="h-px bg-gray-100 dark:bg-gray-700 my-1" />
            <button
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click.stop="
                confirmDelete(item);
                close();
              "
            >
              <font-awesome-icon icon="trash" class="w-4" />
              <span>Excluir</span>
            </button>
          </ActionDropdown>
          <span v-else class="inline-flex px-2" @click.stop>
            <InfoTooltip
              message="Você só pode editar tags que criou. Esta tag foi criada por outro usuário."
              width="220px"
              position="right"
            />
          </span>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p class="text-sm font-semibold text-txt-primary dark:text-white mb-1">
              Nenhuma tag encontrada
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ searchTerm ? 'Tente ajustar a busca.' : 'Comece criando uma nova tag.' }}
            </p>
          </div>
        </template>
      </DataTable>
    </div>

    <NewTagModal
      v-if="isModalOpen"
      :lock-to-department-id="lockDepartmentId"
      @close="isModalOpen = false"
      @tag-created="loadTags"
    />
    <EditTagModal
      v-if="isEditModalOpen"
      :tag="tagToEdit"
      :lock-to-department-id="lockDepartmentId"
      @close="closeEditModal"
      @tag-updated="loadTags"
    />
    <ConfirmationModal
      v-if="showDeleteConfirmation"
      title="Excluir Tag"
      :message="`Tem certeza que deseja excluir a tag '${tagToDelete?.name}'?`"
      @confirm="deleteTag"
      @cancel="cancelDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { AxiosError } from 'axios';
import { toast } from 'vue-sonner';
import ActionDropdown from '@/components/common/ActionDropdown.vue';
import Button from '@/components/common/Button.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import DataTable from '@/components/common/DataTable.vue';
import type { TableHeader } from '@/components/common/DataTable.vue';
import InfoTooltip from '@/components/common/InfoTooltip.vue';
import Input from '@/components/common/Input.vue';
import EditTagModal from '@/components/tags/EditTagModal.vue';
import NewTagModal from '@/components/tags/NewTagModal.vue';
import type { Tag } from '@/models';
import { tagService } from '@/services/tagService';
import { useUserStore } from '@/stores/user';

const props = withDefaults(
  defineProps<{
    /** Supervisor sector management: list sector tags; edit only own. */
    sectorMode?: boolean;
  }>(),
  { sectorMode: false },
);

const userStore = useUserStore();
const tags = ref<Tag[]>([]);
const isLoading = ref(false);
const searchTerm = ref('');
const page = ref(1);
const totalPages = ref(1);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const tagToEdit = ref<Tag | null>(null);
const showDeleteConfirmation = ref(false);
const tagToDelete = ref<Tag | null>(null);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const lockDepartmentId = computed(() =>
  props.sectorMode ? userStore.user?.departmentId ?? undefined : undefined,
);

const canMutate = (tag: Tag) => {
  if (!props.sectorMode) return true;
  return tag.createdById != null && tag.createdById === userStore.user?.id;
};

const headers = computed((): TableHeader[] => [
  { key: 'name', label: 'Nome', align: 'left' },
  { key: 'isActive', label: 'Status', align: 'left' },
]);

const pagination = computed(() => ({
  currentPage: page.value,
  totalPages: totalPages.value,
  totalItems: tags.value.length,
  itemsPerPage: 10,
}));

const loadTags = async () => {
  isLoading.value = true;
  try {
    const { data } = await tagService.fetch({
      q: searchTerm.value || undefined,
      activeOnly: false,
      sectorScope: props.sectorMode || undefined,
      page: page.value,
      limit: 10,
    });
    tags.value = data.items;
    totalPages.value = data.totalPages;
  } catch {
    toast.error('Erro ao carregar tags');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (nextPage: number) => {
  page.value = nextPage;
  loadTags();
};

const openEditModal = async (tag: Tag) => {
  if (!canMutate(tag)) return;
  try {
    const { data } = await tagService.getById(tag.uuid);
    tagToEdit.value = data;
  } catch {
    tagToEdit.value = tag;
  }
  isEditModalOpen.value = true;
};

const onRowClick = (tag: Tag) => {
  if (canMutate(tag)) openEditModal(tag);
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  tagToEdit.value = null;
};

const confirmDelete = (tag: Tag) => {
  if (!canMutate(tag)) return;
  tagToDelete.value = tag;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  tagToDelete.value = null;
};

const deleteTag = async () => {
  if (!tagToDelete.value) return;
  try {
    await tagService.delete(tagToDelete.value.uuid);
    toast.success('Tag excluída com sucesso');
    loadTags();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast.error('Já existem tarefas com essa tag. Desative-a em vez de excluir.');
    } else {
      toast.error('Erro ao excluir tag');
    }
  } finally {
    cancelDelete();
  }
};

watch(searchTerm, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    loadTags();
  }, 250);
});

onMounted(loadTags);
</script>
