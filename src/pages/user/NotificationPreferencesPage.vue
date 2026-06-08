<template>
  <div class="p-4 md:p-6 md:pt-0">
    <div v-if="isLoading" class="py-16 flex justify-center">
      <LoadingSpinner />
    </div>

    <template v-else-if="preferences">
      <div class="space-y-8">
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 class="text-2xl font-bold text-txt-primary dark:text-white m-0">Notificações</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 m-0">
            Escolha como deseja ser notificado sobre suas tarefas.
          </p>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-1 m-0">E-mail</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 m-0">
              Não afeta e-mails de segurança, cadastro ou cobrança.
            </p>

            <div
              v-if="!preferences.tenantEmailAvailable"
              class="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 mb-4"
            >
              Seu plano atual não inclui notificações por e-mail.
            </div>

            <label
              class="flex items-center justify-between gap-4"
              :class="{ 'opacity-50': !preferences.tenantEmailAvailable }"
            >
              <span class="text-sm font-medium text-txt-primary dark:text-white">
                Receber notificações por e-mail sobre tarefas
              </span>
              <button
                type="button"
                role="switch"
                :aria-checked="preferences.emailEnabled"
                :disabled="!preferences.tenantEmailAvailable || isSaving"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                :class="getToggleTrackClass(preferences.emailEnabled)"
                @click="toggleMasterEmail"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
                  :class="preferences.emailEnabled ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </label>

            <div
              v-if="preferences.tenantEmailAvailable && preferences.emailEnabled"
              class="mt-8 space-y-8"
            >
              <div v-for="group in groupedEmailEvents" :key="`email-${group.key}`">
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-txt-light dark:text-gray-500 mb-3 m-0"
                >
                  {{ group.label }}
                </h4>
                <div class="space-y-4">
                  <div
                    v-for="event in group.events"
                    :key="event.event"
                    class="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p class="text-sm font-medium text-txt-primary dark:text-white m-0">
                        {{ event.label }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 m-0">
                        {{ event.description }}
                      </p>
                    </div>
                    <NotificationPreferenceToggle
                      :enabled="event.emailEnabled === true"
                      :required="event.required"
                      :disabled="isSaving"
                      @toggle="toggleEmailEvent(event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold text-txt-primary dark:text-white mb-1 m-0">In-app</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 m-0">
              Notificações exibidas no sino do sistema. Alertas obrigatórios não podem ser
              desativados.
            </p>

            <div class="space-y-8">
              <div v-for="group in groupedInAppEvents" :key="`inapp-${group.key}`">
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-txt-light dark:text-gray-500 mb-3 m-0"
                >
                  {{ group.label }}
                </h4>
                <div class="space-y-4">
                  <div
                    v-for="event in group.events"
                    :key="event.event"
                    class="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p class="text-sm font-medium text-txt-primary dark:text-white m-0">
                        {{ event.label }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 m-0">
                        {{ event.description }}
                      </p>
                    </div>
                    <NotificationPreferenceToggle
                      :enabled="event.inAppEnabled"
                      :required="event.required"
                      :disabled="isSaving"
                      @toggle="toggleInAppEvent(event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import NotificationPreferenceToggle from '@/components/user/NotificationPreferenceToggle.vue';
import type {
  NotificationEventPreference,
  NotificationPreferencesResponse,
} from '@/models/notificationPreference';
import { notificationPreferenceService } from '@/services/notificationPreferenceService';

const GROUP_ORDER = ['atribuicoes', 'status', 'comentarios', 'atualizacoes'] as const;

const preferences = ref<NotificationPreferencesResponse | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);

const getToggleTrackClass = (enabled: boolean, required = false) => {
  if (required) return 'bg-gray-400 dark:bg-gray-500';
  return enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600';
};

const groupEvents = (events: NotificationEventPreference[]) => {
  const map = new Map<string, { key: string; label: string; events: NotificationEventPreference[] }>();

  for (const event of events) {
    if (!map.has(event.group)) {
      map.set(event.group, {
        key: event.group,
        label: event.groupLabel,
        events: [],
      });
    }
    map.get(event.group)!.events.push(event);
  }

  return GROUP_ORDER.filter((key) => map.has(key)).map((key) => {
    const group = map.get(key)!;
    return {
      ...group,
      events: [...group.events].sort((a, b) => Number(b.required) - Number(a.required)),
    };
  });
};

const groupedEmailEvents = computed(() => {
  if (!preferences.value) return [];
  return groupEvents(preferences.value.events.filter((event) => event.supportsEmail));
});

const groupedInAppEvents = computed(() => {
  if (!preferences.value) return [];
  return groupEvents(preferences.value.events);
});

const buildDisabledLists = () => {
  if (!preferences.value) {
    return { disabledInAppEvents: [], disabledEmailEvents: [] };
  }

  return {
    disabledInAppEvents: preferences.value.events
      .filter((event) => !event.required && !event.inAppEnabled)
      .map((event) => event.event),
    disabledEmailEvents: preferences.value.events
      .filter((event) => event.supportsEmail && !event.required && event.emailEnabled === false)
      .map((event) => event.event),
  };
};

const savePreferences = async (patch: {
  emailEnabled?: boolean;
  disabledInAppEvents?: string[];
  disabledEmailEvents?: string[];
}) => {
  isSaving.value = true;
  try {
    const { data } = await notificationPreferenceService.update(patch);
    preferences.value = data;
    toast.success('Preferências salvas');
  } catch {
    toast.error('Não foi possível salvar as preferências');
    await loadPreferences();
  } finally {
    isSaving.value = false;
  }
};

const loadPreferences = async () => {
  isLoading.value = true;
  try {
    const { data } = await notificationPreferenceService.get();
    preferences.value = data;
  } catch {
    toast.error('Erro ao carregar preferências de notificação');
  } finally {
    isLoading.value = false;
  }
};

const toggleMasterEmail = async () => {
  if (!preferences.value?.tenantEmailAvailable) return;
  await savePreferences({ emailEnabled: !preferences.value.emailEnabled });
};

const toggleInAppEvent = async (event: NotificationEventPreference) => {
  if (!preferences.value || event.required) return;

  event.inAppEnabled = !event.inAppEnabled;
  const lists = buildDisabledLists();
  await savePreferences({ disabledInAppEvents: lists.disabledInAppEvents });
};

const toggleEmailEvent = async (event: NotificationEventPreference) => {
  if (!preferences.value || event.required || !event.supportsEmail) return;

  event.emailEnabled = !event.emailEnabled;
  const lists = buildDisabledLists();
  await savePreferences({ disabledEmailEvents: lists.disabledEmailEvents });
};

onMounted(loadPreferences);
</script>
