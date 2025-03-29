// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/admin/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/admin/AboutView.vue'),
//     },
//   ],
// })

// export default router

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Use import type

// Import layouts
import PublicLayout from '@/layouts/PublicLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Import pages
import Login from '@/pages/public/Login.vue';
import Signup from '@/pages/public/SignUp.vue';
import UserHome from '@/pages/user/UserHome.vue';
// import Gallery from '@/pages/Gallery.vue';
import AdminDashboard from '@/pages/admin/AdminDashboard.vue';
// import UsersList from '@/pages/UsersList.vue';
// import Permissions from '@/pages/Permissions.vue';

const routes: RouteRecordRaw[] = [
  // Public Routes (No Layout)
  {
    path: '/login',
    component: Login,
  },

  // User Panel Routes (With User Layout)
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'meus-tickets/recebidos', component: UserHome },
      { path: 'meus-tickets/criados', component: UserHome },
      { path: 'tickets-do-setor', component: UserHome },
    ]
  },

  // Admin Panel Routes (With Admin Layout)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
