import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faUsers,
  faChevronDown,
  faUserPlus,
  faBuilding,
  faTags,
  faChartLine,
  faSignOutAlt,
  faPlusCircle,
  faInbox,
  faPaperPlane,
  faChartBar,
  faTag,
  faPlus,
  faTicket,
  faTachometerAltAverage,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'
import { faBell } from '@fortawesome/free-regular-svg-icons'

library.add(
  faHome,
  faUsers,
  faChevronDown,
  faUserPlus,
  faBuilding,
  faTags,
  faTag,
  faChartLine,
  faSignOutAlt,
  faBell,
  faPlusCircle,
  faInbox,
  faPaperPlane,
  faBuilding,
  faTicket,
  faChartBar,
  faPlus,
  faTachometerAltAverage,
  faMoon
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
