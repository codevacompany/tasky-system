<template>
  <header>
    <div>
      <img src="@/assets/tasky_logo.png" alt="Logo" class="logo" />
    </div>
    <div class="header-actions">
      <div class="notification-icon">
        <font-awesome-icon icon="bell" />
        <span>0</span>
      </div>
      <button class="logout-btn">
        <font-awesome-icon icon="sign-out-alt" />
        <span>SAIR</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  background: #fff;
  position:fixed;
  top: 0;
  left: 0;
  padding: 8px 30px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 80px;
}

/* Logo no header */
header .logo {
  width: 100px;
  height: auto;
  object-fit: contain;
}

/* Ações do header */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}


.notification-icon {
  color: #2c3e50
}

button {
  background-color: #2c3e50;
  padding: 8px 20px 5px 8px;
}
</style>
