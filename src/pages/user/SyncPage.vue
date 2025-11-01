<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-hidden">
      <!-- Main Content -->
      <div class="flex h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <!-- Sidebar -->
        <div class="w-[280px] border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700">
            <div
              class="flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                  currentChannel === 'inicio',
              }"
              @click="currentChannel = 'inicio'"
            >
              <font-awesome-icon icon="home" class="mr-3 text-xl" />
              <span>Início</span>
            </div>
            <div
              class="flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                  currentChannel === 'geral',
              }"
              @click="currentChannel = 'geral'"
            >
              <font-awesome-icon icon="users" class="mr-3 text-xl" />
              <span>Canal Geral</span>
              <span
                class="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded-xl"
                v-if="getUnreadCount('geral')"
              >
                {{ getUnreadCount('geral') }}
              </span>
            </div>
            <div
              class="flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                  currentChannel === 'setor',
              }"
              @click="currentChannel = 'setor'"
            >
              <font-awesome-icon icon="building" class="mr-3 text-xl" />
              <span>Canal do Setor</span>
              <span
                class="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded-xl"
                v-if="getUnreadCount('setor')"
              >
                {{ getUnreadCount('setor') }}
              </span>
            </div>
            <div
              class="flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                  currentChannel === 'individual',
              }"
              @click="currentChannel = 'individual'"
            >
              <font-awesome-icon icon="user" class="mr-3 text-xl" />
              <span>Canal Individual</span>
              <span
                class="ml-auto px-2 py-1 bg-blue-600 text-white text-xs rounded-xl"
                v-if="getUnreadCount('individual')"
              >
                {{ getUnreadCount('individual') }}
              </span>
            </div>
          </div>

          <!-- Lista de usuários para chat individual -->
          <div v-if="currentChannel === 'individual'" class="flex-1 flex flex-col overflow-hidden">
            <div class="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Usuários</h3>
              <div class="relative">
                <input
                  type="text"
                  v-model="userSearchTerm"
                  placeholder="Buscar usuário"
                  class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-3">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                :class="{ 'bg-blue-50 dark:bg-blue-900/30': selectedUser?.id === user.id }"
                @click="selectUser(user)"
              >
                <div
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-medium"
                >
                  <span class="text-sm">{{ getUserInitials(user) }}</span>
                </div>
                <div class="flex-1 flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white"
                    >{{ user.firstName }} {{ user.lastName }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    user.department.name
                  }}</span>
                </div>
                <div
                  class="w-2.5 h-2.5 rounded-full ml-2"
                  :class="{
                    'bg-green-500': user.status === 'online',
                    'bg-gray-400': user.status === 'offline',
                    'bg-orange-500': user.status === 'away',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <div
            v-if="currentChannel === 'inicio'"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div
              class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-left"
            >
              <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-5">
                Bem-vindo ao Sync!
              </h2>
              <ul class="space-y-2 text-gray-700 dark:text-gray-300 text-base mb-5">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Selecione um canal para conversar com todos, com seu setor ou individualmente.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use <b>@nome</b> para mencionar alguém em uma mensagem.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Responda mensagens usando o botão <b>Responder</b> para criar threads.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Marque mensagens importantes para confirmação de leitura/aceite.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use reações para interagir rapidamente com as mensagens.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  As mensagens do canal do setor só são visíveis para membros do mesmo setor.
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Você pode anexar arquivos e usar emojis nas conversas.
                </li>
              </ul>
              <div
                class="mt-5 flex items-center gap-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg"
              >
                <font-awesome-icon icon="info-circle" class="text-lg" />
                <span class="text-base">
                  Dica: Use o Sync para centralizar a comunicação e garantir o registro das
                  interações importantes!
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="replyingTo"
            class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 px-4 rounded-lg mx-4 mt-2 flex items-center gap-3"
          >
            <span>Respondendo a: {{ replyingTo.content.slice(0, 60) }}...</span>
            <button
              @click="cancelReply"
              class="bg-transparent border-none text-blue-600 dark:text-blue-400 text-lg cursor-pointer"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto p-5 will-change-transform"
            ref="messagesList"
            style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch"
          >
            <div
              v-if="isLoading && messages.length === 0"
              class="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-3"
            >
              <font-awesome-icon icon="spinner" spin class="text-2xl" />
              <span>Carregando mensagens...</span>
            </div>
            <template v-else>
              <div
                v-if="isLoading"
                class="flex items-center justify-center p-3 text-gray-500 dark:text-gray-400 gap-2"
              >
                <font-awesome-icon icon="spinner" spin />
                <span>Carregando mais mensagens...</span>
              </div>
              <div
                v-for="message in rootMessages"
                :key="message.id"
                class="flex mb-5"
                :class="{ 'bg-gray-50 dark:bg-gray-800 rounded-lg p-2': !message.read }"
              >
                <div
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-medium"
                >
                  <span class="text-sm">{{ getUserInitials(message.sender) }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <div class="flex flex-col">
                      <span class="font-medium text-gray-900 dark:text-white"
                        >{{ message.sender.firstName }} {{ message.sender.lastName }}</span
                      >
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{
                        message.sender.department.name
                      }}</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{
                      formatTime(message.createdAt)
                    }}</span>
                  </div>
                  <div
                    v-if="message.requiresConfirmation && !hasConfirmedView(message)"
                    class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-2"
                  >
                    <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <font-awesome-icon
                        icon="eye"
                        class="text-lg text-blue-600 dark:text-blue-400"
                      />
                      <span>Esta mensagem requer confirmação de visualização</span>
                      <button
                        class="ml-auto px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer transition-colors duration-200 hover:bg-blue-700"
                      >
                        Mostrar Mensagem
                      </button>
                    </div>
                  </div>
                  <div v-else class="mb-2">
                    <div class="leading-relaxed text-gray-900 dark:text-gray-100">
                      {{ message.content }}
                    </div>
                    <div
                      v-if="message.requiresConfirmation"
                      class="flex items-center gap-2 mt-2 text-sm text-green-600 dark:text-green-400"
                    >
                      <font-awesome-icon icon="check-circle" />
                      <span
                        >Visualizado em
                        {{ formatTime(getUserConfirmation(message)?.viewedAt || '') }}</span
                      >
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-for="reaction in message.reactions"
                      :key="reaction.type"
                      class="px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-xl bg-transparent cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      :class="{
                        'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-600 dark:text-blue-400':
                          reaction.active,
                      }"
                      @click="handleReaction(message, reaction.type)"
                    >
                      {{ reaction.type }} {{ reaction.count }}
                    </button>
                    <button
                      class="px-1 py-1 border border-gray-200 dark:border-gray-600 rounded-xl bg-transparent cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <font-awesome-icon icon="smile" />
                    </button>
                    <button
                      class="px-1 py-1 bg-transparent border-none text-blue-600 dark:text-blue-400 cursor-pointer text-sm flex items-center gap-1 ml-2 hover:underline"
                      @click="setReply(message)"
                    >
                      <font-awesome-icon icon="reply" /> Responder
                    </button>
                  </div>
                </div>
                <!-- Respostas (threads) -->
                <div
                  v-if="repliesMap[message.id]"
                  class="ml-12 mt-2 border-l-2 border-blue-50 dark:border-blue-900/30 pl-3"
                >
                  <div
                    v-for="reply in repliesMap[message.id]"
                    :key="reply.id"
                    class="flex mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
                    :class="{ 'bg-gray-100 dark:bg-gray-700': !reply.read }"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-medium"
                    >
                      <span class="text-sm">{{ getInitials(reply.sender) }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start mb-1">
                        <div class="flex flex-col">
                          <span class="font-medium text-gray-900 dark:text-white"
                            >{{ reply.sender.firstName }} {{ reply.sender.lastName }}</span
                          >
                          <span class="text-xs text-gray-500 dark:text-gray-400">{{
                            reply.sender.department.name
                          }}</span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{
                          formatTime(reply.createdAt)
                        }}</span>
                      </div>
                      <div class="leading-relaxed text-gray-900 dark:text-gray-100">
                        {{ reply.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Message Input -->
          <div
            class="p-5 border-t border-gray-200 dark:border-gray-700 flex items-start gap-3 bg-gray-50 dark:bg-gray-800"
          >
            <div class="flex gap-2 pt-2">
              <button
                class="w-9 h-9 rounded-full border-none bg-transparent text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600"
                title="Anexar arquivo"
              >
                <font-awesome-icon icon="paperclip" />
              </button>
              <button
                class="w-9 h-9 rounded-full border-none bg-transparent text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600"
                title="Inserir emoji"
              >
                <font-awesome-icon icon="smile" />
              </button>
              <button
                class="w-9 h-9 rounded-full border-none bg-transparent text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                    requiresConfirmation,
                }"
                title="Requer confirmação de visualização"
                @click="requiresConfirmation = !requiresConfirmation"
              >
                <font-awesome-icon icon="eye" />
              </button>
            </div>
            <div class="relative flex-1">
              <textarea
                v-model="newMessage"
                placeholder="Digite sua mensagem... (use @ para mencionar)"
                @keydown.enter.prevent="sendMessage"
                @input="handleInput"
                @keydown="handleKeyDown"
                rows="1"
                ref="messageInput"
                class="w-full min-h-[44px] max-h-[120px] border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 resize-none text-gray-900 dark:text-gray-100 text-sm leading-relaxed overflow-y-auto bg-white dark:bg-gray-900 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(25,118,210,0.1)]"
              ></textarea>
              <MentionSelector
                v-if="showMentionSelector"
                :show="showMentionSelector"
                :users="users"
                :search-term="mentionSearchTerm"
                :position="mentionSelectorPosition"
                @select="handleMentionSelect"
                @close="closeMentionSelector"
              />
            </div>
            <button
              class="w-11 h-11 rounded-full border-none bg-blue-600 text-white cursor-pointer transition-all duration-200 flex items-center justify-center mt-0.5 hover:bg-blue-700 hover:scale-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:transform-none"
              @click="sendMessage"
              :disabled="!newMessage.trim()"
            >
              <font-awesome-icon icon="paper-plane" class="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/messageStore';
import type { User } from '@/models';
import type { Message, MessageReaction, MessageViewConfirmation, Mention } from '@/models/message';
import { getUserInitials } from '@/utils/generic-helper';
import { messageService } from '@/services/messageService';
import { userService } from '@/services/userService';
import { toast } from 'vue3-toastify';
import { formatRelativeTime } from '@/utils/date';
import MentionSelector from '@/components/MentionSelector.vue';

const userStore = useUserStore();
const messageStore = useMessageStore();
const currentChannel = ref<'inicio' | 'geral' | 'setor' | 'individual'>('inicio');
const selectedUser = ref<User | null>(null);
const newMessage = ref('');
const userSearchTerm = ref('');
const users = ref<User[]>([]);
const messagesList = ref<HTMLElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const showMentionSelector = ref(false);
const mentionSearchTerm = ref('');
const mentionSelectorPosition = ref({ top: '0px', left: '0px' });
const currentMentions = ref<Mention[]>([]);
const requiresConfirmation = ref(false);
const replyingTo = ref<Message | null>(null);

const filteredUsers = computed(() => {
  if (!userSearchTerm.value) return users.value;
  const searchTerm = userSearchTerm.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm),
  );
});

