import { defineStore } from 'pinia';
import type { Message } from '@/models';
import { messageService } from '@/services/messageService';
import type { PaginatedResponse } from '@/types/http';
import { useUserStore } from './user';

interface MessageState {
  messages: Message[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  hasMore: boolean;
  channel: 'geral' | 'setor' | 'individual';
  targetUserId?: number;
  messageCache: Map<string, Message[]>;
  lastFetchTime: number;
}

const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutos
const MESSAGES_PER_PAGE = 20;

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    isLoading: false,
    hasMore: true,
    channel: 'geral',
    targetUserId: undefined,
    messageCache: new Map(),
    lastFetchTime: 0
  }),

  getters: {
    filteredMessages: (state) => {
      const userStore = useUserStore();
      const currentUser = userStore.user;
      
      if (!currentUser) return state.messages;

      return state.messages.filter(message => {
        // Canal geral: todas as mensagens são visíveis
        if (state.channel === 'geral') return true;
        
        // Canal do setor: apenas mensagens do mesmo setor
        if (state.channel === 'setor') {
          return message.sender.department.id === currentUser.department.id;
        }
        
        // Canal individual: apenas mensagens entre os usuários envolvidos
        if (state.channel === 'individual' && state.targetUserId) {
          return (
            (message.sender.id === currentUser.id && message.targetUserId === state.targetUserId) ||
            (message.sender.id === state.targetUserId && message.targetUserId === currentUser.id)
          );
        }
        
        return false;
      });
    },

    cacheKey: (state) => {
      return `${state.channel}-${state.targetUserId || 'all'}`;
    }
  },

  actions: {
    async fetchMessages(page: number = 1, limit: number = MESSAGES_PER_PAGE) {
      // Verificar cache
      const cacheKey = this.cacheKey;
      const cachedMessages = this.messageCache.get(cacheKey);
      const now = Date.now();

      if (cachedMessages && now - this.lastFetchTime < CACHE_EXPIRATION) {
        if (page === 1) {
          this.messages = cachedMessages;
          return;
        }
      }

      this.isLoading = true;
      try {
        const userStore = useUserStore();
        const currentUser = userStore.user;
        
        if (!currentUser) throw new Error('Usuário não autenticado');

        const params: any = {
          channel: this.channel,
          page,
          limit
        };

        if (this.channel === 'setor') {
          params.departmentId = currentUser.department.id;
        }

        if (this.channel === 'individual' && this.targetUserId) {
          params.targetUserId = this.targetUserId;
        }

        const response = await messageService.fetch(params);
        const data = response.data;

        if (page === 1) {
          this.messages = data.items;
          // Atualizar cache
          this.messageCache.set(cacheKey, data.items);
          this.lastFetchTime = now;
        } else {
          this.messages = [...this.messages, ...data.items];
        }

        this.currentPage = page;
        this.totalPages = data.totalPages;
        this.totalItems = data.totalItems;
        this.hasMore = page < data.totalPages;

        return data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async loadMore() {
      if (!this.hasMore || this.isLoading) return;
      await this.fetchMessages(this.currentPage + 1);
    },

    setChannel(channel: 'geral' | 'setor' | 'individual') {
      this.channel = channel;
      this.reset();
    },

    setTargetUser(userId?: number) {
      this.targetUserId = userId;
      this.reset();
    },

    reset() {
      this.messages = [];
      this.currentPage = 1;
      this.totalPages = 1;
      this.totalItems = 0;
      this.hasMore = true;
    },

    addMessage(message: Message) {
      const userStore = useUserStore();
      const currentUser = userStore.user;
      
      if (!currentUser) return;

      const shouldShow = (() => {
        if (message.channel === 'geral') return true;
        if (message.channel === 'setor') {
          return message.sender.department.id === currentUser.department.id;
        }
        if (message.channel === 'individual') {
          return (
            (message.sender.id === currentUser.id && message.targetUserId === this.targetUserId) ||
            (message.sender.id === this.targetUserId && message.targetUserId === currentUser.id)
          );
        }
        return false;
      })();

      if (shouldShow) {
        this.messages.unshift(message);
        this.totalItems++;
        
        // Atualizar cache
        const cacheKey = this.cacheKey;
        const cachedMessages = this.messageCache.get(cacheKey);
        if (cachedMessages) {
          cachedMessages.unshift(message);
          this.messageCache.set(cacheKey, cachedMessages);
        }
      }
    },

    updateMessage(message: Message) {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        this.messages[index] = message;
        
        // Atualizar cache
        const cacheKey = this.cacheKey;
        const cachedMessages = this.messageCache.get(cacheKey);
        if (cachedMessages) {
          const cacheIndex = cachedMessages.findIndex(m => m.id === message.id);
          if (cacheIndex !== -1) {
            cachedMessages[cacheIndex] = message;
            this.messageCache.set(cacheKey, cachedMessages);
          }
        }
      }
    },

    markMessagesAsRead(messageIds: number[]) {
      this.messages = this.messages.map(message => {
        if (messageIds.includes(message.id)) {
          return { ...message, read: true };
        }
        return message;
      });

      // Atualizar cache
      const cacheKey = this.cacheKey;
      const cachedMessages = this.messageCache.get(cacheKey);
      if (cachedMessages) {
        const updatedCache = cachedMessages.map(message => {
          if (messageIds.includes(message.id)) {
            return { ...message, read: true };
          }
          return message;
        });
        this.messageCache.set(cacheKey, updatedCache);
      }
    },

    clearCache() {
      this.messageCache.clear();
      this.lastFetchTime = 0;
    }
  }
}); 