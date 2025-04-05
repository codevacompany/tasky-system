import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import './assets/icons';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(
  Vue3Toastify,
  {
    autoClose: 3000,
    theme: 'colored'
  } as ToastContainerOptions,
);

app.use(createPinia());
app.use(router);

app.mount('#app');