const messages = computed(() => messageStore.filteredMessages);
const isLoading = computed(() => messageStore.isLoading);
const hasMore = computed(() => messageStore.hasMore);

const getUnreadCount = (channel: 'geral' | 'setor' | 'individual' | 'inicio') => {
  return messages.value.filter(
    (message: Message) =>
      message.channel === channel && !message.read && message.sender.id !== userStore.user!.id,
  ).length;
};

const getInitials = (user: User) => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

const formatTime = (date: string) => {
  return formatRelativeTime(date);
};

const selectUser = (user: User) => {
  selectedUser.value = user;
  messageStore.setTargetUser(user.id);
  fetchMessages();
};

const fetchMessages = async () => {
  try {
    await messageStore.fetchMessages();
    scrollToBottom();
  } catch (error) {
    toast.error('Erro ao carregar mensagens');
  }
};

const fetchUsers = async () => {
  try {
    const response = await userService.fetch({
      page: 1,
      limit: 100,
    });
    users.value = response.data.items;
  } catch (error) {
    toast.error('Erro ao carregar usuários');
  }
};

// Função debounce nativa
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const handleInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  const text = textarea.value;
  const cursorPosition = textarea.selectionStart;

  const lastAtSymbol = text.lastIndexOf('@', cursorPosition);
  if (lastAtSymbol !== -1) {
    const textAfterAt = text.slice(lastAtSymbol + 1, cursorPosition);
    if (!textAfterAt.includes(' ')) {
      mentionSearchTerm.value = textAfterAt;
      showMentionSelector.value = true;

      // Calcular posição do seletor
      const textBeforeCursor = text.slice(0, cursorPosition);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      const lineHeight = 20;

      mentionSelectorPosition.value = {
        top: `${(lines.length - 1) * lineHeight}px`,
        left: `${currentLine.length * 8}px`,
      };
      return;
    }
  }

  showMentionSelector.value = false;
};

