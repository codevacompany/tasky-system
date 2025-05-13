<template>
  <div class="sync-page">
    <div class="page-content">
      <!-- Main Content -->
      <div class="sync-container">
        <!-- Sidebar -->
        <div class="sync-sidebar">
          <div class="channels">
            <div
              class="channel-item"
              :class="{ active: currentChannel === 'inicio' }"
              @click="currentChannel = 'inicio'"
            >
              <font-awesome-icon icon="home" />
              <span>Início</span>
            </div>
            <div
              class="channel-item"
              :class="{ active: currentChannel === 'geral' }"
              @click="currentChannel = 'geral'"
            >
              <font-awesome-icon icon="users" />
              <span>Canal Geral</span>
              <span class="unread-count" v-if="getUnreadCount('geral')">
                {{ getUnreadCount('geral') }}
              </span>
            </div>
            <div
              class="channel-item"
              :class="{ active: currentChannel === 'setor' }"
              @click="currentChannel = 'setor'"
            >
              <font-awesome-icon icon="building" />
              <span>Canal do Setor</span>
              <span class="unread-count" v-if="getUnreadCount('setor')">
                {{ getUnreadCount('setor') }}
              </span>
            </div>
            <div
              class="channel-item"
              :class="{ active: currentChannel === 'individual' }"
              @click="currentChannel = 'individual'"
            >
              <font-awesome-icon icon="user" />
              <span>Canal Individual</span>
              <span class="unread-count" v-if="getUnreadCount('individual')">
                {{ getUnreadCount('individual') }}
              </span>
            </div>
          </div>

          <!-- Lista de usuários para chat individual -->
          <div v-if="currentChannel === 'individual'" class="users-list">
            <div class="users-list-header">
              <h3>Usuários</h3>
              <div class="user-search">
                <input type="text" v-model="userSearchTerm" placeholder="Buscar usuário..." />
              </div>
            </div>
            <div class="users-list-content">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="user-item"
                :class="{ active: selectedUser?.id === user.id }"
                @click="selectUser(user)"
              >
                <div class="user-avatar">
                  <span class="initials">{{ getInitials(user) }}</span>
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                  <span class="user-department">{{ user.department.name }}</span>
                </div>
                <div class="user-status" :class="user.status"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="messages-area">
          <div v-if="currentChannel === 'inicio'" class="inicio-panel">
            <h2>Bem-vindo ao Sync!</h2>
            <ul class="instructions-list">
              <li>Selecione um canal para conversar com todos, com seu setor ou individualmente.</li>
              <li>Use <b>@nome</b> para mencionar alguém em uma mensagem.</li>
              <li>Responda mensagens usando o botão <b>Responder</b> para criar threads.</li>
              <li>Marque mensagens importantes para confirmação de leitura/aceite.</li>
              <li>Use reações para interagir rapidamente com as mensagens.</li>
              <li>As mensagens do canal do setor só são visíveis para membros do mesmo setor.</li>
              <li>Você pode anexar arquivos e usar emojis nas conversas.</li>
            </ul>
            <div class="inicio-dica">
              <font-awesome-icon icon="info-circle" />
              Dica: Use o Sync para centralizar a comunicação e garantir o registro das interações importantes!
            </div>
          </div>
          <div v-if="replyingTo" class="reply-banner">
            <span>Respondendo a: {{ replyingTo.content.slice(0, 60) }}...</span>
            <button @click="cancelReply" class="cancel-reply-btn"><font-awesome-icon icon="times" /></button>
          </div>
          <div class="messages-list" ref="messagesList">
            <div v-if="isLoading && messages.length === 0" class="loading-messages">
              <font-awesome-icon icon="spinner" spin />
              <span>Carregando mensagens...</span>
            </div>
            <template v-else>
              <div v-if="isLoading" class="loading-more">
                <font-awesome-icon icon="spinner" spin />
                <span>Carregando mais mensagens...</span>
              </div>
              <div
                v-for="message in rootMessages"
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.read }"
            >
              <div class="message-avatar">
                <span class="initials">{{ getInitials(message.sender) }}</span>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <div class="message-info">
                    <span class="sender-name"
                      >{{ message.sender.firstName }} {{ message.sender.lastName }}</span
                    >
                    <span class="sender-department">{{ message.sender.department.name }}</span>
                  </div>
                  <span class="message-time">{{ formatTime(message.createdAt) }}</span>
                </div>
                  <div v-if="message.requiresConfirmation && !hasConfirmedView(message)" class="message-confirmation">
                    <div class="confirmation-placeholder">
                      <font-awesome-icon icon="eye" />
                      <span>Esta mensagem requer confirmação de visualização</span>
                      <button class="confirm-btn" @click="confirmView(message)">
                        Mostrar Mensagem
                      </button>
                    </div>
                  </div>
                  <div v-else class="message-text">
                    {{ message.content }}
                    <div v-if="message.requiresConfirmation" class="confirmation-status">
                      <font-awesome-icon icon="check-circle" />
                      <span>Visualizado em {{ formatTime(getUserConfirmation(message)?.viewedAt || '') }}</span>
                    </div>
                  </div>
                <div class="message-actions">
                  <button
                    v-for="reaction in message.reactions"
                    :key="reaction.type"
                    class="reaction-btn"
                    :class="{ active: reaction.active }"
                      @click="handleReaction(message, reaction.type)"
                  >
                    {{ reaction.type }} {{ reaction.count }}
                  </button>
                  <button class="reaction-btn add-reaction">
                    <font-awesome-icon icon="smile" />
                  </button>
                    <button class="reaction-btn reply-btn" @click="setReply(message)">
                      <font-awesome-icon icon="reply" /> Responder
                    </button>
                </div>
              </div>
                <!-- Respostas (threads) -->
                <div v-if="repliesMap[message.id]" class="thread-replies">
                  <div
                    v-for="reply in repliesMap[message.id]"
                    :key="reply.id"
                    class="message-item reply-item"
                    :class="{ unread: !reply.read }"
                  >
                    <div class="message-avatar">
                      <span class="initials">{{ getInitials(reply.sender) }}</span>
            </div>
                    <div class="message-content">
                      <div class="message-header">
                        <div class="message-info">
                          <span class="sender-name">{{ reply.sender.firstName }} {{ reply.sender.lastName }}</span>
                          <span class="sender-department">{{ reply.sender.department.name }}</span>
                        </div>
                        <span class="message-time">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <div class="message-text">{{ reply.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Message Input -->
          <div class="message-input">
            <div class="input-actions">
              <button class="action-btn" title="Anexar arquivo">
                <font-awesome-icon icon="paperclip" />
              </button>
              <button class="action-btn" title="Inserir emoji">
                <font-awesome-icon icon="smile" />
              </button>
              <button 
                class="action-btn" 
                :class="{ active: requiresConfirmation }"
                title="Requer confirmação de visualização"
                @click="requiresConfirmation = !requiresConfirmation"
              >
                <font-awesome-icon icon="eye" />
              </button>
            </div>
            <div class="input-container">
            <textarea
              v-model="newMessage"
                placeholder="Digite sua mensagem... (use @ para mencionar)"
              @keydown.enter.prevent="sendMessage"
                @input="handleInput"
                @keydown="handleKeyDown"
              rows="1"
              ref="messageInput"
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
            <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
              <font-awesome-icon icon="paper-plane" />
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
import { RoleName } from '@/models';
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
      user.email.toLowerCase().includes(searchTerm)
  );
});

