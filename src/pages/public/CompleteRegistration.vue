<template>
  <section id="completeRegistrationSection" class="login-section">
    <div class="login-container">
      <div class="login-header">
        <img
          src="@/assets/images/tasky-pro-white.png"
          alt="Tasky Logo"
          class="login-logo"
          id="loginLogo"
        />
      </div>

      <div class="login-form-container">
        <h2 class="form-title">Complete seu cadastro</h2>
        <p class="form-description">
          Estamos quase lá! Crie suas credenciais para acessar o sistema.
        </p>

        <form
          id="completeRegistrationForm"
          class="login-form"
          @submit.prevent="completeRegistration"
        >
          <div class="form-group">
            <label for="customKey">Prefixo da empresa</label>
            <div class="input-group">
              <font-awesome-icon class="input-icon" icon="building" />
              <input
                type="text"
                id="customKey"
                placeholder="2-3 letras (Ex: TS)"
                v-model="customKey"
                required
                maxlength="3"
                minlength="2"
                @input="handlePrefixInput"
              />
            </div>
            <small class="helper-text"
              >Este prefixo será utilizado no ID dos seus tickets, ex: {{ prefixExample }}</small
            >
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <div class="input-group">
              <font-awesome-icon class="input-icon" icon="lock" />
              <input
                type="password"
                id="password"
                placeholder="Sua senha"
                v-model="password"
                required
                @input="validatePassword"
              />
            </div>
            <div class="password-strength" v-if="password">
              <div class="strength-meter">
                <div
                  class="strength-bar"
                  :style="{ width: passwordStrength + '%' }"
                  :class="strengthClass"
                ></div>
              </div>
              <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirme a senha</label>
            <div class="input-group">
              <font-awesome-icon class="input-icon" icon="lock" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
                v-model="confirmPassword"
                required
                @input="validatePasswordMatch"
              />
            </div>
            <small class="error-text" v-if="!passwordsMatch && confirmPassword">
              As senhas não conferem
            </small>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="isLoading || !isFormValid"
          >
            <LoadingSpinner v-if="isLoading" :size="22" />
            <span v-else>Finalizar cadastro</span>
          </button>
        </form>
      </div>

      <div class="login-footer">
        <p>Já tem uma conta? <router-link to="/login">Fazer login</router-link></p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { signupService } from '@/services/signupService';

const router = useRouter();
const route = useRoute();
const token = computed(() => route.params.token as string);

const customKey = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const passwordStrength = ref(0);
const passwordsMatch = ref(true);

// Example ticket with prefix
const prefixExample = computed(() => {
  if (!customKey.value) return 'TS-001';
  return `${customKey.value.toUpperCase()}-001`;
});

// Convert prefix to uppercase
const handlePrefixInput = () => {
  customKey.value = customKey.value.toUpperCase();
};

// Password strength calculation
const validatePassword = () => {
  let strength = 0;
  const pwd = password.value;

  if (pwd.length >= 8) strength += 25;
  if (pwd.match(/[A-Z]/)) strength += 25;
  if (pwd.match(/[0-9]/)) strength += 25;
  if (pwd.match(/[^A-Za-z0-9]/)) strength += 25;

  passwordStrength.value = strength;
  validatePasswordMatch();
};

// Check if passwords match
const validatePasswordMatch = () => {
  if (confirmPassword.value) {
    passwordsMatch.value = password.value === confirmPassword.value;
  }
};

const strengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'weak';
  if (passwordStrength.value < 75) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Fraca';
  if (passwordStrength.value < 75) return 'Média';
  return 'Forte';
});

const isFormValid = computed(() => {
  return (
    customKey.value.length >= 2 &&
    password.value.length >= 8 &&
    passwordsMatch.value &&
    confirmPassword.value
  );
});

const completeRegistration = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  try {
    await signupService.completeRegistration(token.value, {
      customKey: customKey.value,
      password: password.value,
    });

    toast.success('Cadastro finalizado com sucesso!');
    router.push('/');
  } catch (error) {
    console.error('Error completing registration:', error);
    toast.error('Ocorreu um erro ao finalizar o cadastro. Por favor, tente novamente.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  background-image: linear-gradient(
    to bottom right,
    rgba(245, 247, 250, 0.95),
    rgba(245, 247, 250, 0.8)
  );
  background-size: cover;
  background-position: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s;
}

.login-header {
  height: 160px;
  padding: 0.8rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--secondary-dark);
  position: relative;
}

.login-logo {
  height: auto;
  width: 140px;
  margin: 0 auto;
  padding: 0.5rem 0;
  position: relative;
  top: 6px;
}

.login-form-container {
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-description {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-form {
  margin-bottom: 1rem;
}

.login-form .form-group {
  margin-bottom: 1.2rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
}

.login-form .input-group {
  position: relative;
}

.login-form input[type='text'],
.login-form input[type='password'] {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #333333;
  font-size: 1rem;
  transition: all 0.3s;
}

.login-form input[type='text']:focus,
.login-form input[type='password']:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(73, 99, 235, 0.2);
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 30%;
  color: #666666;
}

.helper-text {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.error-text {
  display: block;
  font-size: 0.85rem;
  color: #dc3545;
  margin-top: 0.5rem;
}

/* Password strength meter */
.password-strength {
  margin-top: 0.5rem;
}

.strength-meter {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

.strength-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.strength-bar.weak {
  background-color: #dc3545;
}

.strength-bar.medium {
  background-color: #ffc107;
}

.strength-bar.strong {
  background-color: #28a745;
}

.strength-text {
  font-size: 0.85rem;
}

.strength-text.weak {
  color: #dc3545;
}

.strength-text.medium {
  color: #ffc107;
}

.strength-text.strong {
  color: #28a745;
}

.btn-primary {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  padding: 0 1.5rem 1.5rem;
  text-align: center;
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s;
}

.login-footer a:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .login-container {
    max-width: 90%;
  }
}

@media (max-height: 700px) {
  .login-section {
    padding: 1rem;
  }

  .login-header {
    height: 120px;
  }

  .login-logo {
    width: 120px;
  }
}
</style>
