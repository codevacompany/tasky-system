<template>
  <div class="cadastro-empresa-wrapper">
    <div class="cadastro-empresa-left">
      <div class="form-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressWidth }"></div>
        </div>
        <h2 v-if="step === 1">Vamos começar!</h2>
        <h2 v-else-if="step === 2">Estamos quase lá</h2>
        <h1 v-if="step === 1">Informações da empresa</h1>
        <h1 v-else-if="step === 2">Informações do Responsável</h1>
        <form v-if="step === 1" @submit.prevent="nextStep" class="cadastro-form">
          <div class="form-group">
            <input v-model="form.companyName" type="text" required placeholder="Nome da empresa" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <input
                v-model="form.cnpj"
                type="text"
                required
                maxlength="18"
                placeholder="CNPJ (12.345.678/0001-99)"
                @input="form.cnpj = maskCNPJ(form.cnpj)"
                @blur="cnpjTouched = true"
              />
              <span v-if="cnpjTouched && cnpjError" class="input-error">{{ cnpjError }}</span>
            </div>
            <div class="form-group">
              <input
                v-model="form.companyPhone"
                type="tel"
                required
                placeholder="Telefone ((11) 91234-5678)"
                @input="form.companyPhone = maskPhone(form.companyPhone)"
                maxlength="15"
              />
            </div>
          </div>
          <div class="form-group">
            <input
              v-model="form.companyEmail"
              type="email"
              required
              placeholder="E-mail (empresa@email.com)"
              @input="form.companyEmail = maskEmail(form.companyEmail)"
              @blur="companyEmailTouched = true"
            />
            <span v-if="companyEmailTouched && companyEmailError" class="input-error">{{
              companyEmailError
            }}</span>
          </div>
          <button type="submit" class="btn btn-primary">Avançar</button>
        </form>
        <form v-else-if="step === 2" @submit.prevent="submitSignUp" class="cadastro-form">
          <div class="form-group">
            <input
              v-model="form.contactName"
              type="text"
              required
              placeholder="Nome do responsável"
            />
          </div>
          <div class="form-group">
            <input
              v-model="form.contactCpf"
              type="text"
              required
              maxlength="14"
              placeholder="CPF (123.456.789-00)"
              @input="form.contactCpf = maskCPF(form.contactCpf)"
              @blur="contactCpfTouched = true"
            />
            <span v-if="contactCpfTouched && contactCpfError" class="input-error">{{
              contactCpfError
            }}</span>
          </div>
          <div class="form-group">
            <input
              v-model="form.contactEmail"
              type="email"
              required
              placeholder="E-mail (nome@email.com)"
              @input="form.contactEmail = maskEmail(form.contactEmail)"
              @blur="contactEmailTouched = true"
            />
            <span v-if="contactEmailTouched && contactEmailError" class="input-error">{{
              contactEmailError
            }}</span>
          </div>
          <div class="form-group">
            <input
              v-model="form.contactPhone"
              type="tel"
              required
              placeholder="Telefone ((11) 91234-5678)"
              @input="form.contactPhone = maskPhone(form.contactPhone)"
              maxlength="15"
            />
          </div>

          <button type="button" class="btn btn-secondary" @click="prevStep">Voltar</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Enviando...</span>
            <span v-else>Concluir Cadastro</span>
          </button>
        </form>
        <div v-else class="cadastro-confirmacao">
          <div class="confirmacao-content">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style="margin-bottom: 1.2rem"
            >
              <circle cx="30" cy="30" r="30" fill="#e6f4ea" />
              <path
                d="M18 32.5L27 41.5L43 23.5"
                stroke="#25D366"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2>Cadastro realizado com sucesso!</h2>
            <p class="confirmacao-msg">
              Obrigado por se cadastrar.<br />Em breve entraremos em contato com você.
            </p>
            <div class="confirmacao-actions">
              <button class="btn btn-secondary" @click="goToLanding">Página Inicial</button>
              <button class="btn btn-primary" @click="goToLogin">Fazer Login</button>
            </div>
          </div>
        </div>
        <p class="termos" v-if="step < 3">
          Ao cadastrar, você concorda com nossa Política de Privacidade e Termos de Uso.
        </p>
      </div>
    </div>
    <div class="cadastro-empresa-right">
      <div class="visual-content">
        <h2>Transforme a gestão da sua empresa</h2>
        <p>
          Organize tarefas, otimize processos e aumente a produtividade da sua equipe com o Tasky
          System.
        </p>
        <img src="@/assets/images/landing/hero-image.png" alt="Dashboard Tasky" />
      </div>
    </div>
    <router-link to="/landing" class="voltar-bottom-btn">Voltar</router-link>
  </div>

  <!-- WhatsApp Button (Outside the main container) -->
  <a href="https://wa.me/SEUNUMEROAQUI" target="_blank" class="whatsapp-button">
    <svg
      fill="#FFFFFF"
      height="36px"
      width="36px"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 308 308"
      xml:space="preserve"
    >
      <g>
        <path
          d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
        ></path>
        <path
          d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
        ></path>
      </g>
    </svg>

    <div class="whatsapp-tooltip">Fale conosco no whatsapp</div>
  </a>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { signupService } from '@/services/signupService';