const autoGrow = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

// Virtualização para melhor performance com muitas mensagens
const visibleMessages = computed(() => {
  if (!messagesList.value) return messages.value;

  const containerHeight = messagesList.value.clientHeight;
  const scrollTop = messagesList.value.scrollTop;
  const itemHeight = 100; // Altura aproximada de cada mensagem

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

  return messages.value.slice(
    Math.max(0, startIndex - 5),
    Math.min(messages.value.length, endIndex + 5),
  );
});

// Otimização do scroll
let scrollTimeout: number | null = null;
const handleScroll = () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }

  scrollTimeout = window.requestAnimationFrame(() => {
    if (!messagesList.value) return;

    const { scrollTop } = messagesList.value;

    // Carregar mais mensagens quando estiver próximo do topo
    if (scrollTop < 100 && hasMore.value && !isLoading.value) {
      messageStore.loadMore();
    }
  });
};

// Otimização do setup do infinite scroll
const setupInfiniteScroll = () => {
  if (!messagesList.value) return;

  messagesList.value.addEventListener('scroll', handleScroll);

  const options = {
    root: messagesList.value,
    rootMargin: '0px',
    threshold: 0.1,
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore.value && !isLoading.value) {
        messageStore.loadMore();
      }
    });
  }, options);

  const sentinel = document.createElement('div');
  sentinel.id = 'scroll-sentinel';
  messagesList.value.appendChild(sentinel);
  observer.value.observe(sentinel);
};

