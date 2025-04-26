<template>
  <div class="chat-support-button" :class="{ 'chat-active': isOpen }">
    <button
      class="chat-button"
      @click="toggleChat"
      :aria-label="isOpen ? 'Fechar chat de suporte' : 'Abrir chat de suporte'"
    >
      <font-awesome-icon :icon="isOpen ? 'times' : 'comment'" class="chat-icon" />
    </button>

    <div v-if="isOpen" class="chat-container">
      <div class="chat-header">
        <span>Chat de Suporte</span>
        <button @click="toggleChat" class="chat-close-button">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div class="chat-body" ref="chatBody">
        <div class="chat-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="chat-message"
            :class="message.sender"
          >
            <div class="message-content">
              <span v-html="message.text"></span>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input-container">
        <textarea
          v-model="newMessage"
          class="chat-input"
          placeholder="Digite sua mensagem..."
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        <button @click="sendMessage" class="chat-send-button">
          <font-awesome-icon icon="paper-plane" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';

interface Message {
  text: string;
  sender: 'user' | 'support';
  time: string;
}

const isOpen = ref(false);
const newMessage = ref('');
const messages = ref<Message[]>([]);
const chatBody = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value && messages.value.length === 0) {
    // Add initial support message when chat is first opened
    addSupportMessage('Olá! Como posso ajudar você hoje?');
  }
};

const formatTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const addSupportMessage = (text: string) => {
  setTimeout(() => {
    messages.value.push({
      text,
      sender: 'support',
      time: formatTime(),
    });
    scrollToBottom();
  }, 1000);
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({
    text: newMessage.value,
    sender: 'user',
    time: formatTime(),
  });

  const userMessage = newMessage.value;
  newMessage.value = '';

  scrollToBottom();

  // Simple auto-responses
  if (userMessage.toLowerCase().includes('ticket')) {
    addSupportMessage(
      'Para criar um novo ticket, acesse a seção "Tickets" e clique em "Novo Ticket". Se precisar de mais detalhes, posso explicar o passo a passo.',
    );
  } else if (userMessage.toLowerCase().includes('senha')) {
    addSupportMessage(
      'Para redefinir sua senha, clique em "Esqueci minha senha" na tela de login. Você receberá um e-mail com instruções para criar uma nova senha.',
    );
  } else if (
    userMessage.toLowerCase().includes('conta') ||
    userMessage.toLowerCase().includes('acesso')
  ) {
    addSupportMessage(
      'Para problemas de acesso à conta, verifique se está usando as credenciais corretas. Se persistir, entre em contato com o administrador do sistema no e-mail: suporte@taskysystem.com',
    );
  } else {
    addSupportMessage(
      'Obrigado pelo contato! Um agente de suporte responderá em breve. Se preferir, você pode consultar nossa FAQ para respostas rápidas às dúvidas mais comuns.',
    );
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
};

watch(isOpen, async (newValue) => {
  if (newValue) {
    await nextTick();
    scrollToBottom();
  }
});

onMounted(() => {
  // Add event listener to close chat when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const chatElement = document.querySelector('.chat-support-button');

    if (isOpen.value && chatElement && !chatElement.contains(target)) {
      isOpen.value = false;
    }
  });
});
</script>

<style scoped>
.chat-support-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-button {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: var(--primary-color, #1976d2);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.chat-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-icon {
  font-size: 1.5rem;
}

.chat-container {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.chat-header {
  padding: 15px;
  background-color: var(--primary-color, #1976d2);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-message {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
  word-break: break-word;
}

.chat-message.user {
  align-self: flex-end;
  background-color: #e3f2fd;
  border-bottom-right-radius: 5px;
}

.chat-message.support {
  align-self: flex-start;
  background-color: #f1f1f1;
  border-bottom-left-radius: 5px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-time {
  font-size: 0.7rem;
  color: #888;
  margin-top: 5px;
  align-self: flex-end;
}

.chat-input-container {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9rem;
  resize: none;
  height: 40px;
  max-height: 80px;
  outline: none;
  font-family: inherit;
}

.chat-send-button {
  background-color: var(--primary-color, #1976d2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .chat-container {
    width: 300px;
    height: 400px;
    right: 0;
  }
}
</style>
