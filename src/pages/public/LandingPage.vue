<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <header class="hero-section">
      <nav class="navbar">
        <div class="menu">
          <div class="logo">
            <img src="@/assets/images/tasky-white.png" alt="Tasky Logo" />
          </div>
          <div class="nav-links">
            <a href="#features">Produto</a>
            <a href="#pricing">Preços</a>
            <a href="#docs">Recursos</a>
          </div>
        </div>
        <div class="auth-links">
          <router-link to="/login" class="login-btn">Entrar</router-link>
          <router-link to="/login" class="btn btn-primary hero-button">AGENDE UMA DEMO</router-link>
        </div>
      </nav>

      <div class="hero-content">
        <div class="hero-text">
          <h1>Sistema inteligente de gestão de tarefas e comunicação empresarial</h1>
          <p class="subtitle">
            Aumente a produtividade, simplifique a comunicação e organize sua equipe.
          </p>
          <div class="hero-buttons">
            <router-link to="/cadastro-empresa" class="btn btn-primary hero-button">COMECE GRÁTIS</router-link>
            <a href="#contact" class="btn btn-outline hero-button">AGENDE UMA DEMO</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/landing/hero-image.png" alt="Tasky Dashboard" />
        </div>
      </div>
    </header>

    <!-- Main Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>
            Maximize a produtividade e melhore a comunicação da sua empresa com uma solução completa
          </h2>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/landing/productivity-icon.svg" alt="Produtividade" />
            </div>
            <h3>Aumento de produtividade</h3>
            <p>Reduza o tempo gasto com gestão e aumente o foco nas atividades importantes.</p>
            <a href="#" class="feature-link">Saiba mais</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/landing/communication-icon.svg" alt="Comunicação" />
            </div>
            <h3>Comunicação Eficaz</h3>
            <p>Elimine ruídos na comunicação e mantenha todos alinhados com os objetivos.</p>
            <a href="#" class="feature-link">Saiba mais</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/landing/resources-icon.svg" alt="Recursos" />
            </div>
            <h3>Gestão de Recursos</h3>
            <p>Monitore indicadores e tome decisões baseadas em dados concretos.</p>
            <a href="#" class="feature-link">Saiba mais</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <img src="@/assets/images/landing/time-icon.svg" alt="Tempo" />
            </div>
            <h3>Otimização de Tempo</h3>
            <p>Reduza reuniões desnecessárias e automatize processos manuais.</p>
            <a href="#" class="feature-link">Saiba mais</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Description -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <h2>
            O Tasky System ajuda você a gerenciar projetos, simplificar a comunicação e aumentar a
            produtividade da sua equipe em uma plataforma integrada
          </h2>
        </div>
      </div>
    </section>

    <!-- Features Detail Sections -->
    <section class="feature-detail-section">
      <div class="container">
        <div class="feature-detail">
          <div class="feature-detail-content">
            <h2>Gestão de tarefas</h2>
            <p>
              Organize, priorize e acompanhe todas as atividades da sua equipe em um único lugar.
            </p>
            <ul class="feature-list">
              <li>Crie tarefas de forma simples e rápida</li>
              <li>Defina prioridades, prazos, pedidos aos colegas</li>
              <li>Acompanhe a evolução de cada projeto em tempo real</li>
            </ul>
          </div>
          <div class="feature-detail-image">
            <img src="@/assets/images/landing/task-management.svg" alt="Gestão de tarefas" />
          </div>
        </div>
      </div>
    </section>

    <section class="feature-detail-section bg-light">
      <div class="container">
        <div class="feature-detail reverse">
          <div class="feature-detail-content">
            <h2>Comunicação Integrada</h2>
            <p>
              Centralize a comunicação da equipe com discussões por tarefa e notificações
              inteligentes.
            </p>
            <ul class="feature-list">
              <li>Conversas estruturadas por tarefas e projetos</li>
              <li>Notificações automáticas de atualizações</li>
              <li>Compartilhamento de arquivos simplificado</li>
            </ul>
          </div>
          <div class="feature-detail-image">
            <img
              src="@/assets/images/landing/integrated-communication.svg"
              alt="Comunicação Integrada"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="feature-detail-section">
      <div class="container">
        <div class="feature-detail">
          <div class="feature-detail-content">
            <h2>Métricas e produtividade</h2>
            <p>Acompanhe indicadores de desempenho e resultados em tempo real.</p>
            <ul class="feature-list">
              <li>Painéis de controle personalizáveis</li>
              <li>Visualização gráfica da produtividade</li>
              <li>Identificação de gargalos e oportunidades</li>
            </ul>
          </div>
          <div class="feature-detail-image">
            <img
              src="@/assets/images/landing/metrics-productivity.svg"
              alt="Métricas e produtividade"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="feature-detail-section bg-light">
      <div class="container">
        <div class="feature-detail reverse">
          <div class="feature-detail-content">
            <h2>Colaboração Eficiente</h2>
            <p>
              Facilite o trabalho em equipe com atribuição de responsáveis e acompanhamento de
              progresso.
            </p>
            <ul class="feature-list">
              <li>Comentários contextuais em cada tarefa</li>
              <li>Edição colaborativa de documentos</li>
              <li>Atribuições claras de responsabilidades</li>
            </ul>
          </div>
          <div class="feature-detail-image">
            <img
              src="@/assets/images/landing/efficient-collaboration.svg"
              alt="Colaboração Eficiente"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <h2>Pronto para transformar a gestão da sua empresa?</h2>
        <p>
          Agende uma demonstração gratuita e descubra como o Tasky System pode auxiliar na
          produtividade da sua equipe.
        </p>
        <router-link to="/login" class="btn btn-primary hero-button">AGENDE UMA DEMO</router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <img src="@/assets/images/tasky-white.png" alt="Tasky Logo" class="footer-logo" />
          <div class="social-icons">
            <img src="@/assets/images/landing/x-logo.svg" alt="X Logo" />
            <img src="@/assets/images/landing/youtube.svg" alt="Youtube Logo" />
            <img src="@/assets/images/landing/linkedin.svg" alt="Linkedin Logo" />
          </div>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4>Começando</h4>
            <ul>
              <li><a href="#">Teste grátis</a></li>
              <li><a href="#">Agende uma demonstração</a></li>
              <li><a href="#">Preços</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Políticas</h4>
            <ul>
              <li><a href="#">Política de privacidade</a></li>
              <li><a href="#">Termos de serviço</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Sobre</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Suporte</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© Tasky System • Todos os direitos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for now