// Limpeza adequada
onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
  if (messagesList.value) {
    messagesList.value.removeEventListener('scroll', handleScroll);
  }
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
});

// Otimização do envio de mensagens
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  try {
    const messageContent = newMessage.value;
    const messageMentions = [...currentMentions.value];
    const messageRequiresConfirmation = requiresConfirmation.value;
    const parentMessageId = replyingTo.value?.id;

    // Limpar campos imediatamente para melhor UX
    newMessage.value = '';
    currentMentions.value = [];
    requiresConfirmation.value = false;
    replyingTo.value = null;

    const data = {
      content: messageContent,
      channel: currentChannel.value,
      targetUserId: currentChannel.value === 'individual' ? selectedUser.value?.id : undefined,
      mentions: messageMentions,
      requiresConfirmation: messageRequiresConfirmation,
      parentMessageId,
    };

    const response = await messageService.create(data);
    messageStore.addMessage(response.data);
    await nextTick();
    scrollToBottom();
  } catch (error) {
    toast.error('Erro ao enviar mensagem');
  }
};

const scrollToBottom = () => {
  if (messagesList.value) {
    messagesList.value.scrollTop = messagesList.value.scrollHeight;
  }
};

const handleReaction = async (message: Message, reactionType: string) => {
  try {
    const existingReaction = message.reactions.find(
      (r: MessageReaction) => r.type === reactionType,
    );
    if (existingReaction) {
      await messageService.removeReaction(message.id, reactionType);
    } else {
      await messageService.addReaction(message.id, reactionType);
    }
  } catch (error) {
    toast.error('Erro ao processar reação');
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMentionSelector.value) {
    closeMentionSelector();
  }
};

