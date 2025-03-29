<template>
  <div id="loginSection" class="container">
    <div class="login-card">
      <img src="@/assets/tasky_logo.png" alt="Logo" class="logo" />
      <form id="loginForm">
        <div class="form-group">
          <label for="emailLogin">Email:</label>
          <input type="text" id="emailLogin" placeholder="Digite seu nome" required />
        </div>
        <div class="form-group">
          <label for="senhaLogin">Senha:</label>
          <input type="password" id="senhaLogin" placeholder="Digite sua senha" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const login = () => {
  // Simulating a login action
  router.push('/user') // Redirect to user home page
}
</script>

<style scoped>
#loginSection {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1e2a3a 0%, #2c3e50 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

/* Estilo do card de login */
.login-card {
  width: 380px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo no login */
.login-card .logo {
  width: 150px;
  height: auto;
  margin-bottom: 30px;
  object-fit: contain;
}

/* Formulário de login */
#loginForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

#loginForm .form-group {
  margin-bottom: 20px;
  width: 100%;
}

#loginForm label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

#loginForm input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;
}

#loginForm input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

#loginForm button {
  width: 100%;
  margin-top: 20px;
  padding: 12px 30px;
  background: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

#loginForm button:hover {
  background: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}
</style>