</script>

<style scoped>
/* General Styles */
.landing-page {
  font-family: 'Inter', sans-serif;
  color: #1a2233;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1,
h2,
h3,
h4 {
  margin-top: 0;
  line-height: 1.2;
}

img {
  max-width: 100%;
}

/* Buttons */
.btn {
  border-radius: 0.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hero-button {
  width: 214px;
  height: 50px;
  font-size: 13px;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

.btn-outline {
  border: 2px solid var(--primary-color);
  color: white;
}

.btn-outline:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  background: var(--secondary-dark);
  color: white;
  padding-bottom: 4rem;
  position: relative;
  overflow: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1500px;
  padding: 1.5rem 4rem;
  margin: 0 auto;
}

.menu {
  display: flex;
  align-items: center;
  gap: 10rem;
}

.logo img {
  height: 42px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.auth-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.login-btn {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.signup-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #00143b;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5rem 4rem;
  max-width: 1500px;
  margin: 0 auto;
}

.hero-text {
  max-width: 600px;
}

.hero-text h1 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  width: 36%;
  display: flex;
  justify-content: flex-end;
}

.hero-image img {
  max-width: 100%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Features Section */
.features-section {
  background-color: white;
  padding: 5rem 0;
  text-align: center;
}

.section-header {
  max-width: 800px;
  margin: 0 auto 4rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #f6f9ff;
  border-radius: 8px;
  padding: 2rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon img {
  width: 40px;
  height: 40px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.feature-link {
  margin-top: auto;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.feature-link:hover {
  color: var(--primary-dark);
}

/* About Section */
.about-section {
  padding: 4rem 0;
  text-align: center;
  background-color: #f6f9ff;
}

.about-content h2 {
  font-size: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-weight: 700;
}

/* Feature Detail Sections */
.feature-detail-section {
  padding: 5rem 0;
  background-color: #f6f9ff;
}

.bg-light {
  background-color: #f6f9ff;
}

.feature-detail {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.feature-detail.reverse {
  flex-direction: row-reverse;
}

.feature-detail-content {
  flex: 1;
}

.feature-detail-content h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.feature-detail-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.feature-list {
  list-style-type: none;
  padding: 0;
}

.feature-list li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 1rem;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: bold;
}

.feature-detail-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-detail-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  text-align: center;
  background: white;
  color: #000;
}

.cta-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.cta-section p {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Footer */
.site-footer {
  background: var(--secondary-dark);
  color: white;
  padding-top: 4rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 3rem;
}

.footer-brand {
  flex: 1;
  min-width: 250px;
}

.footer-logo {
  height: 30px;
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-column {
  min-width: 160px;
}

.footer-column h4 {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 0.75rem;
}

.footer-column ul li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column ul li a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.social-icons {
  display: flex;
  gap: 1rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .hero-text {
    max-width: 100%;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-image {
    width: 100%;
    justify-content: center;
  }

  .feature-detail {
    flex-direction: column;
    gap: 2rem;
  }

  .feature-detail.reverse {
    flex-direction: column;
  }

  .feature-detail-content,
  .feature-detail-image {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links,
  .auth-links {
    width: 100%;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
