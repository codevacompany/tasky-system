<template>
  <div class="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
    <button
      class="w-14 h-14 rounded-full bg-blue-600 text-white border-none shadow-lg cursor-pointer flex justify-center items-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
      @click="toggleChat"
      :aria-label="isOpen ? 'Fechar chat de suporte' : 'Abrir chat de suporte'"
    >
      <font-awesome-icon :icon="isOpen ? 'times' : 'comment'" class="text-2xl" />
    </button>

    <div
      v-if="isOpen"
      class="absolute bottom-20 right-0 w-[350px] h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 md:w-[350px] md:h-[450px] max-md:w-[300px] max-md:h-[400px]"
    >
      <div class="px-4 py-4 bg-blue-600 text-white font-semibold flex justify-between items-center">
        <span>Chat de Suporte</span>
        <button
          @click="toggleChat"
          class="bg-transparent border-none text-white cursor-pointer text-base p-0 hover:opacity-80 transition-opacity"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="chatBody">
        <div class="flex flex-col gap-2.5">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="max-w-[80%] px-4 py-2.5 rounded-2xl relative break-words"
            :class="{
              'self-end bg-blue-50 rounded-br-md': message.sender === 'user',
              'self-start bg-gray-100 rounded-bl-md': message.sender === 'support',
            }"
          >
            <div class="flex flex-col">
              <span v-html="message.text"></span>
              <span class="text-xs text-gray-500 mt-1 self-end">{{ message.time }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex p-2.5 bg-white border-t border-gray-200">
        <textarea
          v-model="newMessage"
          class="flex-1 border border-gray-300 rounded-2xl px-4 py-2 text-sm resize-none h-10 max-h-20 outline-none font-sans focus:border-blue-500 transition-colors"
          placeholder="Digite sua mensagem..."
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        <button
          @click="sendMessage"
          class="bg-blue-600 text-white border-none w-10 h-10 rounded-full ml-2.5 cursor-pointer flex justify-center items-center hover:bg-blue-700 transition-colors"
        >
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
    const chatElement = document.querySelector('.fixed.bottom-8.right-8');

    if (isOpen.value && chatElement && !chatElement.contains(target)) {
      isOpen.value = false;
    }
  });
});
</script>
