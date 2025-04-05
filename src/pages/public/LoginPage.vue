<template>
  <section id="loginSection" class="login-section">
    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/images/tasky-white.png" alt="Tasky Logo" class="login-logo" id="loginLogo" />
      </div>

      <div class="login-form-container">
        <form id="loginForm" class="login-form" @submit.prevent="login">
          <div class="form-group">
            <label for="loginEmail">E-mail</label>
            <div class="input-group">
              <font-awesome-icon class="input-icon" icon="envelope" />
              <input type="email" id="loginEmail" placeholder="Seu e-mail" v-model="email" required />
            </div>
          </div>

          <div class="form-group">
            <label for="loginPassword">Senha</label>
            <div class="input-group">
              <font-awesome-icon class="input-icon" icon="lock" />
              <input type="password" id="loginPassword" placeholder="Sua senha" v-model="password" required />
            </div>
          </div>

          <div class="form-actions">
            <div class="remember-me">
              <div>
                <input type="checkbox" id="rememberMe" />
              </div>
              <label for="rememberMe">Lembrar-me</label>
            </div>
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :size="22"/>
            <span v-else>Entrar</span>
          </button>
        </form>
      </div>

      <div class="login-footer">
        <p>Não tem uma conta? <a href="#" id="registerLink">Cadastre-se</a></p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authService } from '@/services/authService';
import { localStorageService } from '@/utils/localStorageService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  try {
    const response = await authService.login({ email: email.value, password: password.value });
    const { accessToken, refreshToken } = response.data.token;
    const user = response.data.user;

    localStorageService.setAccessToken(accessToken);
    localStorageService.setRefreshToken(refreshToken);
    localStorageService.setUser(user);

    router.push('/');
  } catch {
    toast.error('Email ou senha incorretos');
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
  background-image:
    linear-gradient(to bottom right, rgba(245, 247, 250, 0.95), rgba(245, 247, 250, 0.8)),
    url('@/assets/images/login-bg.svg');
  background-size: cover;
  background-position: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.login-container {
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s;
}

.login-header {
  height: 220px;
  padding: 0.8rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a2233;
  position: relative;
}

.login-logo {
  height: auto;
  width: 170px;
  margin: 0 auto;
  padding: 0.5rem 0;
  position: relative;
  top: 6px;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  font-size: 1rem;
  opacity: 0.9;
}

.login-form-container {
  padding: 2rem 2rem 0 2rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.login-form .form-group {
  margin-bottom: 1.5rem;
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

.login-form .input-group i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
}

.login-form input[type='email'],
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

.login-form input[type='email']::placeholder,
.login-form input[type='password']::placeholder {
  color: #999999;
}

.login-form input[type='email']:focus,
.login-form input[type='password']:focus {
  outline: none;
  border-color: #4963eb;
  box-shadow: 0 0 0 2px rgba(73, 99, 235, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: nowrap;
}

.remember-me {
  display: flex;
  align-items: center;
  justify-content: start;
}

.remember-me input {
  background-color: green;
  margin: 0;
  cursor: pointer;
}

.remember-me label {
  margin: 0 0 0 0.5rem;
  cursor: pointer;
  font-weight: 400;
  color: #666666;
}

.forgot-password {
  color: #1a2233;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
  white-space: nowrap;
}

.forgot-password:hover {
  color: #333333;
  text-decoration: underline;
}

.login-form .btn-primary {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 4px;
  background-color: #1a2233;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.login-form .btn-primary:hover {
  background-color: #333333;
}

.login-footer {
  padding: 0 2rem 2rem;
  text-align: center;
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.login-footer a {
  color: #1a2233;
  text-decoration: none;
  transition: all 0.3s;
}

.login-footer a:hover {
  color: #333333;
  text-decoration: underline;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 30%;
  color: #666666;
}

/* Forçar estilos claros mesmo em modo escuro */
body.dark-mode .login-section {
  background-color: #f5f7fa;
  background-image:
    linear-gradient(to bottom right, rgba(245, 247, 250, 0.95), rgba(245, 247, 250, 0.8)),
    url('../images/login-bg.svg');
}

body.dark-mode .login-container {
  background-color: #ffffff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

body.dark-mode .login-form label {
  color: #333333;
}

body.dark-mode .login-form .input-group i {
  color: #666666;
}

body.dark-mode .login-form input[type='email'],
body.dark-mode .login-form input[type='password'] {
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #333333;
}

body.dark-mode .login-form input[type='email']::placeholder,
body.dark-mode .login-form input[type='password']::placeholder {
  color: #999999;
}

body.dark-mode .remember-me label {
  color: #666666;
}

body.dark-mode .login-footer {
  color: #666666;
}

body.dark-mode .forgot-password {
  color: #1a2233;
}

body.dark-mode .login-form .btn-primary {
  background-color: #1a2233;
}

body.dark-mode .login-footer a {
  color: #1a2233;
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
    max-width: 100%;
  }

  .login-header {
    padding: 1.5rem;
  }

  .login-logo {
    width: 180px;
  }

  .login-header h1 {
    font-size: 1.8rem;
  }

  .login-form-container {
    padding: 1.5rem;
  }
}

@media (max-height: 600px) {
  .login-section {
    padding: 1rem;
  }

  .login-header {
    padding: 1rem;
  }

  .login-logo {
    width: 150px;
    margin-bottom: 0.5rem;
  }

  .login-form-container {
    padding: 1rem;
  }

  .login-form {
    gap: 1rem;
  }
}
</style>
