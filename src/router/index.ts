import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
// import PublicLayout from '@/layouts/PublicLayout.vue';
import LoginPage from '@/pages/public/LoginPage.vue';
import UserHome from '@/pages/user/UserHome.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import UserList from '@/pages/admin/UserList.vue';
import DepartmentList from '@/pages/admin/DepartmentList.vue';
import ReportsPage from '@/pages/admin/ReportsPage.vue';
import CategoryList from '@/pages/admin/CategoryList.vue';
import TicketsPage from '@/pages/user/TicketsPage.vue';
import { localStorageService } from '@/utils/localStorageService';

const routes: RouteRecordRaw[] = [
  // Public Routes (No Layout)
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },

  // User Panel Routes
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'meus-tickets', component: TicketsPage },
    ],
    meta: { requiresAuth: true },
  },

  // Admin Panel Routes
  {
    path: '/admin',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'relatorios', component: ReportsPage },
      { path: 'usuarios', component: UserList },
      { path: 'setores', component: DepartmentList },
      { path: 'categorias', component: CategoryList },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const loggedIn = localStorageService.getAccessToken();

  if (requiresAuth && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;