import { toast } from 'vue3-toastify';
import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskEmail,
  validateEmail,
  validateCPF,
  validateCNPJ,
} from '@/utils/form-helpers';
import { AxiosError } from 'axios';

const router = useRouter();
const step = ref(1);

const form = reactive({
  // Step 1
  companyName: '',
  cnpj: '',
  companyEmail: '',
  companyPhone: '',
  // Step 2
  contactName: '',
  contactCpf: '',
  contactEmail: '',
  contactPhone: '',
});

const companyEmailError = ref('');
const contactEmailError = ref('');
const companyEmailTouched = ref(false);
const contactEmailTouched = ref(false);
const contactCpfError = ref('');
const contactCpfTouched = ref(false);
const cnpjError = ref('');
const cnpjTouched = ref(false);

const isSubmitting = ref(false);

watch(
  () => form.companyEmail,
  (val) => {
    if (!val || validateEmail(val)) {
      companyEmailError.value = '';
    } else {
      companyEmailError.value = 'E-mail inválido';
    }
  },
);

watch(
  () => form.contactEmail,
  (val) => {
    if (!val || validateEmail(val)) {
      contactEmailError.value = '';
    } else {
      contactEmailError.value = 'E-mail inválido';
    }
  },
);

watch(
  () => form.contactCpf,
  (val) => {
    if (!val) {
      contactCpfError.value = '';
    } else {
      const isValid = validateCPF(val);
      contactCpfError.value = isValid ? '' : 'CPF inválido';
    }
  },
);

watch(
  () => form.cnpj,
  (val) => {
    if (!val) {
      cnpjError.value = '';
    } else {
      const isValid = validateCNPJ(val);
      cnpjError.value = isValid ? '' : 'CNPJ inválido';
    }
  },
);

const progressWidth = computed(() => {
  if (step.value === 1) return '50%';
  if (step.value === 2) return '100%';
  return '100%';
});

function nextStep() {
  if (form.cnpj && !validateCNPJ(form.cnpj)) {
    cnpjTouched.value = true;
    cnpjError.value = 'CNPJ inválido';
    return;
  }

  if (step.value < 2) {
    step.value++;
  } else if (step.value === 2) {
    step.value = 3;
  }
}
function prevStep() {
  if (step.value > 1) step.value--;
}

function goToLanding() {
  router.push('/landing');
}

function goToLogin() {
  router.push('/login');
}

async function submitSignUp() {
  if (isSubmitting.value) return;

  if (!validateCPF(form.contactCpf)) {
    contactCpfTouched.value = true;
    contactCpfError.value = 'CPF inválido';
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      companyName: form.companyName,
      email: form.companyEmail,
      cnpj: form.cnpj.replace(/[^\d]/g, ''),
      contactName: form.contactName,
      contactCpf: form.contactCpf.replace(/[^\d]/g, ''),
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone.replace(/[^\d]/g, ''),
      termsAccepted: true,
      privacyPolicyAccepted: true,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
    };

    await signupService.createSignUp(payload);
    step.value = 3;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 409) {
      toast.error('Empresa já cadastrada. Por favor, faça login.');
    } else {
      toast.error('Ocorreu um erro ao enviar seu cadastro. Por favor, tente novamente.');
    }
    console.error('Signup error:', error);
  } finally {
    isSubmitting.value = false;
  }
}
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
  padding: 0rem 2rem 0rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
}

.cadastro-empresa-right {
  flex: 2;
  background: #f6f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 100vh;
  padding: 4.2rem 0rem 0rem 0rem;
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
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
}

.progress {
  height: 6px;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s;
  position: absolute;
  top: 50px;
  left: 0;
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
  max-width: 560px;
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
  margin-bottom: 3rem;
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

.whatsapp-button {
  position: fixed;
  bottom: 36px;
  right: 36px;
  z-index: 1000;
  background-color: #25d366;
  color: white;
  border-radius: 50%;
  padding: 12px;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (min-width: 768px) {
  .whatsapp-button {
    bottom: 28px;
    right: 18px;
  }
}

.whatsapp-button:hover {
  background-color: #128c7e;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.whatsapp-tooltip {
  position: absolute;
  display: none;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 14px;
  background-color: white;
  color: black;
  font-size: 15px;
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.whatsapp-button:hover .whatsapp-tooltip {
  display: block;
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
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
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
.confirmacao-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #64748b;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #4b5563;
}

.input-error {
  color: #e53935;
  font-size: 0.93rem;
  margin-top: 2px;
  display: block;
  text-align: left;
}
.consent-group {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
}
.checkbox-wrapper input[type='checkbox'] {
  margin-right: 0.5rem;
  min-width: 18px;
  height: 18px;
  margin-top: 2px;
}
.checkbox-wrapper label {
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
}
.checkbox-wrapper a {
  color: var(--primary-color);
  text-decoration: none;
}
.checkbox-wrapper a:hover {
  text-decoration: underline;
}
@media (max-width: 900px) {
  .cadastro-empresa-wrapper {
    flex-direction: column;
  }
  .cadastro-empresa-left,
  .cadastro-empresa-right {
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