const hasConfirmedView = (message: Message) => {
  return message.viewConfirmations.some(
    (conf: MessageViewConfirmation) => conf.userId === userStore.user?.id,
  );
};

const getUserConfirmation = (message: Message) => {
  return message.viewConfirmations.find(
    (conf: MessageViewConfirmation) => conf.userId === userStore.user?.id,
  );
};

const confirmView = async (message: Message) => {
  try {
    const response = await messageService.confirmView(message.id);
    messageStore.updateMessage(response.data);
  } catch (error) {
    toast.error('Erro ao confirmar visualização');
  }
};

const handleMentionSelect = (user: User) => {
  const textarea = messageInput.value;
  if (!textarea) return;

  const text = textarea.value;
  const cursorPosition = textarea.selectionStart;
  const lastAtSymbol = text.lastIndexOf('@', cursorPosition);

  if (lastAtSymbol !== -1) {
    const beforeMention = text.slice(0, lastAtSymbol);
    const afterMention = text.slice(cursorPosition);
    const mentionText = `@${user.firstName} ${user.lastName}`;

    newMessage.value = beforeMention + mentionText + ' ' + afterMention;

    // Adicionar menção à lista
    currentMentions.value.push({
      userId: user.id,
      position: lastAtSymbol,
      length: mentionText.length,
    });

    // Focar no textarea após a menção
    setTimeout(() => {
      if (textarea) {
        const newPosition = lastAtSymbol + mentionText.length + 1;
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  }
};

const closeMentionSelector = () => {
  showMentionSelector.value = false;
};

const setReply = (message: Message) => {
  replyingTo.value = message;
  nextTick(() => {
    if (messageInput.value) messageInput.value.focus();
  });
};

const cancelReply = () => {
  replyingTo.value = null;
};

// Agrupar mensagens por thread
const rootMessages = computed(() => messages.value.filter((m: Message) => !m.parentMessageId));
const repliesMap = computed(() => {
  const map: Record<number, Message[]> = {};
  messages.value.forEach((m: Message) => {
    if (m.parentMessageId) {
      if (!map[m.parentMessageId]) map[m.parentMessageId] = [];
      map[m.parentMessageId].push(m);
    }
  });
  return map;
});

watch(currentChannel, (newChannel) => {
  messageStore.setChannel(newChannel);
  fetchMessages();
});

onMounted(() => {
  fetchMessages();
  fetchUsers();
  setupInfiniteScroll();
});
</script>

<style scoped>
/* Mobile responsive design */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }

  .w-\[280px\] {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid theme('colors.gray.200');
  }

  :is(.dark .w-\[280px\]) {
    border-bottom-color: theme('colors.gray.700');
  }

  .flex-1.flex.flex-col.overflow-hidden {
    height: 400px;
  }
}

/* Sentinel for infinite scroll */
#scroll-sentinel {
  height: 1px;
  width: 100%;
}

/* Custom scrollbar styles for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
