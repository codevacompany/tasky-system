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
          <div class="messages-list" ref="messagesList">
            <div
              v-for="message in filteredMessages"
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
                <div class="message-text">{{ message.content }}</div>
                <div class="message-actions">
                  <button
                    v-for="reaction in message.reactions"
                    :key="reaction.type"
                    class="reaction-btn"
                    :class="{ active: reaction.active }"
                  >
                    {{ reaction.type }} {{ reaction.count }}
                  </button>
                  <button class="reaction-btn add-reaction">
                    <font-awesome-icon icon="smile" />
                  </button>
                </div>
              </div>
            </div>
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
            </div>
            <textarea
              v-model="newMessage"
              placeholder="Digite sua mensagem..."
              @keydown.enter.prevent="sendMessage"
              rows="1"
              ref="messageInput"
              @input="autoGrow"
            ></textarea>
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
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import type { User } from '@/models';
import { RoleName } from '@/models';

// Dados mockados
const mockMessages = [
  {
    id: '1',
    content: 'Bom dia a todos! Como estão?',
    sender: {
      id: 1,
      tenantId: 1,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      departmentId: 1,
      department: { id: 1, name: 'TI', createdAt: new Date().toISOString() },
      isActive: true,
      role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    },
    createdAt: new Date('2024-03-20T09:00:00'),
    isGeneral: true,
    read: true,
    reactions: [
      { type: '👍', count: 3, active: true },
      { type: '❤️', count: 1, active: false },
    ],
  },
  {
    id: '2',
    content: 'Alguém pode me ajudar com o relatório mensal?',
    sender: {
      id: 2,
      tenantId: 1,
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria@example.com',
      departmentId: 2,
      department: { id: 2, name: 'Financeiro', createdAt: new Date().toISOString() },
      isActive: true,
      role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    },
    createdAt: new Date('2024-03-20T09:15:00'),
    isGeneral: true,
    read: false,
    reactions: [],
  },
  {
    id: '3',
    content: 'Reunião de equipe amanhã às 10h',
    sender: {
      id: 3,
      tenantId: 1,
      firstName: 'Pedro',
      lastName: 'Oliveira',
      email: 'pedro@example.com',
      departmentId: 1,
      department: { id: 1, name: 'TI', createdAt: new Date().toISOString() },
      isActive: true,
      role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    },
    createdAt: new Date('2024-03-20T09:30:00'),
    isGeneral: false,
    read: false,
    reactions: [{ type: '👍', count: 2, active: false }],
  },
];

// Dados mockados de usuários
const mockUsers = [
  {
    id: 1,
    tenantId: 1,
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@example.com',
    departmentId: 1,
    department: { id: 1, name: 'TI', createdAt: new Date().toISOString() },
    isActive: true,
    role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    status: 'online',
  },
  {
    id: 2,
    tenantId: 1,
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@example.com',
    departmentId: 2,
    department: { id: 2, name: 'Financeiro', createdAt: new Date().toISOString() },
    isActive: true,
    role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    status: 'offline',
  },
  {
    id: 3,
    tenantId: 1,
    firstName: 'Pedro',
    lastName: 'Oliveira',
    email: 'pedro@example.com',
    departmentId: 1,
    department: { id: 1, name: 'TI', createdAt: new Date().toISOString() },
    isActive: true,
    role: { id: 1, name: RoleName.User, createdAt: new Date().toISOString() },
    status: 'away',
  },
];

const userStore = useUserStore();
const currentChannel = ref('geral');
const searchTerm = ref('');
const newMessage = ref('');
const messages = ref(mockMessages);
const messageInput = ref<HTMLTextAreaElement | null>(null);
const userSearchTerm = ref('');
const selectedUser = ref<User | null>(null);
const users = ref(mockUsers);

const filteredMessages = computed(() => {
  return messages.value
    .filter((msg) => {
      const isChannelMatch = currentChannel.value === 'geral' ? msg.isGeneral : !msg.isGeneral;
      const isSearchMatch = msg.content.toLowerCase().includes(searchTerm.value.toLowerCase());
      return isChannelMatch && isSearchMatch;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

const getUnreadCount = (channel: string) => {
  return messages.value.filter((msg) => {
    const isChannelMatch = channel === 'geral' ? msg.isGeneral : !msg.isGeneral;
    return isChannelMatch && !msg.read;
  }).length;
};

const getInitials = (user: User) => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const autoGrow = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !userStore.user) return;

  const newMsg = {
    id: Date.now().toString(),
    content: newMessage.value,
    sender: userStore.user,
    createdAt: new Date(),
    isGeneral: currentChannel.value === 'geral',
    read: false,
    reactions: [],
  };

  messages.value.push(newMsg);
  newMessage.value = '';

  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
  }

  // Scroll para a última mensagem
  setTimeout(() => {
    const messagesList = document.querySelector('.messages-list');
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }, 100);
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const searchTerm = userSearchTerm.value.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const department = user.department.name.toLowerCase();
    return fullName.includes(searchTerm) || department.includes(searchTerm);
  });
});