const messages = computed(() => messageStore.filteredMessages);
const isLoading = computed(() => messageStore.isLoading);
const hasMore = computed(() => messageStore.hasMore);

const getUnreadCount = (channel: 'geral' | 'setor' | 'individual' | 'inicio') => {
  return messages.value.filter(
    (message: Message) => message.channel === channel && !message.read && message.sender.id !== userStore.user!.id
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
      limit: 100
    });
    users.value = response.data.items;
  } catch (error) {
    toast.error('Erro ao carregar usuários');
  }
};

// Função debounce nativa
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
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
        left: `${currentLine.length * 8}px`
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
    Math.min(messages.value.length, endIndex + 5)
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
    
    const { scrollTop, scrollHeight, clientHeight } = messagesList.value;
    
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
    threshold: 0.1
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
      parentMessageId
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
    const existingReaction = message.reactions.find((r: MessageReaction) => r.type === reactionType);
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
  return message.viewConfirmations.some((conf: MessageViewConfirmation) => conf.userId === userStore.user?.id);
};

const getUserConfirmation = (message: Message) => {
  return message.viewConfirmations.find((conf: MessageViewConfirmation) => conf.userId === userStore.user?.id);
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
      length: mentionText.length
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
.sync-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.sync-container {
  height: 100%;
  display: flex;
  gap: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sync-sidebar {
  width: 280px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.channels {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.channel-item:hover {
  background-color: #f5f5f5;
}

.channel-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.channel-item svg {
  margin-right: 12px;
  font-size: 1.2rem;
}

.unread-count {
  margin-left: auto;
  background-color: #1976d2;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.users-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.users-list-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.users-list-header h3 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
}

.user-search input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.users-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.user-item.active {
  background-color: #e3f2fd;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 500;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
}

.user-department {
  font-size: 0.8rem;
  color: #666;
}

.user-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 8px;
}

.user-status.online {
  background-color: #4caf50;
}

.user-status.offline {
  background-color: #9e9e9e;
}

.user-status.away {
  background-color: #ff9800;
}

.messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.loading-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  gap: 12px;
}

.loading-messages svg {
  font-size: 2rem;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  will-change: transform;
  -webkit-overflow-scrolling: touch;
}

.message-item {
  contain: content;
  will-change: transform;
  display: flex;
  margin-bottom: 20px;
}

.message-item.unread {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 500;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.message-info {
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-weight: 500;
}

.sender-department {
  font-size: 0.8rem;
  color: #666;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
}

.message-text {
  margin-bottom: 8px;
  line-height: 1.4;
}

.message-text .mention {
  color: #1976d2;
  font-weight: 500;
  background-color: #e3f2fd;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
}

.message-actions {
  display: flex;
  gap: 8px;
}

.reaction-btn {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.reaction-btn:hover {
  background-color: #f5f5f5;
}

.reaction-btn.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.add-reaction {
  padding: 4px;
}

.message-input {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #f8f9fa;
}

.input-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: #e9ecef;
  color: #1976d2;
}

.input-container {
  position: relative;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

textarea {
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 12px 16px;
  resize: none;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.4;
  overflow-y: auto;
  background-color: transparent;
}

textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.send-btn:hover {
  background-color: #1565c0;
  transform: scale(1.05);
}

.send-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
  transform: none;
}

.send-btn svg {
  font-size: 1.1rem;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #666;
  gap: 8px;
}

.loading-more svg {
  font-size: 1rem;
}

#scroll-sentinel {
  height: 1px;
  width: 100%;
}

.message-confirmation {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
}

.confirmation-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
}

.confirmation-placeholder svg {
  font-size: 1.2rem;
  color: #1976d2;
}

.confirm-btn {
  margin-left: auto;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background-color: #1565c0;
}

.confirmation-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #4caf50;
}

.confirmation-status svg {
  font-size: 1rem;
}

.action-btn.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.reply-banner {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.cancel-reply-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 1.1rem;
  cursor: pointer;
}
.thread-replies {
  margin-left: 48px;
  margin-top: 8px;
  border-left: 2px solid #e3f2fd;
  padding-left: 12px;
}
.reply-item {
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
}
.reply-btn {
  color: #1976d2;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}
.reply-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .sync-container {
    flex-direction: column;
  }

  .sync-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .messages-area {
    height: 400px;
  }
}

.inicio-panel {
  padding: 40px 32px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  text-align: left;
}
.inicio-panel h2 {
  color: #1976d2;
  margin-bottom: 18px;
}
.instructions-list {
  margin: 0 0 18px 0;
  padding: 0 0 0 18px;
  color: #333;
  font-size: 1.05rem;
}
.instructions-list li {
  margin-bottom: 8px;
}
.inicio-dica {
  margin-top: 18px;
  color: #1976d2;
  background: #e3f2fd;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}
</style>
