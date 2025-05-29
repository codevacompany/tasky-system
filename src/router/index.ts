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
import ClientManagement from '@/pages/admin/ClientManagement.vue';
import ClientUsers from '@/pages/admin/ClientUsers.vue';
import ClientSettings from '@/pages/admin/ClientSettings.vue';
import SyncPage from '@/pages/user/SyncPage.vue';
import LandingPage from '@/pages/public/LandingPage.vue';
import { localStorageService } from '@/utils/localStorageService';
import SignUpManagement from '@/pages/admin/SignUpManagement.vue';
import { RoleName } from '@/models';

const routes: RouteRecordRaw[] = [
  // Public Routes (No Layout)
  {
    path: '/landing',
    component: LandingPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/cadastrar',
    component: () => import('@/pages/public/SignUpPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/completar-cadastro/:token',
    component: () => import('@/pages/public/CompleteRegistration.vue'),
    meta: { requiresAuth: false },
  },

  // User Panel Routes
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'meus-tickets', component: TicketsPage },
      { path: 'faq', component: () => import('@/pages/user/FAQ.vue') },
      { path: 'sync', component: SyncPage },
    ],
    meta: { requiresAuth: true },
  },

  // Admin Panel Routes
  {
    path: '/admin',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      {
        path: 'relatorios',
        component: ReportsPage,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'usuarios',
        component: UserList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'setores',
        component: DepartmentList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'categorias',
        component: CategoryList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'clientes',
        component: ClientManagement,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'clientes/:id/usuarios',
        component: ClientUsers,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'clientes/:id/configuracoes',
        component: ClientSettings,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'cadastros',
        component: SignUpManagement,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../pages/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: [RoleName.GlobalAdmin, RoleName.TenantAdmin],
    },
  },

  // Not Found Route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const loggedIn = localStorageService.getAccessToken() && localStorageService.getUser()?.role;

  if (requiresAuth && !loggedIn) {
    return next('/login');
  }

  const hasRequiredRole = to.matched.every((record) => {
    if (!record.meta.roles) return true;

    const userRole = localStorageService.getUser()?.role.name;

    return Array.isArray(record.meta.roles) && userRole
      ? record.meta.roles.includes(userRole)
      : true;
  });

  if (requiresAuth && !hasRequiredRole) {
    return next('/');
  }

  next();
});

export default router;