const selectUser = (user: User) => {
  selectedUser.value = user;
};

onMounted(() => {
  // Scroll para a última mensagem
  const messagesList = document.querySelector('.messages-list');
  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }
});
</script>

<style scoped>
.sync-page {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--body-bg);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}

.sync-container {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
}

.sync-sidebar {
  width: 250px;
  border-right: 1px solid var(--border-color);
  background-color: var(--card-bg);
  display: flex;
  flex-direction: column;
  padding-top: 0.8rem;
}

.channels {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
}

.channel-item:hover {
  background-color: var(--hover-bg);
}

.channel-item.active {
  background-color: var(--primary-color);
  color: white;
}

.unread-count {
  margin-left: auto;
  background-color: var(--danger-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--body-bg);
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  background-color: var(--card-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.message-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.message-item.unread {
  background-color: rgba(var(--primary-rgb), 0.05);
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sender-name {
  font-weight: 600;
  color: var(--text-color);
}

.sender-department {
  color: var(--text-light);
  font-size: 0.875rem;
}

.message-time {
  color: var(--text-light);
  font-size: 0.875rem;
}

.message-text {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reaction-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reaction-btn:hover {
  background-color: var(--hover-bg);
}

.reaction-btn.active {
  background-color: rgba(var(--primary-rgb), 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.add-reaction {
  padding: 0.25rem 0.5rem;
}

.message-input {
  padding: 1rem;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-shrink: 0;
}

.input-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.message-input textarea {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 0.75rem;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  background-color: var(--input-bg);
  color: var(--text-color);
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  transition: all 0.2s ease;
}

.message-input textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover {
  transform: scale(1.05);
}

.send-btn:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  transform: none;
}

.users-list {
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.users-list-header {
  padding: 1rem;
}

.users-list-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-search input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  background-color: var(--input-bg);
  color: var(--text-color);
}

.users-list-content {
  overflow-y: auto;
  max-height: 400px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-item:hover {
  background-color: var(--hover-bg);
}

.user-item.active {
  background-color: rgba(var(--primary-rgb), 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-department {
  display: block;
  font-size: 0.75rem;
  color: var(--text-light);
}

.user-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}

.user-status.online {
  background-color: var(--success-color);
}

.user-status.offline {
  background-color: var(--text-light);
}

.user-status.away {
  background-color: var(--warning-color);
}

/* Dark mode adjustments */
:deep(body.dark-mode) {
  .main-header {
    background-color: var(--card-bg-dark);
    border-color: var(--border-color-dark);
  }

  .header-logo {
    background-color: #2d3446;
  }

  .main-nav ul li div {
    color: var(--text-color-dark);
  }

  .notification-icon,
  .user-profile,
  .dark-mode-toggle {
    color: var(--text-color-dark);
  }

  .sync-page {
    background-color: var(--body-bg-dark);
  }

  .page-header,
  .sync-sidebar,
  .message-item,
  .message-input {
    background-color: var(--card-bg-dark);
  }

  .message-item.unread {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .channel-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .message-input textarea {
    background-color: var(--input-bg-dark);
    color: var(--text-color-dark);
  }

  .search-box input {
    color: var(--text-color-dark);
  }

  .search-box .search-icon {
    color: #94a3b8;
  }

  .user-search input {
    background-color: var(--input-bg-dark);
    color: var(--text-color-dark);
    border-color: var(--border-color-dark);
  }

  .user-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .user-item.active {
    background-color: rgba(var(--primary-rgb), 0.2);
  }
}

.sync-icon {
  color: #64748b;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sync-icon:hover {
  background-color: #f1f5f9;
  color: #4361ee;
}

:deep(body.dark-mode) {
  .sync-icon {
    color: #94a3b8;
  }

  .sync-icon:hover {
    background-color: #1e293b;
    color: #4361ee;
  }
}
</style>
