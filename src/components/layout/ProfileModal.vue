<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="showProfileModal"
      class="backdrop"
      @click="closeModal"
    ></div>

    <!-- Profile Modal/Dropdown -->
    <div
      v-if="showProfileModal"
      class="profile-dropdown"
      id="profileModal"
      @click.stop
    >
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <h2>Meu Perfil</h2>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="profile-header">
            <div class="profile-avatar">
              <img src="./images/user-placeholder.jpg" alt="Avatar" id="profileAvatar" />
            </div>
            <div class="profile-info">
              <h3 id="profileName">Usuário</h3>
              <p id="profileRole">Sem departamento</p>
            </div>
          </div>

          <div class="profile-details">
            <div class="info-group">
              <label>Nome</label>
              <p id="profileNomeDisplay">-</p>
            </div>

            <div class="info-group">
              <label>E-mail</label>
              <p id="profileEmailDisplay">-</p>
            </div>

            <div class="info-group">
              <label>Setor</label>
              <p id="profileSetorDisplay">-</p>
            </div>
          </div>

          <div class="form-actions right-aligned">
            <button type="button" id="logoutBtn" class="btn btn-danger">
              <i class="fas fa-sign-out-alt"></i>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  showProfileModal: Boolean,
});

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const closeModal = () => {
  emit('close'); // Emit close event when the backdrop or close button is clicked
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent; /* Semi-transparent black */
  z-index: 999; /* Behind the modal */
  pointer-events: auto;
}

/* Profile Dropdown */
.profile-dropdown {
  position: fixed;
  top: calc(var(--header-height) + 4px);
  right: 20px;
  width: 360px;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  pointer-events: auto; /* Changed from 'none' to 'auto' */
  border: 1px solid var(--border-color);
}

.profile-dropdown .modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-dropdown .modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.profile-dropdown .modal-header .close-btn {
  color: var(--text-color);
  opacity: 0.8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.profile-dropdown .modal-header .close-btn:hover {
  opacity: 1;
}

.profile-dropdown .modal-body {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

/* Modo escuro para o dropdown de perfil */
body.dark-mode .profile-dropdown {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

body.dark-mode .profile-dropdown .modal-header {
  border-bottom-color: var(--border-color);
  color: var(--text-color);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.profile-info p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.profile-details {
  margin-bottom: 1.5rem;
}

.info-group {
  margin-bottom: 1rem;
}

.info-group label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.info-group p {
  margin: 0;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.right-aligned {
  text-align: right;
}
</style>
