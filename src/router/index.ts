import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Import layouts
// import PublicLayout from '@/layouts/PublicLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Login from '@/pages/public/Login.vue';
import UserHome from '@/pages/user/UserHome.vue';
import AdminDashboard from '@/pages/admin/AdminDashboard.vue';
import TicketsReceived from '@/pages/user/TicketsReceived.vue';
import TicketsCreated from '@/pages/user/TicketsCreated.vue';
import DepartmentTickets from '@/pages/user/DepartmentTickets.vue';

const routes: RouteRecordRaw[] = [
  // Public Routes (No Layout)
  {
    path: '/login',
    component: Login,
  },

  // User Panel Routes
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'meus-tickets/recebidos', component: TicketsReceived },
      { path: 'meus-tickets/criados', component: TicketsCreated },
      { path: 'tickets-do-setor', component: DepartmentTickets },
    ]
  },

  // Admin Panel Routes
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
