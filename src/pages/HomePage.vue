<template>
  <div class="home-page">
    <header class="hero-section">
      <div class="container">
        <div class="logo-container">
          <img src="@/assets/images/tasky-white.png" alt="Tasky System Logo" class="logo">
        </div>
        <p class="subtitle">Sistema Inteligente de Gestão de Tarefas e Comunicação Empresarial</p>
        <div class="cta-buttons">
          <router-link to="/login" class="btn btn-primary">Entrar</router-link>
          <router-link to="/register" class="btn btn-secondary">Solicitar Demonstração</router-link>
        </div>
      </div>
    </header>

    <section class="features">
      <div class="container">
        <h2>Funcionalidades Principais</h2>
        <div class="features-grid">
          <div class="feature-card">
            <font-awesome-icon :icon="['fas', 'tasks']" />
            <h3>Gestão de Tarefas</h3>
            <p>Organize, priorize e acompanhe todas as atividades da sua equipe em um único lugar</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon :icon="['fas', 'comments']" />
            <h3>Comunicação Integrada</h3>
            <p>Centralize a comunicação da equipe com discussões por tarefa e notificações inteligentes</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon :icon="['fas', 'chart-line']" />
            <h3>Métricas de Produtividade</h3>
            <p>Acompanhe indicadores de desempenho e resultados em tempo real</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon :icon="['fas', 'users']" />
            <h3>Colaboração Eficiente</h3>
            <p>Facilite o trabalho em equipe com atribuição de responsáveis e acompanhamento de progresso</p>
          </div>
        </div>
      </div>
    </section>

    <section class="highlight-section">
      <div class="container highlight-content center-text">
        <h2 class="impact-phrase">
          Conecte pessoas, tarefas, projetos<br />
          e inteligência em um só lugar.
        </h2>
      </div>
    </section>

    <section class="benefits">
      <div class="container">
        <h2>Benefícios para sua Empresa</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <font-awesome-icon :icon="['fas', 'arrow-up']" />
            <h3>Aumento da Produtividade</h3>
            <p>Reduza o tempo gasto com gestão e aumente o foco nas atividades importantes</p>
          </div>
          <div class="benefit-card">
            <font-awesome-icon :icon="['fas', 'comments']" />
            <h3>Comunicação Eficaz</h3>
            <p>Elimine ruídos na comunicação e mantenha todos alinhados com os objetivos</p>
          </div>
          <div class="benefit-card">
            <font-awesome-icon :icon="['fas', 'chart-pie']" />
            <h3>Gestão de Resultados</h3>
            <p>Monitore indicadores e tome decisões baseadas em dados concretos</p>
          </div>
          <div class="benefit-card">
            <font-awesome-icon :icon="['fas', 'clock']" />
            <h3>Otimização de Tempo</h3>
            <p>Reduza reuniões desnecessárias e automatize processos manuais</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Pronto para transformar a gestão da sua empresa?</h2>
        <p>Agende uma demonstração gratuita e descubra como o Tasky pode aumentar a produtividade da sua equipe</p>
        <router-link to="/register" class="btn btn-primary btn-large">Solicitar Demonstração</router-link>
      </div>
    </section>

    <footer class="main-footer">
      <div class="container">
        <p>&copy; 2024 Tasky System. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Tasky - Sistema de Gestão de Tarefas e Comunicação'
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.hero-section {
  background: #232938;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo {
  max-width: 250px;
  height: auto;
  filter: brightness(0) invert(1);
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 300;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 900px) {
  .subtitle {
    font-size: 1.1rem;
  }
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #fff;
  color: #232938;
  border: 2px solid #fff;
}

.btn-primary:hover {
  background-color: #f5f7fa;
  color: #232938;
  border: 2px solid #fff;
}

.btn-secondary {
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.btn-secondary:hover {
  background-color: #232938;
  color: #fff;
  border: 2px solid #fff;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.2rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.features {
  padding: 4rem 0;
  background-color: #fff;
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: #232938;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s;
  border: 1.5px solid #232938;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(35, 41, 56, 0.12);
}

.feature-card svg {
  font-size: 2.5rem;
  color: #232938;
  margin-bottom: 1rem;
}

/* Seção de destaque entre funcionalidades e benefícios */
.highlight-section {
  background: #232938;
  color: #fff;
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-content.center-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.impact-phrase {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #fff;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -1px;
}
@media (max-width: 700px) {
  .impact-phrase {
    font-size: 1.5rem;
  }
}

.benefits {
  padding: 4rem 0;
  background-color: #f5f7fa;
}

.benefits h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: #232938;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s;
  border: 1.5px solid #232938;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(35, 41, 56, 0.12);
}

.benefit-card svg {
  font-size: 2.5rem;
  color: #232938;
  margin-bottom: 1rem;
}

.cta-section {
  padding: 4rem 0;
  background: #232938;
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 100vw;
  margin-left: auto;
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 900px) {
  .cta-section p {
    font-size: 1rem;
  }
}
@media (max-width: 600px) {
  .cta-section p {
    font-size: 0.85rem;
  }
}

.main-footer {
  background-color: #232938;
  color: white;
  padding: 2rem 0;
  text-align: center;
  margin-top: auto;
}
</style> 