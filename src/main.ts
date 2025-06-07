import './index.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import './assets/icons';
import { localStorageService } from './utils/localStorageService';

// Initialize dark mode at startup
if (localStorageService.isDarkMode()) {
  document.body.classList.add('dark');
  document.body.classList.add('dark-mode');
}

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: 'light',
} as ToastContainerOptions);

app.use(createPinia());
app.use(router);

app.mount('#app');
