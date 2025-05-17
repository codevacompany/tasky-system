<template>
  <div class="cadastro-empresa-wrapper">
    <div class="cadastro-empresa-left">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth }"></div>
      </div>
      <h2 v-if="step === 1">Vamos começar!</h2>
      <h2 v-else-if="step === 2">Estamos quase lá...</h2>
      <h2 v-else-if="step === 3">Finalizando...</h2>
      <h2 v-else-if="step < 4">Estamos quase lá</h2>
      <h1 v-if="step === 1">Informações da empresa</h1>
      <h1 v-else-if="step === 2">Informações do Endereço</h1>
      <h1 v-else-if="step === 3">Informações do Responsável</h1>
      <form v-if="step === 1" @submit.prevent="nextStep" class="cadastro-form">
        <div class="form-group">
          <input v-model="form.nomeEmpresa" type="text" required placeholder="Nome da empresa" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.cnpj" type="text" required maxlength="18" placeholder="CNPJ (12.345.678/0001-99)" @input="form.cnpj = maskCNPJ(form.cnpj)" />
          </div>
          <div class="form-group">
            <input v-model="form.telefoneEmpresa" type="tel" required placeholder="Telefone ((11) 91234-5678)" @input="form.telefoneEmpresa = maskPhone(form.telefoneEmpresa)" maxlength="15" />
          </div>
        </div>
        <div class="form-group">
          <input v-model="form.emailEmpresa" type="email" required placeholder="E-mail (empresa@email.com)" @input="form.emailEmpresa = maskEmail(form.emailEmpresa)" @blur="emailEmpresaTouched = true" />
          <span v-if="emailEmpresaTouched && emailEmpresaError" class="input-error">{{ emailEmpresaError }}</span>
        </div>
        <button type="submit" class="btn btn-primary">Avançar</button>
      </form>
      <form v-else-if="step === 2" @submit.prevent="nextStep" class="cadastro-form">
        <div class="form-group">
          <input v-model="form.rua" type="text" required placeholder="Rua" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.numero" type="text" required placeholder="Número" />
          </div>
          <div class="form-group">
            <input v-model="form.cep" type="text" required placeholder="CEP (12345-678)" @input="form.cep = maskCEP(form.cep)" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input v-model="form.cidade" type="text" required placeholder="Cidade" />
          </div>
          <div class="form-group">
            <input v-model="form.estado" type="text" required placeholder="Estado" />
          </div>
        </div>
        <button type="button" class="btn btn-secondary" @click="prevStep">Voltar</button>
        <button type="submit" class="btn btn-primary">Avançar</button>
      </form>
      <form v-else-if="step === 3" @submit.prevent="nextStep" class="cadastro-form">
        <div class="form-group">
          <input v-model="form.nomeResponsavel" type="text" required placeholder="Nome do responsável" />
        </div>
        <div class="form-group">
          <input v-model="form.cpfResponsavel" type="text" required placeholder="CPF (123.456.789-00)" @input="form.cpfResponsavel = maskCPF(form.cpfResponsavel)" />
        </div>
        <div class="form-group">
          <input v-model="form.emailResponsavel" type="email" required placeholder="E-mail (nome@email.com)" @input="form.emailResponsavel = maskEmail(form.emailResponsavel)" @blur="emailResponsavelTouched = true" />
          <span v-if="emailResponsavelTouched && emailResponsavelError" class="input-error">{{ emailResponsavelError }}</span>
        </div>
        <div class="form-group">
          <input v-model="form.telefoneResponsavel" type="tel" required placeholder="Telefone ((11) 91234-5678)" @input="form.telefoneResponsavel = maskPhone(form.telefoneResponsavel)" maxlength="15" />
        </div>
        <button type="button" class="btn btn-secondary" @click="prevStep">Voltar</button>
        <button type="submit" class="btn btn-primary">Avançar</button>
      </form>
      <div v-else class="cadastro-confirmacao">
        <div class="confirmacao-content">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1.2rem;"><circle cx="30" cy="30" r="30" fill="#e6f4ea"/><path d="M18 32.5L27 41.5L43 23.5" stroke="#25D366" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h2>Cadastro realizado com sucesso!</h2>
          <p class="confirmacao-msg">Obrigado por se cadastrar.<br>Em breve entraremos em contato com você.</p>
          <p class="confirmacao-redirect">Você será redirecionado para a página inicial em alguns segundos...</p>
        </div>
      </div>
      <p class="termos" v-if="step < 4">Ao cadastrar, você concorda com nossa Política de Privacidade.</p>
    </div>
    <div class="cadastro-empresa-right">
      <div class="visual-content">
        <h2>Transforme a gestão da sua empresa</h2>
        <p>Organize tarefas, otimize processos e aumente a produtividade da sua equipe com o Tasky System.</p>
        <img src="@/assets/images/landing/hero-image.png" alt="Dashboard Tasky" />
      </div>
    </div>
    <router-link to="/landing" class="voltar-bottom-btn">Voltar</router-link>
    <a href="https://wa.me/SEUNUMEROAQUI" target="_blank" class="whatsapp-support-btn" title="Fale conosco pelo WhatsApp">
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="19" cy="19" r="19" fill="#25D366"/>
        <path d="M27.5 22.5C26.8333 22.5 26.1667 22.5 25.5 22.5C25.1667 22.5 25 22.3333 24.8333 22.1667C24.5 21.8333 24.1667 21.5 23.8333 21.1667C23.6667 21 23.5 21 23.3333 21C23.1667 21 23 21 22.8333 21.1667C22.5 21.5 22.1667 21.8333 21.8333 22.1667C21.6667 22.3333 21.5 22.5 21.1667 22.5C20.5 22.5 19.8333 22.5 19.1667 22.5C18.8333 22.5 18.6667 22.3333 18.5 22.1667C18.1667 21.8333 17.8333 21.5 17.5 21.1667C17.3333 21 17.1667 21 17 21C16.8333 21 16.6667 21 16.5 21.1667C16.1667 21.5 15.8333 21.8333 15.5 22.1667C15.3333 22.3333 15.1667 22.5 14.8333 22.5C14.1667 22.5 13.5 22.5 12.8333 22.5C12.5 22.5 12.3333 22.3333 12.1667 22.1667C11.8333 21.8333 11.5 21.5 11.1667 21.1667C11 21 10.8333 21 10.6667 21C10.5 21 10.3333 21 10.1667 21.1667C9.83333 21.5 9.5 21.8333 9.16667 22.1667C9 22.3333 8.83333 22.5 8.5 22.5C7.83333 22.5 7.16667 22.5 6.5 22.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const step = ref(1);

const form = reactive({
  // Etapa 1
  nomeEmpresa: '',
  cnpj: '',
  emailEmpresa: '',
  telefoneEmpresa: '',
  // Etapa 2
  rua: '',
  numero: '',
  cep: '',
  cidade: '',
  estado: '',
  // Etapa 3
  nomeResponsavel: '',
  cpfResponsavel: '',
  emailResponsavel: '',
  telefoneResponsavel: '',
});

const emailEmpresaError = ref('');
const emailResponsavelError = ref('');
const emailEmpresaTouched = ref(false);
const emailResponsavelTouched = ref(false);

function maskCPF(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskCNPJ(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}
function maskCEP(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}
function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}
function maskEmail(value: string) {
  return value.toLowerCase();
}

function validateEmail(email: string) {
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

watch(() => form.emailEmpresa, (val) => {
  if (!val || validateEmail(val)) {
    emailEmpresaError.value = '';
  } else {
    emailEmpresaError.value = 'E-mail inválido';
  }
});

watch(() => form.emailResponsavel, (val) => {
  if (!val || validateEmail(val)) {
    emailResponsavelError.value = '';
  } else {
    emailResponsavelError.value = 'E-mail inválido';
  }
});

const progressWidth = computed(() => {
  if (step.value === 1) return '33%';
  if (step.value === 2) return '66%';
  if (step.value === 3) return '100%';
  return '100%';
});

function nextStep() {
  if (step.value < 3) {
    step.value++;
  } else if (step.value === 3) {
    // Aqui você pode enviar os dados para a API se desejar
    step.value = 4;
  }
}
function prevStep() {
  if (step.value > 1) step.value--;
}

watch(step, (val) => {
  if (val === 4) {
    setTimeout(() => {
      router.push('/landing');
    }, 5000);
  }
});
</script>

<style scoped>
.cadastro-empresa-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}
.cadastro-empresa-left {
  flex: 2;
  max-width: none;
  background: #fff;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 0 16px rgba(0,0,0,0.04);
}
.cadastro-empresa-right {
  flex: 2;
  background: #f6f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-content {
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
}
.visual-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  white-space: nowrap;
}
.visual-content p {
  font-size: 1rem;
  margin-bottom: 1.2rem;
  color: #64748b;
}
.visual-content img {
  max-width: 70%;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.07);
}
.progress-bar {
  width: 100%;
  height: 6px;
  background: #f3f3f3;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s;
}
.cadastro-empresa-left h2 {
  color: var(--primary-color);
  font-size: 1rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
}
.cadastro-empresa-left h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 100%;
  max-width: 520px;
}
.form-row {
  display: flex;
  gap: 0.7rem;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-group input {
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
  width: 100%;
  min-width: 0;
}
.form-group input::placeholder {
  color: #495057;
  opacity: 1;
  font-size: 0.92rem;
}
.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.7rem;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: var(--primary-dark);
}
.btn-secondary {
  width: 100%;
  padding: 0.8rem;
  background: #f3f3f3;
  color: #64748b;
  border: none;
  border-radius: 4px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.7rem;
  transition: background 0.2s;
}
.btn-secondary:hover {
  background: #e5e7eb;
}
.termos {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 1rem;
  text-align: center;
}
.voltar-bottom-btn {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #222;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}
.voltar-bottom-btn:hover {
  color: var(--primary-color);
}
.whatsapp-support-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  background: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  border-radius: 50%;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.whatsapp-support-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}
.cadastro-confirmacao {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 340px;
  width: 100%;
}
.confirmacao-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  padding: 2.5rem 2rem 2rem 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  max-width: 400px;
  margin: 0 auto;
}
.confirmacao-content h2 {
  color: #222;
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  text-align: center;
}
.confirmacao-msg {
  color: #3b3b3b;
  font-size: 1.05rem;
  text-align: center;
  margin-bottom: 1.2rem;
}
.confirmacao-redirect {
  color: #64748b;
  font-size: 0.98rem;
  text-align: center;
}
.input-error {
  color: #e53935;
  font-size: 0.93rem;
  margin-top: 2px;
  display: block;
  text-align: left;
}
@media (max-width: 900px) {
  .cadastro-empresa-wrapper {
    flex-direction: column;
  }
  .cadastro-empresa-left, .cadastro-empresa-right {
    max-width: 100%;
    min-width: 0;
    flex: unset;
    align-items: stretch;
  }
  .cadastro-empresa-right {
    padding: 1.2rem 0;
  }
  .cadastro-form {
    max-width: 100%;
  }
}
</style> 